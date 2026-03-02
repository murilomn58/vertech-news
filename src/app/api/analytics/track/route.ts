import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function parseUA(ua: string) {
  const device = /Mobile|Android/i.test(ua)
    ? /iPad|Tablet/i.test(ua)
      ? "tablet"
      : "mobile"
    : "desktop";

  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";

  return { device, os, browser };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, page, articleUrl, articleTitle, category, source } = body;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const hashedIp = hashIP(ip);
    const ua = request.headers.get("user-agent") || "";
    const { device, os, browser } = parseUA(ua);

    // Use Vercel's built-in geo headers (free, no rate limits)
    const city = request.headers.get("x-vercel-ip-city") || "Unknown";
    const country = request.headers.get("x-vercel-ip-country") || "Unknown";

    const db = getDb();

    if (type === "visit") {
      await db.collection("visits").add({
        page: page || "/",
        device,
        os,
        browser,
        city: decodeURIComponent(city),
        country,
        ip: hashedIp,
        createdAt: FieldValue.serverTimestamp(),
      });
    } else if (type === "click") {
      await db.collection("article_clicks").add({
        articleUrl: articleUrl || "",
        articleTitle: articleTitle || "",
        category: category || "",
        source: source || "",
        page: page || "/",
        ip: hashedIp,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
