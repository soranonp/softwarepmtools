# Timeline Planner Tool — Build Specification

> **For Claude Code**
> This is a complete specification to build the Timeline Planner feature on softwarepmtools.com.
> Read this entire document first before writing any code.
> Project: Software PM Tools (Thai-first B2B web app)
> Repo: github.com/soranonp/softwarepmtools
> Local path: ~/softwarepmtools

---

## 1. Context & Goal

Software PM Tools (softwarepmtools.com) is a Thai-first B2B web app that helps IT PMs, BAs, and business owners plan software projects. It already has one tool — the **Estimation Calculator** — and we are adding a second free tool: the **Timeline Planner**.

**Goal of this tool:** Let a user pick a project type, get an auto-generated phase/task list with realistic durations, adjust as needed, visualize as a Gantt chart, and export the result. The tool runs entirely client-side (static export friendly).

**Primary user:** Thai IT Project Manager preparing a project plan to share with stakeholders or vendors. Secondary user: business owners scoping a software project before hiring a vendor.

---

## 2. Tech Stack & Constraints

**Existing stack (DO NOT change):**
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Folder structure: `app/` (NOT `src/app/`)
- Static export: `output: "export"` in `next.config.js`
- Hosting: Cloudflare Pages
- No backend, no API routes, no server actions
- No login, no database

**Constraints:**
- Everything must work after `next build` → `out/` static export
- No `localStorage`/`sessionStorage` of sensitive data; URL state encoding is OK for share links
- Mobile-responsive (Thai users heavily on mobile)
- Thai language as primary UI; English labels acceptable for technical terms (PM, SA, Gantt)
- Match existing visual style: navy `#0F1E3D` primary, white/cream backgrounds, professional B2B aesthetic

---

## 3. Route & File Structure

Create:

```
app/
└── tools/
    └── timeline-planner/
        └── page.tsx                    # Main page (client component)

lib/
└── timeline/
    ├── types.ts                        # TypeScript types
    ├── date-utils.ts                   # Date math, working days, holidays
    ├── thai-holidays.ts                # Thai public holiday calendar
    ├── templates.ts                    # Preset phase templates
    ├── dependency-engine.ts            # FS dependency resolver
    └── export/
        ├── excel-export.ts             # XLSX export via exceljs
        ├── png-export.ts               # PNG export via html-to-image
        └── pdf-export.ts               # PDF export via jspdf

components/
└── timeline/
    ├── ProjectSetup.tsx                # Project name, type, start date
    ├── TemplateSelector.tsx            # Preset template picker
    ├── TaskTable.tsx                   # Editable task table
    ├── TaskRow.tsx                     # Single task row (editable inline)
    ├── GanttChart.tsx                  # SVG-based Gantt chart
    ├── GanttBar.tsx                    # Single task bar
    ├── GanttTimeline.tsx               # Date axis header
    ├── ExportPanel.tsx                 # Export buttons (XLSX/PNG/PDF)
    ├── StatsPanel.tsx                  # Duration/end-date stats
    └── HolidayBadge.tsx                # Holiday indicator
```

Add a link to this tool in the existing navbar under "Tools".

---

## 4. Dependencies to Install

```bash
npm install exceljs html-to-image jspdf nanoid date-fns
npm install --save-dev @types/node
```

**Why each:**
- `exceljs` — Excel export with formulas, formatting, multiple sheets
- `html-to-image` — Convert Gantt SVG to PNG for download
- `jspdf` — PDF export (combines stats + Gantt as image)
- `nanoid` — Generate unique task IDs (12-char URL-safe)
- `date-fns` — Date math (addDays, format, isWeekend, etc.)

**Do not use:**
- `react-gantt`, `gantt-task-react`, `dhtmlx-gantt` — bloated, hard to style, license issues
- `moment.js` — deprecated, large bundle
- `xlsx` (SheetJS) — has commercial license issues for some use cases; use `exceljs` instead

---

## 5. Data Model (lib/timeline/types.ts)

