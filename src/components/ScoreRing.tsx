import { useEffect, useState } from 'react';
import { getScoreGrade, getScoreLabel } from '@/types/resume';

interface ScoreRingProps {
  score: number;
  size?: number;
}

const ScoreRing = ({ score, size = 200 }: ScoreRingProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const grade = getScoreGrade(score);
  const label = getScoreLabel(score);

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const gradeColorVar: Record<string, string> = {
    excellent: 'hsl(var(--score-excellent))',
    good: 'hsl(var(--score-good))',
    average: 'hsl(var(--score-average))',
    below: 'hsl(var(--score-below))',
    poor: 'hsl(var(--score-poor))',
  };

  const color = gradeColorVar[grade];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-foreground">{animatedScore}</span>
          <span className="text-sm text-muted-foreground font-medium">/ 100</span>
        </div>
      </div>
      <span
        className="text-lg font-semibold px-4 py-1 rounded-full"
        style={{ color, backgroundColor: `${color}15` }}
      >
        {label}
      </span>
    </div>
  );
};

export default ScoreRing;
