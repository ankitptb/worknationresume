import { Card, CardContent } from '@/components/ui/card';
import { ResumeAnalysis, getScoreColor } from '@/types/resume';
import ScoreRoastBanner from '@/components/ScoreRoastBanner';

interface ScoreOverviewProps {
  analysis: ResumeAnalysis;
}

const sections = [
  { key: 'profileInfo', label: 'Profile' },
  { key: 'summary', label: 'Summary' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'skills', label: 'Skills' },
  { key: 'education', label: 'Education' },
  { key: 'formatting', label: 'Formatting' },
] as const;

const SectorRing = ({ analysis }: { analysis: ResumeAnalysis }) => {
  const size = 220;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const score = Math.min(100, Math.max(0, analysis.totalScore || 0));
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
          {/* Progress arc */}
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
          <span className="text-4xl font-bold text-foreground">{score}</span>
          <span className="text-sm text-muted-foreground font-medium mt-1">Overall</span>
        </div>
      </div>
    </div>
  );
};

const ScoreOverview = ({ analysis }: ScoreOverviewProps) => {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <SectorRing analysis={analysis} />

            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">Section Scores</p>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Target: {analysis.targetRole}
                </span>
              </div>
              <div className="space-y-3">
                {sections.map(({ key, label }) => {
                  const scoreInfo = analysis[key as keyof ResumeAnalysis];
                  const score = scoreInfo && typeof scoreInfo === 'object' && 'score' in scoreInfo 
                    ? Number(scoreInfo.score) || 0 
                    : 0;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-10 text-right" style={{ color: getScoreColor(score) }}>
                        {score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScoreRoastBanner roast={analysis.scoreRoast} score={analysis.totalScore} />
    </div>
  );
};

export default ScoreOverview;
