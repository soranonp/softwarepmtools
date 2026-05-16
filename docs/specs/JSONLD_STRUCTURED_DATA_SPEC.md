# JSON-LD Structured Data — Build Specification

> **For Claude Code**
> This is a complete specification to add JSON-LD structured data to softwarepmtools.com.
> Read this entire document first before writing any code.
> Project: Software PM Tools (Thai-first B2B web app)
> Local path: ~/softwarepmtools

---

## 1. Context & Goal

Software PM Tools (softwarepmtools.com) is a Thai-first B2B lead-generation web app for IT Project Managers, Business Analysts, and software project owners. We are adding **JSON-LD structured data** to all major pages to enable rich snippets in Google search results.

**Why JSON-LD matters:**
- Rich snippets (rating, FAQ, sitelinks) make search results 30-50% more clickable
- Establishes E-E-A-T signals (Expertise, Experience, Authoritativeness, Trustworthiness)
- Enables knowledge panel and brand recognition in Google
- Helps LLMs (ChatGPT, Claude, Perplexity) understand and recommend the site

**Owner Info (use these exact values):**
- Full name (EN): `Soranon Promsawat`
- Full name (TH): `สรนนท์ พรหมสวัสดิ์`
- Job title: `IT Project Manager Consultant`
- LinkedIn: `https://www.linkedin.com/in/soranon`
- Email: `[email protected]`
- Profile image: `https://media.licdn.com/dms/image/v2/D5603AQGkE41jypI0dQ/profile-displayphoto-crop_800_800/B56Z4RCzBZK0AI-/0/1778402409778?e=1780531200&v=beta&t=DQZ2f2llmjkRMB5_vuoIOT29BOzgGUOg53RTyZT3-cQ`

> **Note about profile image:** LinkedIn image URLs include short-lived signed parameters and will eventually 404. For long-term reliability, download the image and host it at `/public/profile/soranon.png`, then use `https://softwarepmtools.com/profile/soranon.png`. Implement this as the primary URL, and add a TODO comment noting the LinkedIn URL was used as a fallback.

---

## 2. Tech Stack & Constraints

**Existing stack (DO NOT change):**
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Folder structure: `app/` (NOT `src/app/`)
- Static export: `output: "export"` in `next.config.js`
- Hosting: Cloudflare Pages

**Constraints:**
- Static export must continue to work
- All schemas rendered server-side (Next.js layout/page components, NOT client-side scripts)
- No external dependencies for JSON-LD generation — pure TypeScript objects serialized to JSON
- Each page injects only the schemas relevant to it (don't bloat every page with all schemas)

---

## 3. File Structure

Create:

```
lib/
└── seo/
    ├── constants.ts                    # Author + company constants
    ├── json-ld-types.ts                # TypeScript types for schemas
    └── schemas/
        ├── organization.ts             # Organization schema builder
        ├── person.ts                   # Person schema builder
        ├── website.ts                  # WebSite schema builder
        ├── services.ts                 # 4 × Service schema builders
        ├── software-apps.ts            # 2 × SoftwareApplication builders
        └── faq.ts                      # FAQPage schema builder

components/
└── seo/
    └── JsonLd.tsx                      # React component that renders <script type="application/ld+json">
```

---

## 4. Constants File (lib/seo/constants.ts)

```typescript
export const SITE_URL = 'https://softwarepmtools.com';
export const SITE_NAME = 'Software PM Tools';
export const SITE_NAME_TH = 'เครื่องมือ Software PM';

export const AUTHOR = {
  nameEn: 'Soranon Promsawat',
  nameTh: 'สรนนท์ พรหมสวัสดิ์',
  jobTitle: 'IT Project Manager Consultant',
  jobTitleTh: 'ที่ปรึกษาบริหารโครงการซอฟต์แวร์',
  email: '[email protected]',
  linkedin: 'https://www.linkedin.com/in/soranon',
  // TODO: download the LinkedIn profile image and host at /public/profile/soranon.png
  // for long-term reliability, then update this URL.
  image: `${SITE_URL}/profile/soranon.png`,
  imageFallback: 'https://media.licdn.com/dms/image/v2/D5603AQGkE41jypI0dQ/profile-displayphoto-crop_800_800/B56Z4RCzBZK0AI-/0/1778402409778?e=1780531200&v=beta&t=DQZ2f2llmjkRMB5_vuoIOT29BOzgGUOg53RTyZT3-cQ',
} as const;

export const COMPANY = {
  name: SITE_NAME,
  nameTh: SITE_NAME_TH,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`, // TODO: ensure /public/logo.png exists, 512x512+ PNG
  description: 'เครื่องมือช่วย IT PM, BA, Founder และเจ้าของธุรกิจ ประเมินงบประมาณ Man-day Timeline และ Scope ก่อนเริ่มจ้างทำ Software, Web App, Mobile App หรือระบบองค์กร',
  descriptionEn: 'Software project planning toolkit for IT PMs, BAs, founders, and business owners in Thailand. Free estimation calculator, timeline planner, and consulting services for software project scoping.',
  email: AUTHOR.email,
  areaServed: 'TH',
  inLanguage: 'th-TH',
} as const;

