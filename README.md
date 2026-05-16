# Software PM Tools

A **Thai-first** B2B toolkit that helps software teams and business owners **estimate and plan software projects before hiring a vendor**.

The platform focuses on four practical problem areas:

- **Software project estimation** — Man-day, budget, timeline, and risk
- **SOW preparation** — turning scope into a contract-ready Statement of Work
- **Requirement breakdown** — making scope explicit and estimable
- **Vendor proposal review** — sanity-checking vendor quotes before signing

> Live domain: **[softwarepmtools.com](https://softwarepmtools.com)**

---

## 1. Project Overview

Software PM Tools is a clean, enterprise-grade web platform for the Thai market. Its first shipped tool is the **Software Project Estimation Calculator**: it turns a few inputs (project type, features, roles, complexity, integration, reporting, budget) into a transparent, rule-based estimate of effort, cost, timeline, and risk.

The site is intentionally **Thai-first** (UI copy in Thai with English IT terms where natural) and styled as a serious consulting-grade tool hub — not a toy calculator.

## 2. Domain

`softwarepmtools.com`

Used as the canonical base for SEO metadata, sitemap, robots, and structured data.

## 3. Business Objective

The website is **not just a free calculator** — it is a **lead-generation platform** for freelance and consulting services around software project management:

1. Software project estimation
2. Scope review
3. SOW preparation
4. Requirement breakdown
5. Vendor proposal review
6. PM-as-a-Service

The free tools build trust and traffic; the consulting packages convert that intent. Lead capture is currently handled via a **Google Form** (no backend in this version).

## 4. Target Users

- IT Project Managers
- Business Analysts
- Product Owners
- SME business owners
- Startup founders
- IT managers
- Companies planning to hire software vendors in Thailand

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| Font | Noto Sans Thai (`next/font/google`, Thai + Latin) |
| SEO | App Router Metadata API, JSON-LD, generated OG image |
| Backend | None (no login, no database in this version) |
| Lead capture | Google Form (external) |
| Hosting | Vercel (recommended) |

No backend, database, or authentication is used in the current MVP. Calculator logic runs entirely client-side; all marketing pages are statically prerendered.

### Project structure

```
app/                       # App Router routes
  layout.tsx               # Root layout, fonts, base metadata, Header/Footer
  page.tsx                 # Home
  tools/                   # Tools hub + project-estimation calculator
  services/ about/ contact/ disclaimer/ privacy/
  sitemap.ts robots.ts opengraph-image.tsx
src/
  lib/
    estimation.ts          # Pure estimation engine (no React)
    content.ts             # Single source of truth for Thai copy & config
    seo.ts                 # buildMetadata() + JSON-LD builders
    cn.ts                  # className helper
  types/estimation.ts      # Strongly-typed calculator domain types
  components/              # ui / layout / marketing / calculator / contact / seo
```

## 6. Current MVP Features

- **Software Project Estimation Calculator** (live) — full form + transparent result panel: total Man-day, budget range, timeline, risk level, Man-day breakdown, role breakdown, scope warning, recommended service package, and an available-vs-estimated budget check.
- **Tools Hub** (`/tools`) — 10 tools across 3 categories (Estimation & Planning, Requirement & Scope, Delivery & Control). Only the estimation calculator is live; the rest are "Coming Soon" with interest capture.
- **Services** (`/services`) — 4 consulting packages (Quick Estimate Review, SOW Ready Pack, Vendor Proposal Review, PM-as-a-Service) with starting prices, comparison table, recommendation logic, and FAQ.
- **Marketing pages** — Home, About, Contact (UI-only lead form + Google Form), Disclaimer, Privacy.
- **Lead capture** — Google Form CTAs across the result panel, services, home, contact, and footer (open in a new tab with `rel="noopener noreferrer"`).
- **SEO** — per-page metadata, canonical URLs, OpenGraph + Twitter cards, sitemap, robots, JSON-LD (`Organization`, `WebSite`, `ProfessionalService`, `SoftwareApplication`, `FAQPage`, `ItemList`), and a generated OG image.

## 7. Calculator Logic Summary

A deterministic, transparent rule-based model — no AI, no black box. All constants live at the top of `src/lib/estimation.ts`.

**Base man-days by project type:** Simple Website 20 · Web App 60 · Mobile App 80 · Backoffice 70 · Power Platform 45 · API Integration 50 · Enterprise Workflow 90

**Effort build-up:**

```
Total MD = ( Base MD
           + (Features × 5)
           + (Roles × 3)
           + Report effort )           # None 0 / Basic 10 / Advanced 25
           × Complexity multiplier      # Simple 1.0 / Medium 1.5 / Complex 2.2
           × Integration multiplier     # None 1.0 / Basic API 1.2 / Payment·Email·LINE 1.3 / ERP·SAP·Core 1.6
```

**Budget:** `Total MD × 9,500 THB × 1.2` (blended day-rate + 20% contingency)
Range → Conservative ×0.85 · Expected ×1.0 · High Complexity ×1.25

**Timeline (by Total MD):** `<50` 1–2 months · `50–120` 2–4 · `121–250` 4–6 · `>250` 6–10

**Risk:** Complex *or* ERP/SAP/Core → High · else MD > 120 → Medium-High · else MD < 80 → Medium · otherwise Low-Medium

**Recommended package (by estimated budget):** `<300k` Quick Estimate Review · `300k–1.5M` SOW Ready Pack · `>1.5M` Vendor Proposal Review + PM-as-a-Service

**Role breakdown:** PM 12% · BA 14% · SA 10% · Developer 42% · QA 17% · DevOps 5%

**Budget check:** available budget below the Conservative estimate, within range, or above the High-Complexity estimate — each with a Thai explanation.

## 8. Local Development Setup

**Prerequisites:** Node.js 20+ and npm.

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Run the production build locally
npm run start

# Lint
npm run lint
```

## 9. Environment Variables

The current MVP requires **no environment variables** — it has no backend, no secrets, and the Google Form URL is configured in `src/lib/content.ts` (`SITE.googleFormUrl`).

Before launch, replace the placeholder:

```ts
// src/lib/content.ts
export const SITE = {
  // ...
  googleFormUrl: "https://forms.gle/REPLACE_WITH_REAL_FORM_URL", // ← replace
};
```

**Recommended for future iterations** (optional — not yet wired):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Override the canonical/SEO base URL per environment |
| `NEXT_PUBLIC_GOOGLE_FORM_URL` | Move the lead-capture form URL out of source |

## 10. Deployment on Vercel

The app is a standard Next.js App Router project and deploys to Vercel with zero configuration.

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel, **Import Project** and select the repo.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`; output handled automatically.
4. Add any environment variables (none required today).
5. Deploy, then point the `softwarepmtools.com` domain at the Vercel project.

All marketing pages are statically prerendered; the calculator is a client component, so the app is fast and cache-friendly with no server runtime cost for core flows.

## 11. Roadmap

Planned tools (currently "Coming Soon" on `/tools`):

- **Estimation & Planning:** Timeline Planner, Team Role Breakdown Calculator
- **Requirement & Scope:** SOW Generator, Requirement Breakdown Tool, Acceptance Criteria Generator
- **Delivery & Control:** UAT Test Case Generator, RAID Log Generator, Steering Report Generator, Vendor Proposal Review Checklist

Platform direction:

- Optional backend (e.g. Supabase) for saved estimates and real lead capture
- AI-assisted requirement breakdown and SOW drafting
- Account area for returning consulting clients

## 12. Disclaimer

The estimation output is an **indicative, rule-based approximation** based on average market assumptions, intended for early-stage planning and negotiation. **It is not a quotation, not a contractual commitment, and not a substitute for expert review.** Actual figures depend on finalized requirements, team capability, technology choices, and contract terms. Always validate with a qualified Project Manager before making investment or contractual decisions. See the in-app **Disclaimer** and **Privacy Policy** pages for full terms.
