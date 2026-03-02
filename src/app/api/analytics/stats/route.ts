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

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const db = getDb();

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
    }
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

  return NextResponse.json({
    totalVisits,
    uniqueVisitors: uniqueIPs,
    todayVisits,
    totalClicks: clicks.length,
    visitsByPage,
    visitsByDevice,
    visitsByCountry,
    visitsByCity,
    visitsByBrowser,
    visitsPerDay,
    topArticles,
  });
}
