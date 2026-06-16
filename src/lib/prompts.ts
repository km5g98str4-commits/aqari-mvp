// قوالب البرومبت لـ OpenAI / DeepSeek — توليد أوصاف عقارية بالعربية

import { PropertyFormData, GeneratedContent } from './types';

/**
 * نبرات الوصف المتاحة
 */
export type PropertyTone = 'بيعي' | 'مهني' | 'عائلي' | 'استثماري';

const TONE_GUIDELINES: Record<PropertyTone, string> = {
  بيعي: 'استخدم لغة تسويقية عاطفية تركز على المشاعر والحياة الفاخرة. استخدم كلمات مثل: فرصة، أحلام، فاخر، مميز، راقي.',
  مهني: 'استخدم لغة موضوعية دقيقة تركز على المواصفات والأرقام. نبرة رسمية مهنية بدون مبالغة.',
  عائلي: 'استخدم لغة دافئة تركز على الراحة والأمان والمساحات العائلية. كلمات مثل: دفء، عائلة، أمان، هدوء.',
  استثماري: 'استخدم لغة تحليلية تركز على العائد الاستثماري والموقع الاستراتيجي. كلمات مثل: عائد، استثمار، نمو، قيمة.',
};

/**
 * بناء برومبت توليد وصف عقاري احترافي بالعربية
 */
export function buildPropertyPrompt(data: PropertyFormData, tone: string = 'احترافي'): string {
  const ageText = data.ageUnit === 'جديد' ? 'جديد (لم يُسكن)' : `${data.age} سنوات`;
  const toneGuide = TONE_GUIDELINES[tone as PropertyTone] || TONE_GUIDELINES['مهني'];

  return `أنت كاتب محتوى عقاري محترف متخصص في السوق السعودي. اكتب وصفًا عقاريًا بالعربية للمواصفات التالية:

نوع العقار: ${data.type}
الغرض: ${data.purpose}
المدينة: ${data.city}
الحي: ${data.district || 'غير محدد'}
المساحة: ${data.area} متر مربع
الغرف: ${data.rooms}
دورات المياه: ${data.bathrooms}
الصالات: ${data.livingRooms}
عمر العقار: ${ageText}
السعر: ${Number(data.price).toLocaleString('ar-SA')} ريال
المميزات: ${data.features || 'لا يوجد'}
معلومات إضافية: ${data.extraInfo || 'لا يوجد'}
اسم العميل: ${data.clientName || 'غير محدد'}

أسلوب الكتابة المطلوب: ${toneGuide}

المطلوب:
1. عنوان جذاب للعقار (سطر واحد، 8-15 كلمة)
2. وصف بيعي شامل (200-300 كلمة) يركز على:
   - نمط الحياة والمشاعر اللي راح يعيشها المشتري/المستأجر
   - الموقع الاستراتيجي والمميزات
   - المساحات والتصميم الداخلي
   - القيمة مقابل السعر في السوق السعودي الحالي
   - القرب من الخدمات والمرافق
3. أبرز 5 نقاط قوة للعقار (كل نقطة لا تزيد عن 15 كلمة)
4. دعوة للتواصل (سطر واحد، يشمل وسيلة التواصل)

اكتب بلغة عربية فصيحة قريبة من العامية السعودية. تجنب التكرار والكلمات المبالغ فيها. كل نقطة تكون مختلفة عن الثانية.

أخرج النتيجة بصيغة JSON فقط بدون أي نص آخر:
{
  "title": "العنوان الجذاب",
  "description": "الوصف الكامل (200-300 كلمة)",
  "highlights": ["نقطة 1", "نقطة 2", "نقطة 3", "نقطة 4", "نقطة 5"],
  "cta": "دعوة للتواصل مع اسم العميل"
}`;
}

/**
 * بناء برومبت النظام (system message) للنموذج
 */