```typescript
export type ProjectType =
  | 'web-app'
  | 'mobile-app'
  | 'rpa-automation'
  | 'erp-implementation'
  | 'custom';

export type TaskCategory =
  | 'planning'
  | 'design'
  | 'development'
  | 'testing'
  | 'training'
  | 'deployment';

export interface Task {
  id: string;                  // nanoid
  name: string;
  category: TaskCategory;
  duration: number;            // in working days, integer >= 1
  dependencies: string[];      // array of task IDs that must finish first (FS)
  assignee?: string;           // e.g. "PM", "SA", "Dev Team"
  progress: number;            // 0-100, default 0
  notes?: string;
  // Computed fields (not stored, recomputed):
  startDate?: Date;
  endDate?: Date;
}

export interface Phase {
  id: string;
  name: string;                // e.g. "Phase 1: Kick-off"
  category: TaskCategory;
  tasks: Task[];
  collapsed?: boolean;
}

export interface ProjectConfig {
  name: string;                // default: "โปรเจกต์ใหม่"
  projectType: ProjectType;
  startDate: Date;
  workingDaysOnly: boolean;    // default true (skip weekends)
  includeThaiHolidays: boolean;// default true
  customHolidays: Date[];      // user-added holidays
  weekendDays: number[];       // [0, 6] = Sun, Sat (Thai default)
}

export interface TimelineState {
  config: ProjectConfig;
  phases: Phase[];
}
```

---

## 6. Date Engine (lib/timeline/date-utils.ts)

**Core functions to implement:**

```typescript
isWorkingDay(date: Date, config: ProjectConfig): boolean
// Returns false if weekend (per config.weekendDays) or holiday

isHoliday(date: Date, config: ProjectConfig): boolean
// Checks against Thai holidays (if includeThaiHolidays) + customHolidays

addWorkingDays(start: Date, days: number, config: ProjectConfig): Date
// Adds N working days, skipping weekends and holidays
// IMPORTANT: day 1 = the start date itself (if it's a working day)

countWorkingDays(start: Date, end: Date, config: ProjectConfig): number
// Counts working days between two dates inclusive

getNextWorkingDay(date: Date, config: ProjectConfig): Date
// Returns the next working day on or after the given date
```

**Algorithm note for `addWorkingDays`:** Common bug — off-by-one. If start = Mon and duration = 3, end should be Wed (Mon, Tue, Wed = 3 working days), NOT Thu. Use a loop that decrements a counter only on working days, starting with the start date itself.

---

## 7. Thai Holidays (lib/timeline/thai-holidays.ts)

Provide a static list for 2025 and 2026 (current target years) at minimum. Structure:

```typescript
export const THAI_HOLIDAYS: Record<number, { date: string; name: string }[]> = {
  2025: [
    { date: '2025-01-01', name: 'วันขึ้นปีใหม่' },
    { date: '2025-02-12', name: 'วันมาฆบูชา' },
    { date: '2025-04-07', name: 'ชดเชยวันจักรี' },
    { date: '2025-04-14', name: 'วันสงกรานต์' },
    { date: '2025-04-15', name: 'วันสงกรานต์' },
    { date: '2025-05-01', name: 'วันแรงงานแห่งชาติ' },
    { date: '2025-05-05', name: 'ชดเชยวันฉัตรมงคล' },
    { date: '2025-05-12', name: 'วันวิสาขบูชา' },
    { date: '2025-06-03', name: 'วันเฉลิมพระชนมพรรษา ราชินี' },
    { date: '2025-07-10', name: 'วันอาสาฬหบูชา' },
    { date: '2025-07-11', name: 'วันเข้าพรรษา' },
    { date: '2025-07-28', name: 'วันเฉลิมพระชนมพรรษา ร.10' },
    { date: '2025-08-12', name: 'วันแม่แห่งชาติ' },
    { date: '2025-10-13', name: 'วันคล้ายวันสวรรคต ร.9' },
    { date: '2025-10-23', name: 'วันปิยมหาราช' },
    { date: '2025-12-05', name: 'วันพ่อแห่งชาติ' },
    { date: '2025-12-10', name: 'วันรัฐธรรมนูญ' },
    { date: '2025-12-31', name: 'วันสิ้นปี' },
  ],
  2026: [
    { date: '2026-01-01', name: 'วันขึ้นปีใหม่' },
    { date: '2026-01-02', name: 'วันหยุดราชการเพิ่มเติม' },
    { date: '2026-03-03', name: 'วันมาฆบูชา' },
    { date: '2026-04-06', name: 'วันจักรี' },
    { date: '2026-04-13', name: 'วันสงกรานต์' },
    { date: '2026-04-14', name: 'วันสงกรานต์' },
    { date: '2026-04-15', name: 'วันสงกรานต์' },
    { date: '2026-05-01', name: 'วันแรงงานแห่งชาติ' },
    { date: '2026-05-04', name: 'วันฉัตรมงคล' },
    { date: '2026-06-01', name: 'วันวิสาขบูชา' },
    { date: '2026-06-03', name: 'วันเฉลิมพระชนมพรรษา ราชินี' },
    { date: '2026-07-28', name: 'วันเฉลิมพระชนมพรรษา ร.10' },
    { date: '2026-07-29', name: 'วันอาสาฬหบูชา' },
    { date: '2026-07-30', name: 'วันเข้าพรรษา' },
    { date: '2026-08-12', name: 'วันแม่แห่งชาติ' },
    { date: '2026-10-13', name: 'วันคล้ายวันสวรรคต ร.9' },
    { date: '2026-10-23', name: 'วันปิยมหาราช' },
    { date: '2026-12-05', name: 'วันพ่อแห่งชาติ' },
    { date: '2026-12-07', name: 'ชดเชยวันรัฐธรรมนูญ' },
    { date: '2026-12-10', name: 'วันรัฐธรรมนูญ' },
    { date: '2026-12-31', name: 'วันสิ้นปี' },
  ],
};
```

