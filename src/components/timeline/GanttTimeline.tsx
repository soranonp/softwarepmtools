"use client";

// Date axis header — auto-zoom day / week / month
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.4

import { addDays, differenceInCalendarDays, format } from "date-fns";
import { th } from "date-fns/locale";

export type GanttZoom = "day" | "week" | "month";

/** Pick zoom from project length unless the user forced one. */
export function autoZoom(totalDays: number): GanttZoom {
  if (totalDays < 30) return "day";
  if (totalDays <= 90) return "week";
  return "month";
}

export interface AxisTick {
  x: number;
  label: string;
  /** Major ticks get a darker gridline + bold label (month boundaries). */
  major: boolean;
}

/** Build the tick list for the given zoom. */
export function buildTicks(
  rangeStart: Date,
  totalDays: number,
  dayWidth: number,
  zoom: GanttZoom,
): AxisTick[] {
  const ticks: AxisTick[] = [];
  if (zoom === "month") {
    let cursor = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth(),
      1,
    );
    while (differenceInCalendarDays(cursor, rangeStart) < totalDays) {
      const offset = differenceInCalendarDays(cursor, rangeStart);
      ticks.push({
        x: Math.max(0, offset) * dayWidth,
        label: format(cursor, "MMM yyyy", { locale: th }),
        major: true,
      });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    return ticks;
  }
  if (zoom === "week") {
    let week = 1;
    for (let d = 0; d < totalDays; d += 7) {
      const date = addDays(rangeStart, d);
      ticks.push({
        x: d * dayWidth,
        label: `W${week} · ${format(date, "d MMM", { locale: th })}`,
        major: date.getDate() <= 7,
      });
      week++;
    }
    return ticks;
  }
  // day
  for (let d = 0; d < totalDays; d++) {
    const date = addDays(rangeStart, d);
    const major = date.getDate() === 1 || d === 0;
    ticks.push({
      x: d * dayWidth,
      label: major
        ? format(date, "d MMM", { locale: th })
        : String(date.getDate()),
      major,
    });
  }
  return ticks;
}

export function GanttTimeline({
  ticks,
  height,
  chartWidth,
}: {
  ticks: AxisTick[];
  height: number;
  chartWidth: number;
}) {
  return (
    <g>
      <rect x={0} y={0} width={chartWidth} height={height} fill="#f4f7fa" />
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={t.x}
            y1={0}
            x2={t.x}
            y2={height}
            stroke={t.major ? "#c4cedb" : "#e3e9f0"}
            strokeWidth={1}
          />
          <text
            x={t.x + 4}
            y={height - 8}
            fontSize={t.major ? 11 : 10}
            fontWeight={t.major ? 700 : 400}
            fill={t.major ? "#0a2540" : "#54657a"}
          >
            {t.label}
          </text>
        </g>
      ))}
      <line
        x1={0}
        y1={height}
        x2={chartWidth}
        y2={height}
        stroke="#c4cedb"
        strokeWidth={1}
      />
    </g>
  );
}
