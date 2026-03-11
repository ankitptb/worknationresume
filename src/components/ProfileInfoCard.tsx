import { User, Mail, Phone, Linkedin, Github, Globe, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileInfo } from '@/types/resume';
import { getScoreColor } from '@/types/resume';

interface ProfileInfoCardProps {
  profile: ProfileInfo;
}

const ProfileInfoCard = ({ profile }: ProfileInfoCardProps) => {
  const items = [
    { label: 'Name', value: profile.name, icon: User },
    { label: 'Title', value: profile.title, icon: User },
    { label: 'Email', value: profile.email, icon: Mail },
    { label: 'Phone', value: profile.phone, icon: Phone },
    { label: 'Location', value: profile.location, icon: MapPin },
    { label: 'LinkedIn', value: profile.linkedin, icon: Linkedin },
    { label: 'GitHub', value: profile.github, icon: Github },
    { label: 'Portfolio', value: profile.portfolio, icon: Globe },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
          <Badge
            variant="outline"
            className="text-sm font-bold px-3 py-1"
            style={{ color: getScoreColor(profile.score), borderColor: getScoreColor(profile.score) }}
          >
            {profile.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            const found = !!item.value;
            return (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}:</span>
                {found ? (
                  <span className="text-muted-foreground truncate flex-1">{item.value}</span>
                ) : (
                  <span className="text-destructive italic">Missing</span>
                )}
                {found ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--score-excellent))' }} />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
                )}
              </div>
            );
          })}
        </div>
        {profile.missing.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-1">Missing Items</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {profile.missing.map((m, i) => (
                <li key={i} className="flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-destructive shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
