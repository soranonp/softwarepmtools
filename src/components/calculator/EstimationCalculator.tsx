"use client";

import { useState } from "react";
import { estimateProject, formatTHB } from "@/src/lib/estimation";
import {
  SITE,
  LEAD_CTAS,
  LEAD_COPY,
  LEAD_REASSURANCE,
} from "@/src/lib/content";
import type {
  EstimationInput,
  EstimationResult,
  RiskLevel,
} from "@/src/types/estimation";
import { Card, Badge } from "@/src/components/ui/Card";
import { Button, ButtonLink } from "@/src/components/ui/Button";

const PROJECT_TYPES: { value: EstimationInput["projectType"]; label: string }[] =
  [
    { value: "simple_website", label: "Simple Website" },
    { value: "web_app", label: "Web App" },
    { value: "mobile_app", label: "Mobile App" },
    { value: "backoffice", label: "Backoffice System" },
    { value: "power_platform", label: "Power Platform App" },
    { value: "api_integration", label: "API Integration" },
    { value: "enterprise_workflow", label: "Enterprise Workflow" },
  ];

const COMPLEXITY: { value: EstimationInput["complexity"]; label: string }[] = [
  { value: "simple", label: "Simple — งานมาตรฐาน ไม่ซับซ้อน" },
  { value: "medium", label: "Medium — มี business logic พอสมควร" },
  { value: "complex", label: "Complex — ซับซ้อน มีเงื่อนไขเฉพาะมาก" },
];

const INTEGRATION: {
  value: EstimationInput["integration"];
  label: string;
}[] = [
  { value: "none", label: "None — ไม่มีการเชื่อมต่อ" },
  { value: "basic_api", label: "Basic API" },
  { value: "payment_email_line", label: "Payment / Email / LINE" },
  { value: "erp_sap_core", label: "ERP / SAP / Core System" },
];

const REPORT: { value: EstimationInput["reportLevel"]; label: string }[] = [
  { value: "none", label: "None — ไม่มีรายงาน" },
  { value: "basic", label: "Basic — รายงานพื้นฐาน" },
  { value: "advanced", label: "Advanced — Dashboard / BI" },
];

const RISK_META: Record<
  RiskLevel,
  { label: string; tone: "success" | "warning" | "danger" }
> = {
  low_medium: { label: "Low–Medium", tone: "success" },
  medium: { label: "Medium", tone: "warning" },
  medium_high: { label: "Medium–High", tone: "warning" },
  high: { label: "High", tone: "danger" },
};

const BUDGET_FIT_TONE = {
  below: "danger",
  within: "success",
  buffer: "success",
} as const;

const DEFAULT_INPUT: EstimationInput = {
  projectType: "web_app",
  mainFeatures: 8,
  userRoles: 3,
  reportLevel: "basic",
  complexity: "medium",
  integration: "basic_api",
  availableBudget: 0,
};

const labelClass = "block text-sm font-semibold text-navy-900";
const controlClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-navy-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

