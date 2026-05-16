import { Section, SectionHeading } from "@/src/components/ui/Section";
import { Container } from "@/src/components/ui/Container";
import { Card } from "@/src/components/ui/Card";
import { ButtonLink } from "@/src/components/ui/Button";
import { ToolsGrid } from "@/src/components/marketing/ToolsGrid";
import { ServicePackages } from "@/src/components/marketing/ServicePackages";
import { FaqList } from "@/src/components/marketing/FaqList";
import { LeadCtaSection } from "@/src/components/marketing/LeadCtaSection";
import { EstimatePreviewCard } from "@/src/components/marketing/EstimatePreviewCard";
import ProblemSolutionSection from "@/src/components/home/ProblemSolutionSection";
import {
  HERO,
  CAPABILITIES,
  TRUST_POINTS,
  LEAD_COPY,
} from "@/src/lib/content";
import { estimateProject, formatTHB } from "@/src/lib/estimation";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { buildMetadata } from "@/src/lib/seo";
import { buildOrganizationSchema } from "@/src/lib/seo/schemas/organization";
import { buildWebSiteSchema } from "@/src/lib/seo/schemas/website";
import { buildPersonSchema } from "@/src/lib/seo/schemas/person";
import { buildFaqSchema } from "@/src/lib/seo/schemas/faq";

export const metadata = buildMetadata({
  absoluteTitle:
    "Software PM Tools | ประเมินราคา Software, Man-day และ Timeline ฟรี",
  description:
    "เครื่องมือช่วย IT PM, BA, Founder และเจ้าของธุรกิจ ประเมินงบประมาณ Man-day Timeline และ Scope ก่อนเริ่มจ้างทำ Software, Web App, Mobile App หรือระบบองค์กร",
  path: "/",
});

const SAMPLE = estimateProject({
  projectType: "web_app",
  mainFeatures: 12,
  userRoles: 3,
  complexity: "medium",
  integration: "payment_email_line",
  reportLevel: "basic",
  availableBudget: 0,
});

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

      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-100 to-transparent"
          aria-hidden
        />
        <Container className="relative py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-100 ring-inset">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                สำหรับ IT PM · BA · เจ้าของธุรกิจ · ทีมพัฒนา
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
                {HERO.headline}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted">
                {HERO.subheadline}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={HERO.primaryCta.href} size="lg">
                  {HERO.primaryCta.label}
                </ButtonLink>
                <ButtonLink
                  href={HERO.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                >
                  {HERO.secondaryCta.label}
                </ButtonLink>
              </div>
              <ul className="mt-9 grid gap-2.5 sm:grid-cols-2">
                {TRUST_POINTS.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 text-sm text-navy-800"
                  >
                    <span className="mt-0.5 font-bold text-brand-600">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pl-6">
              <EstimatePreviewCard result={SAMPLE} />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Problem → Solution → CTA */}
      <ProblemSolutionSection />

      {/* 3. What it helps with */}
      <Section>
        <SectionHeading
          eyebrow="Software PM Tools ช่วยอะไร"
          title="เปลี่ยนการเดา ให้เป็นการวางแผนที่มีตัวเลขรองรับ"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <Card key={c.title}>
              <h3 className="text-base font-bold text-navy-900">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted">{c.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 4. Tools preview */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Tools"
          title="ชุดเครื่องมือสำหรับงาน PM ซอฟต์แวร์"
          description="เริ่มจากเครื่องมือประเมินโปรเจกต์ และจะทยอยเปิดเครื่องมืออื่นเพิ่ม"
        />
        <div className="mt-10">
          <ToolsGrid />
        </div>
        <div className="mt-8">
          <ButtonLink href="/tools" variant="secondary">
            ดู Tools ทั้งหมด
          </ButtonLink>
        </div>
      </Section>

      {/* 5. Example estimation result preview */}
      <Section>
        <SectionHeading
          eyebrow="ตัวอย่างผลลัพธ์"
          title="ผลประเมินที่คุณจะได้รับ"
          description="ตัวอย่าง: Web Application 12 ฟีเจอร์ 3 Role ความซับซ้อนปานกลาง"
        />
        <div className="mt-7 flex flex-wrap gap-2">
          {[
            "Web App",
            "12 Features",
            "3 Roles",
            "Complexity: Medium",
            "Integration: Payment/LINE",
          ].map((t) => (
            <span
              key={t}
              className="rounded-md bg-surface px-3 py-1 text-xs font-medium text-muted ring-1 ring-line ring-inset"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Man-day",
              value: `${SAMPLE.totalMD} MD`,
              sub: "รวมทุกบทบาทในทีม",
            },
            {
              label: "กรอบงบประมาณ",
              value: formatTHB(SAMPLE.budgetRange.conservative),
              sub: `ถึง ${formatTHB(SAMPLE.budgetRange.highComplexity)}`,
            },
            {
              label: "Timeline ที่แนะนำ",
              value: SAMPLE.timeline.label,
              sub: "ตามปริมาณงานรวม",
            },
            {
              label: "แพ็กเกจที่แนะนำ",
              value: SAMPLE.recommendedPackageLabel,
              sub: "ตามระดับงบประมาณ",
            },
          ].map((m) => (
            <Card
              key={m.label}
              elevated
              className="relative overflow-hidden p-6"
            >
              <span
                className="absolute inset-x-0 top-0 h-1 bg-brand-600"
                aria-hidden
              />
              <p className="text-sm text-muted">{m.label}</p>
              <p className="mt-2 text-xl font-bold text-navy-900">
                {m.value}
              </p>
              <p className="mt-1 text-xs text-faint">{m.sub}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/tools/project-estimation" size="lg">
            ลองประเมินโปรเจกต์ของคุณ
          </ButtonLink>
        </div>
      </Section>

      {/* 6. Service packages preview */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="บริการ Consulting"
          title="ให้ทีม PM ช่วยตรวจสอบและเตรียมงานให้พร้อม"
          description="ต่อยอดจากผลประเมิน ด้วยบริการที่ช่วยลดความเสี่ยงก่อนเริ่มจ้าง Vendor"
        />
        <div className="mt-10">
          <ServicePackages />
        </div>
        <div className="mt-8">
          <ButtonLink href="/services" variant="secondary">
            ดูรายละเอียดบริการ
          </ButtonLink>
        </div>
      </Section>

      {/* 7. FAQ */}
      <Section>
        <SectionHeading
          eyebrow="คำถามที่พบบ่อย"
          title="FAQ"
          align="center"
        />
        <div className="mt-10">
          <FaqList />
        </div>
      </Section>

      {/* 8. Final CTA — lead capture */}
      <LeadCtaSection
        tone="navy"
        headline={LEAD_COPY.proposal}
        buttons={["contactProject", "quickEstimate", "reviewScope"]}
      />
    </>
  );
}
