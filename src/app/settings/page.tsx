"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, EyeOff, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings } from "@/lib/store";
import { toast } from "sonner";
import type { AppSettings } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [showKey, setShowKey] = useState(false);
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
        إدارة مفتاح API وإعدادات التطبيق
      </p>

      <div className="space-y-6 rounded-xl border bg-white p-6">
        {/* مفتاح API */}
        <div className="space-y-1.5">
          <Label htmlFor="apiKey">مفتاح OpenAI API</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings({ ...settings, apiKey: e.target.value })
                }
                placeholder="sk-..."
                dir="ltr"
                className="font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setShowKey(!showKey)}
                tabIndex={-1}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-amber-600">
            ⚠️ المفتاح يُخزن في متصفحك فقط ولا يُرسل لأي جهة أخرى
          </p>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
          >
            كيف أحصل على مفتاح API؟
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <Separator />

        {/* النموذج */}
        <div className="space-y-1.5">
          <Label htmlFor="model">نموذج الذكاء الاصطناعي</Label>
          <Select
            value={settings.model}
            onValueChange={(v) =>
              setSettings({ ...settings, model: v as AppSettings["model"] })
            }
          >
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">
                GPT-4o mini — الأسرع والأرخص ✓
              </SelectItem>
              <SelectItem value="gpt-4o">
                GPT-4o — الأفضل للجودة العالية
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400">
            GPT-4o mini أرخص وأسرع، يكفي لمعظم العروض
          </p>
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
