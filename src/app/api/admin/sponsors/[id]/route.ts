import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/firebase";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  url: z.string().url().max(2000).optional(),
  description: z.string().min(1).max(1000).optional(),
  category: z
    .enum([
      "claude-code",
      "ai-general",
      "ai-business",
      "cybersecurity",
      "tech-general",
    ])
    .optional(),
  activeFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  activeUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  logo: z.string().url().max(2000).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getDb();
    const docRef = db.collection("sponsored_tools").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    await docRef.update(parsed.data);

    return NextResponse.json({ id, ...doc.data(), ...parsed.data });
  } catch (err) {
    console.error("Sponsor PUT error:", err);
    return NextResponse.json({ error: "Failed to update sponsor" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();
    const docRef = db.collection("sponsored_tools").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sponsor DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete sponsor" }, { status: 500 });
  }
}
