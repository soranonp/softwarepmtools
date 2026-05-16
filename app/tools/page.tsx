import { PageHero } from "@/src/components/marketing/PageHero";
import { Section } from "@/src/components/ui/Section";
import { Container } from "@/src/components/ui/Container";
import { ToolsHub } from "@/src/components/marketing/ToolsHub";
import { CtaSection } from "@/src/components/marketing/CtaSection";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { TOOL_CATEGORIES } from "@/src/lib/content";
import { buildMetadata } from "@/src/lib/seo";
import { buildOrganizationSchema } from "@/src/lib/seo/schemas/organization";

export const metadata = buildMetadata({
  title: "Tools Hub — เครื่องมือสำหรับ IT PM, BA และเจ้าของธุรกิจ",
  description:
    "ศูนย์รวมเครื่องมือ Software Project Management: ประเมินราคา Software, วางแผน Timeline, ทำ SOW, Requirement Breakdown, UAT, RAID Log และตรวจ Proposal Vendor",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <PageHero
        eyebrow="Tools Hub"
        title="ชุดเครื่องมือสำหรับงาน Software Project Management"
        description="แบ่งตามขั้นตอนการทำงานจริง ตั้งแต่ประเมินและวางแผน ทำขอบเขตงาน ไปจนถึงควบคุมการส่งมอบ — เริ่มใช้ตัวที่พร้อมแล้ว ส่วนที่เหลือกำลังทยอยเปิด"
      />

      {/* Category quick-nav — helps users and crawlers see the structure */}
      <div className="border-b border-line bg-surface">
        <Container className="flex flex-wrap gap-2 py-4">
          {TOOL_CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-navy-900 ring-1 ring-line ring-inset transition-colors hover:text-brand-700 hover:ring-brand-100"
            >
              {c.name}
            </a>
          ))}
        </Container>
      </div>

      <Section>
        <ToolsHub />
      </Section>
      <CtaSection />
    </>
  );
}
