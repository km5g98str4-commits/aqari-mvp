import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://aqari-mvp.vercel.app";

export const metadata: Metadata = {
  title: "عقاري — أداة تجهيز العروض العقارية بالذكاء الاصطناعي",
  description:
    "حوّل عقارك إلى عرض احترافي بضغطة زر. ارفع الصور، املأ البيانات، واستلم عرضك العقاري الجاهز للنشر. يدعم السوق السعودي — الرياض، جدة، الدمام.",
  keywords: [
    "عقاري",
    "تسويق عقاري",
    "عروض عقارية",
    "ذكاء اصطناعي عقارات",
    "وصف عقار",
    "عقار",
    "تطبيق عقارات",
    "السعودية",
    "تسويق عقاري AI",
  ],
  authors: [{ name: "عقاري" }],
  openGraph: {
    title: "عقاري — أداة تجهيز العروض العقارية بالذكاء الاصطناعي",
    description:
      "حوّل عقارك إلى عرض احترافي بضغطة زر. ارفع الصور، املأ البيانات، واستلم عرضك العقاري الجاهز.",
    url: BASE_URL,
    siteName: "عقاري",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "عقاري — أداة تجهيز العروض العقارية بالذكاء الاصطناعي",
    description:
      "حوّل عقارك إلى عرض احترافي بضغطة زر. ارفع الصور، املأ البيانات، واستلم عرضك العقاري الجاهز.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50 font-[family-name:var(--font-cairo)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster dir="rtl" />
      </body>
    </html>
  );
}
