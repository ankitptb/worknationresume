import { Card, CardContent } from '@/components/ui/card';
import { SalaryAnalysis } from '@/types/resume';
import { Banknote, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalaryMatchCardProps {
  analysis: SalaryAnalysis;
  expected?: string;
}

const SalaryMatchCard = ({ analysis, expected }: SalaryMatchCardProps) => {
  // Defensive check with more graceful fallback
  if (!analysis) {
    return (
      <div className="p-6 rounded-xl border border-dashed flex flex-col items-center justify-center bg-muted/10 min-h-[140px] text-center gap-2">
        <Banknote className="w-5 h-5 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground italic">Analyzing market salary data...</p>
      </div>
    );
  }

  // Ensure we have a level, default to 'good' if AI missed it but gave advice
  const level = analysis.level || 'good';
  const isMatched = expected && expected.trim() !== "" && expected.toLowerCase() !== "not provided";

  const config = {
    low: {
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      label: isMatched ? 'Below Market' : 'High Potential'
    },
    good: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      label: isMatched ? 'Market Match' : 'Market Standard'
    },
    high: {
      icon: AlertCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      label: isMatched ? 'Above Average' : 'Premium Profile'
    }
  }[level];

  const Icon = config.icon;

  return (
    <div className={cn("p-4 rounded-2xl border flex flex-col gap-4 transition-all", config.bgColor, config.borderColor)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-background", config.color)}>
            <Banknote className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground opacity-70">
              {isMatched ? 'Expectation Check' : 'Market Valuation'}
            </span>
            <span className="text-xs font-bold text-foreground">
              {config.label}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {isMatched ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Your Ask</span>
            <p className="text-xl font-black text-foreground tracking-tighter decoration-primary/20 underline-offset-4 underline">
              {expected}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Potential Worth</span>
            <p className="text-2xl font-black text-foreground tracking-tighter">
              {analysis.marketWorth || "25 - 45 LPA"}
            </p>
          </div>
        )}
        
        {analysis.advice && (analysis.advice.trim() !== "") && (
          <div className="relative bg-background/40 p-3 rounded-lg border border-current/5">
            <p className="text-[11px] leading-relaxed text-muted-foreground italic line-clamp-3">
              "{analysis.advice}"
            </p>
          </div>
        )}
      </div>
      
      <div className="pt-2 border-t border-current/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon className={cn("w-3.5 h-3.5", config.color)} />
            <p className="text-[10px] font-bold text-foreground leading-tight">
              {level === 'high' 
                ? `High demand market range is ${analysis.marketWorth || "Premium bracket"}`
                : level === 'low'
                  ? `Worth ${analysis.marketWorth || "more"}, you are asking low. Market range ${analysis.marketWorth || "is higher"}`
                  : (analysis.marketMatch || "Aligned with market standards")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryMatchCard;
