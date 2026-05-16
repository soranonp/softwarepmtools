"use client";

// Project name / type / start date + working-day toggles
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.1

import type { ProjectConfig, ProjectType } from "@/src/lib/timeline/types";
import {
  toDateInputValue,
  fromDateInputValue,
  formatThaiDate,
} from "@/src/lib/timeline/date-format";

const PROJECT_TYPE_LABELS: { value: ProjectType; label: string }[] = [
  { value: "web-app", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "rpa-automation", label: "RPA / Automation" },
  { value: "erp-implementation", label: "ERP Implementation" },
  { value: "custom", label: "Custom" },
];

const labelClass = "block text-sm font-semibold text-navy-900";
const controlClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-navy-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-1">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
          checked ? "bg-brand-600" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export function ProjectSetup({
  config,
  onChange,
  holidaysInRange,
}: {
  config: ProjectConfig;
  onChange: (config: ProjectConfig) => void;
  holidaysInRange: { date: Date; name: string }[];
}) {
  function patch(p: Partial<ProjectConfig>) {
    onChange({ ...config, ...p });
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 className="text-lg font-bold text-ink">ตั้งค่าโปรเจกต์</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="tl-name" className={labelClass}>
            ชื่อโปรเจกต์
          </label>
          <input
            id="tl-name"
            type="text"
            value={config.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="โปรเจกต์ใหม่"
            className={controlClass}
          />
        </div>
        <div>
          <label htmlFor="tl-type" className={labelClass}>
            ประเภทโปรเจกต์
          </label>
          <select
            id="tl-type"
            value={config.projectType}
            onChange={(e) =>
              patch({ projectType: e.target.value as ProjectType })
            }
            className={controlClass}
          >
            {PROJECT_TYPE_LABELS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tl-start" className={labelClass}>
            วันเริ่มโปรเจกต์
          </label>
          <input
            id="tl-start"
            type="date"
            value={toDateInputValue(config.startDate)}
            onChange={(e) => {
              const d = fromDateInputValue(e.target.value);
              if (d) patch({ startDate: d });
            }}
            className={controlClass}
          />
        </div>
        <div className="flex flex-col justify-center gap-1 rounded-lg bg-surface px-4 py-3">
          <Toggle
            label="นับเฉพาะวันทำการ (ข้ามเสาร์–อาทิตย์)"
            checked={config.workingDaysOnly}
            onChange={(v) => patch({ workingDaysOnly: v })}
          />
          <Toggle
            label="รวมวันหยุดราชการไทย"
            checked={config.includeThaiHolidays}
            onChange={(v) => patch({ includeThaiHolidays: v })}
          />
        </div>
      </div>

      {config.includeThaiHolidays && holidaysInRange.length > 0 && (
        <div className="mt-5 rounded-lg border border-line bg-surface px-4 py-3">
          <p className="text-xs font-semibold text-muted">
            วันหยุดในช่วงโปรเจกต์ ({holidaysInRange.length} วัน)
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            {holidaysInRange
              .slice(0, 12)
              .map((h) => `${formatThaiDate(h.date)} ${h.name}`)
              .join(" · ")}
            {holidaysInRange.length > 12 && " …"}
          </p>
        </div>
      )}
    </div>
  );
}
