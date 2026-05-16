"use client";

// One task bar (memoized — spec §10.4 perf note)
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.4

import { memo } from "react";
import type { Task } from "@/src/lib/timeline/types";
import { CATEGORY_META } from "@/src/lib/timeline/categories";
import { formatThaiDate } from "@/src/lib/timeline/date-format";

export interface GanttBarProps {
  task: Task;
  x: number;
  y: number;
  width: number;
  height: number;
}

function GanttBarImpl({ task, x, y, width, height }: GanttBarProps) {
  const color = CATEGORY_META[task.category].color;
  const progress = Math.max(0, Math.min(100, task.progress)) / 100;
  const tip =
    `${task.name}\n` +
    `${task.startDate ? formatThaiDate(task.startDate) : "—"} → ` +
    `${task.endDate ? formatThaiDate(task.endDate) : "—"}\n` +
    `${task.duration} วันทำการ` +
    (task.assignee ? ` · ${task.assignee}` : "") +
    (task.progress ? ` · ${task.progress}%` : "");

  return (
    <g role="img" aria-label={tip.replace(/\n/g, ", ")}>
      {/* Native tooltip on hover; richer tooltip is a Step 8 polish item. */}
      <title>{tip}</title>
      <rect
        x={x}
        y={y}
        width={Math.max(width, 3)}
        height={height}
        rx={4}
        fill={color}
        fillOpacity={0.35}
      />
      {progress > 0 && (
        <rect
          x={x}
          y={y}
          width={Math.max(width, 3) * progress}
          height={height}
          rx={4}
          fill={color}
        />
      )}
      <rect
        x={x}
        y={y}
        width={Math.max(width, 3)}
        height={height}
        rx={4}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
  );
}

export const GanttBar = memo(GanttBarImpl);
