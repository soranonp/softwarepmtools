import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { SITE } from "@/src/lib/content";
import { SEO_KEYWORDS } from "@/src/lib/seo";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const DEFAULT_DESCRIPTION =
  "เครื่องมือช่วย IT PM, BA, Founder และเจ้าของธุรกิจ ประเมินงบประมาณ Man-day Timeline และ Scope ก่อนเริ่มจ้างทำ Software, Web App, Mobile App หรือระบบองค์กร";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ประเมินราคา Software, Man-day และ Timeline ฟรี`,
    template: `%s | ${SITE.name}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} | ประเมินราคา Software, Man-day และ Timeline ฟรี`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ประเมินราคา Software, Man-day และ Timeline ฟรี`,
    description: DEFAULT_DESCRIPTION,
  },
  category: "Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
