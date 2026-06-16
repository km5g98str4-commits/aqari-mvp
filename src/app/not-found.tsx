import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300">٤٠٤</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">
        الصفحة غير موجودة
      </h2>
      <p className="mt-2 text-gray-500">
        الصفحة اللي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-900 px-5 py-2.5 text-white hover:bg-indigo-800"
      >
        <Home className="h-4 w-4" />
        العودة للرئيسية
      </Link>
    </div>
  );
}
