import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  'Reading resume...',
  'Detecting sections...',
  'Analyzing content quality...',
  'Checking keywords...',
  'Calculating score...',
];

interface ProcessingStatusProps {
  isProcessing: boolean;
}

const ProcessingStatus = ({ isProcessing }: ProcessingStatusProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing) return null;

  return (
    <div className="w-full max-w-md mx-auto space-y-3 py-8">
      {STEPS.map((step, i) => (
        <div
          key={step}
          className={cn(
            'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300',
            i < currentStep && 'opacity-60',
            i === currentStep && 'bg-primary/5',
            i > currentStep && 'opacity-30'
          )}
        >
          {i < currentStep ? (
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          ) : i === currentStep ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
          )}
          <span className={cn(
            'text-sm font-medium',
            i === currentStep ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProcessingStatus;