**Note:** Dates above are an approximation. Claude Code MUST verify against the official Thai government holiday announcement before publishing. Buddhist holidays follow the lunar calendar and shift each year. Add a comment in the code: `// Source: ราชกิจจานุเบกษา / กรมการปกครอง — verify yearly`. Also expose a helper that allows users to add custom holidays via the UI.

---

## 8. Preset Templates (lib/timeline/templates.ts)

Provide 4 ready-to-use templates. Each template returns an array of Phases with default durations.

### Template 1: Web Application (`web-app`)
```
Phase 1: Kick-off & Planning              (3 days)
  - ลงนามในสัญญา และประชุมเริ่มงาน (Kick-off)        1 day
  - จัดทำ Project Charter                              1 day
  - ตั้งค่า Project Management Tools                  1 day

Phase 2: Requirements Gathering           (8 days)
  - ประชุมเก็บความต้องการ + Workshop                  3 days
  - จัดทำ Functional Requirements Spec                3 days
  - Review และอนุมัติ Requirements                    2 days

Phase 3: UI/UX Design                     (12 days)
  - Wireframe Design                                  4 days
  - Visual Design (Mockups)                           5 days
  - Prototype + Review                                3 days

Phase 4: Frontend Development             (25 days)
  - Setup Project + Components Library                3 days
  - Develop Main Pages                                15 days
  - Develop Admin/Internal Pages                      5 days
  - Frontend Integration Testing                      2 days

Phase 5: Backend Development              (25 days)   [parallel with Phase 4]
  - Database Design + Setup                           3 days
  - Develop API Endpoints                             15 days
  - Authentication & Authorization                    3 days
  - Backend Integration Testing                       4 days

Phase 6: System Integration Testing       (8 days)
  - SIT Test Plan                                     2 days
  - Execute SIT                                       4 days
  - Bug Fixes (Round 1)                               2 days

Phase 7: User Acceptance Testing          (6 days)
  - UAT Plan + Test Cases                             2 days
  - Execute UAT with Client                           3 days
  - Bug Fixes (Round 2)                               1 day

Phase 8: Training & Documentation         (3 days)
  - User Training Session                             1 day
  - Admin Training Session                            1 day
  - Handover Documentation                            1 day

Phase 9: Go-Live & Stabilization          (5 days)
  - Production Deployment                             1 day
  - Smoke Testing on Production                       1 day
  - Hypercare Period                                  3 days
```

### Template 2: Mobile Application (`mobile-app`)
Similar to web-app, but add:
- iOS App Store submission & review (5-7 days waiting)
- Android Play Store submission & review (1-2 days)
- Native UI Design per platform
- TestFlight / Internal Testing setup
Total typically 80-100 working days for medium app

### Template 3: RPA / Automation (`rpa-automation`)
Based on the Juslaws Power Automate template — short, focused phases:
```
Phase 1: Kick-off (1 day)
Phase 2: Requirements Workshop (2 days)
Phase 3: Workflow 1 Development (5-10 days)
Phase 4: Workflow 2 Development (5-10 days)  [optional, repeat as needed]
Phase 5: SIT (3 days)
Phase 6: UAT (3 days)
Phase 7: OJT Training + Recording (2 days)
Phase 8: Go-Live + Hand-over (3 days)
```

