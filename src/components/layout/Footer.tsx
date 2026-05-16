import Link from "next/link";
import { NAV, TOOLS_NAV, SITE, LEAD_CTAS, LEAD_COPY } from "@/src/lib/content";
import { Container } from "@/src/components/ui/Container";
import { ButtonLink } from "@/src/components/ui/Button";

const LEGAL = [
  { label: "ข้อจำกัดความรับผิดชอบ", href: "/disclaimer" },
  { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      <div className="bg-grid-dark absolute inset-0" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"
        aria-hidden
      />
      <Container className="relative py-14">
        <div className="mb-12 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-xl text-sm leading-7 text-brand-100">
            {LEAD_COPY.proposal}
          </p>
          <ButtonLink
            href={SITE.googleFormUrl}
            external
            variant="white"
            className="shrink-0"
          >
            {LEAD_CTAS.contactProject}
          </ButtonLink>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <span className="grid grid-cols-2 gap-[3px]">
                  <span className="h-1.5 w-1.5 rounded-[2px] bg-brand-500" />
                  <span className="h-1.5 w-1.5 rounded-[2px] bg-white/30" />
                  <span className="h-1.5 w-1.5 rounded-[2px] bg-white/30" />
                  <span className="h-1.5 w-1.5 rounded-[2px] bg-brand-500" />
                </span>
              </span>
              <p className="text-lg font-bold">{SITE.name}</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-brand-100">
              {SITE.tagline}
            </p>
            <p className="mt-4 inline-flex rounded-md bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-100 ring-1 ring-white/10 ring-inset">
              ออกแบบจากมุมมอง Software Project Management
            </p>
            <p className="mt-5 text-sm text-brand-100">{SITE.email}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">เครื่องมือ</p>
            <ul className="mt-4 space-y-2.5">
              {TOOLS_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-100 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">เมนู</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-100 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">ข้อกำหนด</p>
            <ul className="mt-4 space-y-2.5">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-100 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-brand-100 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {SITE.name}. สงวนลิขสิทธิ์
          </span>
          <span>
            ผลประเมินเป็นค่าประมาณการเบื้องต้น ไม่ใช่ใบเสนอราคา
          </span>
        </div>
      </Container>
    </footer>
  );
}
