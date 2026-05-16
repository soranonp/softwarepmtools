import { PageHero } from "@/src/components/marketing/PageHero";
import { Section } from "@/src/components/ui/Section";
import { Card } from "@/src/components/ui/Card";
import { ButtonLink } from "@/src/components/ui/Button";
import { ContactForm } from "@/src/components/contact/ContactForm";
import { LeadCtaSection } from "@/src/components/marketing/LeadCtaSection";
import { SITE, LEAD_COPY } from "@/src/lib/content";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "ติดต่อเรา",
  description:
    "ติดต่อทีม Software PM Tools เพื่อปรึกษาบริการประเมินราคา Software, รับทำ SOW และ PM-as-a-Service",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="ติดต่อ"
        title="ปรึกษาโปรเจกต์ของคุณกับทีม PM"
        description="กรอกรายละเอียดเบื้องต้น แล้วทีมจะติดต่อกลับเพื่อพูดคุยแนวทางที่เหมาะสม"
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div className="space-y-5">
            <Card>
              <h2 className="text-base font-bold text-navy-900">
                ช่องทางติดต่อ
              </h2>
              <p className="mt-3 text-sm text-muted">อีเมล</p>
              <p className="text-sm font-semibold text-navy-900">
                {SITE.email}
              </p>
              <div className="mt-5">
                <ButtonLink
                  href={SITE.googleFormUrl}
                  external
                  variant="secondary"
                >
                  เปิดแบบฟอร์ม Google Form
                </ButtonLink>
              </div>
            </Card>
            <Card className="bg-surface">
              <h2 className="text-base font-bold text-navy-900">
                ก่อนติดต่อ
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                ลองใช้เครื่องมือประเมินโปรเจกต์ก่อน
                เพื่อให้การพูดคุยมีตัวเลขตั้งต้นที่ชัดเจนขึ้น
              </p>
              <div className="mt-4">
                <ButtonLink href="/tools/project-estimation">
                  เริ่มประเมินฟรี
                </ButtonLink>
              </div>
            </Card>
          </div>
        </div>
      </Section>
      <LeadCtaSection
        tone="navy"
        headline={LEAD_COPY.scope}
        buttons={[
          "contactProject",
          "quickEstimate",
          "sowReady",
          "proposalReview",
          "reviewScope",
        ]}
      />
    </>
  );
}
