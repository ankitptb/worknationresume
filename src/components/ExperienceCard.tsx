import { Briefcase, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExperienceSection, getScoreColor } from '@/types/resume';

interface ExperienceCardProps {
  experience: ExperienceSection;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Work Experience
          </CardTitle>
          <Badge
            variant="outline"
            className="text-sm font-bold px-3 py-1"
            style={{ color: getScoreColor(experience.score), borderColor: getScoreColor(experience.score) }}
          >
            {experience.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {experience.items.length === 0 ? (
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">No work experience entries detected.</p>
          </div>
        ) : (
          experience.items.map((item, i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.company} · {item.duration}
                </p>
              </div>

              {item.highlights.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(var(--score-excellent))' }}>
                    What's Good
                  </p>
                  <ul className="space-y-1">
                    {item.highlights.map((h, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'hsl(var(--score-excellent))' }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.improvements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(var(--score-average))' }}>
                    Suggested Improvements
                  </p>
                  <ul className="space-y-1">
                    {item.improvements.map((imp, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'hsl(var(--score-average))' }} />
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}

        <p className="text-sm text-muted-foreground">{experience.feedback}</p>

        {experience.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-primary" />
              Overall Suggestions
            </p>
            <ul className="space-y-2">
              {experience.suggestions.map((s, i) => (
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

export default ExperienceCard;
