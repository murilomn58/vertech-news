import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { renderWelcomeEmail } from "@/lib/email-template";
import { SITE_CONFIG } from "@/lib/constants";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email().max(320),
});

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 4096) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const db = getDb();

    // Check for existing subscription
    const existing = await db
      .collection("subscribers")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ ok: true, message: "Already subscribed" });
    }

    await db.collection("subscribers").add({
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      active: true,
    });

    // Send welcome email if Resend is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const siteUrl = SITE_CONFIG.url;
      const unsubUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(normalizedEmail)}`;
      const html = renderWelcomeEmail(normalizedEmail);
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: process.env.NEWSLETTER_FROM || "Vertech News <news@vertechnews.com>",
          to: normalizedEmail,
          subject: "Welcome to the AI Intelligence Brief",
          html,
          headers: {
            "List-Unsubscribe": `<${unsubUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }),
      }).catch((err) => {
        console.error("[Newsletter] Welcome email failed:", err);
      });
    }

    return NextResponse.json({ ok: true, message: "Subscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
