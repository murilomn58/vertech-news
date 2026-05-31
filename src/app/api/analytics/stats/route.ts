import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/firebase";

interface VisitDoc {
  page: string;
  device: string;
  os: string;
  browser: string;
  city: string;
  country: string;
  ip: string;
  createdAt: string | null;
}

interface ClickDoc {
  articleUrl: string;
  articleTitle: string;
  category: string;
  source: string;
  page: string;
  ip: string;
  createdAt: string | null;
}

// In-memory cache to reduce Firestore reads (survives across requests on same instance)
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedResult: { data: Record<string, unknown>; expiresAt: number } | null =
  null;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return cached data if still fresh
    if (cachedResult && Date.now() < cachedResult.expiresAt) {
      return NextResponse.json(cachedResult.data);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    const db = getDb();

    // Subscribers
    const subscribersSnap = await db.collection("subscribers").get();
    let totalSubscribers = 0;
    let activeSubscribers = 0;
    const subscribersPerDay: Record<string, number> = {};

    for (const doc of subscribersSnap.docs) {
      const d = doc.data();
      totalSubscribers++;
      if (d.active !== false) activeSubscribers++;

      if (d.subscribedAt) {
        const day =
          typeof d.subscribedAt === "string"
            ? d.subscribedAt.split("T")[0]
            : d.subscribedAt.toDate?.()?.toISOString().split("T")[0];
        if (day) {
          subscribersPerDay[day] = (subscribersPerDay[day] || 0) + 1;
        }
      }
    }

    const visitsSnap = await db
      .collection("visits")
      .where("createdAt", ">=", thirtyDaysAgo)
      .orderBy("createdAt", "desc")
      .get();

    const visits: VisitDoc[] = visitsSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        page: d.page || "/",
        device: d.device || "unknown",
        os: d.os || "Unknown",
        browser: d.browser || "Other",
        city: d.city || "Unknown",
        country: d.country || "Unknown",
        ip: d.ip || "",
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      };
    });

    const clicksSnap = await db
      .collection("article_clicks")
      .where("createdAt", ">=", thirtyDaysAgo)
      .orderBy("createdAt", "desc")
      .get();

    const clicks: ClickDoc[] = clicksSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        articleUrl: d.articleUrl || "",
        articleTitle: d.articleTitle || "",
        category: d.category || "",
        source: d.source || "",
        page: d.page || "/",
        ip: d.ip || "",
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      };
    });

    // Aggregations
    const totalVisits = visits.length;
    const uniqueIPs = new Set(visits.map((v) => v.ip)).size;

    const visitsByPage: Record<string, number> = {};
    const visitsByDevice: Record<string, number> = {};
    const visitsByCountry: Record<string, number> = {};
    const visitsByCity: Record<string, number> = {};
    const visitsByBrowser: Record<string, number> = {};
    const visitsPerDay: Record<string, number> = {};
    const uniqueIPsPerDay: Record<string, Set<string>> = {};
    const visitsPerSixHours: Record<string, number> = {};
    const uniqueIPsPerSixHours: Record<string, Set<string>> = {};

    for (const v of visits) {
      visitsByPage[v.page] = (visitsByPage[v.page] || 0) + 1;
      visitsByDevice[v.device] = (visitsByDevice[v.device] || 0) + 1;
      visitsByCountry[v.country] = (visitsByCountry[v.country] || 0) + 1;
      visitsByBrowser[v.browser] = (visitsByBrowser[v.browser] || 0) + 1;

      const cityKey = `${v.city}, ${v.country}`;
      visitsByCity[cityKey] = (visitsByCity[cityKey] || 0) + 1;

      if (v.createdAt) {
        const day = v.createdAt.split("T")[0];
        visitsPerDay[day] = (visitsPerDay[day] || 0) + 1;

        // Unique visitors per day
        if (!uniqueIPsPerDay[day]) uniqueIPsPerDay[day] = new Set();
        uniqueIPsPerDay[day].add(v.ip);

        // 6-hour bucket: e.g. "2026-03-02T06"
        const hour = new Date(v.createdAt).getUTCHours();
        const bucket = Math.floor(hour / 6) * 6;
        const sixHourKey = `${day}T${String(bucket).padStart(2, "0")}`;
        visitsPerSixHours[sixHourKey] =
          (visitsPerSixHours[sixHourKey] || 0) + 1;

        if (!uniqueIPsPerSixHours[sixHourKey])
          uniqueIPsPerSixHours[sixHourKey] = new Set();
        uniqueIPsPerSixHours[sixHourKey].add(v.ip);
      }
    }

    // Convert Sets to counts
    const uniqueVisitorsPerDay: Record<string, number> = {};
    for (const [day, ips] of Object.entries(uniqueIPsPerDay)) {
      uniqueVisitorsPerDay[day] = ips.size;
    }
    const uniqueVisitorsPerSixHours: Record<string, number> = {};
    for (const [key, ips] of Object.entries(uniqueIPsPerSixHours)) {
      uniqueVisitorsPerSixHours[key] = ips.size;
    }

    // Top articles
    const clicksByArticle: Record<
      string,
      {
        title: string;
        url: string;
        source: string;
        category: string;
        count: number;
      }
    > = {};

    for (const c of clicks) {
      if (!clicksByArticle[c.articleUrl]) {
        clicksByArticle[c.articleUrl] = {
          title: c.articleTitle,
          url: c.articleUrl,
          source: c.source,
          category: c.category,
          count: 0,
        };
      }
      clicksByArticle[c.articleUrl].count++;
    }

    const topArticles = Object.values(clicksByArticle)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const todayStr = now.toISOString().split("T")[0];
    const todayVisits = visitsPerDay[todayStr] || 0;

    const result = {
      totalVisits,
      uniqueVisitors: uniqueIPs,
      todayVisits,
      totalClicks: clicks.length,
      totalSubscribers,
      activeSubscribers,
      subscribersPerDay,
      visitsByPage,
      visitsByDevice,
      visitsByCountry,
      visitsByCity,
      visitsByBrowser,
      visitsPerDay,
      uniqueVisitorsPerDay,
      visitsPerSixHours,
      uniqueVisitorsPerSixHours,
      topArticles,
    };

    // Cache the result for 5 minutes
    cachedResult = { data: result, expiresAt: Date.now() + CACHE_TTL };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analytics stats error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
