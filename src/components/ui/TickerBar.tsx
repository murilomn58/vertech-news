"use client";

import { NewsArticle } from "@/lib/types";

export default function TickerBar({ headlines }: { headlines: NewsArticle[] }) {
  if (headlines.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...headlines, ...headlines];

  return (
    <div className="relative z-20 bg-surface/80 border-b border-neon-cyan/10 h-8 overflow-hidden backdrop-blur-sm">
      <div className="animate-ticker flex items-center h-full whitespace-nowrap">
        {items.map((h, i) => (
          <a
            key={`${h.id}-${i}`}
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mx-8 text-xs font-mono hover:text-neon-cyan transition-colors"
          >
            <span className="text-neon-green mr-2 text-[8px]">&#9654;</span>
            <span className="text-text-secondary">{h.title}</span>
            <span className="text-text-dim ml-2 text-[10px]">[{h.source}]</span>
          </a>
        ))}
      </div>
    </div>
  );
}
