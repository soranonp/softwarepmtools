import type { Metadata } from "next";
import { SITE, FAQ, TOOLS } from "@/src/lib/content";

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
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

/* ---------- JSON-LD structured data ---------- */

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    description:
      "Thai-first toolkit for estimating and planning software projects before hiring vendors.",
    areaServed: { "@type": "Country", name: "Thailand" },
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "th-TH",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function professionalServiceLd() {
  return {
    "@type": "ProfessionalService",
    name: `${SITE.name} — Software Project Consulting`,
    url: `${SITE.url}/services`,
    image: `${SITE.url}/opengraph-image`,
    description:
      "บริการที่ปรึกษา Software Project: รีวิวผลประเมิน เตรียม SOW ตรวจข้อเสนอ Vendor และ PM-as-a-Service",
    areaServed: { "@type": "Country", name: "Thailand" },
    serviceType: [
      "Software Project Estimation",
      "SOW Preparation",
      "Vendor Proposal Review",
      "PM-as-a-Service",
    ],
    provider: { "@id": `${SITE.url}/#organization` },
    priceRange: "$$",
  };
}

export function softwareApplicationLd() {
  return {
    "@type": "SoftwareApplication",
    name: "Software Project Estimation Calculator",
    url: `${SITE.url}/tools/project-estimation`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "th-TH",
    description:
      "คำนวณ Man-day, Budget, Timeline และ Risk เบื้องต้นสำหรับ Web App, Mobile App, Backoffice, Power Platform และ API Integration",
    offers: { "@type": "Offer", price: "0", priceCurrency: "THB" },
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function faqPageLd() {
  return {
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function toolsItemListLd() {
  return {
    "@type": "ItemList",
    name: "Software PM Tools — เครื่องมือสำหรับงาน PM ซอฟต์แวร์",
    itemListElement: TOOLS.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      description: tool.description,
      ...(tool.href ? { url: `${SITE.url}${tool.href}` } : {}),
    })),
  };
}

/** Wraps nodes in a single schema.org graph document. */
export function jsonLdGraph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
