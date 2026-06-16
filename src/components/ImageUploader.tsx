"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

  const validateAndAddFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`الحد الأقصى ${maxImages} صور`);
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remaining);
      const newImages: string[] = [];

      for (const file of filesToProcess) {
        if (!acceptedTypes.includes(file.type)) {
          setError("نوع الملف غير مدعوم (JPG, PNG, WebP فقط)");
          continue;
        }
        if (file.size > maxSizeBytes) {
          setError(`حجم الصورة كبير جدًا (الحد الأقصى ${maxSizeMB} ميجابايت)`);
          continue;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          newImages.push(base64);
          if (newImages.length === filesToProcess.filter((f) => acceptedTypes.includes(f.type) && f.size <= maxSizeBytes).length) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [images, maxImages, maxSizeBytes, onImagesChange, acceptedTypes]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        validateAndAddFiles(e.dataTransfer.files);
      }
    },
    [validateAndAddFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        validateAndAddFiles(e.target.files);
        e.target.value = "";
      }
    },
    [validateAndAddFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      onImagesChange(images.filter((_, i) => i !== index));
      setError(null);
    },
    [images, onImagesChange]
  );

  return (
    <div className="space-y-3">
      {/* منطقة الرفع */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="ارفع صور العقار هنا"
        className={`
          cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors
          ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }
        `}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          اسحب الصور هنا أو اضغط للرفع
        </p>
        <p className="mt-1 text-xs text-gray-400">
          JPG, PNG, WebP • الحد الأقصى {maxSizeMB}MB للصورة • حتى {maxImages}{" "}
          صور
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          ⚠️ {error}
        </p>
      )}

      {/* عداد الصور */}
      {images.length > 0 && (
        <p className="text-sm text-gray-500">
          {images.length} / {maxImages} صور
        </p>
      )}

      {/* شبكة الصور المصغرة */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
              <img
                src={img}
                alt={`صورة ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                aria-label={`حذف الصورة ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* لا صور */}
      {images.length === 0 && !error && (
        <div className="flex items-center justify-center gap-2 rounded-lg border bg-gray-50 py-4 text-sm text-gray-400">
          <ImageIcon className="h-4 w-4" />
          <span>لم تُرفع أي صور بعد</span>
        </div>
      )}
    </div>
  );
}
