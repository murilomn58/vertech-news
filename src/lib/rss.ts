import Parser from "rss-parser";
import { FEED_SOURCES } from "./constants";
import { categorizeArticle } from "./categories";
import { generateId, normalizeUrl, stripHtml, truncateText } from "./utils";
import { FeedSource, NewsArticle } from "./types";

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure"],
    ],
  },
});

/**
 * Google News wraps article URLs in redirects like:
 * https://news.google.com/rss/articles/CBMi...
 * The actual URL is in the <a href="..."> inside the description HTML,
 * or we need to follow the redirect.
 */
function unwrapGoogleNewsUrl(url: string): string {
  if (!url) return url;
  // Google News URLs contain the actual URL encoded in them
  try {
    const u = new URL(url);
    // Check if it's a Google News redirect
    if (
      u.hostname === "news.google.com" ||
      u.hostname === "news.google.com.br"
    ) {
      // Try to extract from query params
      const actualUrl = u.searchParams.get("url");
      if (actualUrl) return actualUrl;
    }
  } catch {
    // Not a valid URL, return as-is
  }
  return url;
}

function extractImageUrl(item: Record<string, unknown>): string | null {
  // Try enclosure
  const enclosure = item.enclosure as
    | { url?: string; type?: string }
    | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image")) {
    return enclosure.url;
  }

  // Try media:content
  const mediaContent = item.mediaContent as
    | { $?: { url?: string } }
    | undefined;
  if (mediaContent?.$?.url) {
    return mediaContent.$.url;
  }

  // Try media:thumbnail
  const mediaThumbnail = item.mediaThumbnail as
    | { $?: { url?: string } }
    | undefined;
  if (mediaThumbnail?.$?.url) {
    return mediaThumbnail.$.url;
  }

  // Try extracting from content:encoded or content HTML
  const contentEncoded = (item["content:encoded"] || "") as string;
  const content = (item.content || "") as string;
  const description = (item.description || "") as string;
  const summary = (item.summary || "") as string;

  // Search all HTML fields for images
  for (const html of [contentEncoded, content, description, summary]) {
    if (!html) continue;
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1] && !imgMatch[1].includes("data:")) {
      return imgMatch[1];
    }
  }

  return null;
}

function getFaviconUrl(articleUrl: string): string | null {
  try {
    const u = new URL(unwrapGoogleNewsUrl(articleUrl));
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=128`;
  } catch {
    return null;
  }
}

async function fetchOgImage(url: string): Promise<string | null> {
  // Unwrap Google News redirect first
  const targetUrl = unwrapGoogleNewsUrl(url);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    // Only read first 50KB to find meta tags faster
    const reader = res.body?.getReader();
    if (!reader) return null;

    let html = "";
    const decoder = new TextDecoder();
    while (html.length < 50000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      // Stop early if we've passed the <head> section
      if (html.includes("</head>")) break;
    }
    reader.cancel();

    // Try og:image (both attribute orders)
    const ogMatch =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
      );
    if (ogMatch?.[1]) return ogMatch[1];

    // Try twitter:image (both attribute orders)
    const twMatch =
      html.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
      );
    if (twMatch?.[1]) return twMatch[1];

    // Try twitter:image:src
    const twSrcMatch = html.match(
      /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i
    );
    if (twSrcMatch?.[1]) return twSrcMatch[1];

    return null;
  } catch {
    return null;
  }
}

// If we still can't get an image, try following the Google News URL redirect to get the actual article URL
async function resolveGoogleNewsRedirect(
  url: string
): Promise<string | null> {
  if (!url.includes("news.google.com")) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    clearTimeout(timeout);

    // The final URL after redirects is the actual article
    if (res.url && !res.url.includes("news.google.com")) {
      return res.url;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchFeed(source: FeedSource): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).map((item) => {
      const rawDescription =
        item.contentSnippet || item.content || item.summary || "";
      const cleanDescription = stripHtml(rawDescription);

      return {
        id: generateId(item.link || item.guid || item.title || ""),
        title: item.title || "Untitled",
        description: truncateText(cleanDescription, 200),
        url: item.link || "",
        imageUrl: extractImageUrl(
          item as unknown as Record<string, unknown>
        ),
        source: source.source,
        category: categorizeArticle(
          item.title || "",
          cleanDescription,
          source.defaultCategory
        ),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch feed ${source.url}:`, error);
    return [];
  }
}

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const normalizedUrl = normalizeUrl(article.url);
    if (seen.has(normalizedUrl)) return false;
    seen.add(normalizedUrl);
    return true;
  });
}

async function enrichWithOgImages(
  articles: NewsArticle[]
): Promise<NewsArticle[]> {
  const BATCH_SIZE = 10;
  const result = [...articles];

  const missingImageIndices = result
    .map((a, i) => (a.imageUrl ? -1 : i))
    .filter((i) => i !== -1);

  for (let i = 0; i < missingImageIndices.length; i += BATCH_SIZE) {
    const batch = missingImageIndices.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (idx) => {
      let articleUrl = result[idx].url;

      // Try og:image from the direct URL first
      let ogImage = await fetchOgImage(articleUrl);

      // If that failed and it's a Google News URL, resolve the redirect
      if (!ogImage && articleUrl.includes("news.google.com")) {
        const resolvedUrl = await resolveGoogleNewsRedirect(articleUrl);
        if (resolvedUrl) {
          ogImage = await fetchOgImage(resolvedUrl);
          // Also update the article URL to the actual article
          if (resolvedUrl) {
            articleUrl = resolvedUrl;
          }
        }
      }

      if (ogImage) {
        result[idx] = { ...result[idx], imageUrl: ogImage, url: articleUrl };
      } else {
        // Fallback: use source domain favicon
        const favicon = getFaviconUrl(articleUrl);
        if (favicon) {
          result[idx] = { ...result[idx], imageUrl: favicon, url: articleUrl };
        }
      }
    });
    await Promise.allSettled(promises);
  }

  return result;
}

export async function fetchAllNews(): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchFeed(source))
  );

  const articles = results
    .filter(
      (r): r is PromiseFulfilledResult<NewsArticle[]> =>
        r.status === "fulfilled"
    )
    .flatMap((r) => r.value);

  const deduplicated = deduplicateArticles(articles);

  const sorted = deduplicated.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const enriched = await enrichWithOgImages(sorted);
  return enriched;
}

export function getArticlesByCategory(
  articles: NewsArticle[],
  category: string
): NewsArticle[] {
  return articles.filter((a) => a.category === category);
}
