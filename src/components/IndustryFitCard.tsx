import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IndustryFitCardProps {
  industryFit: string;
  strengths: string[];
  weaknesses: string[];
}

const IndustryFitCard = ({ industryFit, strengths, weaknesses }: IndustryFitCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Industry Fit & Overall Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground">{industryFit}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'hsl(var(--score-excellent))' }}>
              <CheckCircle2 className="w-4 h-4" />
              Key Strengths
            </p>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'hsl(var(--score-excellent))' }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'hsl(var(--score-poor))' }}>
              <AlertTriangle className="w-4 h-4" />
              Areas to Improve
            </p>
            <ul className="space-y-1.5">
              {weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'hsl(var(--score-poor))' }} />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryFitCard;
