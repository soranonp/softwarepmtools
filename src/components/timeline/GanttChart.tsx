"use client";

// SVG Gantt chart — sticky name column + scrollable timeline
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.4

import { forwardRef, useMemo, useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { Phase, ProjectConfig } from "@/src/lib/timeline/types";
import { isHoliday } from "@/src/lib/timeline/date-utils";
import { CATEGORY_META } from "@/src/lib/timeline/categories";
import {
  GanttTimeline,
  autoZoom,
  buildTicks,
  type GanttZoom,
} from "./GanttTimeline";
import { GanttBar } from "./GanttBar";

const LEFT_W = 220;
const ROW_H = 34;
const HEADER_H = 40;
const BAR_H = 18;
const DAY_WIDTH: Record<GanttZoom, number> = { day: 30, week: 14, month: 5 };

interface Row {
  kind: "phase" | "task";
  label: string;
  color: string;
  y: number;
  // task-only
  taskId?: string;
  x?: number;
  width?: number;
}

export const GanttChart = forwardRef<
  HTMLDivElement,
  { phases: Phase[]; config: ProjectConfig }
>(function GanttChart({ phases, config }, ref) {
  const [zoomOverride, setZoomOverride] = useState<GanttZoom | "auto">("auto");
  const [showArrows, setShowArrows] = useState(false);

  const layout = useMemo(() => {
    const tasks = phases.flatMap((p) => p.tasks);
    const starts = tasks.map((t) => t.startDate).filter(Boolean) as Date[];
    const ends = tasks.map((t) => t.endDate).filter(Boolean) as Date[];
    if (starts.length === 0 || ends.length === 0) return null;

    const minStart = new Date(Math.min(...starts.map((d) => +d)));
    const maxEnd = new Date(Math.max(...ends.map((d) => +d)));
    const spanDays = differenceInCalendarDays(maxEnd, minStart) + 1;
    const zoom: GanttZoom =
      zoomOverride === "auto" ? autoZoom(spanDays) : zoomOverride;
    const dayWidth = DAY_WIDTH[zoom];

    // Snap the left edge for a tidy axis, pad the right edge.
    const rangeStart =
      zoom === "month"
        ? startOfMonth(minStart)
        : zoom === "week"
          ? startOfWeek(minStart, { weekStartsOn: 1 })
          : addDays(startOfDay(minStart), -2);
    const totalDays =
      differenceInCalendarDays(maxEnd, rangeStart) + 1 + (zoom === "day" ? 2 : 7);

    const x = (d: Date) =>
      differenceInCalendarDays(d, rangeStart) * dayWidth;

    const rows: Row[] = [];
    const taskPos = new Map<
      string,
      { x: number; w: number; y: number }
    >();
    let rowIndex = 0;
    for (const phase of phases) {
      rows.push({
        kind: "phase",
        label: phase.name,
        color: CATEGORY_META[phase.category].color,
        y: HEADER_H + rowIndex * ROW_H,
      });
      rowIndex++;
      for (const t of phase.tasks) {
        const y = HEADER_H + rowIndex * ROW_H;
        if (t.startDate && t.endDate) {
          const bx = x(t.startDate);
          const bw =
            (differenceInCalendarDays(t.endDate, t.startDate) + 1) * dayWidth;
          rows.push({
            kind: "task",
            label: t.name,
            color: CATEGORY_META[t.category].color,
            y,
            taskId: t.id,
            x: bx,
            width: bw,
          });
          taskPos.set(t.id, { x: bx, w: bw, y });
        } else {
          rows.push({
            kind: "task",
            label: t.name,
            color: CATEGORY_META[t.category].color,
            y,
          });
        }
        rowIndex++;
      }
    }

    const chartWidth = Math.max(totalDays * dayWidth, 320);
    const chartHeight = HEADER_H + rowIndex * ROW_H;
    const ticks = buildTicks(rangeStart, totalDays, dayWidth, zoom);

    // Weekend / holiday background bands.
    const bands: { x: number; w: number; fill: string }[] = [];
    for (let d = 0; d < totalDays; d++) {
      const date = addDays(rangeStart, d);
      const weekend =
        config.workingDaysOnly && config.weekendDays.includes(date.getDay());
      const holiday = isHoliday(date, config);
      if (holiday) bands.push({ x: d * dayWidth, w: dayWidth, fill: "#e9edf2" });
      else if (weekend)
        bands.push({ x: d * dayWidth, w: dayWidth, fill: "#eaf1fb" });
    }

    const today = startOfDay(new Date());
    const todayX =
      today >= rangeStart && differenceInCalendarDays(today, rangeStart) <= totalDays
        ? x(today)
        : null;

    // Dependency connectors (FS): predecessor end → successor start.
    const arrows: string[] = [];
    if (showArrows) {
      for (const phase of phases) {
        for (const t of phase.tasks) {
          const to = taskPos.get(t.id);
          if (!to) continue;
          for (const depId of t.dependencies) {
            const from = taskPos.get(depId);
            if (!from) continue;
            const x1 = from.x + from.w;
            const y1 = from.y + ROW_H / 2;
            const x2 = to.x;
            const y2 = to.y + ROW_H / 2;
            const midX = Math.max(x1 + 8, x2 - 8);
            arrows.push(
              `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`,
            );
          }
        }
      }
    }

    return {
      rows,
      chartWidth,
      chartHeight,
      ticks,
      bands,
      todayX,
      arrows,
      zoom,
    };
  }, [phases, config, zoomOverride, showArrows]);

  if (!layout) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center text-sm text-muted">
        ยังไม่มี task ที่จะแสดงใน Gantt Chart
      </div>
    );
  }

  const {
    rows,
    chartWidth,
    chartHeight,
    ticks,
    bands,
    todayX,
    arrows,
    zoom,
  } = layout;

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="text-lg font-bold text-ink">Gantt Chart</h2>
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 text-muted">
            <input
              type="checkbox"
              checked={showArrows}
              onChange={(e) => setShowArrows(e.target.checked)}
            />
            แสดงเส้น Dependency
          </label>
          <div className="flex overflow-hidden rounded-md border border-line">
            {(["auto", "day", "week", "month"] as const).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoomOverride(z)}
                className={`px-2.5 py-1 font-semibold ${
                  (zoomOverride === z ||
                    (zoomOverride === "auto" && z === "auto"))
                    ? "bg-brand-600 text-white"
                    : "bg-white text-muted hover:bg-surface"
                }`}
              >
                {z === "auto"
                  ? "Auto"
                  : z === "day"
                    ? "วัน"
                    : z === "week"
                      ? "สัปดาห์"
                      : "เดือน"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sticky task-name column */}
        <div
          className="shrink-0 border-r border-line bg-white"
          style={{ width: LEFT_W }}
        >
          <div style={{ height: HEADER_H }} className="border-b border-line" />
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 truncate border-b border-line px-3 text-xs ${
                r.kind === "phase"
                  ? "bg-surface font-bold text-navy-900"
                  : "text-navy-900"
              }`}
              style={{ height: ROW_H }}
              title={r.label}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: r.color }}
                aria-hidden
              />
              <span className="truncate">{r.label}</span>
            </div>
          ))}
        </div>

        {/* Scrollable timeline */}
        <div data-gantt-scroll className="grow overflow-x-auto">
          <svg
            width={chartWidth}
            height={chartHeight}
            role="img"
            aria-label={`Gantt chart (${zoom} view)`}
          >
            {bands.map((b, i) => (
              <rect
                key={`b${i}`}
                x={b.x}
                y={HEADER_H}
                width={b.w}
                height={chartHeight - HEADER_H}
                fill={b.fill}
              />
            ))}
            {ticks.map((t, i) => (
              <line
                key={`g${i}`}
                x1={t.x}
                y1={HEADER_H}
                x2={t.x}
                y2={chartHeight}
                stroke={t.major ? "#dbe2ea" : "#eef2f6"}
                strokeWidth={1}
              />
            ))}
            {rows.map((r, i) => (
              <line
                key={`r${i}`}
                x1={0}
                y1={r.y + ROW_H}
                x2={chartWidth}
                y2={r.y + ROW_H}
                stroke="#eef2f6"
                strokeWidth={1}
              />
            ))}

            {arrows.map((d, i) => (
              <path
                key={`a${i}`}
                d={d}
                fill="none"
                stroke="#8a99a9"
                strokeWidth={1.25}
                strokeDasharray="3 2"
                markerEnd="url(#tl-arrow)"
              />
            ))}
            <defs>
              <marker
                id="tl-arrow"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0 0 L8 4 L0 8 z" fill="#8a99a9" />
              </marker>
            </defs>

            {rows.map((r, i) =>
              r.kind === "task" &&
              r.taskId &&
              r.x !== undefined &&
              r.width !== undefined ? (
                <GanttBar
                  key={`bar${i}`}
                  task={
                    phases
                      .flatMap((p) => p.tasks)
                      .find((t) => t.id === r.taskId)!
                  }
                  x={r.x}
                  y={r.y + (ROW_H - BAR_H) / 2}
                  width={r.width}
                  height={BAR_H}
                />
              ) : null,
            )}

            {todayX !== null && (
              <g>
                <line
                  x1={todayX}
                  y1={HEADER_H}
                  x2={todayX}
                  y2={chartHeight}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
                <text
                  x={todayX + 4}
                  y={HEADER_H + 12}
                  fontSize={10}
                  fill="#ef4444"
                  fontWeight={700}
                >
                  วันนี้
                </text>
              </g>
            )}

            <GanttTimeline
              ticks={ticks}
              height={HEADER_H}
              chartWidth={chartWidth}
            />
          </svg>
        </div>
      </div>
    </div>
  );
});
