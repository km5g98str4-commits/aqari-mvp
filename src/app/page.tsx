import PropertyForm from "@/components/PropertyForm";

export default function HomePage() {
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

      <PropertyForm />

      {/* تلميح */}
      <p className="mt-6 text-center text-xs text-gray-400">
        جميع البيانات تُعالج محليًا ولا تُرفع إلا لتوليد الوصف عبر OpenAI
      </p>
    </div>
  );
}
