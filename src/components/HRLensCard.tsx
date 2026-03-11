import { Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HRLens } from '@/types/resume';

interface HRLensCardProps {
  hrLens: HRLens;
}

const HRLensCard = ({ hrLens }: HRLensCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          HR Lens — How Recruiters See Your Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground">{hrLens.overallImpression}</p>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg border ${hrLens.wouldShortlist ? 'bg-[hsl(var(--score-excellent))]/5 border-[hsl(var(--score-excellent))]/20' : 'bg-destructive/5 border-destructive/20'}`}>
          {hrLens.wouldShortlist ? (
            <ThumbsUp className="w-5 h-5 text-[hsl(var(--score-excellent))]" />
          ) : (
            <ThumbsDown className="w-5 h-5 text-destructive" />
          )}
          <p className="text-sm font-semibold text-foreground">
            {hrLens.wouldShortlist ? 'Likely to Shortlist' : 'Unlikely to Shortlist'}
          </p>
          <span className="text-xs text-muted-foreground ml-1">— {hrLens.shortlistReason}</span>
        </div>

        <div className="space-y-3">
          {hrLens.items.map((item, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">{item.aspect}</p>
              <p className="text-sm text-muted-foreground">{item.hrOpinion}</p>
              <p className="text-xs text-primary font-medium">💡 {item.suggestion}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HRLensCard;
