import { PageHero } from "@/src/components/marketing/PageHero";
import { Section } from "@/src/components/ui/Section";
import { TimelinePlanner } from "@/src/components/timeline/TimelinePlanner";
import { CtaSection } from "@/src/components/marketing/CtaSection";
import { JsonLd } from "@/src/components/seo/JsonLd";
import {
  buildMetadata,
  jsonLdGraph,
  organizationLd,
  softwareApplicationLd,
} from "@/src/lib/seo";

// Spec §16. Page is a server component so it can export metadata; the
// interactive tool lives in the <TimelinePlanner /> client component.
export const metadata = buildMetadata({
  absoluteTitle:
    "Timeline Planner - วางแผน Project Timeline พร้อม Gantt Chart ฟรี | Software PM Tools",
  description:
    "เครื่องมือวางแผน Timeline สำหรับ Software Project พร้อม Gantt Chart รวมวันหยุดไทย, Dependencies และ Export Excel/PDF ฟรี ไม่ต้องสมัครสมาชิก",
  path: "/tools/timeline-planner",
});

export default function TimelinePlannerPage() {
  return (
    <>
      <JsonLd data={jsonLdGraph([organizationLd(), softwareApplicationLd()])} />
      <PageHero
        eyebrow="Tool · ใช้งานได้แล้ว"
        title="Timeline Planner"
        description="วางแผน Project Timeline พร้อม Gantt Chart รวมวันหยุดไทยและ Dependencies ปรับแก้ได้ทันที และ Export เป็น Excel/PDF"
      />
      <Section>
        <TimelinePlanner />
      </Section>
      <CtaSection
        title="อยากให้ PM จริงช่วยรีวิวแผนงานก่อนเริ่มโปรเจกต์?"
        description="ส่งรายละเอียดโปรเจกต์ให้ทีมช่วยตรวจสอบ Timeline และความเสี่ยง"
      />
    </>
  );
}
