import { fetchAllNews, getArticlesByCategory } from "@/lib/rss";
import { CATEGORIES } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";
import { getActiveSponsors } from "@/lib/sponsored";
import HeroSection from "@/components/ui/HeroSection";
import NewsGrid from "@/components/ui/NewsGrid";
import NeonDivider from "@/components/ui/NeonDivider";
import TimestampBadge from "@/components/ui/TimestampBadge";
import TickerBar from "@/components/ui/TickerBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import AdSlot from "@/components/ads/AdSlot";
import SponsoredToolCard from "@/components/ui/SponsoredToolCard";
import CareerBanner from "@/components/ui/CareerBanner";
import Link from "next/link";

export const revalidate = 21600; // 6 hours

export default async function HomePage() {
  const articles = await fetchAllNews();

  const heroArticle = articles[0];
  const tickerHeadlines = articles.slice(0, 10);

  const sections = (Object.keys(CATEGORIES) as CategorySlug[]).map((slug) => ({
    slug,
    articles: getArticlesByCategory(articles, slug).slice(0, 6),
  }));

  let sponsors: Awaited<ReturnType<typeof getActiveSponsors>> = [];
  try {
    sponsors = await getActiveSponsors();
  } catch {
    // Sponsors are optional
  }

  return (
    <>
      <TickerBar headlines={tickerHeadlines} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        {heroArticle && <HeroSection article={heroArticle} />}

        {/* Newsletter signup */}
        <div className="mt-8 mb-4">
          <ScrollReveal>
            <NewsletterSignup />
          </ScrollReveal>
        </div>

        {/* Career affiliate — compact, right below newsletter */}
        <div className="mb-8">
          <ScrollReveal>
            <CareerBanner locale="en" />
          </ScrollReveal>
        </div>

        {/* Category sections */}
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
                      {cat.name}
                    </h2>
                    <span className="font-mono text-[10px] text-text-dim ml-1">
                      [{section.articles.length}]
                    </span>
                  </div>
                  <Link
                    href={`/category/${section.slug}`}
                    className="font-mono text-xs text-text-dim hover:text-neon-cyan transition-colors group/link"
                  >
                    View all{" "}
                    <span className="inline-block group-hover/link:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </ScrollReveal>

              <NewsGrid articles={section.articles} />

              {/* Sponsored tools after first category section */}
              {i === 0 && sponsors.length > 0 && (
                <div className="mt-8">
                  <NeonDivider />
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-7 rounded-full bg-neon-amber" />
                      <h2 className="font-mono text-lg font-bold tracking-wide">
                        Featured AI Tools
                      </h2>
                      <span className="font-mono text-[9px] text-neon-amber/50 uppercase tracking-widest ml-1">
                        Sponsored
                      </span>
                    </div>
                  </ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sponsors.slice(0, 3).map((tool) => (
                      <ScrollReveal key={tool.id}>
                        <SponsoredToolCard tool={tool} />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {/* Ad slot after 2nd and 4th category sections */}
              {(i === 1 || i === 3) && (
                <AdSlot slot={`home-section-${i}`} format="horizontal" className="mt-6" />
              )}
            </div>
          );
        })}

        <TimestampBadge />
      </div>
    </>
  );
}
