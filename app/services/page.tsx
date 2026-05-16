import { PageHero } from "@/src/components/marketing/PageHero";
import { Section, SectionHeading } from "@/src/components/ui/Section";
import { ServicePackages } from "@/src/components/marketing/ServicePackages";
import { ServiceComparison } from "@/src/components/marketing/ServiceComparison";
import { RecommendLogic } from "@/src/components/marketing/RecommendLogic";
import { FaqList } from "@/src/components/marketing/FaqList";
import { LeadCtaSection } from "@/src/components/marketing/LeadCtaSection";
import { LEAD_COPY, SERVICES_FAQ } from "@/src/lib/content";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { buildMetadata } from "@/src/lib/seo";
import { buildOrganizationSchema } from "@/src/lib/seo/schemas/organization";
import { buildAllServiceSchemas } from "@/src/lib/seo/schemas/services";

export const metadata = buildMetadata({
  title:
    "บริการ Consulting — รับทำ SOW, ตรวจ Proposal Vendor, PM-as-a-Service",
  description:
    "บริการที่ปรึกษาสำหรับ Software Project: Quick Estimate Review, SOW Ready Pack, Vendor Proposal Review และ PM-as-a-Service พร้อมราคาเริ่มต้นชัดเจน",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[buildOrganizationSchema(), ...buildAllServiceSchemas()]}
      />
      <PageHero
        eyebrow="บริการ Consulting"
        title="ลดความเสี่ยงของ Software Project ด้วยทีม PM มืออาชีพ"
        description="เลือกบริการตามสถานการณ์ของคุณ ตั้งแต่รีวิวงบประมาณเบื้องต้น เตรียมเอกสาร SOW ตรวจ Proposal Vendor ไปจนถึงมี PM ดูแลโครงการให้ต่อเนื่อง"
      />

      {/* Packages */}
      <Section>
        <SectionHeading
          eyebrow="แพ็กเกจบริการ"
          title="4 แพ็กเกจ สำหรับทุกช่วงของโครงการ"
          description="ราคาที่แสดงเป็นราคาเริ่มต้น ราคาจริงขึ้นกับขนาดและความซับซ้อนของโปรเจกต์ และจะยืนยันก่อนเริ่มงานเสมอ"
        />
        <div className="mt-10">
          <ServicePackages />
        </div>
      </Section>

      {/* Comparison table */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="เปรียบเทียบ"
          title="ตารางเปรียบเทียบแพ็กเกจ"
          description="ดูภาพรวมว่าแต่ละแพ็กเกจครอบคลุมงานส่วนไหนบ้าง"
        />
        <div className="mt-10">
          <ServiceComparison />
        </div>
      </Section>

      {/* Recommended package logic */}
      <Section>
        <SectionHeading
          eyebrow="เลือกแพ็กเกจไหนดี?"
          title="แนะนำแพ็กเกจตามสถานการณ์ของคุณ"
          description="หลักการเดียวกับที่เครื่องมือประเมินใช้แนะนำแพ็กเกจ — ยึดจากสถานะของโครงการและระดับงบประมาณ"
        />
        <div className="mt-10">
          <RecommendLogic />
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="คำถามที่พบบ่อย"
          title="FAQ เรื่องบริการ"
          align="center"
        />
        <div className="mt-10">
          <FaqList items={SERVICES_FAQ} />
        </div>
      </Section>

      {/* CTA to Google Form */}
      <LeadCtaSection
        tone="navy"
        headline={LEAD_COPY.proposal}
        buttons={[
          "quickEstimate",
          "sowReady",
          "proposalReview",
          "contactProject",
        ]}
      />
    </>
  );
}
