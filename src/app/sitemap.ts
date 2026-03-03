import { MetadataRoute } from "next";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";
import { fetchAllNews } from "@/lib/rss";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = (
    Object.keys(CATEGORIES) as CategorySlug[]
  ).map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  // Article pages
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await fetchAllNews();
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/article/${article.id}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // If RSS fetch fails, skip article pages
  }

  return [...staticPages, ...categoryPages, ...articlePages];
}
