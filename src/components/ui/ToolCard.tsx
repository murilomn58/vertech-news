"use client";

import { ToolEntry } from "@/lib/tools-data";

export default function ToolCard({
  tool,
  color,
}: {
  tool: ToolEntry;
  color: string;
}) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block p-5 rounded-lg border border-border-dim bg-surface/60
        hover:bg-surface/80 transition-all duration-300"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-mono text-sm font-bold group-hover:text-neon-cyan transition-colors">
          {tool.name}
        </h3>
        {tool.badge && (
          <span
            className="font-mono text-[9px] px-2 py-0.5 rounded-full border"
            style={{
              borderColor: `${color}40`,
              color: color,
            }}
          >
            {tool.badge}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-xs leading-relaxed mb-3">
        {tool.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-text-dim">
          {tool.pricing}
        </span>
        <span className="font-mono text-[10px] text-text-dim group-hover:text-neon-cyan transition-colors">
          Visit &rarr;
        </span>
      </div>
    </a>
  );
}
