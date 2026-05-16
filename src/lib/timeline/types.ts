// Timeline Planner — core data model
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §5
// NOTE: Spec §3 specifies a root-level `lib/` dir; we use `src/lib/` to stay
// consistent with the existing codebase (Estimation Calculator). Confirmed
// with the project owner 2026-05-16.

export type ProjectType =
  | "web-app"
  | "mobile-app"
  | "rpa-automation"
  | "erp-implementation"
  | "custom";

export type TaskCategory =
  | "planning"
  | "design"
  | "development"
  | "testing"
  | "training"
  | "deployment";

export interface Task {
  id: string; // nanoid
  name: string;
  category: TaskCategory;
  duration: number; // in working days, integer >= 1
  dependencies: string[]; // task IDs that must finish first (Finish-to-Start)
  assignee?: string; // e.g. "PM", "SA", "Dev Team"
  progress: number; // 0-100, default 0
  notes?: string;
  // Computed fields (not persisted, recomputed by the dependency engine):
  startDate?: Date;
  endDate?: Date;
}

export interface Phase {
  id: string;
  name: string; // e.g. "Phase 1: Kick-off"
  category: TaskCategory;
  tasks: Task[];
  collapsed?: boolean;
}

export interface ProjectConfig {
  name: string; // default: "โปรเจกต์ใหม่"
  projectType: ProjectType;
  startDate: Date;
  workingDaysOnly: boolean; // default true (skip weekends)
  includeThaiHolidays: boolean; // default true
  customHolidays: Date[]; // user-added holidays
  weekendDays: number[]; // [0, 6] = Sun, Sat (Thai default)
}

export interface TimelineState {
  config: ProjectConfig;
  phases: Phase[];
}
