import { COMPANY, SITE_URL } from "../constants";

// Spec §6.4
type ServiceInput = {
  id: string; // Anchor slug, e.g. "quick-estimate-review"
  name: string;
  description: string;
  price: number; // THB
  priceCurrency?: string;
};

function buildServiceSchema(input: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services#${input.id}`,
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      "@id": `${COMPANY.url}#organization`,
      name: COMPANY.name,
    },
    serviceType: "Software Project Consulting",
    areaServed: { "@type": "Country", name: "Thailand" },
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "IT Project Managers, Business Analysts, Software Project Owners",
    },
    offers: {
      "@type": "Offer",
      price: input.price.toString(),
      priceCurrency: input.priceCurrency ?? "THB",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/services#${input.id}`,
    },
    inLanguage: COMPANY.inLanguage,
  } as const;
}

export function buildAllServiceSchemas() {
  return [
    buildServiceSchema({
      id: "quick-estimate-review",
      name: "Quick Estimate Review",
      description:
        "บริการตรวจสอบและประเมินงบประมาณโครงการซอฟต์แวร์เบื้องต้น " +
        "พร้อมคำแนะนำเชิงเทคนิคจาก IT Project Manager มืออาชีพ " +
        "รับรายงานภายใน 3 วันทำการ",
      price: 3900,
    }),
    buildServiceSchema({
      id: "sow-ready-pack",
      name: "SOW Ready Pack",
      description:
        "แพ็กเกจจัดทำ Statement of Work (SOW) พร้อมใช้งาน " +
        "ครอบคลุม Scope, Acceptance Criteria, Deliverables, Timeline และ Payment Terms " +
        "ลดความเสี่ยงจาก scope creep และความขัดแย้งกับ vendor",
      price: 19900,
    }),
    buildServiceSchema({
      id: "vendor-review",
      name: "Vendor Proposal Review",
      description:
        "บริการตรวจสอบความสมเหตุสมผลของ Proposal จาก Vendor " +
        "วิเคราะห์ Man-day, Cost Structure, Risk และ Timeline " +
        "พร้อมรายงานเปรียบเทียบและคำแนะนำในการเจรจา",
      price: 29900,
    }),
    buildServiceSchema({
      id: "pm-as-a-service",
      name: "PM-as-a-Service",
      description:
        "บริการ Project Manager มืออาชีพดูแลโครงการซอฟต์แวร์ของคุณตลอดอายุงาน " +
        "รายเดือนแบบ part-time ติดตาม progress, จัดประชุม, จัดการ vendor, " +
        "และรายงานความเสี่ยงต่อเนื่อง",
      price: 45000, // monthly retainer — adjust if needed
    }),
  ];
}
