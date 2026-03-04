import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || token.length !== 64) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const db = getDb();

    // Find sponsor by token
    const sponsorSnap = await db
      .collection("sponsored_tools")
      .where("reportToken", "==", token)
      .limit(1)
      .get();

    if (sponsorSnap.empty) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const sponsorDoc = sponsorSnap.docs[0];
    const sponsor = sponsorDoc.data();
    const sponsorName = sponsor.name as string;

    // Get clicks for this sponsor
    const clicksSnap = await db
      .collection("affiliate_clicks")
      .where("affiliateName", "==", `sponsored:${sponsorName}`)
      .get();

    const clicksByDay: Record<string, number> = {};
    let totalClicks = 0;

    for (const doc of clicksSnap.docs) {
      totalClicks++;
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.()?.toISOString() || null;
      if (createdAt) {
        const day = createdAt.split("T")[0];
        clicksByDay[day] = (clicksByDay[day] || 0) + 1;
      }
    }

    // Get newsletter impressions
    const sendsSnap = await db
      .collection("newsletter_sends")
      .where("sponsorName", "==", sponsorName)
      .get();

    let totalImpressions = 0;
    for (const doc of sendsSnap.docs) {
      totalImpressions += (doc.data().sentCount as number) || 0;
    }

    const ctr =
      totalImpressions > 0
        ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      sponsorName,
      activeFrom: sponsor.activeFrom,
      activeUntil: sponsor.activeUntil,
      totalClicks,
      totalImpressions,
      ctr,
      clicksByDay,
    });
  } catch (err) {
    console.error("Sponsor report error:", err);
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}
