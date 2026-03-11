import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeAnalysis } from '@/types/resume';
import ScoreOverview from '@/components/ScoreOverview';
import ProfileInfoCard from '@/components/ProfileInfoCard';
import SummaryCard from '@/components/SummaryCard';
import ExperienceCard from '@/components/ExperienceCard';
import ProjectsCard from '@/components/ProjectsCard';
import SkillsCard from '@/components/SkillsCard';
import EducationCard from '@/components/EducationCard';
import IndustryFitCard from '@/components/IndustryFitCard';
import HypeScoreCard from '@/components/HypeScoreCard';
import BrandAdviceCard from '@/components/BrandAdviceCard';
import HRLensCard from '@/components/HRLensCard';
import SectionRadar from '@/components/SectionRadar';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis as ResumeAnalysis | undefined;

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg text-muted-foreground">No analysis data found.</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Upload a Resume
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Analyze Another
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-foreground text-center">Resume Analysis Report</h1>

      <ScoreOverview analysis={analysis} />
      <ProfileInfoCard profile={analysis.profileInfo} />
      <SummaryCard summary={analysis.summary} />
      <ExperienceCard experience={analysis.experience} />
      <ProjectsCard projects={analysis.projects} />
      <SkillsCard skills={analysis.skills} />
      <EducationCard education={analysis.education} />
      <HypeScoreCard hypeScore={analysis.hypeScore} />
      <BrandAdviceCard brandAdvice={analysis.brandAdvice} />
      <IndustryFitCard
        industryFit={analysis.industryFit}
        strengths={analysis.overallStrengths}
        weaknesses={analysis.overallWeaknesses}
      />
      <HRLensCard hrLens={analysis.hrLens} />
      <SectionRadar sections={analysis.sectionMiniScores} />
    </div>
  );
};

export default Results;
