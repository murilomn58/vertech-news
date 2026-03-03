import { NewsArticle } from "./types";
import { AFFILIATE_LINKS, SITE_CONFIG } from "./constants";

interface EmailData {
  articles: NewsArticle[];
  aiCommentary?: string;
  weekLabel: string;
}

export function renderNewsletterEmail({ articles, aiCommentary, weekLabel }: EmailData): string {
  const toolOfWeek = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];

  const articleRows = articles
    .map(
      (a) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #2a2a3a;">
        <a href="${SITE_CONFIG.url}/article/${a.id}" style="color: #00f0ff; text-decoration: none; font-family: monospace; font-size: 14px; font-weight: bold;">
          ${escapeHtml(a.title)}
        </a>
        <div style="color: #8888a0; font-size: 12px; font-family: monospace; margin-top: 4px;">
          ${escapeHtml(a.source)} &bull; ${escapeHtml(a.category.replace(/-/g, " "))}
        </div>
        ${a.description ? `<div style="color: #e4e4ef; font-size: 13px; margin-top: 8px; line-height: 1.5;">${escapeHtml(a.description.slice(0, 150))}...</div>` : ""}
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; color: #e4e4ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="text-align: center; padding: 24px 0; border-bottom: 1px solid #2a2a3a;">
      <span style="font-family: monospace; font-size: 20px; font-weight: bold; color: #00f0ff;">&gt; VERTECH NEWS</span>
      <div style="font-family: monospace; font-size: 11px; color: #555570; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">
        Weekly Intelligence Brief &bull; ${escapeHtml(weekLabel)}
      </div>
    </div>

    ${aiCommentary ? `
    <!-- AI Commentary -->
    <div style="padding: 20px; margin: 20px 0; background-color: #111118; border: 1px solid #2a2a3a; border-radius: 8px;">
      <div style="font-family: monospace; font-size: 10px; color: #00f0ff; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">&gt; This Week in AI</div>
      <div style="color: #e4e4ef; font-size: 14px; line-height: 1.6;">${escapeHtml(aiCommentary)}</div>
    </div>
    ` : ""}

    <!-- Articles -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr><td style="font-family: monospace; font-size: 11px; color: #555570; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 12px;">&gt; Top Stories</td></tr>
      ${articleRows}
    </table>

    <!-- Tool of the Week -->
    <div style="padding: 20px; margin: 20px 0; background-color: #111118; border: 1px solid #a855f720; border-radius: 8px;">
      <div style="font-family: monospace; font-size: 10px; color: #a855f7; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Tool of the Week &bull; Sponsored</div>
      <a href="${toolOfWeek.url}" style="color: #e4e4ef; text-decoration: none; font-family: monospace; font-size: 15px; font-weight: bold;">${escapeHtml(toolOfWeek.name)}</a>
      <div style="color: #8888a0; font-size: 13px; margin-top: 6px; line-height: 1.5;">${escapeHtml(toolOfWeek.description)}</div>
    </div>

    <!-- Vertech CTA -->
    <div style="text-align: center; padding: 24px 0; margin: 20px 0; border-top: 1px solid #2a2a3a;">
      <div style="font-family: monospace; font-size: 12px; color: #555570; margin-bottom: 8px;">Need AI automation for your business?</div>
      <a href="https://wa.me/5511999999999" style="font-family: monospace; font-size: 13px; color: #00f0ff; text-decoration: none; font-weight: bold;">Talk to Vertech Solucoes &rarr;</a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #2a2a3a;">
      <div style="font-family: monospace; font-size: 10px; color: #555570;">
        <a href="${SITE_CONFIG.url}" style="color: #555570; text-decoration: none;">vertechnews.com</a> &bull;
        <a href="${SITE_CONFIG.url}/api/newsletter/unsubscribe?email={{email}}" style="color: #555570; text-decoration: none;">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
