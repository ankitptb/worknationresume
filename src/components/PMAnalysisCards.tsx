import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Zap, Map } from 'lucide-react';

interface PMAnalysisCardsProps {
  actionability: { score: number; feedback: string };
  roleAlignment: { score: number; feedback: string };
  careerPath: { title: string; description: string }[];
}

const PMAnalysisCards = ({ actionability, roleAlignment, careerPath }: PMAnalysisCardsProps) => {
  if (!actionability || !roleAlignment) return null;
  const safeCareerPath = careerPath || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Actionability & Impact
          </CardTitle>
          <div className="flex items-center gap-4 mt-1">
            <Progress value={actionability.score || 0} className="h-1.5 flex-1" />
            <span className="text-xs font-bold text-muted-foreground">{actionability.score || 0}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground leading-relaxed">{actionability.feedback || 'Analyzing actionability...'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Role Alignment
          </CardTitle>
          <div className="flex items-center gap-4 mt-1">
            <Progress value={roleAlignment.score || 0} className="h-1.5 flex-1" />
            <span className="text-xs font-bold text-muted-foreground">{roleAlignment.score || 0}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground leading-relaxed">{roleAlignment.feedback || 'Analyzing alignment...'}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Map className="w-4 h-4 text-emerald-500" />
            AI-Projected Career Trajectory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {safeCareerPath.length > 0 ? safeCareerPath.map((item, i) => (
              <div key={i} className="flex-1 p-3 rounded-lg bg-muted/50 border border-border">
                <h5 className="text-xs font-bold text-foreground mb-1">{item.title}</h5>
                <p className="text-[10px] text-muted-foreground leading-tight">{item.description}</p>
              </div>
            )) : (
              <p className="text-xs text-muted-foreground italic p-4">Trajectory analysis unavailable.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMAnalysisCards;
