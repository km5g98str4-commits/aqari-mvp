"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, Copy, Check, PenLine, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PreviewCard from "@/components/PreviewCard";
import DownloadButton from "@/components/DownloadButton";
import { getFormData, getGeneratedContent, getImages, clearFormData } from "@/lib/store";
import { toast } from "sonner";

export default function PreviewPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const propertyData = getFormData();
  const generatedContent = getGeneratedContent();
  const images = getImages();

  // لو ما فيه محتوى مُولَّد
  if (!generatedContent || !propertyData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-800">لا يوجد عرض مُولَّد</h2>
        <p className="mt-2 text-gray-500">
          لم يتم العثور على محتوى. الرجاء إنشاء عرض جديد.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-6 bg-indigo-900 hover:bg-indigo-800"
        >
          <Plus className="ml-2 h-4 w-4" />
          إنشاء عرض جديد
        </Button>
      </div>
    );
  }

  const handleCopy = async () => {
    const text = `${generatedContent.title}\n\n${generatedContent.description}\n\nأبرز المميزات:\n${generatedContent.highlights.map((h) => `✅ ${h}`).join("\n")}\n\n${generatedContent.cta}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("تم نسخ الوصف!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNew = () => {
    clearFormData();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* أزرار الإجراءات */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <DownloadButton targetRef={previewRef} />

        <Button
          onClick={handleCopy}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
          {copied ? "تم النسخ" : "نسخ الوصف"}
        </Button>

        <Button
          onClick={() => router.push("/")}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <PenLine className="h-4 w-4" />
          تعديل
        </Button>

        <Button
          onClick={handleNew}
          variant="ghost"
          size="lg"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          عرض جديد
        </Button>
      </div>

      <Separator className="mb-8" />

      {/* الكارد */}
      <div className="flex justify-center">
        <PreviewCard
          ref={previewRef}
          propertyData={propertyData}
          generatedContent={generatedContent}
          images={images}
        />
      </div>
    </div>
  );
}
