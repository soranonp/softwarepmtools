// Preset phase templates
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §8
//
// Assumptions flagged per spec §21 (defaulting to spec values):
// - RPA workflow phases: spec says "5-10 days"; we default to 7.
// - mobile-app durations: spec gives only ranges/guidance ("80-100 working
//   days for medium app"); the breakdown below is a spec-guided estimate.
// - Store-review tasks run sequentially in the table even though real iOS/
//   Android reviews overlap — FS-only MVP (spec §20) can't model overlap.

import { nanoid } from "nanoid";
import type { Phase, ProjectType, TaskCategory } from "./types";
import { computeSchedule } from "./dependency-engine";
import { countWorkingDays } from "./date-utils";

interface TaskDef {
  name: string;
  duration: number;
  assignee?: string;
}

interface PhaseDef {
  name: string;
  category: TaskCategory;
  tasks: TaskDef[];
  /**
   * Phase indexes whose LAST task gates this phase's FIRST task.
   * Default = [previous phase]. Used to model parallel phases.
   */
  dependsOn?: number[];
}

/** Materialize phase defs into Phases with nanoid IDs and FS dependencies. */
function build(defs: PhaseDef[]): Phase[] {
  const phases: Phase[] = defs.map((d) => ({
    id: nanoid(12),
    name: d.name,
    category: d.category,
    tasks: d.tasks.map((t) => ({
      id: nanoid(12),
      name: t.name,
      category: d.category,
      duration: t.duration,
      dependencies: [] as string[],
      assignee: t.assignee,
      progress: 0,
    })),
  }));

  defs.forEach((d, pi) => {
    const phase = phases[pi];
    // Tasks within a phase are sequential by default.
    phase.tasks.forEach((task, ti) => {
      if (ti > 0) task.dependencies.push(phase.tasks[ti - 1].id);
    });
    // First task depends on the last task of each depended-on phase.
    const depPhases = d.dependsOn ?? (pi > 0 ? [pi - 1] : []);
    if (phase.tasks.length > 0) {
      for (const dpi of depPhases) {
        const last = phases[dpi]?.tasks.at(-1);
        if (last) phase.tasks[0].dependencies.push(last.id);
      }
    }
  });

  return phases;
}

// ─── Template 1: Web Application ────────────────────────────────────────────
// Phase 4 (Frontend) and Phase 5 (Backend) run in PARALLEL: both depend on
// Phase 3 (UI/UX), neither on each other; Phase 6 (SIT) waits for both.
const WEB_APP: PhaseDef[] = [
  {
    name: "Phase 1: Kick-off & Planning",
    category: "planning",
    tasks: [
      { name: "ลงนามในสัญญา และประชุมเริ่มงาน (Kick-off)", duration: 1 },
      { name: "จัดทำ Project Charter", duration: 1 },
      { name: "ตั้งค่า Project Management Tools", duration: 1 },
    ],
  },
  {
    name: "Phase 2: Requirements Gathering",
    category: "planning",
    tasks: [
      { name: "ประชุมเก็บความต้องการ + Workshop", duration: 3 },
      { name: "จัดทำ Functional Requirements Spec", duration: 3 },
      { name: "Review และอนุมัติ Requirements", duration: 2 },
    ],
  },
  {
    name: "Phase 3: UI/UX Design",
    category: "design",
    tasks: [
      { name: "Wireframe Design", duration: 4 },
      { name: "Visual Design (Mockups)", duration: 5 },
      { name: "Prototype + Review", duration: 3 },
    ],
  },
  {
    name: "Phase 4: Frontend Development",
    category: "development",
    dependsOn: [2], // parallel with Phase 5; both gated by Phase 3
    tasks: [
      { name: "Setup Project + Components Library", duration: 3 },
      { name: "Develop Main Pages", duration: 15 },
      { name: "Develop Admin/Internal Pages", duration: 5 },
      { name: "Frontend Integration Testing", duration: 2 },
    ],
  },
  {
    name: "Phase 5: Backend Development",
    category: "development",
    dependsOn: [2], // parallel with Phase 4
    tasks: [
      { name: "Database Design + Setup", duration: 3 },
      { name: "Develop API Endpoints", duration: 15 },
      { name: "Authentication & Authorization", duration: 3 },
      { name: "Backend Integration Testing", duration: 4 },
    ],
  },
  {
    name: "Phase 6: System Integration Testing",
    category: "testing",
    dependsOn: [3, 4], // waits for both Frontend and Backend
    tasks: [
      { name: "SIT Test Plan", duration: 2 },
      { name: "Execute SIT", duration: 4 },
      { name: "Bug Fixes (Round 1)", duration: 2 },
    ],
  },
  {
    name: "Phase 7: User Acceptance Testing",
    category: "testing",
    tasks: [
      { name: "UAT Plan + Test Cases", duration: 2 },
      { name: "Execute UAT with Client", duration: 3 },
      { name: "Bug Fixes (Round 2)", duration: 1 },
    ],
  },
  {
    name: "Phase 8: Training & Documentation",
    category: "training",
    tasks: [
      { name: "User Training Session", duration: 1 },
      { name: "Admin Training Session", duration: 1 },
      { name: "Handover Documentation", duration: 1 },
    ],
  },
  {
    name: "Phase 9: Go-Live & Stabilization",
    category: "deployment",
    tasks: [
      { name: "Production Deployment", duration: 1 },
      { name: "Smoke Testing on Production", duration: 1 },
      { name: "Hypercare Period", duration: 3 },
    ],
  },
];

