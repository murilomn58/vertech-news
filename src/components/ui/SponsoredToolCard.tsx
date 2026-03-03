"use client";

import { SponsoredTool } from "@/lib/sponsored";

export default function SponsoredToolCard({ tool }: { tool: SponsoredTool }) {
  function trackClick() {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "affiliate_click",
        affiliateName: `sponsored:${tool.name}`,
        category: tool.category,
        page: window.location.pathname,
      }),
    }).catch(() => {});
  }

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={trackClick}
      className="group block p-5 rounded-lg border border-neon-amber/15 bg-surface/60 backdrop-blur-sm
        hover:border-neon-amber/30 hover:bg-surface/80 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] text-neon-amber/50 uppercase tracking-widest">
          Sponsored
        </span>
        {tool.logo && (
          <img
            src={tool.logo}
            alt=""
            className="h-5 w-auto opacity-60 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
      <h4 className="font-mono text-sm font-bold group-hover:text-neon-amber transition-colors mb-1.5">
        {tool.name}
      </h4>
      <p className="text-text-dim text-xs leading-relaxed line-clamp-2">
        {tool.description}
      </p>
      <div className="mt-3 font-mono text-[10px] text-neon-amber/50 group-hover:text-neon-amber transition-colors">
        Try it free &rarr;
      </div>
    </a>
  );
}
