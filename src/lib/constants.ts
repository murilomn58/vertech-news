import { CategoryConfig, CategorySlug, FeedSource } from "./types";

export const SITE_CONFIG = {
  name: "Vertech News",
  tagline: "AI Intelligence Feed",
  description:
    "Dark futuristic AI news aggregator covering Claude Code, general AI, and AI business. Updated daily.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vertechnews.vercel.app",
};

export const CATEGORIES: Record<CategorySlug, CategoryConfig> = {
  "claude-code": {
    name: "Claude Code",
    description: "Anthropic, Claude AI & Claude Code news",
    color: "#a855f7",
    slug: "claude-code",
  },
  "ai-general": {
    name: "AI General",
    description: "Artificial intelligence research, models & breakthroughs",
    color: "#06b6d4",
    slug: "ai-general",
  },
  "ai-business": {
    name: "AI Business",
    description: "AI companies, Elon Musk, Tesla, funding & deals",
    color: "#f59e0b",
    slug: "ai-business",
  },
};

export const FEED_SOURCES: FeedSource[] = [
  // AI General (keyword categorizer re-sorts Claude/Anthropic articles → claude-code)
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    defaultCategory: "ai-general",
    source: "TechCrunch",
  },
  {
    url: "https://arstechnica.com/ai/feed/",
    defaultCategory: "ai-general",
    source: "Ars Technica",
  },
  {
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    defaultCategory: "ai-general",
    source: "The Verge",
  },
  {
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    defaultCategory: "ai-general",
    source: "Wired",
  },
  {
    url: "https://www.technologyreview.com/feed/",
    defaultCategory: "ai-general",
    source: "MIT Tech Review",
  },

  // AI Business
  {
    url: "https://venturebeat.com/category/ai/feed/",
    defaultCategory: "ai-business",
    source: "VentureBeat",
  },
  {
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910",
    defaultCategory: "ai-business",
    source: "CNBC",
  },
];