export const SYSTEM_PROMPT = `أنت كاتب محتوى عقاري محترف متخصص في السوق العقاري السعودي. ترد بصيغة JSON فقط. لا تضيف أي نص خارج JSON. جميع النواتج بالعربية الفصيحة القريبة من العامية السعودية. الأوصاف دقيقة ومحددة — لا تستخدم عبارات عامة أو مكررة.`;

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
      `شقة عصرية ${purposeText} — موقع مميز في ${districtText}`,
    ],
    فيلا: [
      `فيلا راقية ${purposeText} في ${districtText}`,
      `فيلا أحلامك: ${roomsText} ${purposeText} بـ ${districtText}`,
      `فيلا فاخرة ${purposeText} — ${districtText}`,
      `فيلا مودرن ${purposeText} في أرقى أحياء ${districtText}`,
    ],
    أرض: [
      `أرض ${purposeText} في ${districtText}`,
      `فرصة استثمارية: أرض ${purposeText} بـ ${districtText}`,
      `أرض مميزة ${purposeText} — ${districtText}`,
      `موقع استراتيجي: أرض ${purposeText} بـ ${districtText}`,
    ],
    تجاري: [
      `محل تجاري ${purposeText} في ${districtText}`,
      `فرصة استثمارية: موقع تجاري بـ ${districtText}`,
      `مكتب تجاري ${purposeText} — ${districtText}`,
      `مساحة تجارية ${purposeText} في قلب ${districtText}`,
    ],
    دور: [
      `دور كامل ${purposeText} في ${districtText}`,
      `دور فاخر ${purposeText} بـ ${districtText}`,
      `دور أحلامك ${purposeText} — ${districtText}`,
      `دور واسع ${purposeText} بموقع مميز — ${districtText}`,
    ],
    استراحة: [
      `استراحة ${purposeText} في ${districtText}`,
      `استراحة راقية ${purposeText} بـ ${districtText}`,
      `استراحة أحلامك ${purposeText} — ${districtText}`,
      `استراحة فاخرة ${purposeText} بمساحة ${areaText}`,
    ],
  };

  const title =
    titles[data.type]?.[
      Math.floor(Math.random() * (titles[data.type]?.length || 1))
    ] || `${typeText} ${purposeText} في ${districtText}`;

  const description = `🏡 ${typeText} ${purposeText} في ${districtText}

نقدم لكم هذه ${data.purpose === 'بيع' ? 'الفرصة العقارية المميزة' : 'الفرصة التأجيرية الرائعة'} ${purposeText} في قلب ${cityText}، ${districtText}. عقار ${ageText}، يمتد على مساحة ${areaText} ${roomsText} ${bathroomsText} ${livingText}.

✨ ${data.purpose === 'بيع' ? 'اشتري' : 'اسكن'} في موقع استراتيجي يجمع بين الراحة والهدوء مع القرب من جميع الخدمات الأساسية — المدارس، المراكز التجارية، المساجد، والمستشفيات. التصميم الداخلي يمنحك مساحات واسعة وإضاءة طبيعية تضفي شعورًا بالدفء والرحابة.

💰 المعروض بسعر ${priceFormatted} ريال ${data.purpose === 'بيع' ? 'فقط — قيمة استثمارية حقيقية في سوق اليوم' : '— قيمة ممتازة مقابل الموقع والمساحة'}.

${data.features ? `🔑 يتميز العقار بـ: ${data.features}` : ''}

${data.extraInfo ? `📌 ${data.extraInfo}` : ''}

الموقع مثالي للعوائل الباحثة عن الهدوء والرقي. لا تفوّت هذه الفرصة! احجز معاينتك اليوم وابدأ فصلًا جديدًا في منزل أحلامك 🏠`;

  const highlights = [
    `📍 موقع ممتاز في ${districtText} بالقرب من جميع الخدمات`,
    `📐 مساحة ${areaText} بتصميم عصري وأنيق`,
    roomsText || bathroomsText || livingText
      ? `🏠 ${roomsText} ${bathroomsText} ${livingText} — مساحات رحبة ومريحة`
      : '🎨 تصميم معماري مميز وعصري',
    `🕐 ${ageText}`,
    `💵 سعر ${priceFormatted} ريال — ${data.purpose === 'بيع' ? 'فرصة استثمارية لا تتكرر' : 'قيمة إيجارية ممتازة'}`,
  ].filter((h) => h.length > 3);

  const cta = `📞 ${data.clientName || 'للتواصل والاستفسار'} — بادر بحجز معاينتك اليوم`;

  return { title, description, highlights, cta };
}
