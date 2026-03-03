import { fetchAllNews, getArticlesByCategory } from "@/lib/rss";
import { CATEGORIES } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";
import HeroSection from "@/components/ui/HeroSection";
import NewsGrid from "@/components/ui/NewsGrid";
import NeonDivider from "@/components/ui/NeonDivider";
import TimestampBadge from "@/components/ui/TimestampBadge";
import TickerBar from "@/components/ui/TickerBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 21600;

const PT_CATEGORY_NAMES: Record<CategorySlug, string> = {
  "claude-code": "Claude Code",
  "ai-general": "IA Geral",
  "ai-business": "IA & Negócios",
  cybersecurity: "Cibersegurança",
  "tech-general": "Tecnologia",
};

export const metadata: Metadata = {
  title: "Vertech News | Notícias de IA e Tecnologia",
  description:
    "Agregador de notícias de tecnologia e inteligência artificial. Cobertura de IA, cibersegurança, Claude Code e mais.",
  alternates: {
    languages: {
      "en-US": "/",
      "pt-BR": "/pt",
    },
  },
};

export default async function PTHomePage() {
  const articles = await fetchAllNews();

  const heroArticle = articles[0];
  const tickerHeadlines = articles.slice(0, 10);

  const sections = (Object.keys(CATEGORIES) as CategorySlug[]).map((slug) => ({
    slug,
    articles: getArticlesByCategory(articles, slug).slice(0, 6),
  }));

  return (
    <>
      <TickerBar headlines={tickerHeadlines} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Language notice */}
        <div className="mb-6 font-mono text-xs text-text-dim text-center">
          <span className="text-neon-cyan">&gt;</span> Versão em Português
          {" — "}
          <Link href="/" className="text-neon-cyan hover:underline">
            Switch to English
          </Link>
        </div>

        {heroArticle && <HeroSection article={heroArticle} />}

        <div className="mt-8 mb-4">
          <ScrollReveal>
            <NewsletterSignup />
          </ScrollReveal>
        </div>

        {sections.map((section, i) => {
          const cat = CATEGORIES[section.slug];
          return (
            <div key={section.slug}>
              {i > 0 || heroArticle ? <NeonDivider /> : null}

              <ScrollReveal>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-7 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${cat.color}, transparent)`,
                        animation: "bar-scan 3s ease-in-out infinite",
                        backgroundSize: "100% 200%",
                      }}
                    />
                    <h2 className="font-mono text-lg font-bold tracking-wide">
                      {PT_CATEGORY_NAMES[section.slug]}
                    </h2>
                    <span className="font-mono text-[10px] text-text-dim ml-1">
                      [{section.articles.length}]
                    </span>
                  </div>
                  <Link
                    href={`/category/${section.slug}`}
                    className="font-mono text-xs text-text-dim hover:text-neon-cyan transition-colors group/link"
                  >
                    Ver todos{" "}
                    <span className="inline-block group-hover/link:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </ScrollReveal>

              <NewsGrid articles={section.articles} />
            </div>
          );
        })}

        <TimestampBadge />
      </div>
    </>
  );
}
