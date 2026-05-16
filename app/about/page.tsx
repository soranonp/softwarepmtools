import { PageHero } from "@/src/components/marketing/PageHero";
import { Section, SectionHeading } from "@/src/components/ui/Section";
import { Card } from "@/src/components/ui/Card";
import { CtaSection } from "@/src/components/marketing/CtaSection";
import { buildMetadata } from "@/src/lib/seo";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { buildPersonSchema } from "@/src/lib/seo/schemas/person";

export const metadata = buildMetadata({
  title: "เกี่ยวกับเรา",
  description:
    "Software PM Tools คือ Thai-first toolkit สำหรับประเมินและวางแผน Software Project ก่อนเริ่มจ้าง Vendor ในประเทศไทย",
  path: "/about",
});

const PRINCIPLES = [
  {
    title: "ตัวเลขก่อนความรู้สึก",
    desc: "ทุกการตัดสินใจเรื่องงบและเวลาควรมีตัวเลขตั้งต้นที่อธิบายได้",
  },
  {
    title: "โปร่งใส ตรวจสอบได้",
    desc: "ตรรกะการประเมินเปิดเผยชัดเจน ไม่ใช่กล่องดำ",
  },
  {
    title: "เข้าใจบริบทไทย",
    desc: "ออกแบบสำหรับ SME และองค์กรไทยที่ต้องจ้าง Vendor พัฒนาซอฟต์แวร์",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <PageHero
        eyebrow="เกี่ยวกับเรา"
        title="เครื่องมือและที่ปรึกษาสำหรับงาน Software Project"
        description="เราช่วยให้ทีมและเจ้าของธุรกิจวางแผนโปรเจกต์ซอฟต์แวร์ได้อย่างมั่นใจ ตั้งแต่ก่อนเริ่มจ้าง Vendor"
      />
      <Section>
        <div className="max-w-3xl space-y-5 text-base leading-8 text-muted">
          <p>
            Software PM Tools เกิดจากปัญหาที่พบซ้ำ ๆ ในโปรเจกต์ซอฟต์แวร์ของ
            องค์กรไทย — เริ่มงานโดยไม่มีตัวเลขตั้งต้น Requirement ไม่ชัด
            และไม่มีเอกสารที่ใช้ต่อรองกับ Vendor ได้จริง
          </p>
          <p>
            เราจึงสร้างชุดเครื่องมือที่ช่วยประเมินและวางแผนโปรเจกต์
            พร้อมบริการที่ปรึกษาโดย Project Manager ที่มีประสบการณ์จริง
            เพื่อให้การลงทุนด้านซอฟต์แวร์ของคุณคุ้มค่าและความเสี่ยงต่ำลง
          </p>
        </div>
      </Section>
      <Section tone="surface">
        <SectionHeading title="แนวคิดการทำงาน" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <Card key={p.title}>
              <h3 className="text-base font-bold text-navy-900">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted">{p.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
      <CtaSection />
    </>
  );
}
