import { getDb } from "./firebase";

interface ArticleSummary {
  summary: string;
  commentary: string;
}

/**
 * Generate an AI summary for an article. Results are cached in Firestore.
 * Cost: ~$0.01-0.03 per article summary.
 *
 * NOTE: Requires ANTHROPIC_API_KEY env var. Without it, returns the RSS
 * description as the summary with no commentary. This is the expected
 * behavior for the initial deployment — AI features are Phase 2+ and
 * can be enabled later by adding the key. (~$8/month for ~100 articles/week)
 */
export async function generateArticleSummary(
  articleId: string,
  title: string,
  description: string,
  source: string,
  category: string
): Promise<ArticleSummary> {
  // Fast path: no API key = no AI, no Firestore reads, instant fallback
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      summary: description || "No summary available.",
      commentary: "",
    };
  }

  // Check Firestore cache first
  const db = getDb();
  const cacheRef = db.collection("article_summaries").doc(articleId);
  const cached = await cacheRef.get();

  if (cached.exists) {
    const data = cached.data()!;
    return { summary: data.summary, commentary: data.commentary };
  }

  try {
    // Lazy-load SDK only when actually needed
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a concise tech journalist. Given this article info, write:
1. A 2-3 sentence summary of the key points
2. A 1-2 sentence "Vertech Take" — a brief opinionated analysis of why this matters

Article: "${title}"
Source: ${source}
Category: ${category}
Description: ${description}

Respond in JSON: {"summary": "...", "commentary": "..."}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { summary: description, commentary: "" };
    }

    const parsed = JSON.parse(jsonMatch[0]) as ArticleSummary;

    // Cache in Firestore
    await cacheRef.set({
      summary: parsed.summary,
      commentary: parsed.commentary,
      generatedAt: new Date().toISOString(),
    });

    return parsed;
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return { summary: description, commentary: "" };
  }
}
