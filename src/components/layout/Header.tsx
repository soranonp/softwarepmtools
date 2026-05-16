"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, PRIMARY_CTA, SITE } from "@/src/lib/content";
import { ButtonLink } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { cn } from "@/src/lib/cn";

function LogoMark() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
      <span className="grid grid-cols-2 gap-[3px]">
        <span className="h-1.5 w-1.5 rounded-[2px] bg-brand-500" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-white/40" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-white/40" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-brand-500" />
      </span>
    </span>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-navy-900">
          {SITE.name}
        </span>
        <span className="mt-0.5 text-[11px] font-medium text-faint">
          Software Project Planning Toolkit
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      {/* Trust utility bar */}
      <div className="hidden bg-navy-900 text-white lg:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <span className="text-brand-100">
            ใช้สำหรับประเมินเบื้องต้นก่อนคุยกับ Vendor
          </span>
          <span className="text-brand-100">
            เหมาะสำหรับ PM, BA, Founder และทีม IT
          </span>
        </Container>
      </div>

      <div className="border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted hover:bg-surface hover:text-navy-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <ButtonLink href={PRIMARY_CTA.href}>
              {PRIMARY_CTA.label}
            </ButtonLink>
          </div>

          <button
            type="button"
            aria-label="เปิดเมนู"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 ring-1 ring-line lg:hidden"
          >
            <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </Container>

        {open && (
          <div className="border-t border-line bg-white lg:hidden">
            <Container className="flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-900 hover:bg-surface"
                >
                  {item.label}
                </Link>
              ))}
              <ButtonLink href={PRIMARY_CTA.href} className="mt-2" size="lg">
                {PRIMARY_CTA.label}
              </ButtonLink>
            </Container>
          </div>
        )}
      </div>
    </header>
  );
}
