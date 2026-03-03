export type CategorySlug =
  | "claude-code"
  | "ai-general"
  | "ai-business"
  | "cybersecurity"
  | "tech-general";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  source: string;
  category: CategorySlug;
  publishedAt: string;
  summary?: string;
  aiCommentary?: string;
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

export interface AffiliateConfig {
  name: string;
  url: string;
  description: string;
  category: CategorySlug | "general";
  badge?: string;
}
