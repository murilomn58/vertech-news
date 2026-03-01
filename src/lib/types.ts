export type CategorySlug = "claude-code" | "ai-general" | "ai-business";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  source: string;
  category: CategorySlug;
  publishedAt: string;
}

export interface CategoryConfig {
  name: string;
  description: string;
  color: string;
  slug: CategorySlug;
}

export interface FeedSource {
  url: string;
  defaultCategory: CategorySlug;
  source: string;
}
