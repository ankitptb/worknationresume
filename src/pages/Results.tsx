import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutPanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeAnalysis } from '@/types/resume';
import ScoreOverview from '@/components/ScoreOverview';
import ExperienceCard from '@/components/ExperienceCard';
import ProjectsCard from '@/components/ProjectsCard';
import SkillsCard from '@/components/SkillsCard';
import EducationCard from '@/components/EducationCard';
import IndustryFitCard from '@/components/IndustryFitCard';
import HypeScoreCard from '@/components/HypeScoreCard';
import BrandAdviceCard from '@/components/BrandAdviceCard';
import HRLensCard from '@/components/HRLensCard';
import SectionRadar from '@/components/SectionRadar';
import WordCloud from '@/components/WordCloud';
import PMAnalysisCards from '@/components/PMAnalysisCards';

import ProfileInfoCard from '@/components/ProfileInfoCard';
import SummaryCard from '@/components/SummaryCard';

import { useEffect } from 'react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis as ResumeAnalysis | undefined;

  console.log('Results analysis data:', analysis);

  useEffect(() => {
    // If someone hits /results directly or refreshes and state is lost
    if (!analysis) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-foreground">Awaiting Data...</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            We couldn't find your analysis results. Redirecting you to the upload page in a few seconds.
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Analyze New Resume
        </Button>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
          <LayoutPanelLeft className="w-3 h-3" />
          Strategic Analysis Mode
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Strategic Resume Report</h1>
        <p className="text-sm text-muted-foreground">AI-powered architectural feedback for your career transition.</p>
      </div>

      {/* High Value Impact Sections (TOP) */}
      <ScoreOverview analysis={analysis} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 space-y-6">
           <HypeScoreCard hypeScore={analysis.hypeScore} />
           <PMAnalysisCards 
            actionability={analysis.actionability} 
            roleAlignment={analysis.roleAlignment} 
            careerPath={analysis.careerPath} 
           />
        </div>
      </div>

      <SectionRadar sections={analysis.sectionMiniScores} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WordCloud words={analysis.wordCloud} rawText={analysis.rawText} />
          <IndustryFitCard
            industryFit={analysis.industryFit}
            strengths={analysis.overallStrengths}
            weaknesses={analysis.overallWeaknesses}
          />
      </div>

      <div className="mt-12 space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <HRLensCard hrLens={analysis.hrLens} />
          <ProfileInfoCard profile={analysis.profileInfo} />
          <BrandAdviceCard brandAdvice={analysis.brandAdvice} />
        </div>

        <div className="pt-8 border-t">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            Detailed Structural Analysis
          </h2>
          <div className="space-y-6">
            <ExperienceCard experience={analysis.experience} />
            <ProjectsCard projects={analysis.projects} />
            <SkillsCard skills={analysis.skills} />
            <EducationCard education={analysis.education} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

