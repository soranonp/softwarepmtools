import { Section, SectionHeading } from "@/src/components/ui/Section";
import { ButtonLink } from "@/src/components/ui/Button";

export function CtaSection({
  title = "พร้อมประเมินโปรเจกต์ของคุณแล้วหรือยัง?",
  description = "เริ่มจากการประเมินฟรี แล้วให้ทีม PM ช่วยตรวจสอบความสมเหตุสมผลก่อนเริ่มจ้าง Vendor",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Section tone="navy">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading title={title} description={description} invert />
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <ButtonLink
            href="/tools/project-estimation"
            variant="white"
            size="lg"
          >
            เริ่มประเมินฟรี
          </ButtonLink>
          <ButtonLink href="/services" variant="ghost" size="lg" className="text-brand-100 hover:text-white">
            ดูบริการ Consulting
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
