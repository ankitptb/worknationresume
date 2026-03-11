import { FolderOpen, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectsSection, getScoreColor } from '@/types/resume';

interface ProjectsCardProps {
  projects: ProjectsSection;
}

const ProjectsCard = ({ projects }: ProjectsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            Projects
          </CardTitle>
          <Badge
            variant="outline"
            className="text-sm font-bold px-3 py-1"
            style={{ color: getScoreColor(projects.score), borderColor: getScoreColor(projects.score) }}
          >
            {projects.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {projects.items.length === 0 ? (
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">No projects section detected.</p>
          </div>
        ) : (
          projects.items.map((item, i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.techStack.map((tech, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {item.highlights.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(var(--score-excellent))' }}>
                    Strengths
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
                    Improvements
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

        <p className="text-sm text-muted-foreground">{projects.feedback}</p>

        {projects.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-primary" />
              Suggestions
            </p>
            <ul className="space-y-2">
              {projects.suggestions.map((s, i) => (
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

export default ProjectsCard;
