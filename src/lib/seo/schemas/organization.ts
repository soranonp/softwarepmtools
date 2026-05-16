import { COMPANY, AUTHOR, SAME_AS_URLS } from "../constants";

// Spec §6.1
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${COMPANY.url}#organization`,
    name: COMPANY.name,
    alternateName: COMPANY.nameTh,
    url: COMPANY.url,
    logo: {
      "@type": "ImageObject",
      url: COMPANY.logo,
      width: 512,
      height: 512,
    },
    description: COMPANY.description,
    founder: {
      "@type": "Person",
      "@id": `${COMPANY.url}#person`,
      name: AUTHOR.nameEn,
    },
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
    knowsAbout: [
      "Software Project Management",
      "IT Project Estimation",
      "Statement of Work (SOW)",
      "Vendor Evaluation",
      "Software Requirements Analysis",
      "Software Project Budgeting",
      "Software Project Timeline Planning",
    ],
    sameAs: SAME_AS_URLS,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: COMPANY.email,
      availableLanguage: ["th", "en"],
      areaServed: "TH",
    },
    inLanguage: COMPANY.inLanguage,
  } as const;
}
