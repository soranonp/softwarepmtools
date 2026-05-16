"use client";

// Editable task table grouped by collapsible phases
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.3

import { useRef } from "react";
import { nanoid } from "nanoid";
import type { Phase, Task } from "@/src/lib/timeline/types";
import { CATEGORY_META } from "@/src/lib/timeline/categories";
import { TaskRow } from "./TaskRow";

export function TaskTable({
  phases,
  onChange,
  cycleTaskIds,
}: {
  phases: Phase[];
  onChange: (phases: Phase[]) => void;
  cycleTaskIds: Set<string>;
}) {
  const allTasks = phases.flatMap((p) => p.tasks);

  // Drag-reorder bookkeeping (within a single phase only — spec §10.3).
  const drag = useRef<{ phaseId: string; from: number; to: number } | null>(
    null,
  );

  function updatePhases(next: Phase[]) {
    onChange(next);
  }

  function reorderTask(phaseId: string, from: number, to: number) {
    if (from === to) return;
    updatePhases(
      phases.map((p) => {
        if (p.id !== phaseId) return p;
        const tasks = [...p.tasks];
        const [moved] = tasks.splice(from, 1);
        tasks.splice(to, 0, moved);
        return { ...p, tasks };
      }),
    );
  }

  function patchTask(phaseId: string, taskId: string, patch: Partial<Task>) {
    updatePhases(
      phases.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, ...patch } : t,
              ),
            },
      ),
    );
  }

  function deleteTask(phaseId: string, taskId: string) {
    updatePhases(
      phases.map((p) =>
        p.id !== phaseId
          ? p
          : { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) },
      ),
    );
  }

  function moveTask(phaseId: string, idx: number, dir: -1 | 1) {
    updatePhases(
      phases.map((p) => {
        if (p.id !== phaseId) return p;
        const tasks = [...p.tasks];
        const j = idx + dir;
        if (j < 0 || j >= tasks.length) return p;
        [tasks[idx], tasks[j]] = [tasks[j], tasks[idx]];
        return { ...p, tasks };
      }),
    );
  }

  function addTask(phaseId: string) {
    updatePhases(
      phases.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: [
                ...p.tasks,
                {
                  id: nanoid(12),
                  name: "Task ใหม่",
                  category: p.category,
                  duration: 1,
                  dependencies: p.tasks.length
                    ? [p.tasks[p.tasks.length - 1].id]
                    : [],
                  progress: 0,
                },
              ],
            },
      ),
    );
  }

  function addPhase() {
    updatePhases([
      ...phases,
      {
        id: nanoid(12),
        name: `Phase ${phases.length + 1}: ใหม่`,
        category: "planning",
        tasks: [],
      },
    ]);
  }

  function patchPhase(phaseId: string, patch: Partial<Phase>) {
    updatePhases(
      phases.map((p) => (p.id === phaseId ? { ...p, ...patch } : p)),
    );
  }

  function deletePhase(phaseId: string) {
    updatePhases(phases.filter((p) => p.id !== phaseId));
  }

  return (
    <div className="space-y-4">
      {phases.map((phase) => {
        const totalDays = phase.tasks.reduce(
          (s, t) => s + (Number.isFinite(t.duration) ? t.duration : 0),
          0,
        );
        return (
          <div
            key={phase.id}
            className="overflow-hidden rounded-2xl border border-line bg-white"
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-4 py-3">
              <button
                type="button"
                aria-label={phase.collapsed ? "ขยาย" : "ย่อ"}
                onClick={() =>
                  patchPhase(phase.id, { collapsed: !phase.collapsed })
                }
                className="text-muted hover:text-navy-900"
              >
                {phase.collapsed ? "▸" : "▾"}
              </button>
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: CATEGORY_META[phase.category].color }}
                aria-hidden
              />
              <input
                aria-label="ชื่อ Phase"
                value={phase.name}
                onChange={(e) =>
                  patchPhase(phase.id, { name: e.target.value })
                }
                className="min-w-[12rem] flex-1 rounded-md border border-transparent bg-transparent px-1 py-1 text-sm font-bold text-navy-900 hover:border-line focus:border-brand-600 focus:bg-white focus:outline-none"
              />
              <span className="text-xs text-muted">
                {phase.tasks.length} tasks · {totalDays} วันทำการ
              </span>
              <button
                type="button"
                onClick={() => deletePhase(phase.id)}
                className="rounded p-1 text-xs text-muted hover:bg-red-50 hover:text-red-600"
                aria-label="ลบ phase"
              >
                ลบ Phase
              </button>
            </div>

            {!phase.collapsed && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-line text-left text-xs font-semibold text-muted">
                      <th className="px-1 py-2" aria-label="จัดลำดับ" />
                      <th className="px-2 py-2 text-center">#</th>
                      <th className="px-2 py-2">ชื่อ Task</th>
                      <th className="px-2 py-2">Duration</th>
                      <th className="px-2 py-2">Start</th>
                      <th className="px-2 py-2">End</th>
                      <th className="px-2 py-2">Depends on</th>
                      <th className="px-2 py-2">Assignee</th>
                      <th className="px-2 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phase.tasks.map((task, i) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        index={i}
                        otherTasks={allTasks
                          .filter((t) => t.id !== task.id)
                          .map((t) => ({ id: t.id, name: t.name }))}
                        hasCycle={cycleTaskIds.has(task.id)}
                        isFirst={i === 0}
                        isLast={i === phase.tasks.length - 1}
                        onChange={(patch) =>
                          patchTask(phase.id, task.id, patch)
                        }
                        onDelete={() => deleteTask(phase.id, task.id)}
                        onMove={(dir) => moveTask(phase.id, i, dir)}
                        onDragStartRow={() => {
                          drag.current = {
                            phaseId: phase.id,
                            from: i,
                            to: i,
                          };
                        }}
                        onDragOverRow={() => {
                          if (drag.current?.phaseId === phase.id)
                            drag.current.to = i;
                        }}
                        onDropRow={() => {
                          const d = drag.current;
                          if (d && d.phaseId === phase.id)
                            reorderTask(phase.id, d.from, i);
                          drag.current = null;
                        }}
                      />
                    ))}
                    {phase.tasks.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-2 py-4 text-center text-xs text-muted"
                        >
                          ยังไม่มี task ในเฟสนี้
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="border-t border-line px-4 py-2">
                  <button
                    type="button"
                    onClick={() => addTask(phase.id)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    + เพิ่ม Task
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addPhase}
        className="w-full rounded-2xl border border-dashed border-line py-3 text-sm font-semibold text-brand-600 hover:border-brand-600 hover:bg-brand-50"
      >
        + เพิ่ม Phase
      </button>
    </div>
  );
}
