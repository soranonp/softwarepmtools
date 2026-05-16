import { PageHero } from "@/src/components/marketing/PageHero";
import { Section } from "@/src/components/ui/Section";
import { SITE } from "@/src/lib/content";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "ข้อจำกัดความรับผิดชอบ",
  description:
    "ข้อจำกัดความรับผิดชอบเกี่ยวกับผลการประเมินจากเครื่องมือของ Software PM Tools",
  path: "/disclaimer",
});

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "1. ลักษณะของผลประเมิน",
    p: [
      "ผลลัพธ์จากเครื่องมือประเมินโปรเจกต์เป็นการคำนวณเชิงตัวเลขโดยอ้างอิงจากสมมุติฐานและอัตราตลาดโดยเฉลี่ย มีวัตถุประสงค์เพื่อช่วยวางแผนเบื้องต้นเท่านั้น",
      "ผลลัพธ์ดังกล่าวไม่ใช่ใบเสนอราคา ไม่ใช่ข้อผูกพันทางสัญญา และไม่สามารถใช้แทนการประเมินโดยผู้เชี่ยวชาญหรือการเจรจากับผู้พัฒนาจริง",
    ],
  },
  {
    h: "2. ความถูกต้องของข้อมูล",
    p: [
      "ตัวเลขจริงของแต่ละโปรเจกต์ขึ้นอยู่กับ Requirement ที่ชัดเจน ความสามารถของทีมงาน เทคโนโลยีที่เลือกใช้ และเงื่อนไขสัญญา ซึ่งอาจแตกต่างจากผลประเมินอย่างมีนัยสำคัญ",
      "ผู้ใช้ควรใช้วิจารณญาณและตรวจสอบข้อมูลกับผู้เชี่ยวชาญก่อนตัดสินใจลงทุนหรือทำสัญญา",
    ],
  },
  {
    h: "3. การจำกัดความรับผิด",
    p: [
      `${SITE.name} ไม่รับผิดชอบต่อความเสียหายใด ๆ ที่เกิดจากการนำผลประเมินไปใช้ในการตัดสินใจทางธุรกิจหรือทางการเงิน`,
    ],
  },
  {
    h: "4. การเปลี่ยนแปลง",
    p: [
      "เราอาจปรับปรุงตรรกะการคำนวณ อัตราอ้างอิง และเนื้อหาบนเว็บไซต์ได้ตลอดเวลาโดยไม่ต้องแจ้งล่วงหน้า",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="ข้อกำหนด"
        title="ข้อจำกัดความรับผิดชอบ"
        description="โปรดอ่านก่อนนำผลประเมินไปใช้ในการตัดสินใจ"
      />
      <Section>
        <div className="max-w-3xl space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="text-lg font-bold text-navy-900">{s.h}</h2>
              {s.p.map((para, i) => (
                <p
                  key={i}
                  className="mt-3 text-base leading-8 text-muted"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
