"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ImageUploader from "./ImageUploader";
import { getSettings, saveFormData, saveImages, saveGeneratedContent } from "@/lib/store";
import type { PropertyFormData, GeneratedContent } from "@/lib/types";

const propertySchema = z.object({
  type: z.enum(["شقة", "فيلا", "أرض", "تجاري", "دور", "استراحة"], {
    required_error: "اختر نوع العقار",
  }),
  purpose: z.enum(["بيع", "إيجار"], {
    required_error: "اختر الغرض",
  }),
  city: z.enum(["الرياض", "جدة", "الدمام", "مكة", "المدينة", "أخرى"], {
    required_error: "اختر المدينة",
  }),
  district: z.string().optional().default(""),
  area: z.coerce
    .number({ invalid_type_error: "أدخل المساحة" })
    .positive("المساحة يجب أن تكون أكبر من صفر"),
  rooms: z.coerce
    .number({ invalid_type_error: "أدخل عدد الغرف" })
    .min(0, "عدد الغرف لا يمكن أن يكون سالبًا"),
  bathrooms: z.coerce
    .number({ invalid_type_error: "أدخل عدد دورات المياه" })
    .min(0, "عدد دورات المياه لا يمكن أن يكون سالبًا"),
  livingRooms: z.coerce
    .number({ invalid_type_error: "أدخل عدد الصالات" })
    .min(0, "عدد الصالات لا يمكن أن يكون سالبًا"),
  age: z.coerce
    .number({ invalid_type_error: "أدخل العمر" })
    .min(0, "العمر لا يمكن أن يكون سالبًا"),
  ageUnit: z.enum(["سنوات", "جديد"], {
    required_error: "اختر وحدة العمر",
  }),
  price: z.coerce
    .number({ invalid_type_error: "أدخل السعر" })
    .positive("السعر يجب أن يكون أكبر من صفر"),
  features: z.string().optional().default(""),
  extraInfo: z.string().optional().default(""),
  clientName: z.string().optional().default(""),
});

const PROPERTY_TYPES = ["شقة", "فيلا", "أرض", "تجاري", "دور", "استراحة"] as const;
const CITIES = ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "أخرى"] as const;

