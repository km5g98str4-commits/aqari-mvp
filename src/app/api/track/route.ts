import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/track — Analytics tracking endpoint
 * Lightweight ping to track events. No PII. No secrets.
 */
export const runtime = "edge";

const TRACK_ENABLED = true;

export async function POST(request: NextRequest) {
  if (!TRACK_ENABLED) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body: any = await request.json().catch(() => ({}));
    const event = body.event || "unknown";
    const meta = body.meta || {};

    // Filter out any potentially sensitive data
    const safeMeta: Record<string, any> = {};
    for (const [k, v] of Object.entries(meta)) {
      if (typeof v === "string" && v.length > 200) {
        safeMeta[k] = v.slice(0, 200) + "...";
      } else {
        safeMeta[k] = v;
      }
    }

    const entry = {
      event,
      ts: new Date().toISOString(),
      meta: safeMeta,
      ua: (request.headers.get("user-agent") || "").slice(0, 100),
    };

    console.log("[aqari-track]", JSON.stringify(entry));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
