// متجر localStorage لمشروع عقاري
// يخزن الإعدادات وبيانات النموذج والمحتوى المُولَّد محليًا

import { AppSettings, DEFAULT_SETTINGS, PropertyFormData, DEFAULT_PROPERTY_FORM, GeneratedContent } from './types';

const KEYS = {
  SETTINGS: 'aqari_settings',
  FORM_DATA: 'aqari_form_data',
  GENERATED_CONTENT: 'aqari_generated_content',
  IMAGES: 'aqari_images',
} as const;

// ========== الإعدادات ==========

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    console.error('فشل حفظ الإعدادات');
  }
}

// ========== بيانات النموذج ==========

export function getFormData(): PropertyFormData {
  if (typeof window === 'undefined') return DEFAULT_PROPERTY_FORM;
  try {
    const raw = localStorage.getItem(KEYS.FORM_DATA);
    if (!raw) return DEFAULT_PROPERTY_FORM;
    return { ...DEFAULT_PROPERTY_FORM, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROPERTY_FORM;
  }
}

export function saveFormData(data: PropertyFormData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.FORM_DATA, JSON.stringify(data));
  } catch {
    console.error('فشل حفظ بيانات النموذج');
  }
}

export function clearFormData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEYS.FORM_DATA);
    localStorage.removeItem(KEYS.IMAGES);
    localStorage.removeItem(KEYS.GENERATED_CONTENT);
  } catch {
    console.error('فشل مسح بيانات النموذج');
  }
}

// ========== المحتوى المُولَّد ==========

export function getGeneratedContent(): GeneratedContent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.GENERATED_CONTENT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGeneratedContent(content: GeneratedContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.GENERATED_CONTENT, JSON.stringify(content));
  } catch {
    console.error('فشل حفظ المحتوى المُولَّد');
  }
}

// ========== الصور ==========

export function getImages(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.IMAGES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.IMAGES, JSON.stringify(urls));
  } catch (error) {
    console.error('فشل حفظ الصور — قد تكون كبيرة جدًا', error);
  }
}
