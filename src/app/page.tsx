"use client";

import PropertyForm from "@/components/PropertyForm";
import BulkUploader from "@/components/BulkUploader";
import { Sparkles, FileUp } from "lucide-react";
import { useState } from "react";
import type { BulkProperty } from "@/components/BulkUploader";

export default function HomePage() {
  const [showBulk, setShowBulk] = useState(false);
  const [bulkProperties, setBulkProperties] = useState<BulkProperty[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState<any>(null);

  const handlePropertiesParsed = (properties: BulkProperty[]) => {
    setBulkProperties(properties);
  };

  const handleBulkGenerate = async () => {
    if (bulkProperties.length === 0) return;
    setBulkLoading(true);
    setBulkResults(null);

    try {
      const res = await fetch("/api/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ properties: bulkProperties, tone: "بيعي" }),
      });
      const data = await res.json();
      setBulkResults(data);
    } catch (err: any) {
      setBulkResults({ error: err?.message || "فشل الاتصال" });
    } finally {
      setBulkLoading(false);
    }
  };
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* العنوان الرئيسي */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          حوّل عقارك إلى عرض احترافي بضغطة زر ✨
        </h1>
        <p className="mt-3 text-gray-500">
          ارفع الصور، املأ البيانات، واستلم عرضك العقاري الجاهز للنشر
        </p>
      </div>

      {/* Toggle: Single / Bulk */}
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => setShowBulk(false)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !showBulk
              ? "bg-indigo-900 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          عقار واحد
        </button>
        <button
          onClick={() => setShowBulk(true)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            showBulk
              ? "bg-indigo-900 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <FileUp className="h-4 w-4" />
          رفع عدة عقارات
        </button>
      </div>

      {showBulk ? (
        /* Bulk Upload Mode */
        <div className="space-y-6">
          <BulkUploader onPropertiesParsed={handlePropertiesParsed} />

          {bulkProperties.length > 0 && (
            <>
              <div className="rounded-xl border bg-white p-4">
                <h3 className="mb-3 font-semibold text-gray-800">
                  {bulkProperties.length} عقارات جاهزة للتوليد
                </h3>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-right text-gray-500">
                        <th className="px-2 py-1">#</th>
                        <th className="px-2 py-1">النوع</th>
                        <th className="px-2 py-1">الغرض</th>
                        <th className="px-2 py-1">المدينة</th>
                        <th className="px-2 py-1">المساحة</th>
                        <th className="px-2 py-1">السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkProperties.map((p, i) => (
                        <tr key={i} className="border-t text-gray-600">
                          <td className="px-2 py-1">{i + 1}</td>
                          <td className="px-2 py-1">{p.type}</td>
                          <td className="px-2 py-1">{p.purpose}</td>
                          <td className="px-2 py-1">{p.city}</td>
                          <td className="px-2 py-1">{p.area} م²</td>
                          <td className="px-2 py-1">{p.price.toLocaleString("ar-SA")} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={handleBulkGenerate}
                disabled={bulkLoading}
                className="w-full rounded-xl bg-indigo-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-indigo-800 disabled:opacity-50"
              >
                {bulkLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    جاري توليد {bulkProperties.length} عروض...
                  </span>
                ) : (
                  <>
                    <Sparkles className="inline h-5 w-5 ml-2" />
                    توليد {bulkProperties.length} عروض دفعة واحدة
                  </>
                )}
              </button>

              {/* Bulk Results */}
              {bulkResults && (
                <div className="rounded-xl border bg-white p-4">
                  <h3 className="mb-3 font-semibold text-gray-800">نتائج التوليد</h3>
                  {bulkResults.error ? (
                    <p className="text-sm text-red-600">{bulkResults.error}</p>
                  ) : (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>✅ تم التوليد: {bulkResults.generated} / {bulkResults.total}</p>
                      {bulkResults.errors > 0 && (
                        <p>⚠️ أخطاء: {bulkResults.errors}</p>
                      )}
                      <details className="mt-2">
                        <summary className="cursor-pointer text-indigo-600">عرض كل النتائج</summary>
                        <div className="mt-2 max-h-96 overflow-y-auto space-y-3">
                          {bulkResults.results?.map((r: any, i: number) => (
                            <div key={i} className="rounded-lg border p-3 text-xs">
                              <p className="font-medium">
                                #{i + 1}: {r.property?.type} - {r.property?.city}
                              </p>
                              {r.content ? (
                                <>
                                  <p className="mt-1 font-semibold">{r.content.title}</p>
                                  <p className="mt-1 text-gray-500 line-clamp-2">
                                    {r.content.description?.slice(0, 150)}...
                                  </p>
                                </>
                              ) : (
                                <p className="mt-1 text-red-500">{r.error}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <PropertyForm />
      )}

      {/* تلميح */}
      <p className="mt-6 text-center text-xs text-gray-400">
        جميع البيانات تُعالج محليًا ولا تُرفع إلا لتوليد الوصف عبر الذكاء الاصطناعي
      </p>
    </div>
  );
}
