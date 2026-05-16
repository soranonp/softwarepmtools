// Transparent, rule-based estimation engine.
// Pure functions only — no React, no side effects. Constants mirror the agreed spec.

import type {
  BudgetFit,
  Complexity,
  EstimationInput,
  EstimationResult,
  IntegrationLevel,
  ProjectType,
  ReportLevel,
  RiskLevel,
  RoleEffort,
} from "@/src/types/estimation";

/** Base man-days by project type. */
const BASE_MD: Record<ProjectType, number> = {
  simple_website: 20,
  web_app: 60,
  mobile_app: 80,
  backoffice: 70,
  power_platform: 45,
  api_integration: 50,
  enterprise_workflow: 90,
};

/** Man-days added per main feature. */
const MD_PER_FEATURE = 5;

/** Man-days added per user role. */
const MD_PER_ROLE = 3;

/** Man-days added by reporting needs. */
const REPORT_EFFORT: Record<ReportLevel, number> = {
  none: 0,
  basic: 10,
  advanced: 25,
};

/** Effort multiplier by complexity. */
const COMPLEXITY_MULTIPLIER: Record<Complexity, number> = {
  simple: 1.0,
  medium: 1.5,
  complex: 2.2,
};

/** Effort multiplier by integration depth. */
const INTEGRATION_MULTIPLIER: Record<IntegrationLevel, number> = {
  none: 1.0,
  basic_api: 1.2,
  payment_email_line: 1.3,
  erp_sap_core: 1.6,
};

/** Blended day-rate (THB / man-day). */
const BLEND_RATE = 9500;

/** Contingency applied to the blended cost. */
const CONTINGENCY = 1.2;

const ROLE_SHARE: { role: string; percent: number }[] = [
  { role: "Project Manager", percent: 0.12 },
  { role: "Business Analyst", percent: 0.14 },
  { role: "System Analyst", percent: 0.1 },
  { role: "Developer", percent: 0.42 },
  { role: "QA / Tester", percent: 0.17 },
  { role: "DevOps", percent: 0.05 },
];

const RISK_TEXT: Record<RiskLevel, string> = {
  high: "ความเสี่ยงสูง: โปรเจกต์มีความซับซ้อนสูง หรือเชื่อมต่อกับระบบหลัก (ERP/SAP/Core System) ควรวางสถาปัตยกรรมและบริหารความเสี่ยงอย่างใกล้ชิดตั้งแต่ต้น",
  medium_high:
    "ความเสี่ยงค่อนข้างสูง: ปริมาณงานมาก (มากกว่า 120 MD) ควรแบ่งเฟสการพัฒนาและควบคุม Scope อย่างเข้มงวด",
  medium:
    "ความเสี่ยงปานกลาง: ขนาดงานยังไม่ใหญ่ แต่ควรมี Requirement และแผนการทดสอบที่ชัดเจน",
  low_medium:
    "ความเสี่ยงระดับต่ำถึงปานกลาง: สามารถบริหารจัดการได้ หากควบคุม Scope ให้คงที่ตลอดโครงการ",
};

function round(n: number): number {
  return Math.round(n);
}

function clampInput(input: EstimationInput): EstimationInput {
  return {
    ...input,
    mainFeatures: Math.max(0, Math.round(input.mainFeatures)),
    userRoles: Math.max(0, Math.round(input.userRoles)),
    availableBudget: Math.max(0, Math.round(input.availableBudget)),
  };
}

function computeRisk(
  complexity: Complexity,
  integration: IntegrationLevel,
  totalMD: number,
): RiskLevel {
  if (complexity === "complex" || integration === "erp_sap_core") {
    return "high";
  }
  if (totalMD > 120) return "medium_high";
  if (totalMD < 80) return "medium";
  return "low_medium";
}

function timelineLabel(totalMD: number): string {
  if (totalMD < 50) return "1-2 เดือน";
  if (totalMD <= 120) return "2-4 เดือน";
  if (totalMD <= 250) return "4-6 เดือน";
  return "6-10 เดือน";
}

function scopeWarning(riskLevel: RiskLevel, totalMD: number): string {
  if (riskLevel === "high" || totalMD > 250) {
    return "Scope มีความเสี่ยงบานปลายสูง แนะนำให้ทำ Requirement Breakdown และ SOW พร้อม Acceptance Criteria อย่างละเอียดก่อนเริ่มจ้าง Vendor";
  }
  if (totalMD > 120) {
    return "ขอบเขตงานค่อนข้างกว้าง ควรล็อก Requirement และกำหนด Acceptance Criteria ให้ชัดเจนก่อนเซ็นสัญญา";
  }
  return "ขอบเขตงานอยู่ในระดับที่จัดการได้ แต่ควรยืนยัน Requirement หลักให้ครบถ้วนก่อนเริ่มพัฒนา";
}

