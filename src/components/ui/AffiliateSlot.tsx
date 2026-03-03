"use client";

import { AffiliateConfig } from "@/lib/types";

export default function AffiliateSlot({ affiliate }: { affiliate: AffiliateConfig }) {
  function trackClick() {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "affiliate_click",
        affiliateName: affiliate.name,
        category: affiliate.category,
        page: window.location.pathname,
      }),
    }).catch(() => {});
  }

  return (
    <a
      href={affiliate.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={trackClick}
      className="group/aff block rounded-lg border border-neon-purple/20 bg-surface/60 backdrop-blur-sm
        hover:border-neon-purple/40 hover:bg-surface/80 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />

      <div className="p-4">
        {/* Sponsored badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[9px] text-neon-purple/60 uppercase tracking-widest">
            Sponsored
          </span>
          {affiliate.badge && (
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-neon-purple/20 text-neon-purple/70">
              {affiliate.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <h4 className="font-mono text-sm font-bold mb-1.5 group-hover/aff:text-neon-purple transition-colors">
          {affiliate.name}
        </h4>
        <p className="text-text-dim text-xs leading-relaxed line-clamp-2">
          {affiliate.description}
        </p>

        {/* CTA */}
        <div className="mt-3 font-mono text-[10px] text-neon-purple/60 group-hover/aff:text-neon-purple transition-colors">
          Learn more &rarr;
        </div>
      </div>
    </a>
  );
}
