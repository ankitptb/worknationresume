import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeAnalysis, getScoreColor } from '@/types/resume';
import ScoreRoastBanner from '@/components/ScoreRoastBanner';
import SalaryMatchCard from '@/components/SalaryMatchCard';

interface ScoreOverviewProps {
  analysis: ResumeAnalysis;
}

const SectorRing = ({ score }: { score: number }) => {
  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-foreground">{score}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Overall Score</span>
        </div>
      </div>
    </div>
  );
};

const ScoreOverview = ({ analysis }: ScoreOverviewProps) => {
  // Create a stable random ID or use an existing one if available
  const analysisId = useMemo(() => Math.random().toString(36).substr(2, 6).toUpperCase(), []);

  if (!analysis) return null;
  const score = Math.min(100, Math.max(0, analysis.totalScore || 0));

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-primary/10 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-b">
            {/* Score Ring Section */}
            <div className="p-8 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm lg:w-[300px] shrink-0">
              <SectorRing score={score} />
              <div className="mt-4 text-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Target Role</span>
                <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{analysis.targetRole || (analysis as any).profileInfo?.title || 'Professional'}</p>
              </div>
            </div>

            {/* Summary & Salary Section */}
            <div className="flex-1 p-8 flex flex-col gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Executive Summary</h3>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    Analysis ID: {analysisId}
                  </span>
                </div>
                {analysis.summary?.content ? (
                  <p className="text-sm text-foreground leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                    "{analysis.summary.content}"
                  </p>
                ) : (
                  <p className="text-sm text-destructive font-medium bg-destructive/5 p-3 rounded-lg border border-destructive/10">
                    No professional summary detected in your resume. This is a critical missed opportunity for impact.
                  </p>
                )}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {analysis.summary?.feedback || (analysis.summary as any)?.suggestions?.[0] || 'Summary analysis unavailable.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <SalaryMatchCard 
                  analysis={analysis.salaryAnalysis || (analysis as any).salary_analysis || {} as any} 
                  expected={analysis.expectedSalary} 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysis.scoreRoast && (
        <ScoreRoastBanner roast={analysis.scoreRoast} score={analysis.totalScore} />
      )}
    </div>
  );
};

export default ScoreOverview;