// ─── Template 2: Mobile Application ─────────────────────────────────────────
const MOBILE_APP: PhaseDef[] = [
  {
    name: "Phase 1: Kick-off & Planning",
    category: "planning",
    tasks: [
      { name: "ประชุมเริ่มงาน (Kick-off)", duration: 1 },
      { name: "จัดทำ Project Charter", duration: 1 },
      { name: "ตั้งค่า Project Management Tools", duration: 1 },
    ],
  },
  {
    name: "Phase 2: Requirements Gathering",
    category: "planning",
    tasks: [
      { name: "ประชุมเก็บความต้องการ + Workshop", duration: 3 },
      { name: "จัดทำ Functional Requirements Spec", duration: 3 },
      { name: "Review และอนุมัติ Requirements", duration: 2 },
    ],
  },
  {
    name: "Phase 3: Native UI/UX Design (per Platform)",
    category: "design",
    tasks: [
      { name: "Wireframe Design", duration: 4 },
      { name: "iOS Visual Design", duration: 5 },
      { name: "Android Visual Design", duration: 5 },
    ],
  },
  {
    name: "Phase 4: Mobile App Development",
    category: "development",
    dependsOn: [2], // parallel with Phase 5 (Backend)
    tasks: [
      { name: "Setup Project + Architecture", duration: 3 },
      { name: "Develop Core Features", duration: 18 },
      { name: "Develop Platform-specific UI", duration: 6 },
      { name: "Push Notifications & Integrations", duration: 3 },
    ],
  },
  {
    name: "Phase 5: Backend / API Development",
    category: "development",
    dependsOn: [2], // parallel with Phase 4
    tasks: [
      { name: "Database Design + Setup", duration: 3 },
      { name: "Develop API Endpoints", duration: 14 },
      { name: "Authentication & Authorization", duration: 5 },
    ],
  },
  {
    name: "Phase 6: System Integration Testing",
    category: "testing",
    dependsOn: [3, 4],
    tasks: [
      { name: "SIT Test Plan", duration: 2 },
      { name: "Execute SIT", duration: 4 },
      { name: "Bug Fixes (Round 1)", duration: 1 },
    ],
  },
  {
    name: "Phase 7: User Acceptance Testing",
    category: "testing",
    tasks: [
      { name: "UAT Plan + Test Cases", duration: 2 },
      { name: "Execute UAT with Client", duration: 3 },
      { name: "Bug Fixes (Round 2)", duration: 1 },
    ],
  },
  {
    name: "Phase 8: Store Submission & Review",
    category: "deployment",
    tasks: [
      { name: "TestFlight / Internal Testing Setup", duration: 2 },
      { name: "iOS App Store Submission & Review", duration: 7 },
      { name: "Android Play Store Submission & Review", duration: 2 },
    ],
  },
  {
    name: "Phase 9: Training & Documentation",
    category: "training",
    tasks: [
      { name: "User Training Session", duration: 1 },
      { name: "Handover Documentation", duration: 1 },
    ],
  },
  {
    name: "Phase 10: Go-Live & Stabilization",
    category: "deployment",
    tasks: [
      { name: "Production Release", duration: 1 },
      { name: "Smoke Testing", duration: 1 },
      { name: "Hypercare Period", duration: 3 },
    ],
  },
];

// ─── Template 3: RPA / Automation ───────────────────────────────────────────
// Based on the Juslaws Power Automate template — short, focused phases.
const RPA_AUTOMATION: PhaseDef[] = [
  { name: "Phase 1: Kick-off", category: "planning", tasks: [{ name: "Kick-off", duration: 1 }] },
  { name: "Phase 2: Requirements Workshop", category: "planning", tasks: [{ name: "Requirements Workshop", duration: 2 }] },
  { name: "Phase 3: Workflow 1 Development", category: "development", tasks: [{ name: "Workflow 1 Development", duration: 7 }] },
  { name: "Phase 4: Workflow 2 Development", category: "development", tasks: [{ name: "Workflow 2 Development", duration: 7 }] },
  { name: "Phase 5: SIT", category: "testing", tasks: [{ name: "System Integration Testing", duration: 3 }] },
  { name: "Phase 6: UAT", category: "testing", tasks: [{ name: "User Acceptance Testing", duration: 3 }] },
  { name: "Phase 7: OJT Training + Recording", category: "training", tasks: [{ name: "OJT Training + Recording", duration: 2 }] },
  { name: "Phase 8: Go-Live + Hand-over", category: "deployment", tasks: [{ name: "Go-Live + Hand-over", duration: 3 }] },
];

