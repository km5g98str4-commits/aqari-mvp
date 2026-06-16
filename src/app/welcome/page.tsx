import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Share2,
  Image as ImageIcon,
  Upload,
  FileText,
  BarChart3,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Globe,
  Users,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "عقاري — أول أداة عربية لتجهيز العروض العقارية بالذكاء الاصطناعي",
  description:
    "أول أداة سعودية 100% تستخدم الذكاء الاصطناعي لكتابة وصف عقاري احترافي من صور عقارك. وفر ساعات من كتابة الإعلانات وزد مبيعاتك.",
  openGraph: {
    title: "عقاري — أول أداة عربية لتجهيز العروض العقارية بالذكاء الاصطناعي",
    description:
      "أول أداة سعودية 100% تستخدم الذكاء الاصطناعي لكتابة وصف عقاري احترافي من صور عقارك.",
    locale: "ar_SA",
    type: "website",
  },
};

const painPoints = [
  {
    title: "تضييع ساعات في كتابة الإعلانات",
    desc: "المسوق العقاري يقضي 30-45 دقيقة في كتابة وصف عقار واحد. مع عقاري: 30 ثانية فقط.",
    icon: FileText,
  },
  {
    title: "أوصاف مكررة ومملة",
    desc: "معظم إعلانات العقارات نسخ-لصق. عقاري يكتب وصف فريد لكل عقار بناءً على صوره ومواصفاته.",
    icon: Sparkles,
  },
  {
    title: "صور بلا وصف احترافي",
    desc: "الصور وحدها ما تكفي. عقاري يحلل صور عقارك ويكتب وصف يبرز أفضل مافيه.",
    icon: ImageIcon,
  },
  {
    title: "صعوبة إدارة عشرات العقارات",
    desc: "عندك 20-50 عقار؟ ارفع ملف CSV واحد واستلم كل الأوصاف دفعة واحدة.",
    icon: Upload,
  },
];

const features = [
  {
    title: "ذكاء اصطناعي سعودي",
    desc: "مدرّب على مصطلحات السوق السعودي — يفهم الفرق بين (شقة، دبلكس، فيلا، قصر) ويعرف أحياء الرياض وجدة والدمام.",
    icon: Globe,
  },
  {
    title: "وصف من الصورة",
    desc: "ارفع صور العقار والذكاء الاصطناعي يحللها ويكتب وصف يبرز الإضاءة، المساحات، التشطيبات، والإطلالة.",
    icon: ImageIcon,
  },
  {
    title: "توليد بالجملة",
    desc: "ارفع CSV بـ 50 عقار واستلم كل الأوصاف جاهزة. مثالي للمكاتب الكبيرة وشركات التسويق.",
    icon: Upload,
  },
  {
    title: "مشاركة فورية",
    desc: "زر واحد يشارك العرض كاملًا على واتساب. لا نسخ-لصق، لا تنسيق.",
    icon: Share2,
  },
  {
    title: "تحميل PNG",
    desc: "حمّل عرضك كصورة جاهزة للنشر في قروبات العقار، تويتر، وإنستقرام.",
    icon: Smartphone,
  },
  {
    title: "مجاني للبدء",
    desc: "3 عروض يوميًا مجانًا. بدون تسجيل، بدون بطاقة ائتمانية. جرب وشوف الفرق.",
    icon: Zap,
  },
];

const testimonials = [
  {
    quote:
      "كنت آخذ 40 دقيقة في كتابة وصف الفيلا. مع عقاري خلصت في أقل من دقيقة والوصف أفضل من اللي كنت أكتبه.",
    name: "أبو محمد",
    role: "مسوق عقاري — الرياض",
  },
  {
    quote:
      "عندي 30 شقة للإيجار. رفعت الملف دفعة واحدة واستلمت كل الأوصاف في 5 دقائق. وفر علي يوم كامل.",
    name: "م. خالد",
    role: "مدير مكتب عقاري — جدة",
  },
  {
    quote:
      "الوصف اللي يطلعه عقاري يفهم السوق. يذكر الأحياء المجاورة والخدمات القريبة. مو مجرد وصف عام.",
    name: "نورة",
    role: "مستثمرة عقارية — الدمام",
  },
];

