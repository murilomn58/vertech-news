import { CategoryConfig, CategorySlug, FeedSource } from "./types";

export const SITE_CONFIG = {
  name: "Vertech News",
  tagline: "AI Intelligence Feed",
  description:
    "Dark futuristic AI news aggregator covering Claude Code, general AI, and AI business. Updated daily.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vertech-news.up.railway.app",
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
  // Claude Code / Anthropic
  {
    url: "https://news.google.com/rss/search?q=%22Claude+Code%22+OR+%22Anthropic%22+OR+%22Claude+AI%22&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "claude-code",
    source: "Google News",
  },

  // AI General
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
    url: "https://news.google.com/rss/search?q=artificial+intelligence+machine+learning+new&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "ai-general",
    source: "Google News",
  },

  // AI Business
  {
    url: "https://news.google.com/rss/search?q=Elon+Musk+AI+OR+Tesla+AI+OR+xAI+OR+%22OpenAI+business%22&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "ai-business",
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=AI+startup+funding+OR+AI+company+acquisition+OR+AI+IPO&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "ai-business",
    source: "Google News",
  },
];
