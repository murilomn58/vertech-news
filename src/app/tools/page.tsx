import { Metadata } from "next";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools-data";
import { SITE_CONFIG } from "@/lib/constants";
import AdSlot from "@/components/ads/AdSlot";
import ToolCard from "@/components/ui/ToolCard";

export const metadata: Metadata = {
  title: "AI Tools Directory — Best AI Tools for Developers & Teams",
  description:
    "Curated directory of the best AI tools for coding, writing, productivity, security, and infrastructure. Updated regularly.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools`,
    languages: {
      "en-US": "/tools",
      "pt-BR": "/pt/ferramentas",
    },
  },
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="font-mono text-xs text-neon-cyan tracking-widest uppercase mb-2">
          &gt; Curated Directory
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-wide mb-3">
          AI Tools Directory
        </h1>
        <p className="text-text-secondary text-sm max-w-xl mx-auto">
          The best AI and developer tools, curated by Vertech News.
          Affiliate links help support this site at no cost to you.
        </p>
      </div>

      <AdSlot slot="tools-top" format="horizontal" className="mb-8" />

      {/* Tool categories */}
      {TOOL_CATEGORIES.map((cat) => {
        const categoryTools = TOOLS.filter((t) => t.category === cat.slug);
        if (categoryTools.length === 0) return null;

        return (
          <section key={cat.slug} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-1.5 h-7 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <h2 className="font-mono text-lg font-bold tracking-wide">
                {cat.name}
              </h2>
              <span className="font-mono text-[10px] text-text-dim">
                [{categoryTools.length}]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} color={cat.color} />
              ))}
            </div>
          </section>
        );
      })}

      <AdSlot slot="tools-bottom" format="horizontal" className="mt-8" />
    </div>
  );
}
