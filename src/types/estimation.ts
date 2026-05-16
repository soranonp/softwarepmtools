// Domain types for the Software Project Estimation Calculator.
// Output shape is fully typed so the UI never reads an untyped value.

export type ProjectType =
  | "simple_website"
  | "web_app"
  | "mobile_app"
  | "backoffice"
  | "power_platform"
  | "api_integration"
  | "enterprise_workflow";

export type Complexity = "simple" | "medium" | "complex";

export type IntegrationLevel =
  | "none"
  | "basic_api"
  | "payment_email_line"
  | "erp_sap_core";

export type ReportLevel = "none" | "basic" | "advanced";

export type RiskLevel = "high" | "medium_high" | "medium" | "low_medium";

/** How the available budget compares to the estimated range. */
export type BudgetFitStatus = "below" | "within" | "buffer";

export interface EstimationInput {
  projectType: ProjectType;
  /** Number of main features / modules. */
  mainFeatures: number;
  /** Number of distinct user roles. */
  userRoles: number;
  reportLevel: ReportLevel;
  complexity: Complexity;
  integration: IntegrationLevel;
  /** Budget the business has available, in THB. 0 = not specified. */
  availableBudget: number;
}

export interface EstimationBreakdown {
  baseMD: number;
  featureEffort: number;
  roleEffort: number;
  reportEffort: number;
  complexityMultiplier: number;
  integrationMultiplier: number;
}

export interface BudgetRange {
  conservative: number;
  expected: number;
  highComplexity: number;
}

export interface RoleEffort {
  role: string;
  /** Share of total effort, 0–1. */
  percent: number;
  manDays: number;
}

export interface BudgetFit {
  status: BudgetFitStatus;
  message: string;
}

export interface EstimationExplanations {
  risk: string;
  scopeWarning: string;
  budget: string;
  timeline: string;
  recommendedPackage: string;
}

export interface EstimationResult {
  breakdown: EstimationBreakdown;
  /** Total estimated effort in man-days. */
  totalMD: number;
  estimatedBudget: number;
  budgetRange: BudgetRange;
  timeline: { label: string };
  riskLevel: RiskLevel;
  roleBreakdown: RoleEffort[];
  /** Service package id(s) from content.ts that fit this estimate. */
  recommendedPackageIds: string[];
  /** Display label for the recommended package(s). */
  recommendedPackageLabel: string;
  explanations: EstimationExplanations;
  /** Null when the user did not provide an available budget. */
  budgetFit: BudgetFit | null;
}
