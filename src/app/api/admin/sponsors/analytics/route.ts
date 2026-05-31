import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/firebase";

const CACHE_TTL = 5 * 60 * 1000;
let cachedResult: { data: unknown; expiresAt: number } | null = null;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (cachedResult && Date.now() < cachedResult.expiresAt) {
      return NextResponse.json(cachedResult.data);
    }

    const db = getDb();

    // Get all affiliate clicks with "sponsored:" prefix
    const clicksSnap = await db
      .collection("affiliate_clicks")
      .where("affiliateName", ">=", "sponsored:")
      .where("affiliateName", "<=", "sponsored:\uf8ff")
      .get();

    // Get newsletter sends that have a sponsorName
    const sendsSnap = await db.collection("newsletter_sends").get();

    // Aggregate clicks per sponsor
    const clicksBySponsor: Record<
      string,
      { totalClicks: number; clicksByDay: Record<string, number> }
    > = {};

    for (const doc of clicksSnap.docs) {
      const data = doc.data();
      const name = (data.affiliateName as string).replace("sponsored:", "");
      if (!clicksBySponsor[name]) {
        clicksBySponsor[name] = { totalClicks: 0, clicksByDay: {} };
      }
      clicksBySponsor[name].totalClicks++;

      const createdAt = data.createdAt?.toDate?.()?.toISOString() || null;
      if (createdAt) {
        const day = createdAt.split("T")[0];
        clicksBySponsor[name].clicksByDay[day] =
          (clicksBySponsor[name].clicksByDay[day] || 0) + 1;
      }
    }

    // Aggregate impressions per sponsor from newsletter_sends
    const impressionsBySponsor: Record<string, number> = {};
    for (const doc of sendsSnap.docs) {
      const data = doc.data();
      if (data.sponsorName) {
        const name = data.sponsorName as string;
        impressionsBySponsor[name] =
          (impressionsBySponsor[name] || 0) + (data.sentCount as number || 0);
      }
    }

    // Combine into per-sponsor results
    const allNames = new Set([
      ...Object.keys(clicksBySponsor),
      ...Object.keys(impressionsBySponsor),
    ]);

    const sponsors = Array.from(allNames).map((name) => {
      const clicks = clicksBySponsor[name]?.totalClicks || 0;
      const impressions = impressionsBySponsor[name] || 0;
      const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";
      return {
        name,
        totalClicks: clicks,
        newsletterImpressions: impressions,
        ctr: parseFloat(ctr),
        clicksByDay: clicksBySponsor[name]?.clicksByDay || {},
      };
    });

    const result = { sponsors };
    cachedResult = { data: result, expiresAt: Date.now() + CACHE_TTL };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Sponsor analytics error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
