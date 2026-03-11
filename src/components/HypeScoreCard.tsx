import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HypeScore } from '@/types/resume';

interface HypeScoreCardProps {
  hypeScore: HypeScore;
}

const HypeScoreCard = ({ hypeScore }: HypeScoreCardProps) => {
  if (hypeScore.score < 30) return null; // Only show if there's notable hype

  const getHypeLevel = (score: number) => {
    if (score >= 80) return { label: '🔥 Maximum Hype', color: 'text-destructive' };
    if (score >= 60) return { label: '⚠️ Overly Inflated', color: 'text-[hsl(var(--score-average))]' };
    return { label: '🤔 Slightly Exaggerated', color: 'text-muted-foreground' };
  };

  const level = getHypeLevel(hypeScore.score);

  return (
    <Card className="border-destructive/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-destructive" />
          Hype Level — {hypeScore.score}%
          <span className={`text-sm font-medium ${level.color}`}>{level.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-semibold text-destructive">{hypeScore.verdict}</p>
        {hypeScore.flags.length > 0 && (
          <ul className="space-y-1.5">
            {hypeScore.flags.map((flag, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default HypeScoreCard;
