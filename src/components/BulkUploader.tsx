"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollText, Loader2, FileUp, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

/**
 * BulkUploader — رفع ملف Excel/CSV لعدة عقارات دفعة واحدة
 * يقبل صيغة مبسطة: صف لكل عقار
 */
interface BulkProperty {
  type: string;
  purpose: string;
  city: string;
  district: string;
  area: number;
  rooms: number;
  bathrooms: number;
  price: number;
  features: string;
}

interface BulkUploaderProps {
  onPropertiesParsed: (properties: BulkProperty[]) => void;
  locale?: "ar" | "en";
}

const VALID_TYPES = ["شقة", "فيلا", "أرض", "تجاري", "دور", "استراحة"];
const VALID_PURPOSES = ["بيع", "إيجار"];
const VALID_CITIES = ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "أخرى"];

function normalizeType(input: string): string | null {
  const n = input.trim();
  for (const t of VALID_TYPES) {
    if (n.includes(t)) return t;
  }
  return null;
}

function normalizePurpose(input: string): string | null {
  const n = input.trim();
  if (n.includes("بيع")) return "بيع";
  if (n.includes("إيجار") || n.includes("ايجار")) return "إيجار";
  return null;
}

function normalizeCity(input: string): string {
  const n = input.trim();
  for (const c of VALID_CITIES) {
    if (n.includes(c)) return c;
  }
  return "أخرى";
}

