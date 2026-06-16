// أنواع البيانات لمشروع عقاري (Aqari)
// جميع النصوص والتعليقات بالعربية

export interface PropertyFormData {
  /** نوع العقار */
  type: 'شقة' | 'فيلا' | 'أرض' | 'تجاري' | 'دور' | 'استراحة';
  /** الغرض: بيع أو إيجار */
  purpose: 'بيع' | 'إيجار';
  /** المدينة */
  city: 'الرياض' | 'جدة' | 'الدمام' | 'مكة' | 'المدينة' | 'أخرى';
  /** الحي (اختياري) */
  district: string;
  /** المساحة بالمتر المربع */
  area: number;
  /** عدد الغرف */
  rooms: number;
  /** عدد دورات المياه */
  bathrooms: number;
  /** عدد الصالات */
  livingRooms: number;
  /** عمر العقار */
  age: number;
  /** وحدة العمر */
  ageUnit: 'سنوات' | 'جديد';
  /** السعر المطلوب بالريال */
  price: number;
  /** المميزات (اختياري) */
  features: string;
  /** معلومات إضافية (اختياري) */
  extraInfo: string;
  /** اسم العميل أو المكتب (اختياري) */
  clientName: string;
  /** نبرة الوصف */
  tone?: string;
}

export interface GeneratedContent {
  /** عنوان جذاب للعقار */
  title: string;
  /** وصف بيعي كامل (200-300 كلمة) */
  description: string;
  /** أبرز 5 نقاط قوة */
  highlights: string[];
  /** دعوة للتواصل */
  cta: string;
  /** مزود الخدمة المستخدم */
  _provider?: 'deepseek' | 'openai' | 'demo';
}

export interface AppSettings {
  /** النموذج المستخدم (للوضع اليدوي) */
  model: 'gpt-4o' | 'gpt-4o-mini';
  /** اسم المستخدم أو المكتب للعرض */
  userDisplayName: string;
}

/** القيم الافتراضية للإعدادات */
export const DEFAULT_SETTINGS: AppSettings = {
  model: 'gpt-4o-mini',
  userDisplayName: '',
};

/** القيم الافتراضية لبيانات العقار */
export const DEFAULT_PROPERTY_FORM: PropertyFormData = {
  type: 'شقة',
  purpose: 'بيع',
  city: 'الرياض',
  district: '',
  area: 0,
  rooms: 0,
  bathrooms: 0,
  livingRooms: 0,
  age: 0,
  ageUnit: 'سنوات',
  price: 0,
  features: '',
  extraInfo: '',
  clientName: '',
};
