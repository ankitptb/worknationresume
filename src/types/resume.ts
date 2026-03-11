export const ROLE_CATEGORIES = {
  'Technology': [
    'Software Engineer', 'Senior SDE', 'Staff Engineer', 'Principal Engineer',
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'DevOps Engineer', 'SRE', 'Data Engineer',
    'ML Engineer', 'AI Engineer', 'QA Engineer', 'Security Engineer',
    'Cloud Architect', 'Solutions Architect', 'Tech Lead',
  ],
  'Product': [
    'Product Manager', 'Senior PM', 'Group PM', 'Director of Product',
    'VP Product', 'Product Analyst', 'Product Designer', 'UX Researcher',
    'UX Designer', 'UI Designer',
  ],
  'Executive': [
    'CTO', 'CEO', 'COO', 'CFO', 'CMO', 'CPO', 'CISO',
    'VP Engineering', 'VP Operations', 'VP Sales',
    'Engineering Manager', 'Director of Engineering',
  ],
  'Marketing': [
    'Marketing Manager', 'Digital Marketing Specialist', 'Content Strategist',
    'SEO Specialist', 'Growth Manager', 'Brand Manager',
    'Social Media Manager', 'Performance Marketer',
  ],
  'Operations': [
    'Operations Manager', 'Project Manager', 'Program Manager',
    'Scrum Master', 'Business Analyst', 'Supply Chain Manager',
    'Logistics Manager',
  ],
  'Business & Sales': [
    'Business Development Manager', 'Account Manager', 'Sales Manager',
    'Account Executive', 'Customer Success Manager', 'Partnerships Manager',
    'Revenue Manager',
  ],
  'HR & People': [
    'HR Manager', 'Recruiter', 'Talent Acquisition Lead',
    'People Operations', 'L&D Manager', 'HR Business Partner',
    'Compensation Analyst',
  ],
} as const;

export interface ProfileInfo {
  name: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  location: string | null;
  missing: string[];
  score: number;
}

export interface SummarySection {
  score: number;
  content: string | null;
  feedback: string;
  suggestions: string[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  highlights: string[];
  improvements: string[];
}

export interface ExperienceSection {
  score: number;
  items: ExperienceItem[];
  feedback: string;
  suggestions: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  techStack: string[];
  highlights: string[];
  improvements: string[];
}

export interface ProjectsSection {
  score: number;
  items: ProjectItem[];
  feedback: string;
  suggestions: string[];
}

export interface SkillsSection {
  score: number;
  detected: string[];
  missing: string[];
  feedback: string;
  suggestions: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface EducationSection {
  score: number;
  items: EducationItem[];
  certifications: string[];
  feedback: string;
  suggestions: string[];
}

export interface FormattingSection {
  score: number;
  feedback: string;
  issues: string[];
}

export interface ScoreRoast {
  message: string;
  tone: 'brutal' | 'encouraging' | 'celebrating';
  shortlistChanceBoost: string;
}

export interface HypeScore {
  score: number; // 0-100, higher = more exaggerated
  flags: string[];
  verdict: string;
}

export interface BrandAdvice {
  hasTopBrand: boolean;
  message: string;
  actionItems: string[];
}

export interface HRLensItem {
  aspect: string;
  hrOpinion: string;
  suggestion: string;
}

export interface HRLens {
  overallImpression: string;
  items: HRLensItem[];
  wouldShortlist: boolean;
  shortlistReason: string;
}

export interface SectionMiniScore {
  section: string;
  score: number;
  oneLineSummary: string;
}

export interface SalaryAnalysis {
  marketMatch: string;
  advice: string;
  level: 'low' | 'good' | 'high';
  marketWorth?: string;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface TrajectoryItem {
  title: string;
  description: string;
}

export interface ResumeAnalysis {
  isResume: boolean;
  totalScore: number;
  targetRole: string;
  expectedSalary?: string;
  profileInfo: ProfileInfo;
  summary: SummarySection;
  experience: ExperienceSection;
  projects: ProjectsSection;
  skills: SkillsSection;
  education: EducationSection;
  formatting: FormattingSection;
  overallStrengths: string[];
  overallWeaknesses: string[];
  industryFit: string;
  scoreRoast: ScoreRoast;
  hypeScore: HypeScore;
  brandAdvice: BrandAdvice;
  hrLens: HRLens;
  sectionMiniScores: SectionMiniScore[];
  salaryAnalysis: SalaryAnalysis;
  wordCloud: WordCloudItem[];
  actionability: { score: number; feedback: string };
  careerPath: TrajectoryItem[];
  roleAlignment: { score: number; feedback: string };
  rawText: string;
}

export type ScoreGrade = 'excellent' | 'good' | 'average' | 'below' | 'poor';

export function getScoreGrade(score: number): ScoreGrade {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'average';
  if (score >= 60) return 'below';
  return 'poor';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Average';
  if (score >= 60) return 'Below Average';
  return 'Needs Work';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'hsl(var(--score-excellent))';
  if (score >= 60) return 'hsl(var(--score-good))';
  if (score >= 40) return 'hsl(var(--score-average))';
  return 'hsl(var(--score-poor))';
}
