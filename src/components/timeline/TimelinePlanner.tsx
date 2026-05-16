"use client";

// Client orchestrator: owns TimelineState, runs the schedule, wires the
// input UI. Gantt + exports + URL-share land in later build steps.
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10 / §15

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Phase,
  ProjectConfig,
  ProjectType,
} from "@/src/lib/timeline/types";
import {
  computeSchedule,
  DependencyCycleError,
} from "@/src/lib/timeline/dependency-engine";
import { getTemplate } from "@/src/lib/timeline/templates";
import { getNextWorkingDay, countWorkingDays } from "@/src/lib/timeline/date-utils";
import { getThaiHolidaysInRange } from "@/src/lib/timeline/thai-holidays";
import { formatThaiDate } from "@/src/lib/timeline/date-format";
import { ProjectSetup } from "./ProjectSetup";
import { TemplateSelector } from "./TemplateSelector";
import { TaskTable } from "./TaskTable";
import { GanttChart } from "./GanttChart";
import { ExportPanel } from "./ExportPanel";
import { buildShareUrl, decodeState } from "@/src/lib/timeline/url-state";

function defaultConfig(): ProjectConfig {
  const base: ProjectConfig = {
    name: "โปรเจกต์ใหม่",
    projectType: "web-app",
    startDate: new Date(),
    workingDaysOnly: true,
    includeThaiHolidays: true,
    customHolidays: [],
    weekendDays: [0, 6],
  };
  base.startDate = getNextWorkingDay(new Date(), base);
  return base;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-navy-900">{value}</p>
    </div>
  );
}

export function TimelinePlanner() {
  const [config, setConfig] = useState<ProjectConfig>(defaultConfig);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const ganttRef = useRef<HTMLDivElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  }

  // ── Undo: last 10 snapshots, Ctrl/⌘+Z (spec §15.4) ──
  const history = useRef<{ config: ProjectConfig; phases: Phase[] }[]>([]);
  function snapshot() {
    history.current.push({ config, phases });
    if (history.current.length > 10) history.current.shift();
  }
  function updateConfig(next: ProjectConfig) {
    snapshot();
    setConfig(next);
  }
  function updatePhases(next: Phase[]) {
    snapshot();
    setPhases(next);
  }
  function undo() {
    const prev = history.current.pop();
    if (!prev) return;
    setConfig(prev.config);
    setPhases(prev.phases);
    showToast("เลิกทำแล้ว");
  }
  // Keep a stable ref so the keydown listener always calls the latest undo.
  const undoRef = useRef(undo);
  undoRef.current = undo;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "z"
      ) {
        e.preventDefault();
        undoRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Restore state from `?state=` on first mount (spec §13).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("state");
    if (!param) return;
    let cancelled = false;
    decodeState(param).then((restored) => {
      if (cancelled || !restored) return;
      setConfig(restored.config);
      setPhases(restored.phases);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleShare() {
    try {
      const url = await buildShareUrl({ config, phases });
      await navigator.clipboard.writeText(url);
      showToast("คัดลอกลิงก์แล้ว");
    } catch {
      showToast("คัดลอกลิงก์ไม่สำเร็จ");
    }
  }

  // Last successfully scheduled phases — shown when a new edit introduces a
  // cycle, so the view stays stable (spec §9).
  const lastValid = useRef<Phase[]>([]);

  const { scheduled, cycleTaskIds } = useMemo(() => {
    if (phases.length === 0) {
      lastValid.current = [];
      return { scheduled: [] as Phase[], cycleTaskIds: new Set<string>() };
    }
    try {
      const result = computeSchedule(phases, config);
      lastValid.current = result;
      return { scheduled: result, cycleTaskIds: new Set<string>() };
    } catch (e) {
      if (e instanceof DependencyCycleError) {
        return {
          scheduled: lastValid.current,
          cycleTaskIds: new Set(e.taskIds),
        };
      }
      throw e;
    }
  }, [phases, config]);

  // Derived directly from the schedule result — no separate state needed.
  const cycleError = cycleTaskIds.size
    ? "พบ Dependency เป็นวงกลม — ตารางเวลายังคงเป็นเวอร์ชันล่าสุดที่ถูกต้อง"
    : null;

  const stats = useMemo(() => {
    const tasks = scheduled.flatMap((p) => p.tasks);
    const starts = tasks
      .map((t) => t.startDate)
      .filter(Boolean) as Date[];
    const ends = tasks.map((t) => t.endDate).filter(Boolean) as Date[];
    if (starts.length === 0 || ends.length === 0) return null;
    const minStart = new Date(Math.min(...starts.map((d) => d.getTime())));
    const maxEnd = new Date(Math.max(...ends.map((d) => d.getTime())));
    const holidays = config.includeThaiHolidays
      ? getThaiHolidaysInRange(minStart, maxEnd)
      : [];
    const calendarDays =
      Math.round((maxEnd.getTime() - minStart.getTime()) / 86400000) + 1;
    return {
      minStart,
      maxEnd,
      workingDays: countWorkingDays(minStart, maxEnd, config),
      holidays,
      phaseCount: scheduled.length,
      taskCount: tasks.length,
      calendarDays,
    };
  }, [scheduled, config]);

  function applyTemplate(type: ProjectType) {
    snapshot();
    setConfig((c) => ({ ...c, projectType: type }));
    setPhases(getTemplate(type));
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          role="status"
          className="tl-toast-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white shadow-card"
        >
          {toast}
        </div>
      )}
      <ProjectSetup
        config={config}
        onChange={updateConfig}
        holidaysInRange={stats?.holidays ?? []}
      />

      {phases.length === 0 ? (
        <TemplateSelector onSelect={applyTemplate} hasExistingTasks={false} />
      ) : (
        <>
          {stats && (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="วันทำการรวม" value={`${stats.workingDays} วัน`} />
              <Stat
                label="วันสิ้นสุดโปรเจกต์"
                value={formatThaiDate(stats.maxEnd)}
              />
              <Stat label="วันหยุดในช่วง" value={`${stats.holidays.length} วัน`} />
              <Stat label="จำนวน Phase" value={`${stats.phaseCount}`} />
              <Stat label="จำนวน Task" value={`${stats.taskCount}`} />
              <Stat
                label="วันตามปฏิทิน"
                value={`${stats.calendarDays} วัน`}
              />
            </div>
          )}

          {cycleError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {cycleError}
            </div>
          )}

          {phases.every((p) => p.tasks.length === 0) && (
            <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-8 text-center">
              <p className="text-sm font-medium text-muted">
                ยังไม่มี task — เลือก template เพื่อเริ่มต้น
                หรือเพิ่ม task เองด้านล่าง
              </p>
              <button
                type="button"
                onClick={() => setPhases([])}
                className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                เลือก Template
              </button>
            </div>
          )}

          <details className="rounded-2xl border border-line bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-muted">
              เปลี่ยน Template (จะแทนที่ tasks ที่มีอยู่)
            </summary>
            <div className="mt-4">
              <TemplateSelector
                onSelect={applyTemplate}
                hasExistingTasks
              />
            </div>
          </details>

          <ExportPanel
            phases={scheduled}
            config={config}
            ganttRef={ganttRef}
            onShare={handleShare}
          />

          <TaskTable
            phases={scheduled}
            onChange={updatePhases}
            cycleTaskIds={cycleTaskIds}
          />

          <GanttChart ref={ganttRef} phases={scheduled} config={config} />
        </>
      )}
    </div>
  );
}
