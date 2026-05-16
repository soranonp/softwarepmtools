"use client";

// Export buttons: Excel / PNG / PDF
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.5 / §15

import { useRef, useState, type RefObject } from "react";
import type { Phase, ProjectConfig } from "@/src/lib/timeline/types";
import { exportTimelineExcel } from "@/src/lib/timeline/export/excel-export";
import { exportGanttPng } from "@/src/lib/timeline/export/png-export";
import { exportTimelinePdf } from "@/src/lib/timeline/export/pdf-export";

type Busy = null | "excel" | "png" | "pdf";

export function ExportPanel({
  phases,
  config,
  ganttRef,
  onShare,
}: {
  phases: Phase[];
  config: ProjectConfig;
  ganttRef: RefObject<HTMLDivElement | null>;
  onShare: () => void | Promise<void>;
}) {
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const lastAction = useRef<{
    kind: Exclude<Busy, null>;
    fn: () => Promise<unknown>;
  } | null>(null);

  async function run(kind: Exclude<Busy, null>, fn: () => Promise<unknown>) {
    lastAction.current = { kind, fn };
    setBusy(kind);
    setError(null);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      setError("Export ไม่สำเร็จ");
    } finally {
      setBusy(null);
    }
  }

  function retry() {
    if (lastAction.current)
      run(lastAction.current.kind, lastAction.current.fn);
  }

  function needGantt(): HTMLDivElement {
    const node = ganttRef.current;
    if (!node) throw new Error("Gantt chart not ready");
    return node;
  }

  const hasTasks = phases.some((p) => p.tasks.length > 0);
  const disabled = !hasTasks || busy !== null;

  const spinner = (
    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-navy-900">Export:</span>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            run("excel", () => exportTimelineExcel(phases, config))
          }
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {busy === "excel" && spinner}
          Excel (.xlsx)
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => run("png", () => exportGanttPng(needGantt()))}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-brand-600 disabled:opacity-60"
        >
          {busy === "png" && spinner}
          PNG (Gantt)
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            run("pdf", () => exportTimelinePdf(needGantt(), phases, config))
          }
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-brand-600 disabled:opacity-60"
        >
          {busy === "pdf" && spinner}
          PDF (2 หน้า)
        </button>

        <button
          type="button"
          disabled={!hasTasks}
          onClick={() => onShare()}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-brand-600 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-60"
        >
          🔗 แชร์ลิงก์
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-3 text-sm font-medium text-red-600"
        >
          {error}
          <button
            type="button"
            onClick={retry}
            disabled={busy !== null}
            className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            ลองใหม่
          </button>
        </p>
      )}
    </div>
  );
}
