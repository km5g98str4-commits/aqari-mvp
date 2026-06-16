"use client";

import { useState, type RefObject } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export default function DownloadButton({ targetRef }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current) return;

    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(targetRef.current, {
        scale: 2, // جودة عالية
        useCORS: true, // لدعم الصور الخارجية
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "عرض-عقاري.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("فشل تحميل الصورة:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="default"
      size="lg"
      className="bg-indigo-900 hover:bg-indigo-800"
    >
      {loading ? (
        <>
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          جاري التحميل...
        </>
      ) : (
        <>
          <Download className="ml-2 h-5 w-5" />
          تحميل العرض كصورة
        </>
      )}
    </Button>
  );
}
