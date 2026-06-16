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

export const metadata: Metadata = {
  title: "عقاري — أداة تجهيز العروض العقارية",
  description:
    "حوّل عقارك إلى عرض احترافي بضغطة زر. ارفع الصور، املأ البيانات، واستلم عرضك العقاري الجاهز.",
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
