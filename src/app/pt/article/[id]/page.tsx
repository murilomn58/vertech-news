import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAllNews, getArticlesByCategory } from "@/lib/rss";
import { generateArticleSummary } from "@/lib/ai-summary";
import { translateToPTBR } from "@/lib/translate";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import ArticleDetail from "@/components/ui/ArticleDetail";

export const revalidate = 21600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const articles = await fetchAllNews();
  const article = articles.find((a) => a.id === id);

  if (!article) return { title: "Artigo Não Encontrado" };

  const translated = await translateToPTBR(
    `${id}-meta`,
    article.title,
    article.description
  );

  return {
    title: translated.title,
    description: translated.description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/pt/article/${id}`,
      languages: {
        "en-US": `/article/${id}`,
        "pt-BR": `/pt/article/${id}`,
      },
    },
  };
}

export default async function PTArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articles = await fetchAllNews();
  const article = articles.find((a) => a.id === id);

  if (!article) notFound();

  // Generate AI summary (English first)
  const { summary, commentary } = await generateArticleSummary(
    article.id,
    article.title,
    article.description,
    article.source,
    CATEGORIES[article.category].name
  );

  // Translate to PT-BR
  const translated = await translateToPTBR(
    article.id,
    article.title,
    article.description,
    summary,
    commentary
  );

  const enrichedArticle = {
    ...article,
    title: translated.title,
    description: translated.description,
    summary: translated.summary,
    aiCommentary: translated.commentary,
  };

  const relatedArticles = getArticlesByCategory(articles, article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, 4);

  return (
    <ArticleDetail
      article={enrichedArticle}
      relatedArticles={relatedArticles}
    />
  );
}
