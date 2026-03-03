import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { fetchAllNews } from "@/lib/rss";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pt`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  // PT-BR article pages
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await fetchAllNews();
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/pt/article/${article.id}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch {
    // Skip article pages if fetch fails
  }

  return [...staticPages, ...articlePages];
}