function recommendPackage(estimatedBudget: number): {
  ids: string[];
  label: string;
  text: string;
} {
  if (estimatedBudget < 300_000) {
    return {
      ids: ["quick-estimate-review"],
      label: "Quick Estimate Review",
      text: "งบและขอบเขตยังไม่ใหญ่ เหมาะกับการให้ PM ช่วยรีวิวตัวเลขประเมินอย่างรวดเร็วเพื่อยืนยันความสมเหตุสมผลก่อนตัดสินใจ",
    };
  }
  if (estimatedBudget <= 1_500_000) {
    return {
      ids: ["sow-ready-pack"],
      label: "SOW Ready Pack",
      text: "ขนาดงานระดับกลาง แนะนำให้จัดทำ SOW และ Requirement Breakdown พร้อม Acceptance Criteria ให้พร้อมก่อนคุยและทำสัญญากับ Vendor",
    };
  }
  return {
    ids: ["vendor-proposal-review", "pm-as-a-service"],
    label: "Vendor Proposal Review + PM-as-a-Service",
    text: "เป็นโปรเจกต์ขนาดใหญ่ ควรตรวจข้อเสนอ Vendor อย่างละเอียด และมี PM ดูแลควบคุม Scope, Timeline และความเสี่ยงตลอดโครงการ",
  };
}

function assessBudgetFit(
  availableBudget: number,
  conservative: number,
  highComplexity: number,
): BudgetFit | null {
  if (availableBudget <= 0) return null;

  if (availableBudget < conservative) {
    return {
      status: "below",
      message: "งบประมาณที่ตั้งไว้อาจต่ำกว่าความซับซ้อนของ Scope ปัจจุบัน",
    };
  }
  if (availableBudget > highComplexity) {
    return {
      status: "buffer",
      message:
        "งบประมาณมี buffer เพียงพอสำหรับความเสี่ยงและรายละเอียดเพิ่มเติม",
    };
  }
  return {
    status: "within",
    message: "งบประมาณใกล้เคียงกับระดับ Scope ที่ประเมิน",
  };
}

export function estimateProject(rawInput: EstimationInput): EstimationResult {
  const input = clampInput(rawInput);

  const baseMD = BASE_MD[input.projectType];
  const featureEffort = input.mainFeatures * MD_PER_FEATURE;
  const roleEffort = input.userRoles * MD_PER_ROLE;
  const reportEffort = REPORT_EFFORT[input.reportLevel];
  const complexityMultiplier = COMPLEXITY_MULTIPLIER[input.complexity];
  const integrationMultiplier = INTEGRATION_MULTIPLIER[input.integration];

  const totalMD = round(
    (baseMD + featureEffort + roleEffort + reportEffort) *
      complexityMultiplier *
      integrationMultiplier,
  );

  const estimatedBudget = round(totalMD * BLEND_RATE * CONTINGENCY);
  const budgetRange = {
    conservative: round(estimatedBudget * 0.85),
    expected: estimatedBudget,
    highComplexity: round(estimatedBudget * 1.25),
  };

  const timeline = { label: timelineLabel(totalMD) };

  const riskLevel = computeRisk(
    input.complexity,
    input.integration,
    totalMD,
  );

  const roleBreakdown: RoleEffort[] = ROLE_SHARE.map((r) => ({
    role: r.role,
    percent: r.percent,
    manDays: round(totalMD * r.percent),
  }));

  const pkg = recommendPackage(estimatedBudget);

  const budgetFit = assessBudgetFit(
    input.availableBudget,
    budgetRange.conservative,
    budgetRange.highComplexity,
  );

  return {
    breakdown: {
      baseMD,
      featureEffort,
      roleEffort,
      reportEffort,
      complexityMultiplier,
      integrationMultiplier,
    },
    totalMD,
    estimatedBudget,
    budgetRange,
    timeline,
    riskLevel,
    roleBreakdown,
    recommendedPackageIds: pkg.ids,
    recommendedPackageLabel: pkg.label,
    explanations: {
      risk: RISK_TEXT[riskLevel],
      scopeWarning: scopeWarning(riskLevel, totalMD),
      budget: `งบประมาณคำนวณจาก Total MD × ${BLEND_RATE.toLocaleString(
        "th-TH",
      )} บาท/MD รวม Contingency 20% — ช่วงประเมินอยู่ระหว่าง ${formatTHB(
        budgetRange.conservative,
      )} (Conservative) ถึง ${formatTHB(
        budgetRange.highComplexity,
      )} (High Complexity) โดยมีค่ากลางที่ ${formatTHB(budgetRange.expected)}`,
      timeline: `ระยะเวลาที่แนะนำ (${timeline.label}) ประเมินจากปริมาณงานรวม (Total MD) ยังไม่รวมเวลารอการตัดสินใจ การจัดหาทีม หรือการเปลี่ยน Scope ระหว่างทาง`,
      recommendedPackage: pkg.text,
    },
    budgetFit,
  };
}

/** Formats a THB amount in Thai-friendly currency form (e.g. ฿1,250,000). */
export function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}
