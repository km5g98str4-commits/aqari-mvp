export default function Footer() {
  return (
    <footer className="border-t py-6 text-center">
      <p className="text-sm text-gray-400">
        عقاري — أداة تجهيز العروض العقارية الاحترافية
        {" "}
        <a href="/stats" className="text-gray-300 hover:text-gray-500 transition" title="لوحة الإحصائيات">
          📊
        </a>
      </p>
    </footer>
  );
}
