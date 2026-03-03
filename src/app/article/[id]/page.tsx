import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAllNews, getArticlesByCategory } from "@/lib/rss";
import { generateArticleSummary } from "@/lib/ai-summary";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import ArticleDetail from "@/components/ui/ArticleDetail";

export const revalidate = 21600; // 6 hours

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const articles = await fetchAllNews();
  const article = articles.find((a) => a.id === id);

  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/article/${id}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articles = await fetchAllNews();
  const article = articles.find((a) => a.id === id);

  if (!article) notFound();

  // Generate AI summary
  const { summary, commentary } = await generateArticleSummary(
    article.id,
    article.title,
    article.description,
    article.source,
    CATEGORIES[article.category].name
  );

  const enrichedArticle = {
    ...article,
    summary,
    aiCommentary: commentary,
  };

  // Get related articles (same category, excluding current)
  const relatedArticles = getArticlesByCategory(articles, article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, 4);

  // JSON-LD for article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    image: article.imageUrl || undefined,
    author: {
      "@type": "Organization",
      name: article.source,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetail
        article={enrichedArticle}
        relatedArticles={relatedArticles}
      />
    </>
  );
}