export function EstimationCalculator() {
  const [input, setInput] = useState<EstimationInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<EstimationResult | null>(null);

  function update<K extends keyof EstimationInput>(
    key: K,
    value: EstimationInput[K],
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function num(value: string): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(estimateProject(input));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start"
      >
        <Card elevated>
          <div className="flex items-center gap-2">
            <span
              className="h-5 w-1 rounded-full bg-brand-600"
              aria-hidden
            />
            <h2 className="text-lg font-bold text-navy-900">
              รายละเอียดโปรเจกต์
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted">
            กรอกข้อมูลเท่าที่ทราบ ใช้สำหรับประเมินเบื้องต้นก่อนคุยกับ Vendor
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className={labelClass} htmlFor="projectType">
                ประเภทโปรเจกต์
              </label>
              <select
                id="projectType"
                className={controlClass}
                value={input.projectType}
                onChange={(e) =>
                  update(
                    "projectType",
                    e.target.value as EstimationInput["projectType"],
                  )
                }
              >
                {PROJECT_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="mainFeatures">
                  จำนวนฟีเจอร์หลัก
                </label>
                <input
                  id="mainFeatures"
                  type="number"
                  min={0}
                  className={controlClass}
                  value={input.mainFeatures}
                  onChange={(e) =>
                    update("mainFeatures", num(e.target.value))
                  }
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="userRoles">
                  จำนวน User Role
                </label>
                <input
                  id="userRoles"
                  type="number"
                  min={0}
                  className={controlClass}
                  value={input.userRoles}
                  onChange={(e) => update("userRoles", num(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="complexity">
                ระดับความซับซ้อน (Complexity)
              </label>
              <select
                id="complexity"
                className={controlClass}
                value={input.complexity}
                onChange={(e) =>
                  update(
                    "complexity",
                    e.target.value as EstimationInput["complexity"],
                  )
                }
              >
                {COMPLEXITY.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="integration">
                ระดับการเชื่อมต่อระบบ (Integration)
              </label>
              <select
                id="integration"
                className={controlClass}
                value={input.integration}
                onChange={(e) =>
                  update(
                    "integration",
                    e.target.value as EstimationInput["integration"],
                  )
                }
              >
                {INTEGRATION.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="reportLevel">
                ระดับรายงาน (Report)
              </label>
              <select
                id="reportLevel"
                className={controlClass}
                value={input.reportLevel}
                onChange={(e) =>
                  update(
                    "reportLevel",
                    e.target.value as EstimationInput["reportLevel"],
                  )
                }
              >
                {REPORT.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="availableBudget">
                งบประมาณที่ตั้งไว้ (บาท)
              </label>
              <input
                id="availableBudget"
                type="number"
                min={0}
                step={50000}
                placeholder="ไม่ระบุ = 0"
                className={controlClass}
                value={input.availableBudget || ""}
                onChange={(e) =>
                  update("availableBudget", num(e.target.value))
                }
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              คำนวณผลประเมิน
            </Button>
          </div>
        </Card>
      </form>

      {/* Result */}
      <div className="lg:col-span-3">
        {result ? (
          <ResultPanel result={result} />
        ) : (
          <Card className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold text-navy-900">
              ยังไม่มีผลประเมิน
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              กรอกรายละเอียดโปรเจกต์ทางด้านซ้าย แล้วกด
              &ldquo;คำนวณผลประเมิน&rdquo; เพื่อดูผลลัพธ์เบื้องต้น
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-4 w-1 rounded-full bg-brand-600" aria-hidden />
      <h3 className="text-base font-bold text-navy-900">{children}</h3>
    </div>
  );
}

function ResultPanel({ result }: { result: EstimationResult }) {
  const risk = RISK_META[result.riskLevel];
  const b = result.breakdown;

  return (
    <div className="space-y-5">
      <Card elevated className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-line bg-surface px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span
              className="h-5 w-1 rounded-full bg-brand-600"
              aria-hidden
            />
            <h2 className="text-lg font-bold text-navy-900">
              ผลประเมินเบื้องต้น
            </h2>
          </div>
          <Badge tone={risk.tone} dot>
            Risk: {risk.label}
          </Badge>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 text-white">
              <p className="text-sm text-brand-100">Total Man-day</p>
              <p className="mt-1 text-3xl font-bold">
                {result.totalMD}
                <span className="ml-1 text-base font-semibold text-brand-100">
                  MD
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-5">
              <p className="text-sm text-muted">Timeline ที่แนะนำ</p>
              <p className="mt-1 text-3xl font-bold text-navy-900">
                {result.timeline.label}
              </p>
            </div>
          </div>

          {/* Budget range — Expected emphasized */}
          <p className="mt-6 mb-3 text-sm font-semibold text-navy-900">
            กรอบงบประมาณ (THB)
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Conservative",
                value: result.budgetRange.conservative,
                sub: "ประเมินแบบระมัดระวัง",
                emph: false,
              },
              {
                label: "Expected",
                value: result.budgetRange.expected,
                sub: "ค่ากลาง · รวม Contingency 20%",
                emph: true,
              },
              {
                label: "High Complexity",
                value: result.budgetRange.highComplexity,
                sub: "เผื่อความซับซ้อนเพิ่ม",
                emph: false,
              },
            ].map((c) => (
              <div
                key={c.label}
                className={
                  c.emph
                    ? "rounded-xl border-2 border-brand-600 bg-brand-50 p-5"
                    : "rounded-xl border border-line bg-surface p-5"
                }
              >
                <p
                  className={
                    c.emph
                      ? "text-xs font-bold tracking-wide text-brand-700 uppercase"
                      : "text-xs font-semibold tracking-wide text-muted uppercase"
                  }
                >
                  {c.label}
                </p>
                <p className="mt-1.5 text-lg font-bold text-navy-900">
                  {formatTHB(c.value)}
                </p>
                <p className="mt-1 text-xs text-faint">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {result.budgetFit && (
        <Card
          className={
            result.budgetFit.status === "below"
              ? "border-red-200 bg-red-50"
              : "border-emerald-200 bg-emerald-50"
          }
        >
          <div className="flex items-start gap-3">
            <Badge tone={BUDGET_FIT_TONE[result.budgetFit.status]} dot>
              งบประมาณ
            </Badge>
            <p className="text-sm leading-7 font-medium text-navy-900">
              {result.budgetFit.message}
            </p>
          </div>
        </Card>
      )}

      <Card elevated>
        <SectionLabel>การคำนวณ Man-day</SectionLabel>
        <dl className="mt-4 divide-y divide-line text-sm">
          {[
            ["Base MD (ประเภทโปรเจกต์)", `${b.baseMD} MD`],
            ["Feature Effort", `${b.featureEffort} MD`],
            ["Role Effort", `${b.roleEffort} MD`],
            ["Report Effort", `${b.reportEffort} MD`],
            ["Complexity Multiplier", `× ${b.complexityMultiplier}`],
            ["Integration Multiplier", `× ${b.integrationMultiplier}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5">
              <dt className="text-muted">{k}</dt>
              <dd className="font-semibold text-navy-900">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between py-2.5">
            <dt className="font-semibold text-navy-900">Total MD</dt>
            <dd className="font-bold text-brand-700">
              {result.totalMD} MD
            </dd>
          </div>
        </dl>
      </Card>

      <Card elevated>
        <div className="flex items-center justify-between">
          <SectionLabel>การประเมินความเสี่ยง</SectionLabel>
          <Badge tone={risk.tone} dot>
            {risk.label}
          </Badge>
        </div>
        <p className="mt-3 text-sm leading-7 text-navy-800">
          {result.explanations.risk}
        </p>
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
          <span aria-hidden className="mt-0.5">
            ⚠
          </span>
          <span>
            <strong className="font-semibold">Scope Warning: </strong>
            {result.explanations.scopeWarning}
          </span>
        </div>
      </Card>

      <Card elevated>
        <SectionLabel>Role Breakdown</SectionLabel>
        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full ring-1 ring-line ring-inset">
          {result.roleBreakdown.map((r, i) => (
            <div
              key={r.role}
              className={i % 2 === 0 ? "bg-brand-600" : "bg-navy-700"}
              style={{ width: `${Math.round(r.percent * 100)}%` }}
              title={`${r.role} ${Math.round(r.percent * 100)}%`}
            />
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {result.roleBreakdown.map((r, i) => (
            <div key={r.role}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-navy-800">
                  <span
                    aria-hidden
                    className={
                      i % 2 === 0
                        ? "h-2.5 w-2.5 rounded-[3px] bg-brand-600"
                        : "h-2.5 w-2.5 rounded-[3px] bg-navy-700"
                    }
                  />
                  {r.role}
                </span>
                <span className="font-semibold text-navy-900">
                  {r.manDays} MD ({Math.round(r.percent * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card elevated>
        <SectionLabel>คำอธิบายผลประเมิน</SectionLabel>
        <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
          <p>
            <span className="font-semibold text-navy-900">งบประมาณ: </span>
            {result.explanations.budget}
          </p>
          <p>
            <span className="font-semibold text-navy-900">Timeline: </span>
            {result.explanations.timeline}
          </p>
        </div>
      </Card>

      <div className="relative overflow-hidden rounded-2xl border border-navy-800 bg-navy-900 p-6 text-white shadow-card sm:p-8">
        <div className="bg-grid-dark absolute inset-0" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
          aria-hidden
        />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15 ring-inset">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            แพ็กเกจบริการที่แนะนำ
          </span>
          <p className="mt-3 text-xl font-bold text-white">
            {result.recommendedPackageLabel}
          </p>
          <p className="mt-2 text-sm leading-7 text-brand-100">
            {result.explanations.recommendedPackage}
          </p>
          <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-7 text-brand-100">
            {LEAD_COPY.afterEstimate}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href={SITE.googleFormUrl}
              external
              variant="white"
              size="lg"
            >
              {LEAD_CTAS.reviewScope}
            </ButtonLink>
            <ButtonLink
              href={SITE.googleFormUrl}
              external
              variant="secondary"
              size="lg"
            >
              {LEAD_CTAS.quickEstimate}
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="ghost"
              size="lg"
              className="text-brand-100 hover:text-white"
            >
              ดูบริการทั้งหมด
            </ButtonLink>
          </div>
          <p className="mt-4 text-xs text-brand-100/80">
            {LEAD_REASSURANCE}
          </p>
        </div>
      </div>
    </div>
  );
}
