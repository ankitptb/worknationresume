import { GraduationCap, Award, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EducationSection, getScoreColor } from '@/types/resume';

interface EducationCardProps {
  education: EducationSection;
}

const EducationCard = ({ education }: EducationCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Education & Certifications
          </CardTitle>
          <Badge
            variant="outline"
            className="text-sm font-bold px-3 py-1"
            style={{ color: getScoreColor(education.score), borderColor: getScoreColor(education.score) }}
          >
            {education.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.items.length > 0 ? (
          <div className="space-y-3">
            {education.items.map((item, i) => (
              <div key={i} className="p-3 rounded-lg border border-border bg-muted/30">
                <p className="font-semibold text-foreground">{item.degree}</p>
                <p className="text-sm text-muted-foreground">{item.institution}</p>
                <p className="text-xs text-muted-foreground">{item.year}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">No education entries detected.</p>
          </div>
        )}

        {education.certifications.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" />
              Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {education.certifications.map((cert, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{cert}</Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">{education.feedback}</p>

        {education.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-primary" />
              Suggestions
            </p>
            <ul className="space-y-2">
              {education.suggestions.map((s, i) => (
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

export default EducationCard;