export const SOCIAL = {
  linkedin: AUTHOR.linkedin,
} as const;

// Used in Organization.sameAs and Person.sameAs
export const SAME_AS_URLS: readonly string[] = [
  SOCIAL.linkedin,
] as const;
```

---

## 5. JsonLd Component (components/seo/JsonLd.tsx)

This is the only React component needed. It safely serializes any schema object to a `<script>` tag.

```typescript
import React from 'react';

type JsonLdProps = {
  /**
   * The schema object (or array of objects) to be serialized.
   * Pass a single object or an array — multiple schemas can be combined.
   */
  data: Record<string, unknown> | Record<string, unknown>[];
  /**
   * Optional unique id to help React identify the script across re-renders.
   */
  id?: string;
};

/**
 * Renders a <script type="application/ld+json"> tag with the given schema(s).
 * Must be placed inside a Server Component (default in Next.js App Router).
 *
 * IMPORTANT: We escape `</` to `<\/` to prevent the closing-tag attack
 * (a string in the JSON containing "</script>" would break the page otherwise).
 */
export function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
```

---

## 6. Schema Definitions

For each schema below, create a **builder function** that returns a plain object. This keeps logic testable and reusable.

### 6.1 Organization (`lib/seo/schemas/organization.ts`)

```typescript
import { COMPANY, AUTHOR, SAME_AS_URLS } from '../constants';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${COMPANY.url}#organization`,
    name: COMPANY.name,
    alternateName: COMPANY.nameTh,
    url: COMPANY.url,
    logo: {
      '@type': 'ImageObject',
      url: COMPANY.logo,
      width: 512,
      height: 512,
    },
    description: COMPANY.description,
    founder: {
      '@type': 'Person',
      '@id': `${COMPANY.url}#person`,
      name: AUTHOR.nameEn,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Thailand',
    },
    knowsAbout: [
      'Software Project Management',
      'IT Project Estimation',
      'Statement of Work (SOW)',
      'Vendor Evaluation',
      'Software Requirements Analysis',
      'Software Project Budgeting',
      'Software Project Timeline Planning',
    ],
    sameAs: SAME_AS_URLS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: COMPANY.email,
      availableLanguage: ['th', 'en'],
      areaServed: 'TH',
    },
    inLanguage: COMPANY.inLanguage,
  } as const;
}
```

### 6.2 Person (`lib/seo/schemas/person.ts`)

```typescript
import { AUTHOR, COMPANY, SAME_AS_URLS } from '../constants';

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${COMPANY.url}#person`,
    name: AUTHOR.nameEn,
    alternateName: AUTHOR.nameTh,
    jobTitle: AUTHOR.jobTitle,
    description:
      'IT Project Manager Consultant ผู้ก่อตั้ง Software PM Tools ' +
      'ให้บริการประเมินโครงการซอฟต์แวร์ จัดทำ SOW และ Review Vendor Proposal ' +
      'สำหรับองค์กรในประเทศไทย',
    image: {
      '@type': 'ImageObject',
      url: AUTHOR.image,
    },
    email: `mailto:${AUTHOR.email}`,
    url: COMPANY.url,
    worksFor: {
      '@type': 'Organization',
      '@id': `${COMPANY.url}#organization`,
      name: COMPANY.name,
    },
    knowsAbout: [
      'IT Project Management',
      'Software Project Estimation',
      'Software Requirements Analysis',
      'Statement of Work (SOW) Writing',
      'Vendor Proposal Evaluation',
      'Software Project Risk Management',
      'Agile and Waterfall Methodologies',
    ],
    sameAs: SAME_AS_URLS,
  } as const;
}
```

### 6.3 WebSite (`lib/seo/schemas/website.ts`)

Note: We intentionally do NOT include a SearchAction because the site does not currently have a `/search` route. Adding a fake SearchAction can be flagged as spam by Google. Add it later only when an actual on-site search is built.

```typescript
import { COMPANY } from '../constants';

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${COMPANY.url}#website`,
    name: COMPANY.name,
    alternateName: COMPANY.nameTh,
    url: COMPANY.url,
    description: COMPANY.description,
    inLanguage: COMPANY.inLanguage,
    publisher: {
      '@type': 'Organization',
      '@id': `${COMPANY.url}#organization`,
    },
  } as const;
}
```

### 6.4 Services (`lib/seo/schemas/services.ts`)

```typescript
import { COMPANY, SITE_URL } from '../constants';

