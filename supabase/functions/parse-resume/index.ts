import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @deno-types="npm:@types/pdf-parse@1.1.4"
import pdfParse from "npm:pdf-parse@1.1.1";
import mammoth from "npm:mammoth@1.8.0";
import { decode as base64Decode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function isResume(text: string): boolean {
  if (text.trim().length < 50) return false;
  const signals = [/experience/i, /education/i, /skills/i, /email/i, /phone/i, /summary/i, /objective/i, /projects/i, /@/];
  return signals.filter((r) => r.test(text)).length >= 3;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileName, fileType, targetRole, expectedSalary } = await req.json();

    if (!fileBase64 || !fileName || !fileType) {
      return new Response(JSON.stringify({ error: "Missing file data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fileBuffer = base64Decode(fileBase64);
    let text = "";

    if (fileType === "application/pdf") {
      try {
        const result = await pdfParse(fileBuffer);
        text = result.text;
      } catch {
        return new Response(
          JSON.stringify({ isResume: false, error: "ATS cannot parse this PDF. It may be image-based or corrupted." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        text = result.value;
      } catch {
        return new Response(
          JSON.stringify({ isResume: false, error: "ATS cannot parse this DOCX file." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      return new Response(JSON.stringify({ error: "Unsupported file type." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isResume(text)) {
      return new Response(
        JSON.stringify({ isResume: false, totalScore: 0, error: "This doesn't appear to be a resume." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const roleContext = targetRole ? `The candidate is targeting the role: "${targetRole}".` : "";
    const salaryContext = expectedSalary ? `The candidate expects a salary of: "${expectedSalary}".` : "The candidate has NOT provided an expected salary.";

    const systemPrompt = `You are an elite Resume Architect and Product Manager with 20+ years of experience in talent assessment. 
Analyze the resume text with deep strategic insight.

Be specific, reference actual content, and provide actionable feedback.

For the scoreRoast:
- Always use suggestive language for the shortlistChanceBoost (e.g. "Solving this could increase your chances by 30%" instead of "is mandatory").

For Salary Analysis:
- Evaluation is MANDATORY. Compare the applicant's EXPECTED SALARY (if provided) against their actual years of experience and role in the resume.
- You MUST set "level" to exactly one of: "low", "good", or "high". 
- Set "level": "high" IF the EXPECTED SALARY is significantly higher than market standards for their experience (e.g., asking 90 LPA with only 5 years of experience).
- Set "level": "low" IF the EXPECTED SALARY is significantly lower than market standards.
- Set "level": "good" ONLY if the EXPECTED SALARY is perfectly aligned with industry standards for their specific seniority.
- Recognize regional formats like "LPA", "k", "$".
- You MUST calculate a realistic "marketWorth" range based on the resume's seniority (e.g., "15 - 25 LPA" for Juniors, "40 - 70 LPA" for Seniors).
- DO NOT return generic placeholders. Be specific.
- Advice MUST explicitly mention the salary. (e.g., "90 LPA is significantly above the 45-60 LPA range for a Senior PM with 8 years of experience").
- Tone: Be professional and data-backed.

For Word Cloud:
- Extract exactly 15-20 most impactful and unique keywords/skills that highlight the PROFILE's core strengths and character.
- DO NOT use generic words. Focus on high-value technical skills, specific achievements, or industry-specific terminology.
- You MUST generate this from the full content of the resume provided.
- Assign a 'value' (1-10) to each based on its relevance to the target role.

For PM-Focused Sections:
1. Actionability: How much of the resume describes results/impact vs just tasks?
2. Career Path: What is the logical next step for this candidate?
3. Role Alignment: How well does their past experience actually align with the target role?

Scoring:
- Clamped between 47-95.
- Be critical but fair.`;

    const userPrompt = `TARGET ROLE: "${targetRole || 'Not specified'}"
EXPECTED SALARY: "${expectedSalary || 'Not provided'}"

Analyze this resume and provide a detailed review:

---\n${text}\n---`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Return a comprehensive resume analysis including salary market fit, word cloud, and strategic PM insights.",
              parameters: {
                type: "object",
                properties: {
                  totalScore: { type: "number" },
                  profileInfo: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      title: { type: "string" },
                      email: { type: "string" },
                      phone: { type: "string" },
                      linkedin: { type: "string" },
                      github: { type: "string" },
                      portfolio: { type: "string" },
                      location: { type: "string" },
                      missing: { type: "array", items: { type: "string" } },
                      score: { type: "number" },
                    },
                    required: ["name", "title", "email", "phone", "linkedin", "github", "portfolio", "location", "missing", "score"],
                  },
                  summary: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      content: { type: "string" },
                      feedback: { type: "string" },
                      suggestions: { type: "array", items: { type: "string" } },
                    },
                    required: ["score", "content", "feedback", "suggestions"],
                  },
                  experience: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            company: { type: "string" },
                            duration: { type: "string" },
                            highlights: { type: "array", items: { type: "string" } },
                            improvements: { type: "array", items: { type: "string" } },
                          },
                          required: ["title", "company", "duration", "highlights", "improvements"],
                        },
                      },
                      feedback: { type: "string" },
                      suggestions: { type: "array", items: { type: "string" } },
                    },
                    required: ["score", "items", "feedback", "suggestions"],
                  },
                  projects: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            description: { type: "string" },
                            techStack: { type: "array", items: { type: "string" } },
                            highlights: { type: "array", items: { type: "string" } },
                            improvements: { type: "array", items: { type: "string" } },
                          },
                          required: ["name", "description", "techStack", "highlights", "improvements"],
                        },
                      },
                      feedback: { type: "string" },
                      suggestions: { type: "array", items: { type: "string" } },
                    },
                    required: ["score", "items", "feedback", "suggestions"],
                  },
                  skills: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      detected: { type: "array", items: { type: "string" } },
                      missing: { type: "array", items: { type: "string" } },
                      feedback: { type: "string" },
                      suggestions: { type: "array", items: { type: "string" } },
                    },
                    required: ["score", "detected", "missing", "feedback", "suggestions"],
                  },
                  education: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            degree: { type: "string" },
                            institution: { type: "string" },
                            year: { type: "string" },
                          },
                          required: ["degree", "institution", "year"],
                        },
                      },
                      certifications: { type: "array", items: { type: "string" } },
                      feedback: { type: "string" },
                      suggestions: { type: "array", items: { type: "string" } },
                    },
                    required: ["score", "items", "certifications", "feedback", "suggestions"],
                  },
                  formatting: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      feedback: { type: "string" },
                      issues: { type: "array", items: { type: "string" } },
                    },
                    required: ["score", "feedback", "issues"],
                  },
                  overallStrengths: { type: "array", items: { type: "string" } },
                  overallWeaknesses: { type: "array", items: { type: "string" } },
                  industryFit: { type: "string" },
                  scoreRoast: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      tone: { type: "string", enum: ["brutal", "encouraging", "celebrating"] },
                      shortlistChanceBoost: { type: "string" },
                    },
                    required: ["message", "tone", "shortlistChanceBoost"],
                  },
                  hypeScore: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      flags: { type: "array", items: { type: "string" } },
                      verdict: { type: "string" },
                    },
                    required: ["score", "flags", "verdict"],
                  },
                  brandAdvice: {
                    type: "object",
                    properties: {
                      hasTopBrand: { type: "boolean" },
                      message: { type: "string" },
                      actionItems: { type: "array", items: { type: "string" } },
                    },
                    required: ["hasTopBrand", "message", "actionItems"],
                  },
                  hrLens: {
                    type: "object",
                    properties: {
                      overallImpression: { type: "string" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            aspect: { type: "string" },
                            hrOpinion: { type: "string" },
                            suggestion: { type: "string" },
                          },
                          required: ["aspect", "hrOpinion", "suggestion"],
                        },
                      },
                      wouldShortlist: { type: "boolean" },
                      shortlistReason: { type: "string" },
                    },
                    required: ["overallImpression", "items", "wouldShortlist", "shortlistReason"],
                  },
                  sectionMiniScores: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        section: { type: "string" },
                        score: { type: "number" },
                        oneLineSummary: { type: "string" },
                      },
                      required: ["section", "score", "oneLineSummary"],
                    },
                  },
                  salaryAnalysis: {
                    type: "object",
                    properties: {
                      marketMatch: { type: "string" },
                      advice: { type: "string" },
                      level: { type: "string", enum: ["low", "good", "high"] },
                      marketWorth: { type: "string" },
                    },
                    required: ["marketMatch", "advice", "level", "marketWorth"],
                  },
                  wordCloud: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                          text: { type: "string" },
                          value: { type: "number" },
                        },
                        required: ["text", "value"],
                    },
                  },
                  actionability: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      feedback: { type: "string" },
                    },
                    required: ["score", "feedback"],
                  },
                  careerPath: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["title", "description"],
                    },
                  },
                  roleAlignment: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      feedback: { type: "string" },
                    },
                    required: ["score", "feedback"],
                  },
                },
                required: [
                  "totalScore", "profileInfo", "summary", "experience", "projects", "skills",
                  "education", "formatting", "overallStrengths", "overallWeaknesses", "industryFit",
                  "scoreRoast", "hypeScore", "brandAdvice", "hrLens", "sectionMiniScores",
                  "salaryAnalysis", "wordCloud", "actionability", "careerPath", "roleAlignment"
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_resume" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return structured analysis");
    }

    let analysis = {};
    try {
      analysis = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse AI arguments:", e);
    }

    if (!analysis) analysis = {};

    // Robust mapping for potential AI naming variations (camelCase vs snake_case)
    const rawSalary = (analysis as any).salaryAnalysis || (analysis as any).salary_analysis || {};
    const rawWordCloud = (analysis as any).wordCloud || (analysis as any).word_cloud || [];
    const rawActionability = (analysis as any).actionability || (analysis as any).action_ability || { score: 70, feedback: "Strategic impact detected." };
    const rawCareerPath = (analysis as any).careerPath || (analysis as any).career_path || [];
    const rawRoleAlignment = (analysis as any).roleAlignment || (analysis as any).role_alignment || { score: 75, feedback: "Direct alignment with target role." };

    let totalScore = Math.round((analysis as any).totalScore || 70);
    if (totalScore > 0 && totalScore < 47) totalScore = 47;
    if (totalScore > 95) totalScore = 95;

    const response = {
      isResume: true,
      totalScore,
      targetRole: targetRole || "General",
      expectedSalary: expectedSalary || "",
      profileInfo: (analysis as any).profileInfo || { missing: [], score: 0 },
      summary: (analysis as any).summary || { score: 0, content: null, feedback: "", suggestions: [] },
      experience: (analysis as any).experience || { score: 0, items: [], feedback: "", suggestions: [] },
      projects: (analysis as any).projects || { score: 0, items: [], feedback: "", suggestions: [] },
      skills: (analysis as any).skills || { score: 0, detected: [], missing: [], feedback: "", suggestions: [] },
      education: (analysis as any).education || { score: 0, items: [], certifications: [], feedback: "", suggestions: [] },
      formatting: (analysis as any).formatting || { score: 0, feedback: "", issues: [] },
      overallStrengths: (analysis as any).overallStrengths || [],
      overallWeaknesses: (analysis as any).overallWeaknesses || [],
      industryFit: (analysis as any).industryFit || "General",
      scoreRoast: (analysis as any).scoreRoast || { message: "Analysis complete.", tone: "encouraging", shortlistChanceBoost: "10%" },
      hypeScore: (analysis as any).hypeScore || { score: 0, flags: [], verdict: "Safe" },
      brandAdvice: (analysis as any).brandAdvice || { hasTopBrand: false, message: "General advice.", actionItems: [] },
      hrLens: (analysis as any).hrLens || { overallImpression: "", items: [], wouldShortlist: true, shortlistReason: "" },
      sectionMiniScores: (analysis as any).sectionMiniScores || [],
      salaryAnalysis: {
        marketMatch: (rawSalary.marketMatch || rawSalary.market_match || "").trim() || "Analysis of market fit based on profile.",
        advice: (rawSalary.advice || "").trim() || "Strategy based on your target role and experience.",
        level: (rawSalary.level || "good") as 'low' | 'good' | 'high',
        marketWorth: (rawSalary.marketWorth || rawSalary.market_worth || "").trim() || "Estimated market range",
      },
      wordCloud: rawWordCloud,
      actionability: rawActionability,
      careerPath: rawCareerPath,
      roleAlignment: rawRoleAlignment,
      rawText: text,
      rawAiAnalysis: analysis,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
