"use client";

import { CATEGORIES, AFFILIATE_LINKS } from "@/lib/constants";
import { NewsArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import AffiliateSlot from "./AffiliateSlot";
import NewsletterSignup from "./NewsletterSignup";
import AdSlot from "@/components/ads/AdSlot";

export default function ArticleDetail({
  article,
  relatedArticles,
}: {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}) {
  const catColor = CATEGORIES[article.category].color;
  const categoryAffiliates = AFFILIATE_LINKS.filter(
    (a) => a.category === article.category
  ).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="font-mono text-xs text-text-dim mb-6">
        <a href="/" className="hover:text-neon-cyan transition-colors">
          Home
        </a>
        <span className="mx-2">/</span>
        <a
          href={`/category/${article.category}`}
          className="hover:text-neon-cyan transition-colors"
        >
          {CATEGORIES[article.category].name}
        </a>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Article</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={article.category} />
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider">
            {article.source}
          </span>
          <time className="font-mono text-[10px] text-text-dim">
            {formatDate(article.publishedAt)}
          </time>
        </div>

        <h1 className="font-mono text-2xl md:text-3xl font-bold leading-tight mb-4">
          {article.title}
        </h1>

        {article.imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-border-dim mb-6">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ backgroundColor: catColor }}
            />
          </div>
        )}
      </header>

      {/* Ad: above summary */}
      <AdSlot slot="article-top" format="horizontal" className="my-6" />

      {/* AI Summary */}
      {article.summary && (
        <section className="mb-8 p-6 rounded-lg border border-border-dim bg-surface/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-5 rounded-full bg-neon-cyan" />
            <h2 className="font-mono text-xs text-neon-cyan uppercase tracking-widest">
              AI Summary
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            {article.summary}
          </p>

          {article.aiCommentary && (
            <div className="mt-4 pt-4 border-t border-border-dim">
              <p className="font-mono text-[10px] text-neon-purple uppercase tracking-widest mb-2">
                Vertech Take
              </p>
              <p className="text-text-secondary text-sm italic leading-relaxed">
                {article.aiCommentary}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Read full article CTA */}
      <div className="mb-8 text-center">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-mono text-sm font-bold
            bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30
            hover:bg-neon-cyan/20 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]
            transition-all duration-300"
        >
          Read Full Article on {article.source}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* Ad: below article CTA */}
      <AdSlot slot="article-bottom" format="rectangle" className="my-6" />

      {/* Category-matched affiliates */}
      {categoryAffiliates.length > 0 && (
        <section className="mb-8">
          <h3 className="font-mono text-xs text-text-dim uppercase tracking-widest mb-4">
            Recommended Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryAffiliates.map((aff) => (
              <AffiliateSlot key={aff.name} affiliate={aff} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="mb-8">
        <NewsletterSignup />
      </section>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section>
          <h3 className="font-mono text-xs text-text-dim uppercase tracking-widest mb-4">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((related) => (
              <a
                key={related.id}
                href={`/article/${related.id}`}
                className="group block p-4 rounded-lg border border-border-dim bg-surface/40 hover:border-neon-cyan/30 transition-colors"
              >
                <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider">
                  {related.source}
                </span>
                <h4 className="font-mono text-sm font-bold mt-1 line-clamp-2 group-hover:text-neon-cyan transition-colors">
                  {related.title}
                </h4>
                <time className="block font-mono text-[10px] text-text-dim mt-2">
                  {formatDate(related.publishedAt)}
                </time>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
