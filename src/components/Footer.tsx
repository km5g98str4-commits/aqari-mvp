export default function Footer() {
  return (
    <footer className="border-t py-6 text-center">
      <div className="flex items-center justify-center gap-4">
        <p className="text-sm text-gray-400">
          عقاري — أداة تجهيز العروض العقارية الاحترافية
          {" "}
          <a href="/stats" className="text-gray-300 hover:text-gray-500 transition" title="لوحة الإحصائيات">
            📊
          </a>
        </p>
        <a href="/contact" className="text-xs text-indigo-500 hover:text-indigo-700 transition">
          للتواصل
        </a>
      </div>
    </footer>
  );
}
