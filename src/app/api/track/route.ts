import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * POST /api/track — Analytics tracking endpoint
 * Lightweight ping to track events. No PII. No secrets.
 * Stores to local JSON file for /api/track reading.
 *
 * Use GET /api/track to retrieve aggregated stats.
 */
export const runtime = "nodejs";

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");
const MAX_REQUESTS = 5000; // Keep file manageable

function readStats(): Record<string, any>[] {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(STATS_FILE)) return [];
    const raw = fs.readFileSync(STATS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function appendStats(entry: Record<string, any>) {
  try {
    const all = readStats();
    all.unshift(entry);
    if (all.length > MAX_REQUESTS) all.length = MAX_REQUESTS;
    fs.writeFileSync(STATS_FILE, JSON.stringify(all, null, 2));
  } catch {
    // Silent fail — never break the response
  }
}

export async function POST(request: NextRequest) {
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
    };

    // Store to local file
    appendStats(entry);

    // Also log to console for Vercel Log Drains
    console.log("[aqari-track]", JSON.stringify(entry));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  try {
    const all = readStats();

    // Aggregate stats
    const stats: Record<string, any> = {};
    stats.total_events = all.length;
    stats.events_by_type = {} as Record<string, number>;
    stats.by_purpose = {} as Record<string, number>;
    stats.by_type = {} as Record<string, number>;
    stats.by_city = {} as Record<string, number>;
    stats.last_7_days = 0;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const entry of all) {
      // By event type
      const evt = entry.event || "unknown";
      stats.events_by_type[evt] = (stats.events_by_type[evt] || 0) + 1;

      // Last 7 days
      if (entry.ts && new Date(entry.ts).getTime() > sevenDaysAgo) {
        stats.last_7_days++;
      }

      // Aggregate from meta
      if (entry.meta?.purpose) {
        stats.by_purpose[entry.meta.purpose] = (stats.by_purpose[entry.meta.purpose] || 0) + 1;
      }
      if (entry.meta?.type) {
        stats.by_type[entry.meta.type] = (stats.by_type[entry.meta.type] || 0) + 1;
      }
      if (entry.meta?.city) {
        stats.by_city[entry.meta.city] = (stats.by_city[entry.meta.city] || 0) + 1;
      }
    }

    // Recent 10 events
    stats.recent = all.slice(0, 10);

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ total_events: 0 }, { status: 200 });
  }
}
