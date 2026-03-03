import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { z } from "zod";
import webpush from "web-push";

const sendSchema = z.object({
  title: z.string().max(200),
  body: z.string().max(500),
  url: z.string().max(2000).optional(),
  icon: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const authHeader = request.headers.get("authorization");
    const secret = process.env.PUSH_SECRET;
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL;

    if (!vapidPublicKey || !vapidPrivateKey || !vapidEmail) {
      return NextResponse.json(
        { error: "VAPID keys not configured" },
        { status: 500 }
      );
    }

    webpush.setVapidDetails(
      `mailto:${vapidEmail}`,
      vapidPublicKey,
      vapidPrivateKey
    );

    const body = await request.json();
    const parsed = sendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const payload = JSON.stringify({
      title: parsed.data.title,
      body: parsed.data.body,
      url: parsed.data.url || "/",
      icon: parsed.data.icon || "/icon-192.png",
    });

    const db = getDb();
    const subscriptionsSnap = await db
      .collection("push_subscriptions")
      .where("active", "==", true)
      .get();

    let sent = 0;
    let failed = 0;
    const failedEndpoints: string[] = [];

    await Promise.allSettled(
      subscriptionsSnap.docs.map(async (doc) => {
        const sub = doc.data();
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload
          );
          sent++;
        } catch (error: unknown) {
          failed++;
          // Mark expired/invalid subscriptions as inactive
          const statusCode = (error as { statusCode?: number })?.statusCode;
          if (statusCode === 404 || statusCode === 410) {
            failedEndpoints.push(doc.id);
          }
        }
      })
    );

    // Clean up expired subscriptions
    if (failedEndpoints.length > 0) {
      const batch = db.batch();
      for (const id of failedEndpoints) {
        batch.update(db.collection("push_subscriptions").doc(id), {
          active: false,
        });
      }
      await batch.commit();
    }

    return NextResponse.json({ ok: true, sent, failed });
  } catch {
    return NextResponse.json(
      { error: "Failed to send push notifications" },
      { status: 500 }
    );
  }
}