export default function PropertyForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: "شقة",
      purpose: "بيع",
      city: "الرياض",
      district: "",
      area: undefined as unknown as number,
      rooms: undefined as unknown as number,
      bathrooms: undefined as unknown as number,
      livingRooms: undefined as unknown as number,
      age: undefined as unknown as number,
      ageUnit: "سنوات",
      price: undefined as unknown as number,
      features: "",
      extraInfo: "",
      clientName: "",
    },
  });

  const ageUnit = watch("ageUnit");

  const onSubmit = async (data: PropertyFormData) => {
    setApiError(null);
    const settings = getSettings();

    // في حال ما فيه API Key — يشتغل بالوضع التجريبي تلقائيًا
    if (!settings.apiKey) {
      console.log("🧪 الوضع التجريبي — بدون API Key");
    }

    if (images.length === 0) {
      setApiError("⚠️ الرجاء رفع صورة واحدة على الأقل للعقار.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": settings.apiKey,
          "x-model": settings.model,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "فشل توليد الوصف. حاول مرة أخرى.");
      }

      const content: GeneratedContent = await res.json();

      // حفظ البيانات في localStorage
      saveFormData(data);
      saveImages(images);
      saveGeneratedContent(content);

      router.push("/preview");
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "حدث خطأ غير متوقع. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* رسالة خطأ عامة */}
      {apiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* القسم 1: معلومات أساسية */}
      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          📋 معلومات أساسية
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* نوع العقار */}
          <div className="space-y-1.5">
            <Label htmlFor="type">نوع العقار *</Label>
            <Select
              onValueChange={(v) => setValue("type", v as PropertyFormData["type"])}
              defaultValue="شقة"
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="اختر نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* الغرض */}
          <div className="space-y-1.5">
            <Label>الغرض *</Label>
            <div className="flex gap-4 pt-2">
              {(["بيع", "إيجار"] as const).map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={p}
                    {...register("purpose")}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
            {errors.purpose && (
              <p className="text-xs text-red-500">{errors.purpose.message}</p>
            )}
          </div>

          {/* المدينة */}
          <div className="space-y-1.5">
            <Label htmlFor="city">المدينة *</Label>
            <Select
              onValueChange={(v) => setValue("city", v as PropertyFormData["city"])}
              defaultValue="الرياض"
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* الحي */}
          <div className="space-y-1.5">
            <Label htmlFor="district">الحي</Label>
            <Input id="district" placeholder="مثال: الملقا" {...register("district")} />
          </div>
        </div>
      </section>

      {/* القسم 2: مواصفات العقار */}
      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          🏠 مواصفات العقار
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="area">المساحة (م²) *</Label>
            <Input
              id="area"
              type="number"
              placeholder="مثال: 250"
              {...register("area")}
            />
            {errors.area && (
              <p className="text-xs text-red-500">{errors.area.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rooms">عدد الغرف *</Label>
            <Input
              id="rooms"
              type="number"
              placeholder="مثال: 4"
              {...register("rooms")}
            />
            {errors.rooms && (
              <p className="text-xs text-red-500">{errors.rooms.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bathrooms">عدد دورات المياه</Label>
            <Input
              id="bathrooms"
              type="number"
              placeholder="مثال: 3"
              {...register("bathrooms")}
            />
            {errors.bathrooms && (
              <p className="text-xs text-red-500">{errors.bathrooms.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="livingRooms">عدد الصالات</Label>
            <Input
              id="livingRooms"
              type="number"
              placeholder="مثال: 1"
              {...register("livingRooms")}
            />
            {errors.livingRooms && (
              <p className="text-xs text-red-500">{errors.livingRooms.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="age">عمر العقار</Label>
            <div className="flex gap-2">
              <Input
                id="age"
                type="number"
                placeholder="مثال: 5"
                disabled={ageUnit === "جديد"}
                className="flex-1"
                {...register("age")}
              />
              <div className="flex items-center gap-4 rounded-md border px-3">
                {(["سنوات", "جديد"] as const).map((u) => (
                  <label key={u} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      value={u}
                      {...register("ageUnit")}
                      className="h-3.5 w-3.5 accent-indigo-600"
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>
            {errors.age && (
              <p className="text-xs text-red-500">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">السعر المطلوب (ريال) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="مثال: 1500000"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* القسم 3: السعر والمميزات */}
      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          ✨ المميزات والتفاصيل
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="features">المميزات</Label>
          <Textarea
            id="features"
            rows={4}
            placeholder="مثال: مدخلين، مسبح، حديقة، تكييف مركزي..."
            {...register("features")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="extraInfo">معلومات إضافية</Label>
          <Textarea
            id="extraInfo"
            rows={3}
            placeholder="مثال: قريب من الخدمات، موقع مميز..."
            {...register("extraInfo")}
          />
        </div>
      </section>

      {/* القسم 4: معلومات العميل */}
      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          👤 معلومات العميل
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="clientName">اسم العميل / المكتب</Label>
          <Input
            id="clientName"
            placeholder="مثال: مكتب النخبة العقاري"
            {...register("clientName")}
          />
        </div>
      </section>

      {/* القسم 5: رفع الصور */}
      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          📸 صور العقار *
        </h2>
        <ImageUploader images={images} onImagesChange={setImages} />
      </section>

      <Separator />

      {/* زر التوليد */}
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full bg-indigo-900 text-lg hover:bg-indigo-800"
      >
        {loading ? (
          <>
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جاري توليد العرض...
          </>
        ) : (
          <>
            <Sparkles className="ml-2 h-5 w-5" />
            توليد العرض العقاري
          </>
        )}
      </Button>
    </form>
  );
}
