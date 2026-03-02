import { CategoryConfig, CategorySlug, FeedSource } from "./types";

export const SITE_CONFIG = {
  name: "Vertech News",
  tagline: "Tech & AI Intelligence Feed",
  description:
    "Dark futuristic tech news aggregator covering AI, cybersecurity, and general technology. Updated daily.",
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
  cybersecurity: {
    name: "Cybersecurity",
    description: "Security threats, vulnerabilities, data breaches & defense",
    color: "#ef4444",
    slug: "cybersecurity",
  },
  "tech-general": {
    name: "Tech General",
    description: "Software, hardware, startups & general technology news",
    color: "#10b981",
    slug: "tech-general",
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

  // Cybersecurity
  {
    url: "https://www.bleepingcomputer.com/feed/",
    defaultCategory: "cybersecurity",
    source: "BleepingComputer",
  },
  {
    url: "https://feeds.feedburner.com/TheHackersNews",
    defaultCategory: "cybersecurity",
    source: "The Hacker News",
  },
  {
    url: "https://krebsonsecurity.com/feed/",
    defaultCategory: "cybersecurity",
    source: "Krebs on Security",
  },

  // Tech General
  {
    url: "https://www.theverge.com/rss/index.xml",
    defaultCategory: "tech-general",
    source: "The Verge",
  },
  {
    url: "https://feeds.arstechnica.com/arstechnica/index",
    defaultCategory: "tech-general",
    source: "Ars Technica",
  },
];
