import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionMiniScore, getScoreColor } from '@/types/resume';
import { BarChart3 } from 'lucide-react';

interface SectionRadarProps {
  sections: SectionMiniScore[];
}

const MiniRingCard = ({ score, label, summary }: { score: number; label: string; summary: string }) => {
  const size = 60;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex items-center gap-4 p-4 border rounded-xl bg-card hover:bg-muted/30 transition-colors">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{score}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground mb-1">{label}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
      </div>
    </div>
  );
};

const SectionRadar = ({ sections }: SectionRadarProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Section-wise Improvement Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sections.map((s) => (
            <MiniRingCard key={s.section} score={s.score} label={s.section} summary={s.oneLineSummary} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionRadar;
