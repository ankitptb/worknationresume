import { AlertTriangle, TrendingUp, Trophy } from 'lucide-react';
import { ScoreRoast } from '@/types/resume';

interface ScoreRoastBannerProps {
  roast: ScoreRoast;
  score: number;
}

const ScoreRoastBanner = ({ roast, score }: ScoreRoastBannerProps) => {
  const config = {
    brutal: {
      icon: AlertTriangle,
      bg: 'bg-destructive/10 border-destructive/30',
      text: 'text-destructive',
      iconColor: 'text-destructive',
    },
    encouraging: {
      icon: TrendingUp,
      bg: 'bg-[hsl(var(--score-average))]/10 border-[hsl(var(--score-average))]/30',
      text: 'text-foreground',
      iconColor: 'text-[hsl(var(--score-average))]',
    },
    celebrating: {
      icon: Trophy,
      bg: 'bg-[hsl(var(--score-excellent))]/10 border-[hsl(var(--score-excellent))]/30',
      text: 'text-foreground',
      iconColor: 'text-[hsl(var(--score-excellent))]',
    },
  }[roast.tone];

  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-5 ${config.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="space-y-1.5">
          <p className={`text-sm font-bold ${config.text}`}>{roast.message}</p>
          {roast.shortlistChanceBoost && (
            <p className="text-xs text-muted-foreground">{roast.shortlistChanceBoost}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreRoastBanner;
