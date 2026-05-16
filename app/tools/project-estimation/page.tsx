import Link from "next/link";
import { PageHero } from "@/src/components/marketing/PageHero";
import { Section } from "@/src/components/ui/Section";
import { EstimationCalculator } from "@/src/components/calculator/EstimationCalculator";
import { CtaSection } from "@/src/components/marketing/CtaSection";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { buildMetadata } from "@/src/lib/seo";
import { buildEstimationCalculatorSchema } from "@/src/lib/seo/schemas/software-apps";

export const metadata = buildMetadata({
  absoluteTitle:
    "ประเมินราคาทำ Software ฟรี | Software Project Estimation Calculator",
  description:
    "คำนวณ Man-day, Budget, Timeline และ Risk เบื้องต้นสำหรับ Web App, Mobile App, Backoffice, Power Platform และ API Integration ก่อนเริ่มคุยกับ Vendor",
  path: "/tools/project-estimation",
});

export default function ProjectEstimationPage() {
  return (
    <>
      <JsonLd data={buildEstimationCalculatorSchema()} />
      <PageHero
        eyebrow="Tool · ใช้งานได้แล้ว"
        title="Software Project Estimation Calculator"
        description="ประเมิน Man-day งบประมาณ Timeline และความเสี่ยงของโปรเจกต์เบื้องต้น เพื่อใช้ตั้งต้นวางแผนและเจรจากับ Vendor"
      />
      <Section>
        <EstimationCalculator />
        <p className="mt-8 max-w-3xl text-sm leading-7 text-muted">
          หมายเหตุ: ผลลัพธ์เป็นการประเมินเชิงตัวเลขตามอัตราตลาดโดยเฉลี่ย
          ใช้เพื่อการวางแผนเบื้องต้นเท่านั้น ไม่ใช่ใบเสนอราคา
          ตัวเลขจริงขึ้นกับ Requirement ทีมงาน และเงื่อนไขสัญญา
          อ่านเพิ่มเติมใน{" "}
          <Link href="/disclaimer" className="font-semibold text-brand-600">
            ข้อจำกัดความรับผิดชอบ
          </Link>
        </p>
      </Section>
      <CtaSection
        title="อยากได้ตัวเลขที่ผ่านการรีวิวโดย PM จริง?"
        description="ส่งรายละเอียดโปรเจกต์ให้ทีมช่วยตรวจสอบความสมเหตุสมผลก่อนตัดสินใจ"
      />
    </>
  );
}