type ServiceInput = {
  id: string;             // Anchor slug, e.g. "quick-estimate-review"
  name: string;
  description: string;
  price: number;          // THB
  priceCurrency?: string;
};

function buildServiceSchema(input: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services#${input.id}`,
    name: input.name,
    description: input.description,
    provider: {
      '@type': 'Organization',
      '@id': `${COMPANY.url}#organization`,
      name: COMPANY.name,
    },
    serviceType: 'Software Project Consulting',
    areaServed: { '@type': 'Country', name: 'Thailand' },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'IT Project Managers, Business Analysts, Software Project Owners',
    },
    offers: {
      '@type': 'Offer',
      price: input.price.toString(),
      priceCurrency: input.priceCurrency ?? 'THB',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/services#${input.id}`,
    },
    inLanguage: COMPANY.inLanguage,
  } as const;
}

export function buildAllServiceSchemas() {
  return [
    buildServiceSchema({
      id: 'quick-estimate-review',
      name: 'Quick Estimate Review',
      description:
        'บริการตรวจสอบและประเมินงบประมาณโครงการซอฟต์แวร์เบื้องต้น ' +
        'พร้อมคำแนะนำเชิงเทคนิคจาก IT Project Manager มืออาชีพ ' +
        'รับรายงานภายใน 3 วันทำการ',
      price: 3900,
    }),
    buildServiceSchema({
      id: 'sow-ready-pack',
      name: 'SOW Ready Pack',
      description:
        'แพ็กเกจจัดทำ Statement of Work (SOW) พร้อมใช้งาน ' +
        'ครอบคลุม Scope, Acceptance Criteria, Deliverables, Timeline และ Payment Terms ' +
        'ลดความเสี่ยงจาก scope creep และความขัดแย้งกับ vendor',
      price: 19900,
    }),
    buildServiceSchema({
      id: 'vendor-review',
      name: 'Vendor Proposal Review',
      description:
        'บริการตรวจสอบความสมเหตุสมผลของ Proposal จาก Vendor ' +
        'วิเคราะห์ Man-day, Cost Structure, Risk และ Timeline ' +
        'พร้อมรายงานเปรียบเทียบและคำแนะนำในการเจรจา',
      price: 29900,
    }),
    buildServiceSchema({
      id: 'pm-as-a-service',
      name: 'PM-as-a-Service',
      description:
        'บริการ Project Manager มืออาชีพดูแลโครงการซอฟต์แวร์ของคุณตลอดอายุงาน ' +
        'รายเดือนแบบ part-time ติดตาม progress, จัดประชุม, จัดการ vendor, ' +
        'และรายงานความเสี่ยงต่อเนื่อง',
      price: 45000, // monthly retainer — adjust if needed
    }),
  ];
}
```

### 6.5 SoftwareApplication (`lib/seo/schemas/software-apps.ts`)

```typescript
import { COMPANY, SITE_URL } from '../constants';

