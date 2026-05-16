import { COMPANY, SITE_URL } from "../constants";

// Spec §6.5
type AppInput = {
  url: string;
  name: string;
  description: string;
  features: string[];
};

function buildSoftwareAppSchema(input: AppInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${input.url}#software`,
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    browserRequirements:
      "Requires JavaScript. Modern browser (Chrome, Safari, Firefox, Edge).",
    inLanguage: COMPANY.inLanguage,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "THB",
      availability: "https://schema.org/InStock",
    },
    featureList: input.features,
    publisher: {
      "@type": "Organization",
      "@id": `${COMPANY.url}#organization`,
    },
  } as const;
}

export function buildEstimationCalculatorSchema() {
  return buildSoftwareAppSchema({
    url: `${SITE_URL}/tools/project-estimation`,
    name: "Software Project Estimation Calculator",
    description:
      "เครื่องมือคำนวณ Man-day, Budget และ Timeline เบื้องต้นสำหรับโครงการซอฟต์แวร์ " +
      "เหมาะสำหรับ IT PM, BA, Founder ใช้ประเมินก่อนคุยกับ Vendor",
    features: [
      "คำนวณ Man-day ของแต่ละ role (PM, SA, Dev, Tester)",
      "ประเมิน Budget แบบ Conservative / Expected / High",
      "แสดง Role Allocation พร้อมเปอร์เซ็นต์",
      "ระบุระดับความเสี่ยง (Risk Level)",
      "รองรับโครงการประเภท Web, Mobile, Internal System",
    ],
  });
}

export function buildTimelinePlannerSchema() {
  return buildSoftwareAppSchema({
    url: `${SITE_URL}/tools/timeline-planner`,
    name: "Timeline Planner with Gantt Chart",
    description:
      "เครื่องมือวางแผน Timeline สำหรับโครงการซอฟต์แวร์ พร้อม Gantt Chart, " +
      "รองรับ Dependencies, รวมวันหยุดราชการไทย และ Export Excel/PDF ฟรี",
    features: [
      "Preset templates สำหรับ Web App, Mobile App, RPA, ERP",
      "Gantt Chart แบบ interactive",
      "รองรับ Task Dependencies (Finish-to-Start)",
      "รวมวันหยุดราชการไทยอัตโนมัติ",
      "Export เป็น Excel (.xlsx), PDF และ PNG",
      "Share ผ่าน URL ได้",
    ],
  });
}
