"use client";

import { forwardRef } from "react";
import { Check, MapPin, Bed, Bath, Sofa, Maximize, Calendar, Share2 } from "lucide-react";
import type { GeneratedContent, PropertyFormData } from "@/lib/types";
import ImageGallery from "./ImageGallery";

interface ShareSectionProps {
  propertyData: PropertyFormData;
  generatedContent: GeneratedContent;
  images: string[];
}

export function buildShareText(propertyData: PropertyFormData, generatedContent: GeneratedContent) {
  const purpose = propertyData.purpose === "بيع" ? "للبيع" : "للإيجار";
  const location = propertyData.district
    ? `حي ${propertyData.district} - ${propertyData.city}`
    : propertyData.city;

  return `🏠 *${generatedContent.title}*

${generatedContent.description}

✨ *أبرز المميزات:*${generatedContent.highlights.map((h) => `\n✅ ${h}`).join("")}

📞 ${generatedContent.cta}`;
}

export function ShareSection({ propertyData, generatedContent, images }: ShareSectionProps) {
  const shareText = buildShareText(propertyData, generatedContent);

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(shareText.replace(/\*/g, ""));
    // toast is handled by the parent calling component
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleWhatsApp}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        مشاركة واتساب
      </button>

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
      >
        <Share2 className="h-4 w-4" />
        نسخ الرابط
      </button>
    </div>
  );
}

interface PreviewCardProps {
  propertyData: PropertyFormData;
  generatedContent: GeneratedContent;
  images: string[];
}

const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ propertyData, generatedContent, images }, ref) => {
    const ageText =
      propertyData.ageUnit === "جديد"
        ? "جديد"
        : `${propertyData.age} سنوات`;

    return (
      <div ref={ref} className="w-full max-w-[600px] overflow-hidden rounded-2xl border bg-white shadow-xl">
        {/* معرض الصور */}
        <ImageGallery images={images} alt={generatedContent.title} />

        {/* تراكب السعر - يظهر داخل معرض الصور */}
        {images.length > 0 && (
          <div className="relative -mt-20 z-10 px-6">
            <div className="inline-block rounded-lg bg-white/95 backdrop-blur-sm shadow-lg px-4 py-2">
              <p className="text-xl font-bold text-[#1e3a5f]">
                {Number(propertyData.price).toLocaleString("ar-SA")} ريال
              </p>
            </div>
          </div>
        )}

        {/* لا صورة */}
        {images.length === 0 && (
          <div className="flex h-56 items-center justify-center rounded-t-2xl bg-gray-200">
            <span className="text-gray-400">لا توجد صورة</span>
          </div>
        )}

        {/* المحتوى */}
        <div className="space-y-5 p-6">
          {/* العنوان + الموقع */}
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#1e3a5f]">
              {generatedContent.title}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-[#c6a962]" />
              <span>
                {propertyData.city}
                {propertyData.district && ` - حي ${propertyData.district}`}
              </span>
            </div>
          </div>

          {/* المواصفات في شبكة */}
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-[#c6a962]" />
              <span>{propertyData.rooms} غرف</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-[#c6a962]" />
              <span>{propertyData.bathrooms} حمامات</span>
            </div>
            <div className="flex items-center gap-2">
              <Sofa className="h-4 w-4 text-[#c6a962]" />
              <span>{propertyData.livingRooms} صالات</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-[#c6a962]" />
              <span>{propertyData.area} م²</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#c6a962]" />
              <span>{ageText}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-[#1e3a5f]">
              <span>{propertyData.purpose === "بيع" ? "للبيع" : "للإيجار"}</span>
            </div>
          </div>

          {/* الوصف */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-[#1e3a5f]">عن العقار</h3>
            <p className="whitespace-pre-line leading-relaxed text-gray-700">
              {generatedContent.description}
            </p>
          </div>

          {/* أبرز النقاط */}
          {generatedContent.highlights.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-[#1e3a5f]">
                أبرز المميزات
              </h3>
              <ul className="space-y-2">
                {generatedContent.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* مميزات إضافية */}
          {propertyData.features && (
            <div>
              <h3 className="mb-2 text-lg font-semibold text-[#1e3a5f]">
                مميزات إضافية
              </h3>
              <p className="text-gray-700">{propertyData.features}</p>
            </div>
          )}

          {/* معلومات إضافية */}
          {propertyData.extraInfo && (
            <p className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
              {propertyData.extraInfo}
            </p>
          )}

          <hr className="border-gray-200" />

          {/* معلومات العميل + CTA */}
          <div className="text-center">
            {propertyData.clientName && (
              <p className="mb-1 text-sm text-gray-500">
                {propertyData.clientName}
              </p>
            )}
            <p className="text-lg font-semibold text-[#1e3a5f]">
              📞 {generatedContent.cta}
            </p>
          </div>

          {/* تذييل */}
          <p className="text-center text-xs text-gray-400">
            تم إنشاء هذا العرض بواسطة عقاري
          </p>
        </div>
      </div>
    );
  }
);

PreviewCard.displayName = "PreviewCard";

export default PreviewCard;
