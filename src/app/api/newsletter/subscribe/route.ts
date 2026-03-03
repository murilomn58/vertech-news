import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
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

    return NextResponse.json({ ok: true, message: "Subscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
