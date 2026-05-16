// Task category metadata — Thai labels + Gantt bar colors
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §14
//
// Colors are kept as a TS map (not Tailwind classes) because Tailwind v4
// cannot generate classes from dynamic category strings, and Gantt bars
// need the hex value directly for inline SVG fills.

import type { TaskCategory } from "./types";

export const CATEGORY_META: Record<
  TaskCategory,
  { label: string; color: string }
> = {
  planning: { label: "วางแผน", color: "#94A3B8" },
  design: { label: "ออกแบบ", color: "#A78BFA" },
  development: { label: "พัฒนา", color: "#2563EB" },
  testing: { label: "ทดสอบ", color: "#F59E0B" },
  training: { label: "อบรม", color: "#10B981" },
  deployment: { label: "ส่งมอบ / Go-Live", color: "#EF4444" },
};

export const ALL_CATEGORIES: TaskCategory[] = [
  "planning",
  "design",
  "development",
  "testing",
  "training",
  "deployment",
];
