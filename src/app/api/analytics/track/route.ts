import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { createHash } from "crypto";
import { z } from "zod";

// --- Input validation ---
const trackSchema = z.object({
  type: z.enum(["visit", "click"]),
  page: z.string().max(500).optional(),
  articleUrl: z.string().max(2000).optional(),
  articleTitle: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
  source: z.string().max(100).optional(),
});

// --- Rate limiting (in-memory, per-IP, resets on cold start) ---
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // max requests per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

// --- Secure IP hashing with SHA-256 + salt ---
const IP_SALT = process.env.IP_HASH_SALT || "vertech-default-salt";

function hashIP(ip: string): string {
  return createHash("sha256")
    .update(ip + IP_SALT)
    .digest("hex")
    .slice(0, 16);
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
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Reject oversized payloads (16KB max)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 16_384) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = trackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { type, page, articleUrl, articleTitle, category, source } =
      parsed.data;

    const hashedIp = hashIP(ip);
    const ua = request.headers.get("user-agent") || "";
    const { device, os, browser } = parseUA(ua);

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
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
