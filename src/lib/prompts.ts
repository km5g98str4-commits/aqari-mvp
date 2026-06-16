// قوالب البرومبت لـ OpenAI — توليد أوصاف عقارية بالعربية

import { PropertyFormData, GeneratedContent } from './types';

/**
 * بناء برومبت توليد وصف عقاري احترافي بالعربية
 */
export function buildPropertyPrompt(data: PropertyFormData): string {
  const ageText = data.ageUnit === 'جديد' ? 'جديد (لم يُسكن)' : `${data.age} سنوات`;

  return `أنت كاتب محتوى عقاري محترف. اكتب وصفًا بيعيًا جذابًا بالعربية لعقار بالمواصفات التالية:

نوع العقار: ${data.type}
الغرض: ${data.purpose}
المدينة: ${data.city}
الحي: ${data.district || 'غير محدد'}
المساحة: ${data.area} م²
الغرف: ${data.rooms}
دورات المياه: ${data.bathrooms}
الصالات: ${data.livingRooms}
عمر العقار: ${ageText}
السعر: ${Number(data.price).toLocaleString('ar-SA')} ريال
المميزات: ${data.features || 'لا يوجد'}
معلومات إضافية: ${data.extraInfo || 'لا يوجد'}
اسم العميل: ${data.clientName || 'غير محدد'}

المطلوب:
1. عنوان جذاب للعقار (سطر واحد، لا يزيد عن 15 كلمة)
2. وصف بيعي من 200-300 كلمة يركز على:
   - نمط الحياة والمشاعر اللي راح يعيشها المشتري
   - الموقع والمميزات
   - المساحات والغرف
   - القيمة مقابل السعر
3. أبرز 5 نقاط قوة للعقار
4. دعوة للتواصل

اكتب بلغة عربية فصيحة قريبة من العامية السعودية، نبرة بيعية مهنية، ركز على المشاعر ونمط الحياة مو بس المواصفات.

أخرج النتيجة بصيغة JSON فقط بدون أي نص آخر:
{
  "title": "العنوان",
  "description": "الوصف كاملاً",
  "highlights": ["نقطة1", "نقطة2", "نقطة3", "نقطة4", "نقطة5"],
  "cta": "دعوة للتواصل"
}`;
}

/**
 * بناء برومبت النظام (system message) للنموذج
 */
export const SYSTEM_PROMPT = `أنت كاتب محتوى عقاري محترف باللغة العربية. ترد بصيغة JSON فقط. لا تضيف أي نص خارج JSON. جميع النواتج بالعربية الفصيحة القريبة من العامية السعودية.`;

/**
 * توليد محتوى تجريبي بدون استدعاء API — للوضع التجريبي
 */
export function generateDemoContent(data: PropertyFormData): GeneratedContent {
  const priceFormatted = Number(data.price).toLocaleString('ar-SA');
  const purposeText = data.purpose === 'بيع' ? 'للبيع' : 'للإيجار';
  const typeText = data.type;
  const cityText = data.city;
  const districtText = data.district ? `حي ${data.district}` : data.city;
  const roomsText = data.rooms ? `${data.rooms} غرف` : '';
  const bathroomsText = data.bathrooms ? `و${data.bathrooms} دورات مياه` : '';
  const livingText = data.livingRooms ? `و${data.livingRooms} صالات` : '';
  const areaText = `${data.area} متر مربع`;
  const ageText =
    data.ageUnit === 'جديد'
      ? 'جديد لم يُسكن'
      : `عمره ${data.age} سنوات فقط`;

  const titles: Record<string, string[]> = {
    شقة: [
      `شقة فاخرة ${purposeText} في ${districtText}`,
      `فرصة ذهبية: شقة ${typeText} ${purposeText} بـ ${districtText}`,
      `مسكن أحلامك: شقة ${typeText} في قلب ${districtText}`,
    ],
    فيلا: [
      `فيلا راقية ${purposeText} في ${districtText}`,
      `فيلا أحلامك: ${roomsText} ${purposeText} بـ ${districtText}`,
      `فيلا فاخرة ${purposeText} — ${districtText}`,
    ],
    أرض: [
      `أرض ${purposeText} في ${districtText}`,
      `فرصة استثمارية: أرض ${purposeText} بـ ${districtText}`,
      `أرض مميزة ${purposeText} — ${districtText}`,
    ],
    تجاري: [
      `محل تجاري ${purposeText} في ${districtText}`,
      `فرصة استثمارية: موقع تجاري بـ ${districtText}`,
      `مكتب تجاري ${purposeText} — ${districtText}`,
    ],
    دور: [
      `دور كامل ${purposeText} في ${districtText}`,
      `دور فاخر ${purposeText} بـ ${districtText}`,
      `دور أحلامك ${purposeText} — ${districtText}`,
    ],
    استراحة: [
      `استراحة ${purposeText} في ${districtText}`,
      `استراحة راقية ${purposeText} بـ ${districtText}`,
      `استراحة أحلامك ${purposeText} — ${districtText}`,
    ],
  };

  const title =
    titles[data.type]?.[
      Math.floor(Math.random() * (titles[data.type]?.length || 1))
    ] || `${typeText} ${purposeText} في ${districtText}`;

  const description = `🏡 ${typeText} ${purposeText} في ${districtText}

نقدم لكم هذه ${data.purpose === 'بيع' ? 'الفرصة العقارية المميزة' : 'الفرصة التأجيرية الرائعة'} ${purposeText} في قلب ${cityText}، ${districtText}. عقار ${ageText}، يمتد على مساحة ${areaText} ${roomsText} ${bathroomsText} ${livingText}.

✨ ${data.purpose === 'بيع' ? 'اشتري' : 'اسكن'} في موقع استراتيجي يجمع بين الراحة والهدوء مع القرب من جميع الخدمات الأساسية. التصميم الداخلي يمنحك مساحات واسعة وإضاءة طبيعية تضفي شعورًا بالدفء والرحابة.

💰 المعروض بسعر ${priceFormatted} ريال ${data.purpose === 'بيع' ? 'فقط — قيمة استثمارية حقيقية في سوق اليوم' : '— قيمة ممتازة مقابل الموقع والمساحة'}.

${data.features ? `🔑 يتميز العقار بـ: ${data.features}` : ''}

${data.extraInfo ? `📌 ${data.extraInfo}` : ''}

لا تفوّت هذه الفرصة! احجز معاينتك اليوم وابدأ فصلًا جديدًا في منزل أحلامك 🏠`;

  const highlights = [
    `موقع ممتاز في ${districtText} بالقرب من جميع الخدمات`,
    `مساحة ${areaText} بتصميم عصري`,
    roomsText || bathroomsText || livingText
      ? `${roomsText} ${bathroomsText} ${livingText} — مساحات رحبة`
      : 'تصميم معماري مميز',
    ageText,
    `سعر ${priceFormatted} ريال — ${data.purpose === 'بيع' ? 'فرصة استثمارية' : 'قيمة إيجارية ممتازة'}`,
  ].filter((h) => h.length > 3);

  const cta = `📞 ${data.clientName || 'للتواصل والاستفسار'} — بادر قبل فوات الفرصة`;

  return { title, description, highlights, cta };
}
