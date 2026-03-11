import { Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandAdvice } from '@/types/resume';

interface BrandAdviceCardProps {
  brandAdvice: BrandAdvice;
}

const BrandAdviceCard = ({ brandAdvice }: BrandAdviceCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Brand & Pedigree Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`p-4 rounded-lg border ${brandAdvice.hasTopBrand ? 'bg-[hsl(var(--score-excellent))]/5 border-[hsl(var(--score-excellent))]/20' : 'bg-[hsl(var(--score-average))]/5 border-[hsl(var(--score-average))]/20'}`}>
          <p className="text-sm text-foreground">{brandAdvice.message}</p>
        </div>
        {brandAdvice.actionItems.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-foreground">Action Items:</p>
            <ul className="space-y-1.5">
              {brandAdvice.actionItems.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandAdviceCard;
