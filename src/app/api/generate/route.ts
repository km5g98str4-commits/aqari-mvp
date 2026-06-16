import { NextRequest, NextResponse } from "next/server";
import { buildPropertyPrompt, SYSTEM_PROMPT, generateDemoContent } from "@/lib/prompts";
import type { GeneratedContent } from "@/lib/types";

// ========== إعدادات المفاتيح ==========
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

// ========== Rate Limiting ==========
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
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

// ========== دوال استدعاء LLM ==========
async function callLLM(
  apiKey: string,
  url: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
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
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
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

async function callLLMWithRetry(
  apiKey: string,
  url: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxRetries = 2
): Promise<string> {
  let lastErr: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const content = await callLLM(apiKey, url, model, systemPrompt, userPrompt, controller.signal);
      clearTimeout(timeoutId);
      return content;
    } catch (err: any) {
      clearTimeout(timeoutId);
      const msg = err?.message || String(err);
      const isRetryable =
        msg.includes("timeout") ||
        msg.includes("aborted") ||
        msg.includes("AbortError") ||
        /\b5\d{2}\b/.test(msg) ||
        /\b429\b/.test(msg);

      lastErr = err;

      if (isRetryable && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
        console.warn(`LLM retry ${attempt}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }

  throw lastErr || new Error("All retries exhausted");
}

// ========== تحليل JSON ==========
function parseAIResponse(raw: string): GeneratedContent {
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  let parsed: any;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // محاولة ثانية — بعض الأحيان النموذج يضيف نص قبل/بعد JSON
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("تنسيق الرد غير متوقع من الذكاء الاصطناعي");
    }
    parsed = JSON.parse(jsonMatch[0]);
  }

  if (!parsed.title || !parsed.description || !parsed.highlights || !parsed.cta) {
    throw new Error("الرد من الذكاء الاصطناعي ناقص");
  }

  return {
    title: parsed.title,
    description: parsed.description,
    highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 5) : [],
    cta: parsed.cta,
  };
}

// ========== المسار الرئيسي ==========
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "لقد تجاوزت الحد المسموح. حاول مرة أخرى بعد دقيقة." },
      { status: 429 }
    );
  }

  // قراءة الجسم
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "البيانات المرسلة غير صالحة." },
      { status: 400 }
    );
  }

  // تحقق من الحقول المطلوبة
  const errors: string[] = [];
  if (!body.type) errors.push("نوع العقار مطلوب");
  if (!body.purpose) errors.push("الغرض مطلوب");
  if (!body.city) errors.push("المدينة مطلوبة");
  if (!body.area || body.area <= 0) errors.push("المساحة غير صالحة");
  if (body.rooms === undefined || body.rooms < 0) errors.push("عدد الغرف غير صالح");
  if (!body.price || body.price <= 0) errors.push("السعر غير صالح");

  if (errors.length > 0) {
    return NextResponse.json(
      { error: errors.join("، ") },
      { status: 400 }
    );
  }

  // تحديد النبرة
  const tone = body.tone || "احترافي";
  const prompt = buildPropertyPrompt(body, tone);

  // 🔑 الأولوية: DeepSeek → OpenAI → وضع تجريبي
  // 1. جرّب DeepSeek أولاً (أرخص)
  if (DEEPSEEK_API_KEY) {
    try {
      const rawContent = await callLLMWithRetry(
        DEEPSEEK_API_KEY,
        DEEPSEEK_URL,
        DEEPSEEK_MODEL,
        SYSTEM_PROMPT,
        prompt
      );
      const content = parseAIResponse(rawContent);
      return NextResponse.json({ ...content, _provider: "deepseek" });
    } catch (err: any) {
      console.warn("DeepSeek failed:", err?.message?.slice(0, 150));
      // نكمل للـ fallback
    }
  }

  // 2. جرّب OpenAI
  if (OPENAI_API_KEY) {
    try {
      const rawContent = await callLLMWithRetry(
        OPENAI_API_KEY,
        OPENAI_URL,
        OPENAI_MODEL,
        SYSTEM_PROMPT,
        prompt
      );
      const content = parseAIResponse(rawContent);
      return NextResponse.json({ ...content, _provider: "openai" });
    } catch (err: any) {
      console.warn("OpenAI failed:", err?.message?.slice(0, 150));
      // نكمل للـ fallback
    }
  }

  // 3. وضع تجريبي — بدون أي API keys
  console.log("🧪 الوضع التجريبي — لا مفاتيح API متاحة");
  await new Promise((resolve) => setTimeout(resolve, 800));
  const demoContent = generateDemoContent(body);
  return NextResponse.json({ ...demoContent, _provider: "demo" });
}
