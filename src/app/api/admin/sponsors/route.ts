import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/firebase";
import { z } from "zod";
import { randomBytes } from "crypto";

const sponsorSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url().max(2000),
  description: z.string().min(1).max(1000),
  category: z.enum([
    "claude-code",
    "ai-general",
    "ai-business",
    "cybersecurity",
    "tech-general",
  ]),
  activeFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  activeUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  logo: z.string().url().max(2000).optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const snap = await db
      .collection("sponsored_tools")
      .orderBy("activeFrom", "desc")
      .get();

    const sponsors = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ sponsors });
  } catch (err) {
    console.error("Sponsors GET error:", err);
    return NextResponse.json({ error: "Failed to fetch sponsors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = sponsorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getDb();
    const reportToken = randomBytes(32).toString("hex");

    const docRef = await db.collection("sponsored_tools").add({
      ...parsed.data,
      reportToken,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: docRef.id,
      ...parsed.data,
      reportToken,
    });
  } catch (err) {
    console.error("Sponsors POST error:", err);
    return NextResponse.json({ error: "Failed to create sponsor" }, { status: 500 });
  }
}
