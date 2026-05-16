import type { Metadata } from "next";
import { SITE } from "@/src/lib/content";

/** Target keywords for the Thai software-project-planning market. */
export const SEO_KEYWORDS = [
  "ประเมินราคาทำแอป",
  "ประเมินราคาทำเว็บไซต์",
  "คำนวณค่าใช้จ่ายทำระบบ",
  "ประเมินราคา software",
  "ประเมิน man-day software",
  "software project estimation",
  "IT project estimation",
  "รับทำ SOW",
  "ทำเอกสาร SOW",
  "ตรวจ proposal vendor",
  "software project management tools",
  "เครื่องมือ Project Manager",
  "เครื่องมือ IT PM",
];

interface BuildMetadataArgs {
  /** Page title. Combined with the brand template unless `absoluteTitle` is set. */
  title?: string;
  /** Full title that bypasses the `%s | Software PM Tools` template. */
  absoluteTitle?: string;
  description: string;
  /** Route path, e.g. "/tools". Used for the canonical URL. */
  path: string;
  keywords?: string[];
}

/**
 * Builds App Router `Metadata` with canonical URL, Open Graph, and Twitter
 * card. `metadataBase` is set on the root layout so relative URLs resolve.
 */
export function buildMetadata({
  title,
  absoluteTitle,
  description,
  path,
  keywords,
}: BuildMetadataArgs): Metadata {
  const ogTitle = absoluteTitle ?? `${title} | ${SITE.name}`;
  const canonical = path === "/" ? "/" : path;
  // Static OG asset in /public — works on a fully static host (Cloudflare Pages).
  const ogImage = {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Software PM Tools - ประเมินงบประมาณ Software Project",
  };

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    keywords: keywords ?? SEO_KEYWORDS,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: SITE.name,
      url: `${SITE.url}${path === "/" ? "" : path}`,
      title: ogTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ["/og-image.png"],
    },
  };
}
