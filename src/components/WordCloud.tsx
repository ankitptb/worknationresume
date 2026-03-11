import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordCloudItem } from '@/types/resume';
import { Layout } from 'lucide-react';

const WordCloud = ({ words, rawText }: { words?: WordCloudItem[], rawText?: string }) => {
  const displayWords = useMemo(() => {
    let result = (words && words.length > 0) ? [...words] : [];
    
    if (result.length === 0 && rawText) {
      const stopWords = new Set(['the', 'and', 'with', 'from', 'this', 'that', 'for', 'was', 'were', 'have', 'had', 'been', 'will', 'shall', 'should', 'would', 'could', 'must', 'can', 'may', 'might', 'into', 'onto', 'upon', 'about', 'above', 'below', 'under', 'over', 'again', 'once', 'then', 'when', 'where', 'while', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'too', 'very', 'just', 'now', 'using', 'used', 'working', 'worked', 'through', 'across', 'within', 'around', 'during']);
      
      const cleanedWords = rawText
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.has(w));
      
      const counts: Record<string, number> = {};
      cleanedWords.forEach(w => counts[w] = (counts[w] || 0) + 1);
      
      const sortedEntries = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20);

      const maxCount = sortedEntries[0]?.[1] || 1;
      
      result = sortedEntries.map(([text, count]) => ({
        text: text.toUpperCase(),
        value: Math.min(10, Math.max(1, Math.round((count / maxCount) * 10)))
      }));
    }

    // Keep it organized: top words first, then some slight shuffling
    const topWords = result.filter(w => w.value >= 8);
    const otherWords = result.filter(w => w.value < 8).sort(() => Math.random() - 0.5);
    return [...topWords, ...otherWords];
  }, [words, rawText]);

  if (displayWords.length === 0) {
    return (
      <Card className="overflow-hidden border-dashed opacity-60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2 text-muted-foreground">
            <Layout className="w-4 h-4" />
            Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-xs italic">
          Distilling resume context...
        </CardContent>
      </Card>
    );
  }

  const getFontSize = (value: number) => {
    // 1-10 importance - more tactical spread for "clean" feel
    const baseSize = value * 2.5 + 11; // 13.5px to 36px
    return `${baseSize}px`;
  };

  const getStyle = (value: number, index: number) => {
    // Subtle organic tilts only (no vertical)
    const rotations = [0, -2, 2, 0, -3, 3, 0, -1, 1, 0];
    const rotate = rotations[index % rotations.length];
    
    return {
      fontSize: getFontSize(value),
      fontWeight: value >= 8 ? '900' : value >= 5 ? '700' : '400',
      opacity: 0.4 + (value / 10) * 0.6,
      transform: rotate !== 0 ? `rotate(${rotate}deg)` : 'none',
      color: value >= 8 ? 'hsl(var(--primary))' : value >= 5 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
      padding: '4px 10px',
      margin: '2px',
      lineHeight: '1.2',
      letterSpacing: value > 7 ? '-0.02em' : 'normal',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    };
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-muted/20 border-primary/5 shadow-premium">
      <CardHeader className="pb-1 py-4 bg-muted/10 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-2 text-primary">
            <Layout className="w-3 h-3" />
            Strategic DNA
          </CardTitle>
          <div className="flex gap-2 items-center">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Core Insights</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {displayWords.map((item, i) => (
            <span
              key={i}
              className="inline-block hover:scale-110 hover:text-primary hover:z-10 cursor-default select-none animate-in fade-in zoom-in duration-1000"
              style={getStyle(item.value, i)}
            >
              {item.text}
            </span>
          ))}
          
          {/* Decorative elements for 'clean' premium look */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 blur-[80px] rounded-full -z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100/[0.02] -z-10" />
        </div>
      </CardContent>
    </Card>
  );
};

export default WordCloud;