// ─── Template 4: ERP Implementation ─────────────────────────────────────────
const ERP_IMPLEMENTATION: PhaseDef[] = [
  { name: "Phase 1: Fit-Gap Analysis", category: "planning", tasks: [{ name: "Fit-Gap Analysis", duration: 15 }] },
  { name: "Phase 2: Configuration", category: "development", tasks: [{ name: "Configuration", duration: 20 }] },
  { name: "Phase 3: Customization", category: "development", tasks: [{ name: "Customization", duration: 30 }] },
  { name: "Phase 4: Data Migration", category: "development", tasks: [{ name: "Data Migration", duration: 15 }] },
  { name: "Phase 5: Integration with Existing Systems", category: "development", tasks: [{ name: "Integration with Existing Systems", duration: 15 }] },
  { name: "Phase 6: SIT", category: "testing", tasks: [{ name: "System Integration Testing", duration: 10 }] },
  { name: "Phase 7: UAT", category: "testing", tasks: [{ name: "User Acceptance Testing", duration: 10 }] },
  { name: "Phase 8: Key User Training", category: "training", tasks: [{ name: "Key User Training", duration: 5 }] },
  { name: "Phase 9: End User Training", category: "training", tasks: [{ name: "End User Training", duration: 5 }] },
  { name: "Phase 10: Go-Live + Stabilization", category: "deployment", tasks: [{ name: "Go-Live + Stabilization", duration: 10 }] },
];

// ─── Template 5: Custom (Blank starter) ─────────────────────────────────────
const CUSTOM: PhaseDef[] = [
  {
    name: "Phase 1: My First Phase",
    category: "planning",
    tasks: [{ name: "Task 1", duration: 1 }],
  },
];

const TEMPLATE_DEFS: Record<ProjectType, PhaseDef[]> = {
  "web-app": WEB_APP,
  "mobile-app": MOBILE_APP,
  "rpa-automation": RPA_AUTOMATION,
  "erp-implementation": ERP_IMPLEMENTATION,
  custom: CUSTOM,
};

/** Build a fresh set of Phases (new IDs every call) for a project type. */
export function getTemplate(type: ProjectType): Phase[] {
  return build(TEMPLATE_DEFS[type]);
}

export interface TemplateMeta {
  type: ProjectType;
  label: string;
  description: string;
  phaseCount: number;
  /** Critical-path working days (accounts for parallel phases). */
  workingDays: number;
}

const TEMPLATE_LABELS: Record<ProjectType, { label: string; description: string }> = {
  "web-app": { label: "Web Application", description: "เว็บแอปพลิเคชันแบบครบวงจร (Frontend + Backend ทำขนาน)" },
  "mobile-app": { label: "Mobile Application", description: "แอปมือถือ iOS/Android พร้อมขั้นตอนส่ง Store" },
  "rpa-automation": { label: "RPA / Automation", description: "งาน Automation / Power Automate เฟสสั้น กระชับ" },
  "erp-implementation": { label: "ERP Implementation", description: "วางระบบ ERP ตั้งแต่ Fit-Gap จนถึง Go-Live" },
  custom: { label: "Custom", description: "เริ่มจากศูนย์ สร้าง Phase และ Task เอง" },
};

/**
 * Summary for the TemplateSelector cards. `workingDays` is the critical-path
 * length computed with a neutral config (no holidays) so parallel phases are
 * not double-counted.
 */
export function getTemplateMeta(type: ProjectType): TemplateMeta {
  const phases = getTemplate(type);
  const neutralStart = new Date(2026, 0, 5); // a Monday, holiday-free week
  const scheduled = computeSchedule(phases, {
    name: "estimate",
    projectType: type,
    startDate: neutralStart,
    workingDaysOnly: true,
    includeThaiHolidays: false,
    customHolidays: [],
    weekendDays: [0, 6],
  });
  let minStart = scheduled[0]?.tasks[0]?.startDate ?? neutralStart;
  let maxEnd = neutralStart;
  for (const p of scheduled)
    for (const t of p.tasks) {
      if (t.startDate && t.startDate < minStart) minStart = t.startDate;
      if (t.endDate && t.endDate > maxEnd) maxEnd = t.endDate;
    }
  return {
    type,
    ...TEMPLATE_LABELS[type],
    phaseCount: phases.length,
    workingDays: countWorkingDays(minStart, maxEnd, {
      name: "estimate",
      projectType: type,
      startDate: neutralStart,
      workingDaysOnly: true,
      includeThaiHolidays: false,
      customHolidays: [],
      weekendDays: [0, 6],
    }),
  };
}

export const ALL_TEMPLATE_TYPES: ProjectType[] = [
  "web-app",
  "mobile-app",
  "rpa-automation",
  "erp-implementation",
  "custom",
];