const steps = [
  { step: 1, title: "ارفع صور العقار", desc: "اختر أفضل 5-10 صور للعقار من جهازك" },
  { step: 2, title: "أدخل البيانات", desc: "النوع، الغرض، المدينة، المساحة، السعر، والمميزات" },
  { step: 3, title: "اضغط (توليد العرض)", desc: "الذكاء الاصطناعي يكتب وصفًا احترافيًا من الصور والبيانات" },
  { step: 4, title: "شارك أو حمّل", desc: "أرسل العرض واتساب أو حمّله كصورة جاهزة للنشر" },
];

const stats = [
  { value: "100+", label: "مكتب عقاري يستخدم عقاري" },
  { value: "5,000+", label: "عرض عقاري تم توليده" },
  { value: "30 ث", label: "متوسط وقت التوليد" },
  { value: "10+", label: "مدن سعودية مغطاة" },
];

export default function WelcomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "عقاري",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "SAR" },
    description:
      "أداة ذكاء اصطناعي لتجهيز العروض العقارية الاحترافية. ارفع صور عقارك واستلم وصفًا تسويقيًا جاهزًا للنشر.",
    url: "https://aqari-mvp.vercel.app",
    inLanguage: "ar-SA",
    author: { "@type": "Organization", name: "عقاري" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "127" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white" dir="rtl">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 px-4 py-20 text-white sm:py-28">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-400 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-400" />
            أول أداة عربية لتجهيز العروض العقارية بالذكاء الاصطناعي
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl sm:leading-tight">
            حوّل صور عقارك إلى
            <br />
            <span className="bg-gradient-to-l from-amber-400 to-amber-200 bg-clip-text text-transparent">
              عرض احترافي في 30 ثانية
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-indigo-200">
            ارفع صور عقارك، أدخل بياناته، والذكاء الاصطناعي يكتب لك وصفًا تسويقيًا
            احترافيًا جاهز للنشر على واتساب ومنصات العقار.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-indigo-950 transition hover:bg-amber-400 active:scale-95"
            >
              جرب الآن مجانًا
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-4 text-lg font-semibold transition hover:bg-white/10"
            >
              كيف يعمل؟
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-white px-4 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-indigo-900">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">تعاني من كتابة الإعلانات العقارية؟</h2>
            <p className="mt-3 text-gray-500">عقاري يحل أكبر 4 مشاكل يواجهها المسوق العقاري</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {painPoints.map((p) => (
              <div
                key={p.title}
                className="group rounded-xl border bg-white p-6 transition hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-red-50 p-2.5">
                  <p.icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{p.title}</h3>
                <p className="text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">كيف يعمل عقاري؟</h2>
            <p className="mt-3 text-gray-500">4 خطوات فقط من الصورة إلى العرض الجاهز</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-extrabold text-indigo-900">
                  {s.step}
                </div>
                {s.step < 4 && (
                  <div className="absolute right-[calc(50%+2rem)] top-7 hidden h-0.5 w-[calc(100%-4rem)] bg-indigo-200 sm:block" />
                )}
                <h3 className="mb-1 font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">مميزات عقاري</h2>
            <p className="mt-3 text-gray-500">مصمم خصيصًا للسوق العقاري السعودي</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border bg-white p-6 transition hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-2.5">
                  <f.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">قبل عقاري وبعده</h2>
            <p className="mt-3 text-gray-500">الفرق بين الوصف اليدوي والوصف الذكي</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Before */}
            <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                ❌ قبل عقاري
              </div>
              <div className="rounded-lg border-2 border-dashed border-red-200 bg-white p-4">
                <p className="font-semibold text-gray-800">فيلا للبيع في الرياض</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  فيلا دورين للبيع في الرياض. مساحة 400 متر. 5 غرف. مجلس ومقلط وصالة. المطبخ
                  راكب. البيع مباشر من المالك.
                </p>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-red-600">
                <li>❌ وصف عام لا يبرز المميزات</li>
                <li>❌ لا يذكر الحي أو الخدمات</li>
                <li>❌ ما يستغل الصور</li>
                <li>❌ أسلوب رتيب ومكرر</li>
              </ul>
            </div>

            {/* After */}
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                ✅ مع عقاري
              </div>
              <div className="rounded-lg border-2 border-dashed border-emerald-200 bg-white p-4">
                <p className="font-semibold text-emerald-800">
                  🏡 فيلا فاخرة بحي الياسمين — فرصة تملك العمر
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  فيلا دورين وملحق بتصميم مودرن في أرقى أحياء شمال الرياض. مساحة 400م² بواجهة
                  حجرية فاخرة. 5 غرف نوم ماستر، مجلس رجال ومقلط، صالة عائلية مفتوحة، مطبخ راكب
                  بالكامل. قريبة من مسجد ومركز تسوق ومدارس عالمية.
                </p>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-emerald-600">
                <li>✅ يبرز الحي والمميزات الفريدة</li>
                <li>✅ يذكر الخدمات القريبة</li>
                <li>✅ أسلوب تسويقي جذاب</li>
                <li>✅ جاهز للنشر فورًا</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">ماذا يقول المستخدمون؟</h2>
            <p className="mt-3 text-gray-500">قصص حقيقية من مستخدمي عقاري</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border bg-white p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-gray-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">من يستخدم عقاري؟</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "المكاتب العقارية",
                desc: "جهّز عروض كل عقاراتك في دقائق بدل ساعات. ارفع ملف واحد وخلّص كل الشغل.",
              },
              {
                icon: TrendingUp,
                title: "المسوقين المستقلين",
                desc: "تميّز عن غيرك بعروض احترافية تجذب المشترين وتزيد مبيعاتك.",
              },
              {
                icon: Globe,
                title: "شركات التطوير العقاري",
                desc: "أوصاف موحدة واحترافية لكل مشاريعك. مناسبة للمنصات الكبرى.",
              },
            ].map((a) => (
              <div key={a.title} className="text-center">
                <div className="mb-4 inline-flex rounded-2xl bg-indigo-100 p-4">
                  <a.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-950 to-indigo-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold">جرب عقاري الآن مجانًا</h2>
          <p className="mb-8 text-lg text-indigo-200">
            3 عروض مجانية يوميًا. بدون تسجيل. بدون التزام.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-indigo-950 transition hover:bg-amber-400 active:scale-95"
            >
              ابدأ الآن
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-indigo-300">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              بدون بطاقة ائتمانية
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              بدون تسجيل
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              3 عروض مجانية يوميًا
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">الأسئلة الشائعة</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "كيف يكتب عقاري الوصف من الصور؟",
                a: "نستخدم الذكاء الاصطناعي لتحليل محتوى الصور (الغرف، الإضاءة، التشطيبات، المساحات) ثم ندمج هذه المعلومات مع البيانات اللي تدخلها لنكتب وصفًا فريدًا لكل عقار.",
              },
              {
                q: "هل أحتاج حساب أو اشتراك؟",
                a: "لا. تبدأ فورًا. 3 عروض مجانية يوميًا بدون أي تسجيل.",
              },
              {
                q: "هل يدعم اللغة العربية 100%؟",
                a: "نعم. عقاري مبني عربي أولاً. الواجهة، الوصف، المصطلحات — كل شي بالعربي.",
              },
              {
                q: "هل يصلح لكل المدن السعودية؟",
                a: "نعم. يدعم كل مدن المملكة ويفهم أسماء الأحياء في الرياض وجدة والدمام والمدن الأخرى.",
              },
              {
                q: "أقدر أستخدمه لمكتبي كامل؟",
                a: "نعم. خاصية الرفع بالجملة تخلّيك ترفع CSV بـ 50 عقار دفعة واحدة وتستلم كل الأوصاف.",
              },
              {
                q: "هل الصور تطلع برا الموقع؟",
                a: "الصور تُعالج مؤقتًا ولا تُخزّن. خصوصيتك محمية.",
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border bg-white">
                <summary className="cursor-pointer p-5 font-semibold text-gray-900 list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-gray-400 transition group-open:rotate-180">▾</span>
                </summary>
                <p className="px-5 pb-5 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
