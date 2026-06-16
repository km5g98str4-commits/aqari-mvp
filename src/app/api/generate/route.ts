import { NextRequest, NextResponse } from "next/server";
import { buildPropertyPrompt, SYSTEM_PROMPT, generateDemoContent } from "@/lib/prompts";

// Rate limiting (in-memory, resets on server restart — كافي لـ MVP)
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

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
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

  const apiKey = request.headers.get("x-api-key");
  const model = request.headers.get("x-model") || "gpt-4o-mini";

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "البيانات المرسلة غير صالحة." },
      { status: 400 }
    );
  }

  // Validate required fields
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

  // 🧪 وضع تجريبي — بدون API Key
  if (!apiKey) {
    // محاكاة تأخير بسيط عشان الإحساس واقعي
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const demoContent = generateDemoContent(body);
    return NextResponse.json(demoContent);
  }

  // وضع حقيقي مع OpenAI
  const prompt = buildPropertyPrompt(body);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!openaiRes.ok) {
      const errData = await openaiRes.json().catch(() => ({}));
      const status = openaiRes.status;

      if (status === 401) {
        return NextResponse.json(
          { error: "مفتاح API غير صالح. تأكد من المفتاح في صفحة الإعدادات." },
          { status: 401 }
        );
      }
      if (status === 429) {
        return NextResponse.json(
          { error: "تم تجاوز حد الطلبات في OpenAI. حاول مرة أخرى لاحقًا." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errData.error?.message || "فشل الاتصال بـ OpenAI. حاول مرة أخرى." },
        { status: 502 }
      );
    }

    const data = await openaiRes.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "لم يتم توليد محتوى. حاول مرة أخرى." },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return NextResponse.json(
        { error: "تنسيق الرد غير متوقع من OpenAI. حاول مرة أخرى." },
        { status: 500 }
      );
    }

    if (!parsed.title || !parsed.description || !parsed.highlights || !parsed.cta) {
      return NextResponse.json(
        { error: "الرد من OpenAI ناقص. حاول مرة أخرى." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      title: parsed.title,
      description: parsed.description,
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 5) : [],
      cta: parsed.cta,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "انتهت مهلة الاتصال. حاول مرة أخرى." },
        { status: 504 }
      );
    }

    console.error("OpenAI API error:", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا." },
      { status: 500 }
    );
  }
}
