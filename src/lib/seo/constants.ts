// Author + company constants for JSON-LD structured data.
// Spec: docs/specs/JSONLD_STRUCTURED_DATA_SPEC.md §4 (paths adapted to src/).

export const SITE_URL = "https://softwarepmtools.com";
export const SITE_NAME = "Software PM Tools";
export const SITE_NAME_TH = "เครื่องมือ Software PM";

export const AUTHOR = {
  nameEn: "Soranon Promsawat",
  nameTh: "สรนนท์ พรหมสวัสดิ์",
  jobTitle: "IT Project Manager Consultant",
  jobTitleTh: "ที่ปรึกษาบริหารโครงการซอฟต์แวร์",
  // Cloudflare Email Routing alias → forwards to soranon.p@gmail.com
  email: "contact@softwarepmtools.com",
  linkedin: "https://www.linkedin.com/in/soranon",
  // Primary image is self-hosted (public/profile/soranon.png exists).
  // LinkedIn URL kept as a documented fallback (signed, will expire).
  image: `${SITE_URL}/profile/soranon.png`,
  imageFallback:
    "https://media.licdn.com/dms/image/v2/D5603AQGkE41jypI0dQ/profile-displayphoto-crop_800_800/B56Z4RCzBZK0AI-/0/1778402409778?e=1780531200&v=beta&t=DQZ2f2llmjkRMB5_vuoIOT29BOzgGUOg53RTyZT3-cQ",
} as const;

export const COMPANY = {
  name: SITE_NAME,
  nameTh: SITE_NAME_TH,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`, // public/logo.png exists
  description:
    "เครื่องมือช่วย IT PM, BA, Founder และเจ้าของธุรกิจ ประเมินงบประมาณ Man-day Timeline และ Scope ก่อนเริ่มจ้างทำ Software, Web App, Mobile App หรือระบบองค์กร",
  descriptionEn:
    "Software project planning toolkit for IT PMs, BAs, founders, and business owners in Thailand. Free estimation calculator, timeline planner, and consulting services for software project scoping.",
  email: "contact@softwarepmtools.com",
  areaServed: "TH",
  inLanguage: "th-TH",
} as const;

export const SOCIAL = {
  linkedin: AUTHOR.linkedin,
} as const;

// Used in Organization.sameAs and Person.sameAs
export const SAME_AS_URLS: readonly string[] = [SOCIAL.linkedin] as const;
