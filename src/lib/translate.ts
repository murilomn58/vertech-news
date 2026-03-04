import { getDb } from "./firebase";

interface Translation {
  title: string;
  description: string;
  summary?: string;
  commentary?: string;
}

/**
 * Free fallback translation using MyMemory API (no API key needed)
 * 500 requests/day free, no registration required
 */
async function translateWithMyMemory(text: string): Promise<string> {
  if (!text) return text;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt-br`;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData?.translatedText ?? text;
  } catch {
    return text;
  }
}

/**
 * Translate article content to PT-BR. Results are cached in Firestore.
 *
 * Uses Anthropic Claude if ANTHROPIC_API_KEY is set (best quality).
 * Falls back to MyMemory free API if no key is set (decent quality, no cost).
 * All results are cached in Firestore to avoid repeated API calls.
 */
export async function translateToPTBR(
  articleId: string,
  title: string,
  description: string,
  summary?: string,
  commentary?: string
): Promise<Translation> {
  // Check Firestore cache first (always available, regardless of API key)
  const db = getDb();
  const cacheRef = db.collection("translations").doc(articleId);
  const cached = await cacheRef.get();

  if (cached.exists) {
    return cached.data() as Translation;
  }

  // If API key available, use Anthropic for best quality
  if (process.env.ANTHROPIC_API_KEY) {

    try {
      // Lazy-load SDK only when actually needed
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const parts = [
        `Title: ${title}`,
        `Description: ${description}`,
        summary ? `Summary: ${summary}` : null,
        commentary ? `Commentary: ${commentary}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: `Translate the following tech news content to Brazilian Portuguese (PT-BR). Keep technical terms in English when commonly used in Brazil (e.g., "AI", "machine learning", "startup", "cloud"). Be natural and fluent.

${parts}

Respond in JSON: {"title": "...", "description": "..."${summary ? ', "summary": "..."' : ""}${commentary ? ', "commentary": "..."' : ""}}`,
          },
        ],
      });

      const text =
        message.content[0].type === "text" ? message.content[0].text : "";

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { title, description, summary, commentary };
      }

      const parsed = JSON.parse(jsonMatch[0]) as Translation;

      // Cache
      await cacheRef.set({
        ...parsed,
        translatedAt: new Date().toISOString(),
      });

      return parsed;
    } catch (error) {
      console.error("Anthropic translation failed:", error);
      // Fall through to MyMemory fallback
    }
  }

  // No API key or Anthropic failed → use MyMemory (free, no key needed)
  const [translatedTitle, translatedDesc] = await Promise.all([
    translateWithMyMemory(title),
    translateWithMyMemory(description),
  ]);

  const result = { title: translatedTitle, description: translatedDesc, summary, commentary };

  // Cache the result
  await cacheRef.set({
    ...result,
    translatedAt: new Date().toISOString(),
  });

  return result;
}
