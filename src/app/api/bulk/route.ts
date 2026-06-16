import { NextRequest, NextResponse } from "next/server";
import { buildPropertyPrompt, SYSTEM_PROMPT, generateDemoContent } from "@/lib/prompts";
import type { GeneratedContent } from "@/lib/types";

export const runtime = "edge";
export const maxDuration = 120;

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

// ========== Rate Limiting ==========
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count++;
  return true;
}

async function callLLM(
  apiKey: string,
  url: string,
  model: string,
  prompt: string,
  signal?: AbortSignal
): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`LLM returned ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from LLM");
  return content;
}

function parseAIResponse(raw: string): GeneratedContent {
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON");
    parsed = JSON.parse(jsonMatch[0]);
  }
  if (!parsed.title || !parsed.description || !parsed.highlights || !parsed.cta) {
    throw new Error("Incomplete response");
  }
  return {
    title: parsed.title,
    description: parsed.description,
    highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 5) : [],
    cta: parsed.cta,
  };
}

async function generateSingle(
  property: any,
  tone: string
): Promise<GeneratedContent> {
  const prompt = buildPropertyPrompt(property, tone);

  // Try DeepSeek
  if (DEEPSEEK_API_KEY) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const raw = await callLLM(DEEPSEEK_API_KEY, DEEPSEEK_URL, DEEPSEEK_MODEL, prompt, controller.signal);
      clearTimeout(timeout);
      return { ...parseAIResponse(raw), _provider: "deepseek" };
    } catch {
      clearTimeout(timeout);
    }
  }

  // Try OpenAI
  if (OPENAI_API_KEY) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const raw = await callLLM(OPENAI_API_KEY, OPENAI_URL, OPENAI_MODEL, prompt, controller.signal);
      clearTimeout(timeout);
      return { ...parseAIResponse(raw), _provider: "openai" };
    } catch {
      clearTimeout(timeout);
    }
  }

  // Demo fallback
  return { ...generateDemoContent(property), _provider: "demo" };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "لقد تجاوزت الحد المسموح للرفع الجماعي. حاول مرة أخرى بعد دقيقة." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "البيانات غير صالحة." }, { status: 400 });
  }

  const properties = body.properties;
  if (!Array.isArray(properties) || properties.length === 0) {
    return NextResponse.json(
      { error: "مطلوب على الأقل عقار واحد." },
      { status: 400 }
    );
  }

  if (properties.length > 50) {
    return NextResponse.json(
      { error: "الحد الأقصى هو 50 عقار في الدفعة الواحدة." },
      { status: 400 }
    );
  }

  const tone = body.tone || "احترافي";
  const results: Array<{ index: number; property: any; content: GeneratedContent | null; error?: string }> = [];

  // Generate in sequence to avoid rate limiting providers
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    try {
      // Validate required fields
      if (!prop.type || !prop.purpose || !prop.city || !prop.area || prop.area <= 0 || !prop.price || prop.price <= 0) {
        results.push({ index: i, property: prop, content: null, error: "بيانات ناقصة" });
        continue;
      }

      // Normalize prop for prompt builder
      const normalized = {
        type: prop.type,
        purpose: prop.purpose,
        city: prop.city,
        district: prop.district || "",
        area: prop.area,
        rooms: prop.rooms || 0,
        bathrooms: prop.bathrooms || 0,
        livingRooms: prop.livingRooms || 0,
        age: prop.age || 0,
        ageUnit: prop.ageUnit || "سنوات",
        price: prop.price,
        features: prop.features || "",
        extraInfo: prop.extraInfo || "",
        clientName: prop.clientName || "",
      };

      const content = await generateSingle(normalized, tone);
      results.push({ index: i, property: normalized, content });
    } catch (err: any) {
      results.push({ index: i, property: prop, content: null, error: err?.message || "فشل التوليد" });
    }
  }

  const successCount = results.filter((r) => r.content).length;
  const errorCount = results.filter((r) => r.error).length;

  return NextResponse.json({
    success: true,
    total: properties.length,
    generated: successCount,
    errors: errorCount,
    results,
  });
}
