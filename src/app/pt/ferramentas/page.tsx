import { Metadata } from "next";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools-data";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diretório de Ferramentas de IA — Melhores Ferramentas para Desenvolvedores",
  description:
    "Diretório curado das melhores ferramentas de IA para programação, escrita, produtividade, segurança e infraestrutura.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/pt/ferramentas`,
    languages: {
      "en-US": "/tools",
      "pt-BR": "/pt/ferramentas",
    },
  },
};

const PT_CATEGORY_NAMES: Record<string, string> = {
  coding: "IA para Programação",
  writing: "IA para Escrita",
  productivity: "Produtividade",
  security: "Segurança",
  infrastructure: "Infraestrutura",
  image: "IA para Imagem & Vídeo",
};

export default function PTToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 font-mono text-xs text-text-dim text-center">
        <span className="text-neon-cyan">&gt;</span> Versão em Português
        {" — "}
        <Link href="/tools" className="text-neon-cyan hover:underline">
          Switch to English
        </Link>
      </div>

      <div className="mb-10 text-center">
        <p className="font-mono text-xs text-neon-cyan tracking-widest uppercase mb-2">
          &gt; Diretório Curado
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-wide mb-3">
          Ferramentas de IA
        </h1>
        <p className="text-text-secondary text-sm max-w-xl mx-auto">
          As melhores ferramentas de IA e desenvolvimento, curadas pela Vertech News.
          Links de afiliados ajudam a manter este site sem custo para você.
        </p>
      </div>

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
                {PT_CATEGORY_NAMES[cat.slug] || cat.name}
              </h2>
              <span className="font-mono text-[10px] text-text-dim">
                [{categoryTools.length}]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group block p-5 rounded-lg border border-border-dim bg-surface/60
                    hover:border-opacity-50 hover:bg-surface/80 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-mono text-sm font-bold group-hover:text-neon-cyan transition-colors">
                      {tool.name}
                    </h3>
                    {tool.badge && (
                      <span
                        className="font-mono text-[9px] px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: `${cat.color}40`,
                          color: cat.color,
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
                      Visitar &rarr;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
