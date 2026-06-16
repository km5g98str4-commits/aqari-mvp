import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "للتواصل — عقاري",
  description: "تواصل معنا للاستفسارات التجارية، الدعم الفني، أو طلب ميزات مخصصة.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center" dir="rtl">
      <h1 className="mb-4 text-3xl font-bold text-indigo-900">للتواصل</h1>
      <p className="mb-8 text-gray-500">
        للاستفسارات التجارية أو الدعم الفني أو طلب ميزات مخصصة لمكتبك
      </p>

      <div className="rounded-xl border bg-white p-8 text-right space-y-6">
        <div>
          <h3 className="mb-2 font-semibold text-gray-800">📧 البريد الإلكتروني</h3>
          <a
            href="mailto:hello@aqari.app"
            className="text-indigo-600 hover:underline"
          >
            hello@aqari.app
          </a>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-2 font-semibold text-gray-800">📱 واتساب</h3>
          <a
            href="https://wa.me/966000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            تواصل واتساب
          </a>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-2 font-semibold text-gray-800">🌟 خطط مخصصة للمكاتب</h3>
          <p className="text-sm text-gray-500">
            ندعم المكاتب العقارية بخطط مخصصة تشمل:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>✅ وصول غير محدود للـ API</li>
            <li>✅ تنسيق مخصص يتوافق مع هوية مكتبك</li>
            <li>✅ تكامل مع منصات العقار (عقار، زاهب، بيوت)</li>
            <li>✅ دعم فني مباشر</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
