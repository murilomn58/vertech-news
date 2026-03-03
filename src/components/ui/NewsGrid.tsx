import { NewsArticle } from "@/lib/types";
import { AFFILIATE_LINKS } from "@/lib/constants";
import NewsCard from "./NewsCard";
import AffiliateSlot from "./AffiliateSlot";
import ScrollReveal from "./ScrollReveal";

function getAffiliateForCategory(category: string, index: number) {
  const matching = AFFILIATE_LINKS.filter((a) => a.category === category);
  if (matching.length === 0) {
    // Fallback to general tech affiliates
    const fallback = AFFILIATE_LINKS.filter((a) => a.category === "tech-general");
    return fallback[index % fallback.length];
  }
  return matching[index % matching.length];
}

export default function NewsGrid({
  articles,
  showAffiliates = true,
}: {
  articles: NewsArticle[];
  showAffiliates?: boolean;
}) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-text-dim text-sm">
          <span className="text-neon-cyan">&gt;</span> No articles found_
        </p>
      </div>
    );
  }

  // Build items list with affiliate slots injected every 7th position
  const items: { type: "article" | "affiliate"; article?: NewsArticle; affiliateIndex?: number }[] = [];
  let affiliateCounter = 0;

  articles.forEach((article, i) => {
    items.push({ type: "article", article });

    if (showAffiliates && (i + 1) % 6 === 0 && i + 1 < articles.length) {
      items.push({ type: "affiliate", article, affiliateIndex: affiliateCounter });
      affiliateCounter++;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => {
        if (item.type === "affiliate" && item.article) {
          const affiliate = getAffiliateForCategory(
            item.article.category,
            item.affiliateIndex ?? 0
          );
          return (
            <ScrollReveal key={`aff-${i}`} delay={i * 60}>
              <AffiliateSlot affiliate={affiliate} />
            </ScrollReveal>
          );
        }

        return (
          <ScrollReveal key={item.article!.id} delay={i * 60}>
            <NewsCard article={item.article!} />
          </ScrollReveal>
        );
      })}
    </div>
  );
}
