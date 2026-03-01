"use client";

import { CATEGORIES } from "@/lib/constants";
import { NewsArticle } from "@/lib/types";

const categoryColors: Record<string, string> = {
  "claude-code": CATEGORIES["claude-code"].color,
  "ai-general": CATEGORIES["ai-general"].color,
  "ai-business": CATEGORIES["ai-business"].color,
};

export default function TickerBar({ headlines }: { headlines: NewsArticle[] }) {
  if (headlines.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...headlines, ...headlines];

  return (
    <div className="relative z-20 bg-surface/80 border-b border-neon-cyan/10 h-8 overflow-hidden backdrop-blur-sm">
      {/* LIVE indicator */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-3 pr-4 bg-gradient-to-r from-surface via-surface to-transparent">
        <span className="relative flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-red-400">LIVE</span>
        </span>
      </div>

      {/* Scrolling headlines */}
      <div className="animate-ticker flex items-center h-full whitespace-nowrap pl-20">
        {items.map((h, i) => {
          const color = categoryColors[h.category] || "#06b6d4";
          return (
            <a
              key={`${h.id}-${i}`}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mx-6 text-xs font-mono hover:brightness-125 transition-all"
            >
              <span
                className="w-1 h-1 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span style={{ color }}>
                {h.title}
              </span>
              <span className="text-text-dim ml-2 text-[10px]">
                [{h.source}]
              </span>
              {/* Separator */}
              <span className="ml-6 text-border-dim">|</span>
            </a>
          );
        })}
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
    </div>
  );
}
