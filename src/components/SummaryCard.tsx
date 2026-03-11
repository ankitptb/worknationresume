import { FileText, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SummarySection, getScoreColor } from '@/types/resume';

interface SummaryCardProps {
  summary: SummarySection;
}

const SummaryCard = ({ summary }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Professional Summary
          </CardTitle>
          <Badge
            variant="outline"
            className="text-sm font-bold px-3 py-1"
            style={{ color: getScoreColor(summary.score), borderColor: getScoreColor(summary.score) }}
          >
            {summary.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.content ? (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-foreground italic">"{summary.content}"</p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">No professional summary found in your resume.</p>
          </div>
        )}

        <p className="text-sm text-muted-foreground">{summary.feedback}</p>

        {summary.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-primary" />
              Suggestions
            </p>
            <ul className="space-y-2">
              {summary.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-primary">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
