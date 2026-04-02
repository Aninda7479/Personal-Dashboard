import { Sparkles, Quote } from 'lucide-react';

export default function QuoteCard({ quote, author }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-subtle relative overflow-hidden group h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote size={80} className="text-primary" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-neon-happy mb-3">
          <Sparkles size={18} />
          <span className="text-xs font-bold tracking-wider uppercase">Quote of the Day</span>
        </div>
        <p className="text-lg font-display italic text-primary mb-4 pr-8 line-clamp-3">&quot;{quote || 'Loading quote...'}&quot;</p>
        <p className="text-secondary font-medium text-sm">— {author || '...'}</p>
      </div>
    </div>
  );
}
