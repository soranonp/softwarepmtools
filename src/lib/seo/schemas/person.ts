import { AUTHOR, COMPANY, SAME_AS_URLS } from "../constants";

// Spec §6.2
export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${COMPANY.url}#person`,
    name: AUTHOR.nameEn,
    alternateName: AUTHOR.nameTh,
    jobTitle: AUTHOR.jobTitle,
    description:
      "IT Project Manager Consultant ผู้ก่อตั้ง Software PM Tools " +
      "ให้บริการประเมินโครงการซอฟต์แวร์ จัดทำ SOW และ Review Vendor Proposal " +
      "สำหรับองค์กรในประเทศไทย",
    image: {
      "@type": "ImageObject",
      url: AUTHOR.image,
    },
    email: `mailto:${AUTHOR.email}`,
    url: COMPANY.url,
    worksFor: {
      "@type": "Organization",
      "@id": `${COMPANY.url}#organization`,
      name: COMPANY.name,
    },
    knowsAbout: [
      "IT Project Management",
      "Software Project Estimation",
      "Software Requirements Analysis",
      "Statement of Work (SOW) Writing",
      "Vendor Proposal Evaluation",
      "Software Project Risk Management",
      "Agile and Waterfall Methodologies",
    ],
    sameAs: SAME_AS_URLS,
  } as const;
}
