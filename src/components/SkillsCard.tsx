import { Code, Lightbulb, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkillsSection, getScoreColor } from '@/types/resume';

interface SkillsCardProps {
  skills: SkillsSection;
}

const SkillsCard = ({ skills }: SkillsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Skills & Keywords
          </CardTitle>
          <Badge
            variant="outline"
            className="text-sm font-bold px-3 py-1"
            style={{ color: getScoreColor(skills.score), borderColor: getScoreColor(skills.score) }}
          >
            {skills.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.detected.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Detected Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.detected.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {skills.missing.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Missing Skills for Target Role
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.missing.map((skill, i) => (
                <Badge key={i} variant="outline" className="text-xs text-destructive border-destructive/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">{skills.feedback}</p>

        {skills.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-primary" />
              Suggestions
            </p>
            <ul className="space-y-2">
              {skills.suggestions.map((s, i) => (
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

export default SkillsCard;
