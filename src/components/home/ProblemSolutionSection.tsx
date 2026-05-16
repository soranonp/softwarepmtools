import Link from "next/link";
import { X, Check, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/src/components/ui/Section";

// Problem → Solution → CTA cards. Header reuses the site's <SectionHeading>
// (eyebrow=brand-600 uppercase, h2, muted subtitle) to keep heading
// hierarchy and visual consistency with the rest of the homepage.

interface ProblemSolution {
  problem: string;
  solutionTitle: string;
  solutionDescription: string;
  ctaText: string;
  ctaHref: string;
}

const problemSolutions: ProblemSolution[] = [
  {
    problem: "ไม่รู้ว่าควรใช้งบเท่าไหร่",
    solutionTitle: "Estimation Calculator",
    solutionDescription: "ประเมิน Man-day, Budget และ Timeline เบื้องต้นได้ฟรี",
    ctaText: "ลองคำนวณฟรี",
    ctaHref: "/tools/project-estimation",
  },
  {
    problem: "Requirement ยังไม่ชัด",
    solutionTitle: "SOW Ready Pack",
    solutionDescription: "บริการจัดทำ Scope ให้ชัดเจนก่อนเริ่มจ้าง Vendor",
    ctaText: "ดูบริการ",
    ctaHref: "/services#sow-ready-pack",
  },
  {
    problem: "กลัว Vendor ตีราคาแพงเกินจริง",
    solutionTitle: "Vendor Proposal Review",
    solutionDescription:
      "ตรวจสอบความสมเหตุสมผลของ Proposal โดยผู้เชี่ยวชาญ",
    ctaText: "ดูบริการ",
    ctaHref: "/services#vendor-review",
  },
  {
    problem: "Scope บานระหว่างทาง",
    solutionTitle: "PM-as-a-Service",
    solutionDescription:
      "PM มืออาชีพดูแลตลอดโปรเจกต์ ลดความเสี่ยงจาก scope creep",
    ctaText: "ดูบริการ",
    ctaHref: "/services#pm-as-a-service",
  },
  {
    problem: "ไม่มี SOW หรือ Acceptance Criteria ที่ชัดเจน",
    solutionTitle: "SOW Ready Pack",
    solutionDescription: "Template SOW + Checklist + AC ที่ใช้งานได้จริง",
    ctaText: "ดูบริการ",
    ctaHref: "/services#sow-ready-pack",
  },
  {
    problem: "ไม่รู้ Timeline ที่ Vendor เสนอสมจริงหรือไม่",
    solutionTitle: "Timeline Planner",
    solutionDescription: "วางแผน Timeline พร้อม Gantt Chart รวมวันหยุดไทย",
    ctaText: "ลองใช้ฟรี",
    ctaHref: "/tools/timeline-planner",
  },
];

export default function ProblemSolutionSection() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="ปัญหาที่พบบ่อย"
        title="เริ่ม Software Project ทั้งที ไม่ควรเดา"
        description="6 ปัญหาที่ IT PM และเจ้าของธุรกิจเจอบ่อย — พร้อมเครื่องมือและบริการที่ช่วยแก้ได้"
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {problemSolutions.map((item, idx) => (
          <article
            key={idx}
            className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-brand-200 hover:shadow-lg"
          >
            {/* Problem */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50">
                <X className="h-4 w-4 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold leading-tight text-navy-900">
                {item.problem}
              </h3>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-gray-100" />

            {/* Solution (flex-1 pushes CTA to the bottom for row alignment) */}
            <div className="flex flex-1 items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50">
                <Check
                  className="h-4 w-4 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900">
                  {item.solutionTitle}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {item.solutionDescription}
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={item.ctaHref}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              {item.ctaText}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}
