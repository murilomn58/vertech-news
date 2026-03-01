import { fetchAllNews, getArticlesByCategory } from "@/lib/rss";
import { CATEGORIES } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";
import HeroSection from "@/components/ui/HeroSection";
import NewsGrid from "@/components/ui/NewsGrid";
import NeonDivider from "@/components/ui/NeonDivider";
import TimestampBadge from "@/components/ui/TimestampBadge";
import TickerBar from "@/components/ui/TickerBar";
import Link from "next/link";

export const revalidate = 86400; // 24 hours

export default async function HomePage() {
  const articles = await fetchAllNews();

  const heroArticle = articles[0];
  const claudeArticles = getArticlesByCategory(articles, "claude-code").slice(0, 6);
  const generalArticles = getArticlesByCategory(articles, "ai-general").slice(0, 6);
  const businessArticles = getArticlesByCategory(articles, "ai-business").slice(0, 6);

  // Top 10 headlines for ticker
  const tickerHeadlines = articles.slice(0, 10);

  const sections: { slug: CategorySlug; articles: typeof claudeArticles }[] = [
    { slug: "claude-code", articles: claudeArticles },
    { slug: "ai-general", articles: generalArticles },
    { slug: "ai-business", articles: businessArticles },
  ];

  return (
    <>
      <TickerBar headlines={tickerHeadlines} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        {heroArticle && <HeroSection article={heroArticle} />}

        {/* Category sections */}
        {sections.map((section, i) => {
          const cat = CATEGORIES[section.slug];
          return (
            <div key={section.slug}>
              {i > 0 || heroArticle ? <NeonDivider /> : null}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h2 className="font-mono text-lg font-bold tracking-wide">
                    {cat.name}
                  </h2>
                </div>
                <Link
                  href={`/category/${section.slug}`}
                  className="font-mono text-xs text-text-dim hover:text-neon-cyan transition-colors"
                >
                  View all &rarr;
                </Link>
              </div>

              <NewsGrid articles={section.articles} />
            </div>
          );
        })}

        <TimestampBadge />
      </div>
    </>
  );
}
