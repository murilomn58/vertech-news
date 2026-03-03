import { getDb } from "./firebase";

interface Translation {
  title: string;
  description: string;
  summary?: string;
  commentary?: string;
}

/**
 * Translate article content to PT-BR. Results are cached in Firestore.
 *
 * NOTE: Requires ANTHROPIC_API_KEY env var. Without it, returns the original
 * English content as-is. This is the expected behavior for the initial
 * deployment — translation can be enabled later by adding the key.
 */
export async function translateToPTBR(
  articleId: string,
  title: string,
  description: string,
  summary?: string,
  commentary?: string
): Promise<Translation> {
  // Fast path: no API key = no translation, return originals instantly
  if (!process.env.ANTHROPIC_API_KEY) {
    return { title, description, summary, commentary };
  }

  // Check Firestore cache
  const db = getDb();
  const cacheRef = db.collection("translations").doc(articleId);
  const cached = await cacheRef.get();

  if (cached.exists) {
    return cached.data() as Translation;
  }

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
    console.error("Translation failed:", error);
    return { title, description, summary, commentary };
  }
}
