"use client";

import { forwardRef } from "react";
import { Check, MapPin, Bed, Bath, Sofa, Maximize, Calendar } from "lucide-react";
import type { GeneratedContent, PropertyFormData } from "@/lib/types";

interface PreviewCardProps {
  propertyData: PropertyFormData;
  generatedContent: GeneratedContent;
  images: string[];
}

const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ propertyData, generatedContent, images }, ref) => {
    const mainImage = images[0] || "";
    const ageText =
      propertyData.ageUnit === "جديد"
        ? "جديد"
        : `${propertyData.age} سنوات`;

    return (
      <div ref={ref} className="w-full max-w-[600px] overflow-hidden rounded-2xl border bg-white shadow-xl">
        {/* صورة رئيسية مع السعر */}
        <div className="relative h-[350px] w-full overflow-hidden bg-gray-200">
          {mainImage ? (
            <img
              src={mainImage}
              alt={generatedContent.title}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              لا توجد صورة
            </div>
          )}
          {/* تراكب السعر */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-16">
            <p className="text-3xl font-bold text-white drop-shadow-lg">
              {Number(propertyData.price).toLocaleString("ar-SA")} ريال
            </p>
          </div>
        </div>

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
