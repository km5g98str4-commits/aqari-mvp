"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("خطأ في الصفحة:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-red-400">⚠️</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">
        حدث خطأ غير متوقع
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        نأسف، حدث خطأ أثناء تحميل الصفحة.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          حاول مرة أخرى
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-900 px-4 py-2 text-sm text-white hover:bg-indigo-800"
        >
          <Home className="h-4 w-4" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
