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
    const { fileBase64, fileName, fileType, targetRole } = await req.json();

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

    const systemPrompt = `You are an expert resume analyst, career coach, and HR professional with 15+ years of hiring experience. 
Analyze the following resume text with brutal honesty and deep expertise.

${roleContext}

Be specific, reference actual content, and provide actionable feedback. Score sections 0-100 fairly but critically.

For the scoreRoast:
- If total score < 60: tone="brutal", be very harsh but constructive. Say things like "No recruiter will spend more than 5 seconds on this" or "ATS will reject this before any human sees it"
- If total score 60-80: tone="encouraging", motivate improvement. Mention specific % chance improvements.
- If total score > 80: tone="celebrating", congratulate but push for perfection.
- For all tones, the shortlistChanceBoost MUST use suggestive language, not mandatory. (e.g. "Solving this could increase your chances by 30%" instead of "Solving this is mandatory").

For hypeScore: Detect exaggeration, buzzword stuffing, vague claims without metrics, impossible achievements. Score 0-100 where 100 = completely fabricated. Flag specific phrases that sound fake. Be brutally honest — "Saying you 'revolutionized' a process without metrics is a red flag for any experienced interviewer."

For brandAdvice: Check if education is from well-known universities (IIT, MIT, Stanford, etc.) and companies are recognizable (FAANG, top startups). If not, suggest ways to compensate with projects, skills, and certifications.

For hrLens: Think as an HR manager reviewing this for the target role. What jumps out? What's missing? Would you shortlist? Be candid.

For sectionMiniScores: Provide a score and one-line improvement summary for each major section.`;

    const userPrompt = `Analyze this resume thoroughly for the role "${targetRole || 'General'}":\n\n---\n${text}\n---`;

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
              description: "Return a comprehensive resume analysis with scores, feedback, roast, hype detection, HR perspective, and brand analysis.",
              parameters: {
                type: "object",
                properties: {
                  totalScore: { type: "number", description: "Overall resume score 0-100, clamped between 47-95" },
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
                      message: { type: "string", description: "A bold, memorable roast or praise based on the score" },
                      tone: { type: "string", enum: ["brutal", "encouraging", "celebrating"] },
                      shortlistChanceBoost: { type: "string", description: "E.g. 'Fixing these issues could increase your shortlist chances by 40%'" },
                    },
                    required: ["message", "tone", "shortlistChanceBoost"],
                  },
                  hypeScore: {
                    type: "object",
                    properties: {
                      score: { type: "number", description: "0-100, how exaggerated/fake the resume sounds" },
                      flags: { type: "array", items: { type: "string" }, description: "Specific exaggerated phrases or claims" },
                      verdict: { type: "string", description: "Strong honest verdict about resume authenticity" },
                    },
                    required: ["score", "flags", "verdict"],
                  },
                  brandAdvice: {
                    type: "object",
                    properties: {
                      hasTopBrand: { type: "boolean", description: "Whether resume has recognizable brand names (top colleges/companies)" },
                      message: { type: "string", description: "Honest assessment of brand impact on resume" },
                      actionItems: { type: "array", items: { type: "string" }, description: "What to do to compensate if no brand names" },
                    },
                    required: ["hasTopBrand", "message", "actionItems"],
                  },
                  hrLens: {
                    type: "object",
                    properties: {
                      overallImpression: { type: "string", description: "What an HR manager thinks in first 10 seconds" },
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
                        oneLineSummary: { type: "string", description: "One line on what to improve" },
                      },
                      required: ["section", "score", "oneLineSummary"],
                    },
                    description: "Mini scores for Profile, Summary, Experience, Projects, Skills, Education, Formatting, Overall",
                  },
                },
                required: [
                  "totalScore", "profileInfo", "summary", "experience", "projects", "skills",
                  "education", "formatting", "overallStrengths", "overallWeaknesses", "industryFit",
                  "scoreRoast", "hypeScore", "brandAdvice", "hrLens", "sectionMiniScores",
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

    const analysis = JSON.parse(toolCall.function.arguments);

    let totalScore = Math.round(analysis.totalScore);
    if (totalScore > 0 && totalScore < 47) totalScore = 47;
    if (totalScore > 95) totalScore = 95;

    const response = {
      isResume: true,
      totalScore,
      targetRole: targetRole || "General",
      profileInfo: analysis.profileInfo,
      summary: analysis.summary,
      experience: analysis.experience,
      projects: analysis.projects,
      skills: analysis.skills,
      education: analysis.education,
      formatting: analysis.formatting,
      overallStrengths: analysis.overallStrengths,
      overallWeaknesses: analysis.overallWeaknesses,
      industryFit: analysis.industryFit,
      scoreRoast: analysis.scoreRoast,
      hypeScore: analysis.hypeScore,
      brandAdvice: analysis.brandAdvice,
      hrLens: analysis.hrLens,
      sectionMiniScores: analysis.sectionMiniScores,
      rawText: text,
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