### Template 4: ERP Implementation (`erp-implementation`)
```
Phase 1: Fit-Gap Analysis (15 days)
Phase 2: Configuration (20 days)
Phase 3: Customization (30 days)
Phase 4: Data Migration (15 days)
Phase 5: Integration with Existing Systems (15 days)
Phase 6: SIT (10 days)
Phase 7: UAT (10 days)
Phase 8: Key User Training (5 days)
Phase 9: End User Training (5 days)
Phase 10: Go-Live + Stabilization (10 days)
```

### Template 5: Custom (Blank)
Empty state with one phase + one task as starter:
```
Phase 1: My First Phase
  - Task 1 (1 day)
```

**Dependency rules in templates:**
- All tasks within a phase are sequential by default (Task 2 depends on Task 1)
- Phases are sequential by default (Phase 2 depends on last task of Phase 1)
- Mark Phase 4 (Frontend) and Phase 5 (Backend) of web-app as PARALLEL (both depend on Phase 3, but don't depend on each other)

---

## 9. Dependency Engine (lib/timeline/dependency-engine.ts)

Implement Finish-to-Start (FS) only. No FF/SS/SF for MVP.

**Core function:**
```typescript
computeSchedule(
  phases: Phase[],
  config: ProjectConfig
): Phase[]
```

**Algorithm:**
1. Flatten all tasks into a single list with their phase context preserved
2. Topological sort by dependencies (detect cycles → throw error with task IDs)
3. For each task in topological order:
   - If no dependencies: `startDate = getNextWorkingDay(config.startDate, config)`
   - Else: `startDate = getNextWorkingDay(max(dep.endDate) + 1 working day, config)`
   - `endDate = addWorkingDays(startDate, duration - 1, config)`
4. Return phases with computed `startDate`/`endDate` on each task

**Cycle detection:** If user creates A → B → A, show error toast: "พบ Dependency เป็นวงกลม: Task X → Task Y" and don't update the schedule (keep last valid one).

---

## 10. UI Components

### 10.1 ProjectSetup.tsx
- Input: Project name (text)
- Select: Project type (dropdown with 5 options)
- Date picker: Start date (default = next working day from today)
- Toggle: Working days only (default ON)
- Toggle: Include Thai holidays (default ON)
- Show: List of upcoming holidays in project range (small text)

### 10.2 TemplateSelector.tsx
- 5 cards: Web App / Mobile App / RPA / ERP / Custom
- Each card: icon + name + "X phases, ~Y working days"
- Click → confirm dialog "ใช้ template นี้จะแทนที่ tasks ที่มีอยู่ทั้งหมด ต้องการดำเนินการต่อ?"
- After confirmation → load template into state

### 10.3 TaskTable.tsx + TaskRow.tsx
- Columns: # / ชื่อ Task / Duration / Start / End / Depends on / Assignee / Action
- Inline edit: click cell to edit (use shadcn-style inputs)
- Drag handle on left to reorder tasks within a phase
- Add task button per phase + "Add Phase" button at bottom
- Dependency picker: searchable dropdown showing all OTHER tasks (prevent self-reference)
- Visual indicator: red border on rows with circular dependency
- Group by phase with collapsible headers
- Show task count + total days per phase header

### 10.4 GanttChart.tsx + GanttBar.tsx + GanttTimeline.tsx
**Layout:**
- Left column: Task names (sticky, ~200px wide)
- Right scrollable area: SVG with bars
- Top: Date axis (auto-zoom: day / week / month based on project length)
  - < 30 days: day view
  - 30-90 days: week view
  - 90+ days: month view
- Today marker: vertical red dashed line
- Holiday marker: light gray vertical bands
- Weekend marker: light blue vertical bands (if workingDaysOnly is ON)
- Task bar: rounded rectangle, color by category, hover shows tooltip
- Dependency arrows: SVG path connecting end of predecessor to start of successor (optional for MVP, add toggle)
- Progress: darker shade overlay = `progress %` of bar width

**Performance:** Use React `memo` for GanttBar. Virtualize if > 100 tasks (not for MVP).

### 10.5 ExportPanel.tsx
Three buttons:
1. **Export Excel** → calls `excelExport(state)` → downloads `timeline-{date}.xlsx`
2. **Export PNG** → calls `html-to-image.toPng(ganttRef)` → downloads `gantt-{date}.png`
3. **Export PDF** → combines stats + Gantt PNG into A4 PDF

### 10.6 StatsPanel.tsx
Display at top of page:
- Total duration: X working days
- Project end date: 2026-XX-XX
- Number of holidays in range: X
- Number of phases: X
- Number of tasks: X
- Estimated calendar days: X days (working + weekends + holidays)

---

## 11. Excel Export Format (lib/timeline/export/excel-export.ts)

Match Juslaws style: 3 sheets

### Sheet 1: "Project Info"
- Row 1: Project name (merged across A:F, large bold)
- Row 3: Created date, Start date, End date, Total working days
- Row 5+: Phase summary table

### Sheet 2: "Timeline Detail" (main sheet)
Columns (match the Thai PM expectation):
```
A: ลำดับ
B: รายละเอียดการดำเนินงาน
C: ระยะเวลา (วันทำการ)
D: วันที่เริ่มต้น
E: วันที่สิ้นสุด
F: Dependencies
G: ผู้ดำเนินการ
H: Progress (%)
I onwards: Week columns (W1, W2, W3, ... ) showing colored cells for bar
```

- Phase rows: bold background `#D9E1F2`, calculated subtotals
- Task rows: normal
- Date format: `dd MMM yyyy` (e.g., "01 มิ.ย. 2026")
- Use Excel formulas where possible (e.g., `=D6+C6` for end date in working-day context)
- For the Gantt-in-Excel: fill cells in week columns with phase color

### Sheet 3: "Holidays"
List all Thai holidays that fall within the project date range with the Thai name.

---

## 12. PDF Export (lib/timeline/export/pdf-export.ts)

A4 portrait, 2 pages max:

**Page 1:**
- Header: Project name + logo (Software PM Tools)
- Stats section
- Task summary table (text-based, top 50 tasks if more)
- Footer: "Generated by softwarepmtools.com on {date}"

**Page 2:**
- Full Gantt chart as image (scaled to fit width)
- Holidays list at bottom

Use `jspdf` + capture Gantt SVG via `html-to-image.toCanvas` → embed as image in PDF.

---

## 13. URL State Sharing

For the "Share" button: encode the state into a URL parameter so a teammate can open the same timeline.

```
softwarepmtools.com/tools/timeline-planner?state={base64-encoded-json}
```

- On mount: if `?state=` exists, decode and restore state
- Compress with `LZString` if state JSON is > 2KB (no extra install needed; inline a tiny base64 encoder)
- On Share click: encode current state → copy URL to clipboard → toast "คัดลอกลิงก์แล้ว"

**Note:** This bypasses the localStorage restriction. State lives in URL only.

---

## 14. Styling Guidelines

Follow the existing site palette:

```css
/* Primary palette (already in the site) */
--color-navy-900: #0F1E3D;       /* primary brand color */
--color-navy-700: #1E3A5F;
--color-brand-600: #2563EB;       /* CTA blue */
--color-brand-100: #DBEAFE;       /* hover/light bg */

/* Category colors for Gantt bars */
--color-planning:     #94A3B8;   /* gray */
--color-design:       #A78BFA;   /* purple */
--color-development:  #2563EB;   /* blue (primary) */
--color-testing:      #F59E0B;   /* amber */
--color-training:     #10B981;   /* green */
--color-deployment:   #EF4444;   /* red */
```

Tailwind classes — extend `tailwind.config.ts` if needed for category colors.

**Typography:** Use existing fonts. Thai text should use the existing Thai-supporting font stack from layout.tsx.

**Responsive breakpoints:**
- Mobile (< 768px): Stack layout, Gantt becomes horizontally scrollable, task table becomes a card view
- Tablet (768-1024px): Side-by-side but Gantt scrolls horizontally
- Desktop (> 1024px): Full layout with both visible

---

## 15. UX Details That Matter

1. **First-load experience:** Show TemplateSelector front and center. Don't show empty TaskTable.
2. **Inline validation:** Duration must be >= 1, integer only. Show red border + tooltip on invalid.
3. **Optimistic updates:** Update Gantt immediately on any task edit (debounce 300ms for re-layout).
4. **Undo:** Keep last 10 states in memory, Ctrl+Z to undo. Show toast "เลิกทำแล้ว" on undo.
5. **Empty states:** If user deletes all tasks, show CTA "เลือก template เพื่อเริ่มต้น" with button.
6. **Loading states:** Export operations show spinner on button + disabled state during processing.
7. **Error handling:** Wrap all exports in try-catch, show toast on failure with retry button.
8. **Accessibility:** Keyboard navigation on task table, ARIA labels on Gantt bars, focus rings visible.

---

## 16. SEO & Page Metadata

```typescript
// app/tools/timeline-planner/page.tsx
export const metadata: Metadata = {
  title: 'Timeline Planner - วางแผน Project Timeline พร้อม Gantt Chart ฟรี | Software PM Tools',
  description: 'เครื่องมือวางแผน Timeline สำหรับ Software Project พร้อม Gantt Chart รวมวันหยุดไทย, Dependencies และ Export Excel/PDF ฟรี ไม่ต้องสมัครสมาชิก',
  keywords: 'timeline planner, gantt chart ภาษาไทย, วางแผนโปรเจกต์, project timeline tool, แผนงาน software project',
  openGraph: {
    title: 'Timeline Planner - วางแผน Project Timeline ฟรี',
    description: 'สร้าง Project Timeline + Gantt Chart พร้อม Export Excel/PDF',
    images: ['/og-timeline-planner.png'],
  },
};
```

Add `/tools/timeline-planner` to `public/sitemap.xml` with priority 0.9.

---

## 17. Internal Linking

Add this tool to:
1. **Homepage** — add a "Tools" section if not present, showcase both Estimation Calculator and Timeline Planner
2. **Navbar** — under "Tools" dropdown (or direct link if no dropdown)
3. **Footer** — "เครื่องมือ" section
4. **Estimation Calculator result page** — add a CTA: "ลองวางแผน Timeline สำหรับโปรเจกต์นี้ →"

---

## 18. Acceptance Criteria

Before considering this done, verify:

- [ ] `npm run build` completes without errors
- [ ] `out/tools/timeline-planner/index.html` exists after build
- [ ] Visit `/tools/timeline-planner` shows the page with all 4 template cards
- [ ] Click "Web App" template → loads 9 phases with ~80 working days total
- [ ] Edit a task duration → Gantt bars and dates update within 300ms
- [ ] Drag-reorder a task within a phase → dependencies and dates update
- [ ] Add a circular dependency → see error toast, schedule stays valid
- [ ] Click "Export Excel" → downloads .xlsx with 3 sheets, opens correctly in Excel
- [ ] Click "Export PNG" → downloads chart image, looks identical to on-screen
- [ ] Click "Export PDF" → downloads 2-page PDF
- [ ] Share button → copies URL with encoded state to clipboard
- [ ] Open copied URL in incognito → state restored exactly
- [ ] Mobile view (375px width) — page is usable, Gantt scrolls horizontally
- [ ] Thai holiday (e.g., 2026-04-13 สงกรานต์) — task that would start on that day moves to next working day
- [ ] Lighthouse score: Performance > 85, Accessibility > 90 on the new page

---

## 19. Suggested Build Order

1. Types + date-utils + thai-holidays (foundation)
2. Dependency engine + templates (logic)
3. ProjectSetup + TemplateSelector + TaskTable (input UI)
4. GanttChart (visualization — likely the longest step)
5. Excel export (because it's the most common use case)
6. PNG + PDF export
7. URL state sharing
8. Polish: responsive, animations, error handling
9. Add to navigation + sitemap
10. Test against acceptance criteria

Estimated time: 2-3 working days for an experienced React/TypeScript engineer; longer for the Gantt chart if drawing dependency arrows.

---

## 20. Out of Scope (DO NOT BUILD)

To prevent scope creep, the following are explicitly NOT part of this MVP:

- ❌ User accounts / login
- ❌ Saving projects to a backend
- ❌ Real-time collaboration
- ❌ Resource leveling / capacity planning
- ❌ Critical Path Method (CPM) highlighting
- ❌ Cost calculation (that's the Estimation Calculator's job)
- ❌ Other dependency types beyond FS (Finish-to-Start)
- ❌ Recurring tasks
- ❌ Sub-tasks / nested tasks
- ❌ Comments / discussion on tasks
- ❌ File attachments
- ❌ Mobile app version
- ❌ MS Project / Smartsheet import

Features above may be considered for V2.

---

## 21. Questions to Confirm Before Coding

If anything in this spec is unclear, ASK the user before writing code:

1. Confirm holiday list accuracy for the target year(s) — request official source
2. Confirm exact Thai labels for all UI strings (do they want to adjust wording?)
3. Confirm export filename format (e.g., `timeline-{projectName}-{date}.xlsx`)
4. Confirm whether to include a "Print" button (browser print) in addition to PDF export
5. Confirm preferred analytics integration (PostHog/GA4) for tracking tool usage

Default to the values in this spec if no answer is given, but flag the assumption in a code comment.

---

**End of Specification.**

Built for: softwarepmtools.com
Spec version: 1.0
Date: 2026-05-16
