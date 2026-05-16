"use client";

// Single editable task row
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.3

import { useState } from "react";
import type { Task } from "@/src/lib/timeline/types";
import { cn } from "@/src/lib/cn";
import { formatThaiDate } from "@/src/lib/timeline/date-format";

export interface TaskRowProps {
  task: Task;
  index: number;
  /** All tasks except this one — for the dependency picker. */
  otherTasks: { id: string; name: string }[];
  hasCycle: boolean;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<Task>) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  onDragStartRow: () => void;
  onDragOverRow: () => void;
  onDropRow: () => void;
}

const cellInput =
  "w-full rounded-md border border-line bg-white px-2 py-1.5 text-sm text-navy-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

export function TaskRow({
  task,
  index,
  otherTasks,
  hasCycle,
  isFirst,
  isLast,
  onChange,
  onDelete,
  onMove,
  onDragStartRow,
  onDragOverRow,
  onDropRow,
}: TaskRowProps) {
  const [depOpen, setDepOpen] = useState(false);
  const [depFilter, setDepFilter] = useState("");

  const durationInvalid =
    !Number.isInteger(task.duration) || task.duration < 1;

  const depNames = task.dependencies
    .map((id) => otherTasks.find((t) => t.id === id)?.name)
    .filter(Boolean) as string[];

  const filtered = otherTasks.filter((t) =>
    t.name.toLowerCase().includes(depFilter.toLowerCase()),
  );

  function toggleDep(id: string) {
    const next = task.dependencies.includes(id)
      ? task.dependencies.filter((d) => d !== id)
      : [...task.dependencies, id];
    onChange({ dependencies: next });
  }

  return (
    <tr
      onDragOver={(e) => {
        e.preventDefault();
        onDragOverRow();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropRow();
      }}
      className={cn(
        "border-b border-line last:border-0",
        hasCycle && "outline outline-2 -outline-offset-2 outline-red-500",
      )}
    >
      <td
        draggable
        onDragStart={onDragStartRow}
        aria-label="ลากเพื่อจัดลำดับ"
        title="ลากเพื่อจัดลำดับ"
        className="cursor-grab select-none px-1 text-center text-muted active:cursor-grabbing"
      >
        ⠿
      </td>
      <td className="px-2 py-2 text-center text-xs text-muted">{index + 1}</td>
      <td className="px-2 py-2">
        <input
          aria-label="ชื่อ Task"
          className={cellInput}
          value={task.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </td>
      <td className="px-2 py-2">
        <input
          aria-label="ระยะเวลา (วันทำการ)"
          type="number"
          min={1}
          step={1}
          className={cn(
            cellInput,
            "w-20 text-center",
            durationInvalid && "border-red-500 ring-1 ring-red-500",
          )}
          title={durationInvalid ? "ต้องเป็นจำนวนเต็ม ≥ 1" : undefined}
          value={task.duration}
          onChange={(e) => onChange({ duration: Number(e.target.value) })}
        />
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-xs text-muted">
        {task.startDate ? formatThaiDate(task.startDate) : "—"}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-xs text-muted">
        {task.endDate ? formatThaiDate(task.endDate) : "—"}
      </td>
      <td className="px-2 py-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDepOpen((o) => !o)}
            className="w-full min-w-[8rem] rounded-md border border-line px-2 py-1.5 text-left text-xs text-navy-900 hover:border-brand-600"
            aria-expanded={depOpen}
          >
            {depNames.length === 0
              ? "— ไม่มี —"
              : depNames.length <= 2
                ? depNames.join(", ")
                : `${depNames.length} tasks`}
          </button>
          {depOpen && (
            <div className="absolute z-20 mt-1 w-64 rounded-lg border border-line bg-white p-2 shadow-card">
              <input
                autoFocus
                placeholder="ค้นหา task…"
                value={depFilter}
                onChange={(e) => setDepFilter(e.target.value)}
                className="mb-2 w-full rounded-md border border-line px-2 py-1 text-xs focus:border-brand-600 focus:outline-none"
              />
              <div className="max-h-48 overflow-auto">
                {filtered.length === 0 && (
                  <p className="px-1 py-2 text-xs text-muted">ไม่พบ task</p>
                )}
                {filtered.map((t) => (
                  <label
                    key={t.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-surface"
                  >
                    <input
                      type="checkbox"
                      checked={task.dependencies.includes(t.id)}
                      onChange={() => toggleDep(t.id)}
                    />
                    <span className="truncate">{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="px-2 py-2">
        <input
          aria-label="ผู้ดำเนินการ"
          className={cn(cellInput, "w-24")}
          placeholder="PM"
          value={task.assignee ?? ""}
          onChange={(e) => onChange({ assignee: e.target.value })}
        />
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-center">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            aria-label="เลื่อนขึ้น"
            disabled={isFirst}
            onClick={() => onMove(-1)}
            className="rounded p-1 text-muted hover:bg-surface hover:text-navy-900 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            aria-label="เลื่อนลง"
            disabled={isLast}
            onClick={() => onMove(1)}
            className="rounded p-1 text-muted hover:bg-surface hover:text-navy-900 disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            aria-label="ลบ task"
            onClick={onDelete}
            className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
