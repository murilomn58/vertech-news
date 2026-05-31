import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse(renderPage("Missing email parameter.", false), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();
    const db = getDb();

    const snapshot = await db
      .collection("subscribers")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return new NextResponse(renderPage("Email not found in our subscriber list.", false), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const doc = snapshot.docs[0];
    await doc.ref.update({ active: false, unsubscribedAt: new Date().toISOString() });

    return new NextResponse(renderPage("You have been unsubscribed. You will no longer receive the AI Intelligence Brief.", true), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("[Newsletter] Unsubscribe failed:", error);
    return new NextResponse(renderPage("Something went wrong. Please try again later.", false), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

// POST handler for RFC 8058 one-click unsubscribe (required by Gmail)
export async function POST(request: NextRequest) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const email = params.get("email") || request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();
    const db = getDb();

    const snapshot = await db
      .collection("subscribers")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      await snapshot.docs[0].ref.update({ active: false, unsubscribedAt: new Date().toISOString() });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}

function renderPage(message: string, success: boolean): string {
  const icon = success ? "&#10003;" : "&#10007;";
  const color = success ? "#22D3EE" : "#ef4444";
  const bgColor = success ? "rgba(34,211,238,0.1)" : "rgba(239,68,68,0.1)";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe — Vertech News</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0F172A; color: #F8FAFC; font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
  <div style="max-width: 480px; text-align: center; padding: 40px 24px;">
    <div style="width: 64px; height: 64px; margin: 0 auto 24px; background: ${bgColor}; border-radius: 50%; line-height: 64px; font-size: 28px; color: ${color};">${icon}</div>
    <div style="font-size: 24px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">VERTECH <span style="color: #22D3EE;">NEWS</span></div>
    <p style="font-size: 16px; line-height: 1.7; color: #F8FAFC; margin-bottom: 32px;">${message}</p>
    <a href="/" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #0891B2 0%, #22D3EE 100%); color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 50px;">Back to Vertech News</a>
  </div>
</body>
</html>`;
}