export default function BulkUploader({ onPropertiesParsed, locale = "ar" }: BulkUploaderProps) {
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<{ count: number; errors: string[] } | null>(null);
  const isAr = locale === "ar";

  const content = {
    title: isAr ? "رفع عدة عقارات دفعة واحدة" : "Bulk Upload",
    dragText: isAr
      ? "اسحب ملف Excel/CSV أو اضغط للاختيار"
      : "Drag Excel/CSV file or click to select",
    formatHelp: isAr ? "التنسيق المطلوب" : "Required Format",
    columns: [
      isAr ? "نوع العقار" : "Type",
      isAr ? "الغرض" : "Purpose",
      isAr ? "المدينة" : "City",
      isAr ? "الحي" : "District",
      isAr ? "المساحة (م²)" : "Area (m²)",
      isAr ? "الغرف" : "Rooms",
      isAr ? "الحمامات" : "Bathrooms",
      isAr ? "السعر" : "Price",
      isAr ? "المميزات" : "Features",
    ],
    parsed: isAr
      ? `تم استخراج ${parseResult?.count || 0} عقارات`
      : `Parsed ${parseResult?.count || 0} properties`,
    errors: isAr ? "أخطاء" : "Errors",
    clearData: isAr ? "مسح البيانات" : "Clear Data",
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parseFile = async (file: File) => {
    setParsing(true);
    setParseResult(null);

    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        toast.error(isAr ? "الملف فارغ أو يحتوي صف واحد فقط" : "File is empty or has only one row");
        setParsing(false);
        return;
      }

      // Read first line as header
      const headers = parseCSVLine(lines[0] || "").map((h) => h.trim().toLowerCase());

      const requiredCols = ["type", "purpose", "city", "area", "rooms", "bathrooms", "price"];
      const colMap: Record<string, number> = {};

      for (const col of requiredCols) {
        const idx = headers.findIndex((h) => h.includes(col) || h === col);
        if (idx === -1) {
          toast.error(
            isAr
              ? `العمود "${col}" غير موجود في الملف`
              : `Column "${col}" not found in file`
          );
          setParsing(false);
          return;
        }
        colMap[col] = idx;
      }

      // Optional columns
      const districtIdx = headers.findIndex((h) => h.includes("district") || h.includes("حي"));
      const featuresIdx = headers.findIndex((h) => h.includes("features") || h.includes("مميزات"));

      const properties: BulkProperty[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i] || "");
        if (cols.length < 7) {
          errors.push(`${isAr ? "صف" : "Row"} ${i + 1}: ${isAr ? "أعمدة ناقصة" : "missing columns"}`);
          continue;
        }

        const type = normalizeType(cols[colMap.type] || "");
        const purpose = normalizePurpose(cols[colMap.purpose] || "");
        const city = normalizeCity(cols[colMap.city] || "");

        if (!type) {
          errors.push(`${isAr ? "صف" : "Row"} ${i + 1}: ${isAr ? "نوع العقار غير صالح" : "invalid property type"}`);
          continue;
        }
        if (!purpose) {
          errors.push(`${isAr ? "صف" : "Row"} ${i + 1}: ${isAr ? "الغرض غير صالح" : "invalid purpose"}`);
          continue;
        }

        const area = parseInt(cols[colMap.area] || "0", 10);
        const rooms = parseInt(cols[colMap.rooms] || "0", 10);
        const bathrooms = parseInt(cols[colMap.bathrooms] || "0", 10);
        const price = parseInt(cols[colMap.price] || "0", 10);

        if (area <= 0 || rooms < 0 || price <= 0) {
          errors.push(`${isAr ? "صف" : "Row"} ${i + 1}: ${isAr ? "قيم رقمية غير صالحة" : "invalid numeric values"}`);
          continue;
        }

        properties.push({
          type: type as string,
          purpose: purpose as string,
          city,
          district: districtIdx >= 0 ? (cols[districtIdx] || "").trim() : "",
          area,
          rooms,
          bathrooms,
          price,
          features: featuresIdx >= 0 ? (cols[featuresIdx] || "").trim() : "",
        });
      }

      if (properties.length === 0) {
        toast.error(isAr ? "لم يتم العثور على عقارات صالحة" : "No valid properties found");
      } else {
        setParseResult({ count: properties.length, errors });
        onPropertiesParsed(properties);
        toast.success(
          isAr
            ? `تم استخراج ${properties.length} عقارات`
            : `Parsed ${properties.length} properties`
        );
      }
    } catch (err) {
      toast.error(isAr ? "فشل قراءة الملف" : "Failed to read file");
    } finally {
      setParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = ""; // Reset so same file can be re-uploaded
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        className="relative rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/30"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label={content.title}
        />

        {parsing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm text-gray-500">
              {isAr ? "جاري تحليل الملف..." : "Parsing file..."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-indigo-100 p-3">
              <FileUp className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="font-medium text-gray-700">{content.dragText}</p>
            <p className="text-xs text-gray-400">CSV, TXT</p>
          </div>
        )}
      </div>

      {/* Format Help */}
      <details className="rounded-lg border bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium text-gray-700">
          <ScrollText className="inline h-4 w-4 ml-1" />
          {content.formatHelp}
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs" dir="ltr">
            <thead>
              <tr className="border-b text-left text-gray-500">
                {content.columns.map((col, i) => (
                  <th key={i} className="px-2 py-1 font-normal">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-600">
                <td className="px-2 py-1">شقة</td>
                <td className="px-2 py-1">بيع</td>
                <td className="px-2 py-1">الرياض</td>
                <td className="px-2 py-1">الملقا</td>
                <td className="px-2 py-1">250</td>
                <td className="px-2 py-1">4</td>
                <td className="px-2 py-1">3</td>
                <td className="px-2 py-1">1500000</td>
                <td className="px-2 py-1">مسبح, حديقة</td>
              </tr>
              <tr className="text-gray-600">
                <td className="px-2 py-1">فيلا</td>
                <td className="px-2 py-1">إيجار</td>
                <td className="px-2 py-1">جدة</td>
                <td className="px-2 py-1">الشاطئ</td>
                <td className="px-2 py-1">400</td>
                <td className="px-2 py-1">7</td>
                <td className="px-2 py-1">5</td>
                <td className="px-2 py-1">200000</td>
                <td className="px-2 py-1">مطل بحري</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-gray-400">
            {isAr
              ? "السطر الأول = أسماء الأعمدة. كل سطر بعده = عقار واحد. ملف CSV (Comma Separated)."
              : "First row = column names. Each row after = one property. CSV format."}
          </p>
        </div>
      </details>

      {/* Result */}
      {parseResult && (
        <div className="flex items-center gap-3 rounded-lg border bg-white p-4">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            {content.parsed}
          </span>
          {parseResult.errors.length > 0 && (
            <details className="flex-1">
              <summary className="cursor-pointer text-xs text-amber-600">
                <AlertCircle className="inline h-3.5 w-3.5 ml-1" />
                {parseResult.errors.length} {content.errors}
              </summary>
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                {parseResult.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export type { BulkProperty };
