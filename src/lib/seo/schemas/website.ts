import { COMPANY } from "../constants";

// Spec §6.3 — intentionally NO SearchAction (no /search route exists;
// a fake one gets flagged by Google).
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${COMPANY.url}#website`,
    name: COMPANY.name,
    alternateName: COMPANY.nameTh,
    url: COMPANY.url,
    description: COMPANY.description,
    inLanguage: COMPANY.inLanguage,
    publisher: {
      "@type": "Organization",
      "@id": `${COMPANY.url}#organization`,
    },
  } as const;
}
