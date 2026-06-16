"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, MapPin, Home, Building, Hash } from "lucide-react";

interface StatData {
  total_events: number;
  events_by_type: Record<string, number>;
  by_purpose: Record<string, number>;
  by_type: Record<string, number>;
  by_city: Record<string, number>;
  last_7_days: number;
  recent: Array<{ ts: string; event: string; meta: Record<string, any> }>;
}

export default function StatsPage() {
  const [data, setData] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/track")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!data || data.total_events === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold text-gray-600">لا توجد بيانات بعد</h2>
        <p className="mt-2 text-gray-400">
          ستبدأ الإحصائيات بالظهور بعد أول استخدام للموقع
        </p>
      </div>
    );
  }

  const labels: Record<string, string> = {
    generate: "توليد إعلان",
    bulk_generate: "توليد بالجملة",
    download_png: "تحميل PNG",
    copy_text: "نسخ النص",
    view_preview: "عرض المعاينة",
    whatsapp_share: "مشاركة واتساب",
  };

  const barColors = ["bg-indigo-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-cyan-600"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8" dir="rtl">
      <h1 className="mb-8 text-2xl font-bold text-indigo-900">📊 لوحة الإحصائيات</h1>

      {/* بطاقات KPI */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Hash className="h-4 w-4" />
            إجمالي الأحداث
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-900">{data.total_events}</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <TrendingUp className="h-4 w-4" />
            آخر 7 أيام
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{data.last_7_days}</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Home className="h-4 w-4" />
            إعلانات
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-900">
            {(data.events_by_type.generate || 0) + (data.events_by_type.bulk_generate || 0)}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin className="h-4 w-4" />
            مدن
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-900">
            {Object.keys(data.by_city).length}
          </p>
        </div>
      </div>

      {/* المخطط */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* حسب الحدث */}
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">حسب الحدث</h2>
          <div className="space-y-3">
            {Object.entries(data.events_by_type)
              .sort(([, a], [, b]) => b - a)
              .map(([event, count], i) => (
                <div key={event}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{labels[event] || event}</span>
                    <span className="font-semibold text-gray-600">{count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColors[i % barColors.length]}`}
                      style={{
                        width: `${(count / Math.max(...Object.values(data.events_by_type))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* حسب الغرض */}
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">حسب الغرض</h2>
          <div className="space-y-3">
            {Object.entries(data.by_purpose)
              .sort(([, a], [, b]) => b - a)
              .map(([purpose, count], i) => (
                <div key={purpose}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{purpose === "بيع" ? "للبيع" : "للإيجار"}</span>
                    <span className="font-semibold text-gray-600">{count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColors[i % barColors.length]}`}
                      style={{
                        width: `${(count / Math.max(...Object.values(data.by_purpose))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* حسب النوع */}
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">حسب النوع</h2>
          <div className="space-y-3">
            {Object.entries(data.by_type)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count], i) => (
                <div key={type}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{type}</span>
                    <span className="font-semibold text-gray-600">{count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColors[i % barColors.length]}`}
                      style={{
                        width: `${(count / Math.max(...Object.values(data.by_type))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* حسب المدينة */}
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">حسب المدينة</h2>
          {Object.keys(data.by_city).length === 0 ? (
            <p className="text-sm text-gray-400">لا توجد بيانات مدن بعد</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.by_city)
                .sort(([, a], [, b]) => b - a)
                .map(([city, count], i) => (
                  <div key={city}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{city}</span>
                      <span className="font-semibold text-gray-600">{count}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColors[i % barColors.length]}`}
                        style={{
                          width: `${(count / Math.max(...Object.values(data.by_city))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* آخر الأحداث */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">آخر 10 أحداث</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-right text-gray-500">
                <th className="py-2 pl-4">الوقت</th>
                <th className="py-2 pl-4">الحدث</th>
                <th className="py-2">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((entry, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 pl-4 text-gray-400 whitespace-nowrap">
                    {new Date(entry.ts).toLocaleString("ar-SA")}
                  </td>
                  <td className="py-2 pl-4">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {labels[entry.event] || entry.event}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">
                    {entry.meta?.city && `${entry.meta.city}`}
                    {entry.meta?.type && ` • ${entry.meta.type}`}
                    {entry.meta?.purpose && ` • ${entry.meta.purpose === "بيع" ? "بيع" : "إيجار"}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