type AppInput = {
  url: string;
  name: string;
  description: string;
  features: string[];
};

function buildSoftwareAppSchema(input: AppInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${input.url}#software`,
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Modern browser (Chrome, Safari, Firefox, Edge).',
    inLanguage: COMPANY.inLanguage,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
    },
    featureList: input.features,
    publisher: {
      '@type': 'Organization',
      '@id': `${COMPANY.url}#organization`,
    },
  } as const;
}

export function buildEstimationCalculatorSchema() {
  return buildSoftwareAppSchema({
    url: `${SITE_URL}/tools/project-estimation`,
    name: 'Software Project Estimation Calculator',
    description:
      'เครื่องมือคำนวณ Man-day, Budget และ Timeline เบื้องต้นสำหรับโครงการซอฟต์แวร์ ' +
      'เหมาะสำหรับ IT PM, BA, Founder ใช้ประเมินก่อนคุยกับ Vendor',
    features: [
      'คำนวณ Man-day ของแต่ละ role (PM, SA, Dev, Tester)',
      'ประเมิน Budget แบบ Conservative / Expected / High',
      'แสดง Role Allocation พร้อมเปอร์เซ็นต์',
      'ระบุระดับความเสี่ยง (Risk Level)',
      'รองรับโครงการประเภท Web, Mobile, Internal System',
    ],
  });
}

export function buildTimelinePlannerSchema() {
  return buildSoftwareAppSchema({
    url: `${SITE_URL}/tools/timeline-planner`,
    name: 'Timeline Planner with Gantt Chart',
    description:
      'เครื่องมือวางแผน Timeline สำหรับโครงการซอฟต์แวร์ พร้อม Gantt Chart, ' +
      'รองรับ Dependencies, รวมวันหยุดราชการไทย และ Export Excel/PDF ฟรี',
    features: [
      'Preset templates สำหรับ Web App, Mobile App, RPA, ERP',
      'Gantt Chart แบบ interactive',
      'รองรับ Task Dependencies (Finish-to-Start)',
      'รวมวันหยุดราชการไทยอัตโนมัติ',
      'Export เป็น Excel (.xlsx), PDF และ PNG',
      'Share ผ่าน URL ได้',
    ],
  });
}
```

### 6.6 FAQPage (`lib/seo/schemas/faq.ts`)

Use the FAQ content provided in Section 8 below.

```typescript
import { THAI_FAQ } from './faq-content';

