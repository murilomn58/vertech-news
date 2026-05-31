import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { fetchAllNews } from "@/lib/rss";
import { renderNewsletterEmail } from "@/lib/email-template";
import { SITE_CONFIG } from "@/lib/constants";
import { getActiveSponsors } from "@/lib/sponsored";

export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const authHeader = request.headers.get("authorization");
    const secret = process.env.NEWSLETTER_SECRET;
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // Get active subscribers
    const subscribersSnap = await db
      .collection("subscribers")
      .where("active", "==", true)
      .get();

    if (subscribersSnap.empty) {
      return NextResponse.json({ ok: true, message: "No active subscribers", sent: 0 });
    }

    // Get top articles from the past week
    const articles = await fetchAllNews();
    const topArticles = articles.slice(0, 10);

    // Format week label
    const now = new Date();
    const weekLabel = `Week of ${now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;

    // Get active sponsor for Tool of the Week
    const activeSponsors = await getActiveSponsors();
    const sponsor = activeSponsors[0] ?? null;

    const html = renderNewsletterEmail({
      articles: topArticles,
      weekLabel,
      sponsor,
    });

    // Send via Resend (or log for now if no API key)
    const resendKey = process.env.RESEND_API_KEY;
    let sentCount = 0;

    if (resendKey) {
      const emails = subscribersSnap.docs.map((doc) => doc.data().email as string);

      // Send in batches of 50
      for (let i = 0; i < emails.length; i += 50) {
        const batch = emails.slice(i, i + 50);

        const res = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify(
            batch.map((email) => {
              const unsubUrl = `${SITE_CONFIG.url}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
              return {
                from: process.env.NEWSLETTER_FROM || "Vertech News <onboarding@resend.dev>",
                to: email,
                subject: `AI Intel Brief — ${weekLabel}`,
                html: html.replace("{{email}}", encodeURIComponent(email)),
                headers: {
                  "List-Unsubscribe": `<${unsubUrl}>`,
                  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                },
              };
            })
          ),
        });

        if (res.ok) {
          sentCount += batch.length;
        }
      }
    } else {
      // Log mode (no Resend API key configured)
      sentCount = subscribersSnap.size;
      console.log(`[Newsletter] Would send to ${sentCount} subscribers (no RESEND_API_KEY set)`);
    }

    // Log send event
    await db.collection("newsletter_sends").add({
      sentAt: new Date().toISOString(),
      subscriberCount: subscribersSnap.size,
      sentCount,
      articleCount: topArticles.length,
      ...(sponsor && {
        sponsorId: sponsor.id,
        sponsorName: sponsor.name,
      }),
    });

    return NextResponse.json({ ok: true, sent: sentCount });
  } catch (error) {
    console.error("Newsletter send failed:", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}
