import { NewsArticle, CategorySlug } from "./types";
import { AFFILIATE_LINKS, SITE_CONFIG, CATEGORIES } from "./constants";
import { SponsoredTool } from "./sponsored";

// Vertech brand colors (from identity manual)
const B = {
  navy: "#0F172A",
  navyLight: "#1E293B",
  navyMid: "#162032",
  cyan: "#22D3EE",
  cyanDark: "#0891B2",
  white: "#F8FAFC",
  offWhite: "#E2E8F0",
  gray: "#94A3B8",
  grayDark: "#64748B",
  border: "#334155",
  borderLight: "#1E293B",
  font: "'Montserrat', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

function categoryColor(slug: CategorySlug): string {
  return CATEGORIES[slug]?.color ?? B.cyan;
}

function categoryName(slug: CategorySlug): string {
  return CATEGORIES[slug]?.name ?? slug.replace(/-/g, " ");
}

const EMAIL_HEAD = `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>`;

// ─── SHARED COMPONENTS ──────────────────────────────────────────────

function emailHeader(subtitle: string): string {
  return `
    <!-- Cyan accent bar -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr><td style="height: 4px; background-color: ${B.cyan};"></td></tr>
    </table>

    <!-- Header -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="text-align: center; padding: 40px 24px 32px; background-color: ${B.navy};">
          <div style="font-family: ${B.font}; font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.03em; line-height: 38px;">VERTECH <span style="color: ${B.cyan};">NEWS</span></div>
          <div style="font-family: ${B.font}; font-size: 12px; color: ${B.grayDark}; margin-top: 10px; text-transform: uppercase; letter-spacing: 4px; font-weight: 600;">
            ${subtitle}
          </div>
        </td>
      </tr>
    </table>`;
}

function emailFooter(unsubscribeUrl: string): string {
  return `
    <!-- Footer -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="text-align: center; padding: 32px 24px; background-color: ${B.navy}; border-top: 1px solid ${B.border};">
          <div style="font-family: ${B.font}; font-size: 13px; color: ${B.grayDark}; line-height: 24px;">
            <a href="${SITE_CONFIG.url}" style="color: ${B.gray}; text-decoration: none; font-weight: 500;">vertechnews.com</a>
            &nbsp;&nbsp;&#183;&nbsp;&nbsp;
            <a href="${unsubscribeUrl}" style="color: ${B.gray}; text-decoration: none; font-weight: 500;">Unsubscribe</a>
          </div>
          <div style="font-family: ${B.font}; font-size: 11px; color: ${B.border}; margin-top: 12px;">
            &copy; ${new Date().getFullYear()} Vertech News. All rights reserved.
          </div>
        </td>
      </tr>
    </table>`;
}

// ─── WEEKLY NEWSLETTER ──────────────────────────────────────────────

interface EmailData {
  articles: NewsArticle[];
  aiCommentary?: string;
  weekLabel: string;
  sponsor?: SponsoredTool | null;
}

function buildSponsorUrl(sponsor: SponsoredTool): string {
  const url = new URL(sponsor.url);
  url.searchParams.set("utm_source", "vertech_newsletter");
  url.searchParams.set("utm_medium", "email");
  url.searchParams.set("utm_campaign", "tool_of_week");
  url.searchParams.set("utm_content", sponsor.name.toLowerCase().replace(/\s+/g, "_"));
  return url.toString();
}

export function renderNewsletterEmail({ articles, aiCommentary, weekLabel, sponsor }: EmailData): string {
  const toolOfWeek = sponsor
    ? { name: sponsor.name, url: buildSponsorUrl(sponsor), description: sponsor.description, badge: "Sponsored" as string | undefined }
    : AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];

  const toolUrl = sponsor ? buildSponsorUrl(sponsor) : toolOfWeek.url;

  const articleRows = articles
    .map((a, i) => {
      const num = String(i + 1).padStart(2, "0");
      const catColor = categoryColor(a.category);
      const catName = categoryName(a.category);

      return `
    <tr>
      <td style="padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <!-- Number -->
            <td style="width: 52px; vertical-align: top; padding: 24px 0 24px 24px;">
              <div style="width: 36px; height: 36px; background-color: ${B.navyLight}; border-radius: 10px; text-align: center; line-height: 36px; font-family: ${B.font}; font-size: 14px; font-weight: 700; color: ${B.cyan};">${num}</div>
            </td>
            <!-- Content -->
            <td style="vertical-align: top; padding: 24px 24px 24px 12px;">
              <!-- Category pill -->
              <span style="display: inline-block; padding: 3px 10px; background-color: ${catColor}20; border-radius: 20px; font-family: ${B.font}; font-size: 10px; font-weight: 700; color: ${catColor}; text-transform: uppercase; letter-spacing: 1px; line-height: 18px;">${escapeHtml(catName)}</span>
              <!-- Title -->
              <div style="margin-top: 10px;">
                <a href="${SITE_CONFIG.url}/article/${a.id}" style="color: #FFFFFF; text-decoration: none; font-family: ${B.font}; font-size: 18px; font-weight: 700; line-height: 26px;">${escapeHtml(a.title)}</a>
              </div>
              <!-- Source -->
              <div style="font-family: ${B.font}; font-size: 13px; color: ${B.gray}; margin-top: 6px; font-weight: 500;">${escapeHtml(a.source)}</div>
              ${a.description ? `<div style="font-family: ${B.font}; font-size: 15px; color: ${B.offWhite}; margin-top: 10px; line-height: 24px; font-weight: 400;">${escapeHtml(a.description.slice(0, 160))}...</div>` : ""}
            </td>
          </tr>
        </table>
        <!-- Divider -->
        <div style="height: 1px; background-color: ${B.border}; margin: 0 24px;"></div>
      </td>
    </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
${EMAIL_HEAD}
<body style="margin: 0; padding: 0; background-color: #0B1120; font-family: ${B.font};">
  <!--[if mso]><table width="600" align="center"><tr><td><![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: ${B.navy};">
    <tr><td>
      ${emailHeader(`Intelligence Brief &nbsp;&#183;&nbsp; ${escapeHtml(weekLabel)}`)}

      ${aiCommentary ? `
      <!-- AI Commentary -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${B.navyLight}; border-radius: 16px; border-left: 4px solid ${B.cyan};">
              <tr>
                <td style="padding: 24px 28px;">
                  <div style="font-family: ${B.font}; font-size: 11px; color: ${B.cyan}; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 14px; font-weight: 700;">&#9670; This Week in AI</div>
                  <div style="font-family: ${B.font}; font-size: 16px; color: ${B.white}; line-height: 28px; font-weight: 400;">${escapeHtml(aiCommentary)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      ` : ""}

      <!-- Section Label: Top Stories -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 28px 24px 4px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="font-family: ${B.font}; font-size: 11px; color: ${B.grayDark}; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">Top Stories</td>
                <td style="text-align: right; font-family: ${B.font}; font-size: 12px; color: ${B.gray}; font-weight: 500;">${articles.length} articles</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Articles -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${articleRows}
      </table>

      <!-- Read More CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="text-align: center; padding: 28px 24px 8px;">
            <a href="${SITE_CONFIG.url}" style="display: inline-block; padding: 14px 36px; background-color: ${B.cyan}; color: ${B.navy}; font-family: ${B.font}; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 50px; letter-spacing: 0.5px;">Read All Stories on Vertech News &rarr;</a>
          </td>
        </tr>
      </table>

      <!-- Tool of the Week -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${B.navyLight}; border-radius: 16px; border-left: 4px solid #a855f7;">
              <tr>
                <td style="padding: 24px 28px;">
                  <div style="font-family: ${B.font}; font-size: 10px; color: #a855f7; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 14px; font-weight: 700;">&#9733; Tool of the Week &nbsp;&#183;&nbsp; Sponsored</div>
                  <a href="${toolUrl}" style="color: #FFFFFF; text-decoration: none; font-family: ${B.font}; font-size: 20px; font-weight: 700; line-height: 28px;">${escapeHtml(toolOfWeek.name)}</a>
                  ${toolOfWeek.badge ? `<span style="display: inline-block; margin-left: 8px; padding: 2px 8px; background-color: #a855f720; border-radius: 20px; font-family: ${B.font}; font-size: 10px; font-weight: 700; color: #a855f7; vertical-align: middle;">${escapeHtml(toolOfWeek.badge)}</span>` : ""}
                  <div style="font-family: ${B.font}; font-size: 15px; color: ${B.gray}; margin-top: 10px; line-height: 24px; font-weight: 400;">${escapeHtml(toolOfWeek.description)}</div>
                  <div style="margin-top: 16px;">
                    <a href="${toolUrl}" style="font-family: ${B.font}; font-size: 13px; color: #a855f7; text-decoration: none; font-weight: 600;">Learn more &rarr;</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${emailFooter(`${SITE_CONFIG.url}/api/newsletter/unsubscribe?email={{email}}`)}
    </td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;
}

// ─── WELCOME EMAIL ──────────────────────────────────────────────────

export function renderWelcomeEmail(email: string): string {
  const unsubscribeUrl = `${SITE_CONFIG.url}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

  return `<!DOCTYPE html>
<html>
${EMAIL_HEAD}
<body style="margin: 0; padding: 0; background-color: #0B1120; font-family: ${B.font};">
  <!--[if mso]><table width="600" align="center"><tr><td><![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: ${B.navy};">
    <tr><td>
      ${emailHeader("Subscription Confirmed")}

      <!-- Welcome Content -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 48px 32px; text-align: center;">
            <!-- Check icon -->
            <div style="width: 64px; height: 64px; margin: 0 auto 28px; background-color: ${B.cyan}; border-radius: 50%; line-height: 64px; font-size: 28px; color: #FFFFFF;">&#10003;</div>

            <div style="font-family: ${B.font}; font-size: 26px; font-weight: 800; color: #FFFFFF; margin-bottom: 20px; letter-spacing: -0.03em; line-height: 32px;">
              You're in.
            </div>

            <div style="color: ${B.white}; font-family: ${B.font}; font-size: 17px; line-height: 30px; margin-bottom: 12px; font-weight: 400;">
              The <strong style="color: ${B.cyan}; font-weight: 600;">AI Intelligence Brief</strong> arrives every Monday with the top stories in AI, cybersecurity, and tech.
            </div>

            <div style="color: ${B.gray}; font-family: ${B.font}; font-size: 15px; line-height: 24px; margin-bottom: 36px;">
              No noise. No fluff. Just the signal that matters.
            </div>

            <!-- CTA Button -->
            <a href="${SITE_CONFIG.url}" style="display: inline-block; padding: 16px 40px; background-color: ${B.cyan}; color: ${B.navy}; font-family: ${B.font}; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 50px; letter-spacing: 0.5px;">Read Latest Stories &rarr;</a>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td style="padding: 0 32px;"><div style="height: 1px; background-color: ${B.border};"></div></td></tr>
      </table>

      <!-- What to expect -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 36px 24px; text-align: center;">
            <div style="font-family: ${B.font}; font-size: 11px; color: ${B.grayDark}; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 24px; font-weight: 700;">What to expect</div>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="width: 33%; text-align: center; padding: 0 8px; vertical-align: top;">
                  <div style="font-size: 28px; margin-bottom: 10px;">&#129302;</div>
                  <div style="font-family: ${B.font}; font-size: 14px; color: #FFFFFF; font-weight: 700;">AI &amp; Tech</div>
                  <div style="font-family: ${B.font}; font-size: 12px; color: ${B.gray}; margin-top: 6px; line-height: 18px;">Latest breakthroughs</div>
                </td>
                <td style="width: 33%; text-align: center; padding: 0 8px; vertical-align: top;">
                  <div style="font-size: 28px; margin-bottom: 10px;">&#128274;</div>
                  <div style="font-family: ${B.font}; font-size: 14px; color: #FFFFFF; font-weight: 700;">Cybersecurity</div>
                  <div style="font-family: ${B.font}; font-size: 12px; color: ${B.gray}; margin-top: 6px; line-height: 18px;">Threats &amp; defense</div>
                </td>
                <td style="width: 33%; text-align: center; padding: 0 8px; vertical-align: top;">
                  <div style="font-size: 28px; margin-bottom: 10px;">&#128640;</div>
                  <div style="font-family: ${B.font}; font-size: 14px; color: #FFFFFF; font-weight: 700;">Business</div>
                  <div style="font-family: ${B.font}; font-size: 12px; color: ${B.gray}; margin-top: 6px; line-height: 18px;">Deals &amp; funding</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${emailFooter(unsubscribeUrl)}
    </td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;
}

// ─── UTILS ──────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
