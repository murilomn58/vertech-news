import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { z } from "zod";

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(2000),
  keys: z.object({
    p256dh: z.string().max(500),
    auth: z.string().max(500),
  }),
  expirationTime: z.number().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 8192) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = subscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const { endpoint, keys } = parsed.data;
    const db = getDb();

    // Check if subscription already exists
    const existing = await db
      .collection("push_subscriptions")
      .where("endpoint", "==", endpoint)
      .limit(1)
      .get();

    if (!existing.empty) {
      // Update existing subscription
      await existing.docs[0].ref.update({
        keys,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new subscription
      await db.collection("push_subscriptions").add({
        endpoint,
        keys,
        active: true,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
