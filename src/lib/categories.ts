import { CategorySlug } from "./types";

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "claude-code": [
    "claude",
    "anthropic",
    "claude code",
    "claude 3",
    "claude 4",
    "claude opus",
    "claude sonnet",
    "claude haiku",
    "constitutional ai",
  ],
  "ai-business": [
    "elon musk",
    "tesla ai",
    "xai",
    "grok",
    "openai business",
    "ai funding",
    "series a",
    "series b",
    "ipo",
    "acquisition",
    "ai startup",
    "nvidia earnings",
    "ai revenue",
    "ai valuation",
    "ai investment",
    "microsoft ai deal",
    "google deepmind business",
    "billion",
    "million raised",
    "market cap",
  ],
};

export function categorizeArticle(
  title: string,
  description: string,
  defaultCategory: CategorySlug
): CategorySlug {
  const text = `${title} ${description}`.toLowerCase();

  // Check claude-code keywords first (highest priority)
  for (const keyword of CATEGORY_KEYWORDS["claude-code"]) {
    if (text.includes(keyword)) return "claude-code";
  }

  // Check ai-business keywords
  for (const keyword of CATEGORY_KEYWORDS["ai-business"]) {
    if (text.includes(keyword)) return "ai-business";
  }

  // Fall back to the feed's default category
  return defaultCategory;
}
