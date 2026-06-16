"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings } from "@/lib/store";
import { toast } from "sonner";
import type { AppSettings } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    toast.success("تم حفظ الإعدادات بنجاح ✅");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Button
        onClick={() => router.push("/")}
        variant="ghost"
        className="mb-6 gap-2"
      >
        <ArrowRight className="h-4 w-4" />
        العودة للرئيسية
      </Button>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">⚙️ الإعدادات</h1>
      <p className="mb-8 text-sm text-gray-500">
        إدارة إعدادات التطبيق
      </p>

      <div className="space-y-6 rounded-xl border bg-white p-6">
        {/* ملاحظة عن API */}
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
          ✨ <strong>التطبيق يعمل تلقائياً!</strong> لا تحتاج إدخال أي مفتاح API.
          <br />
          التطبيق يستخدم DeepSeek تلقائياً (أسرع وأرخص)، وإذا تعذّر ينتقل لـ
          OpenAI، وفي حال عدم توفرهما يعمل بالوضع التجريبي.
        </div>

        <Separator />

        {/* اسم المستخدم */}
        <div className="space-y-1.5">
          <Label htmlFor="userDisplayName">اسم المكتب / المستخدم</Label>
          <Input
            id="userDisplayName"
            value={settings.userDisplayName}
            onChange={(e) =>
              setSettings({ ...settings, userDisplayName: e.target.value })
            }
            placeholder="مثال: مكتب النخبة العقاري"
          />
          <p className="text-xs text-gray-400">
            سيظهر هذا الاسم في العروض العقارية
          </p>
        </div>

        {/* زر الحفظ */}
        <Button
          onClick={handleSave}
          className="w-full bg-indigo-900 hover:bg-indigo-800"
          size="lg"
        >
          <Save className="ml-2 h-5 w-5" />
          {saved ? "تم الحفظ ✅" : "حفظ الإعدادات"}
        </Button>
      </div>
    </div>
  );
}