export function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: THAI_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } as const;
}
```

---

## 7. Per-Page Schema Mapping

| Page | File | Schemas to inject |
|------|------|-------------------|
| `/` (Home) | `app/page.tsx` | Organization, WebSite, Person, FAQPage |
| `/about` | `app/about/page.tsx` | Person (extended) |
| `/services` | `app/services/page.tsx` | Organization, 4× Service |
| `/tools/project-estimation` | `app/tools/project-estimation/page.tsx` | SoftwareApplication (Calculator) |
| `/tools/timeline-planner` | `app/tools/timeline-planner/page.tsx` | SoftwareApplication (Timeline) |
| `/contact` | `app/contact/page.tsx` | Organization (with ContactPoint emphasized) |
| `/tools` | `app/tools/page.tsx` | Organization only |
| `/privacy`, `/disclaimer` | (legal pages) | None — legal pages don't need rich snippets |

### Example: Injecting in Home Page

In `app/page.tsx`, add this at the top of the JSX return (before any visible content):

```tsx
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganizationSchema } from '@/lib/seo/schemas/organization';
import { buildPersonSchema } from '@/lib/seo/schemas/person';
import { buildWebSiteSchema } from '@/lib/seo/schemas/website';
import { buildFaqSchema } from '@/lib/seo/schemas/faq';

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          buildOrganizationSchema(),
          buildWebSiteSchema(),
          buildPersonSchema(),
          buildFaqSchema(),
        ]}
      />
      {/* rest of page content */}
    </>
  );
}
```

---

## 8. FAQ Content (Thai)

Create `lib/seo/schemas/faq-content.ts` with the following 10 question-answer pairs. These are written to:
- Target keywords IT PMs and business owners actually search
- Provide substantive answers (Google rewards thorough content)
- Match the brand voice of softwarepmtools.com (professional, helpful, Thai-first)

```typescript
export const THAI_FAQ = [
  {
    question: 'Software PM Tools เหมาะกับใครบ้าง?',
    answer:
      'เหมาะกับ IT Project Manager, Business Analyst, Founder, เจ้าของธุรกิจ และทีม IT ในองค์กรไทย ที่ต้องการประเมินงบประมาณ Man-day Timeline หรือ Scope ของโครงการซอฟต์แวร์ก่อนเริ่มจ้าง Vendor ทั้งเครื่องมือฟรี (Calculator, Timeline Planner) และบริการที่ปรึกษาระดับมืออาชีพ',
  },
  {
    question: 'Estimation Calculator ใช้งานฟรีจริงไหม? ต้องสมัครสมาชิกหรือไม่?',
    answer:
      'ใช้งานฟรี 100% ไม่ต้องสมัครสมาชิก ไม่ต้องกรอกอีเมล ไม่มีโฆษณา และไม่จำกัดจำนวนครั้งในการใช้งาน ระบบทำงานบน browser ทั้งหมด ข้อมูลที่กรอกไม่ถูกส่งไปยัง server ใดๆ ทั้งสิ้น',
  },
  {
    question: 'Calculator ประเมินตัวเลขจากอะไร แม่นยำแค่ไหน?',
    answer:
      'Calculator ใช้สูตรคำนวณตามมาตรฐานอุตสาหกรรมซอฟต์แวร์ในประเทศไทย โดยอ้างอิงจากประสบการณ์โครงการจริงและ rate การจ้างพัฒนาในตลาดไทย เหมาะสำหรับใช้ประเมินเบื้องต้นก่อนคุยกับ Vendor ผลลัพธ์ที่ได้คือช่วงตัวเลข (Conservative / Expected / High) ซึ่งช่วยให้คุณมีจุดอ้างอิงในการต่อรองและตัดสินใจ ทั้งนี้ความแม่นยำขึ้นอยู่กับรายละเอียดของแต่ละโครงการ และไม่ใช่ตัวเลขสำหรับใช้เซ็นสัญญาโดยตรง',
  },
  {
    question: 'ต่างจากการจ้าง Vendor ประเมินตรงๆ ยังไง?',
    answer:
      'ปกติ Vendor จะประเมินจากมุมมองของผู้พัฒนา ซึ่งอาจมี bias ในเรื่องราคาและ scope ส่วน Software PM Tools ให้บริการประเมินจากมุมมองของ Project Manager ที่เป็นกลาง ไม่ได้รับค่า commission จาก Vendor ใดๆ ทำให้ลูกค้าได้ตัวเลขที่ใช้เป็นฐานในการเปรียบเทียบและต่อรอง รวมถึงรู้ว่า Vendor เสนอราคาสมเหตุสมผลหรือเปล่า',
  },
  {
    question: 'SOW Ready Pack ราคา 19,900 บาท ครอบคลุมอะไรบ้าง?',
    answer:
      'SOW Ready Pack คือบริการจัดทำ Statement of Work (SOW) แบบครบชุด สำหรับใช้งานจ้าง Vendor หรือทีมพัฒนา ครอบคลุม: (1) Project Scope ที่ชัดเจน (2) Acceptance Criteria ของแต่ละ Deliverable (3) Timeline และ Milestone (4) Payment Terms และ Penalty Clauses (5) Change Request Process (6) Risk Register เบื้องต้น ใช้เวลาดำเนินการ 5-7 วันทำการ พร้อม revision 2 รอบ',
  },
  {
    question: 'Vendor Proposal Review ทำอะไรบ้าง?',
    answer:
      'บริการตรวจสอบ Proposal จาก Vendor โดยวิเคราะห์: (1) ความสมเหตุสมผลของ Man-day และ Cost Structure (2) ความครบถ้วนของ Scope เทียบกับ Requirement (3) ช่องโหว่ใน Terms & Conditions (4) Timeline ที่สมจริงหรือเป็นไปได้ (5) Risk ที่ Vendor ซ่อนไว้ พร้อมรายงานเปรียบเทียบและคำแนะนำเชิงกลยุทธ์ในการเจรจา ใช้เวลา 5 วันทำการ',
  },
  {
    question: 'PM-as-a-Service ต่างจากการจ้าง PM ประจำยังไง?',
    answer:
      'PM-as-a-Service คือบริการ Project Manager มืออาชีพแบบ part-time รายเดือน เหมาะกับองค์กรขนาดเล็กถึงกลางที่ไม่มี PM ประจำ หรือมีโครงการสำคัญที่ต้องการ PM เฉพาะกิจ ข้อดีคือประหยัดกว่าจ้างประจำ (ไม่มีค่าสวัสดิการ ไม่มี overhead) ได้คนที่มีประสบการณ์โครงการหลากหลาย และไม่ผูกพันระยะยาว สามารถยกเลิกได้รายเดือน',
  },
  {
    question: 'ใช้บริการแล้วต้องเซ็น NDA ไหม?',
    answer:
      'ได้ครับ เราพร้อมเซ็น NDA (Non-Disclosure Agreement) ก่อนเริ่มงานทุกครั้งหากลูกค้าต้องการ ข้อมูลทั้งหมดที่ได้รับจะถูกเก็บเป็นความลับ ไม่นำไปใช้ในงานอื่นๆ และไม่เปิดเผยต่อบุคคลที่สาม สามารถใช้ NDA Template มาตรฐานของลูกค้า หรือใช้ Template ของเราก็ได้',
  },
  {
    question: 'ใช้เวลาดำเนินการแต่ละบริการนานแค่ไหน?',
    answer:
      'Quick Estimate Review: 3 วันทำการ. SOW Ready Pack: 5-7 วันทำการ พร้อม revision 2 รอบ. Vendor Proposal Review: 5 วันทำการ. PM-as-a-Service: เริ่มงานได้ภายใน 1 สัปดาห์หลังเซ็นสัญญา ทุกบริการสามารถเร่งด่วน (Rush Service) ได้โดยคิดค่าบริการเพิ่ม 50%',
  },
  {
    question: 'รับเฉพาะลูกค้าในประเทศไทยเท่านั้นหรือเปล่า?',
    answer:
      'รับลูกค้าทั้งในประเทศไทยและบริษัทไทยที่มีโครงการในต่างประเทศ สำหรับโครงการระดับนานาชาติ บริการจะให้ในภาษาอังกฤษได้ แต่หากเป็นเอกสาร SOW หรือ Proposal Review ที่ต้องใช้ในประเทศไทย แนะนำให้จัดทำเป็นภาษาไทยเพื่อความชัดเจนทางกฎหมาย',
  },
] as const;
```

---

## 9. Validation Steps (Run These After Implementation)

### 9.1 Local validation

After building, verify the generated HTML contains `<script type="application/ld+json">` tags:

```bash
npm run build
grep -r "application/ld+json" out/ | wc -l
# Expected: at least 7 occurrences (Home has 4 schemas, plus other pages)
```

### 9.2 Validate JSON syntax

Each `<script>` tag should contain valid JSON. Test with:

```bash
# Extract and validate one script tag (example for Home)
node -e "
const html = require('fs').readFileSync('out/index.html', 'utf8');
const matches = html.match(/<script type=\"application\\/ld\\+json\"[^>]*>(.*?)<\\/script>/gs);
matches?.forEach((m, i) => {
  const json = m.replace(/<script[^>]*>/, '').replace(/<\\/script>/, '');
  try { JSON.parse(json); console.log('Schema', i+1, ': OK'); }
  catch(e) { console.error('Schema', i+1, ': FAIL', e.message); }
});
"
```

### 9.3 Google Rich Results Test

After deploying to production:

1. Go to https://search.google.com/test/rich-results
2. Enter `https://softwarepmtools.com/` and click TEST URL
3. Verify it detects:
   - Organization
   - WebSite
   - Person
   - FAQPage
4. Repeat for `/services` (should detect Organization + 4 Services)
5. Repeat for `/tools/project-estimation` and `/tools/timeline-planner` (should detect SoftwareApplication)

### 9.4 Schema.org Validator

For deeper validation:
1. Go to https://validator.schema.org/
2. Paste your home page URL
3. Verify zero errors and zero warnings

---

## 10. Acceptance Criteria

- [ ] `lib/seo/constants.ts` created with all author/company data
- [ ] `components/seo/JsonLd.tsx` created with proper escaping (`<` → `\u003c`)
- [ ] All 6 schema builder files created in `lib/seo/schemas/`
- [ ] `lib/seo/schemas/faq-content.ts` created with all 10 Thai FAQ items
- [ ] Each builder function returns a plain object (not a string)
- [ ] Home page injects: Organization + WebSite + Person + FAQPage
- [ ] `/services` injects: Organization + 4 × Service
- [ ] `/tools/project-estimation` injects SoftwareApplication
- [ ] `/tools/timeline-planner` injects SoftwareApplication
- [ ] `/contact` injects Organization (ContactPoint emphasis)
- [ ] `/about` injects Person (extended)
- [ ] Legal pages (`/privacy`, `/disclaimer`) do NOT inject schemas
- [ ] `npm run build` completes with zero errors
- [ ] `out/index.html` contains at least 4 `<script type="application/ld+json">` tags
- [ ] All JSON in script tags is valid (passes `JSON.parse`)
- [ ] No TypeScript errors
- [ ] No new dependencies installed (use only built-in React + Next.js)
- [ ] Existing pages still render correctly (no regression)

---

## 11. Suggested Build Order

1. `lib/seo/constants.ts` — foundation
2. `components/seo/JsonLd.tsx` — the renderer
3. `lib/seo/schemas/faq-content.ts` — FAQ data
4. All 6 schema builder files
5. Wire up Home page (`app/page.tsx`) — biggest schema set, validate first
6. Wire up `/services` and tool pages
7. Wire up `/about` and `/contact`
8. Run validations from Section 9
9. Deploy and run Google Rich Results Test on production

---

## 12. Out of Scope (DO NOT BUILD)

- ❌ Breadcrumb schemas (add later when site has deep hierarchy)
- ❌ Article schemas (no blog yet)
- ❌ Review/Rating schemas (no reviews collected yet — adding fake ones violates Google's policy)
- ❌ Event schemas
- ❌ Video schemas
- ❌ Product schemas (services are not products)
- ❌ HowTo schemas (different content type)
- ❌ Job posting schemas
- ❌ Local Business schema (no physical location)

These can be added in a future iteration once the underlying content exists.

---

## 13. Things to Watch Out For

1. **Don't fake ratings or reviews.** Google penalizes sites that add AggregateRating without verifiable reviews. We will add Rating schemas only when real customer reviews exist.

2. **Profile image URL expires.** The LinkedIn-hosted image URL has signed expiration parameters. Download the image and host it on our own server at `/profile/soranon.png` for long-term reliability. The constants file references this path as primary; ensure the file actually exists in `/public/profile/` before deploying.

3. **Logo file.** Schema requires a logo image. Ensure `/public/logo.png` exists at minimum 512×512 PNG with the company branding. If not, the Organization schema will fail validation.

4. **Don't add SearchAction yet.** We removed it because the site doesn't have an actual search route. Adding a fake search URL gets the schema flagged.

5. **Avoid duplicate `@id` values.** Each `@id` must be unique across all schemas on a page. We use these conventions:
   - `${SITE_URL}#organization`
   - `${SITE_URL}#person`
   - `${SITE_URL}#website`
   - `${SITE_URL}/services#{slug}`
   - `${page.url}#software`

6. **Keep FAQ answers under 500 characters each.** Google may truncate longer answers in rich results.

7. **TypeScript strictness.** Use `as const` on returned objects so TypeScript infers literal types — helps prevent typos in schema keys.

---

**End of Specification.**

Built for: softwarepmtools.com
Spec version: 1.0
Date: 2026-05-16
