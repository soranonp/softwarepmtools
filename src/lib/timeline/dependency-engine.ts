// Finish-to-Start (FS) dependency resolver
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §9
// MVP scope: FS only. No FF/SS/SF (spec §20).

import { addDays } from "date-fns";
import type { Phase, ProjectConfig, Task } from "./types";
import { addWorkingDays, getNextWorkingDay } from "./date-utils";

/**
 * Thrown when the task graph contains a cycle. `taskNames` is a human-readable
 * path (Thai task names) for the error toast; `taskIds` is the raw cycle.
 */
export class DependencyCycleError extends Error {
  readonly taskIds: string[];
  readonly taskNames: string[];
  constructor(taskIds: string[], taskNames: string[]) {
    super(`พบ Dependency เป็นวงกลม: ${taskNames.join(" → ")}`);
    this.name = "DependencyCycleError";
    this.taskIds = taskIds;
    this.taskNames = taskNames;
  }
}

/** DFS back-edge search — returns one cycle as an ordered list of task IDs. */
function findCycle(byId: Map<string, Task>): string[] {
  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Map<string, number>();
  const stack: string[] = [];
  for (const id of byId.keys()) color.set(id, WHITE);

  function dfs(id: string): string[] | null {
    color.set(id, GRAY);
    stack.push(id);
    for (const dep of byId.get(id)?.dependencies ?? []) {
      if (!byId.has(dep)) continue;
      if (color.get(dep) === GRAY) {
        // Found a back-edge: slice the stack from `dep` to here.
        return [...stack.slice(stack.indexOf(dep)), dep];
      }
      if (color.get(dep) === WHITE) {
        const found = dfs(dep);
        if (found) return found;
      }
    }
    stack.pop();
    color.set(id, BLACK);
    return null;
  }

  for (const id of byId.keys()) {
    if (color.get(id) === WHITE) {
      const found = dfs(id);
      if (found) return found;
    }
  }
  return [];
}

/**
 * Compute start/end dates for every task using FS dependencies.
 *
 * - No deps → starts on the next working day from `config.startDate`.
 * - With deps → starts the next working day after the latest predecessor end.
 * - `endDate = addWorkingDays(startDate, duration - 1)` (start day counts).
 *
 * Returns new Phase/Task objects (does not mutate input). Throws
 * {@link DependencyCycleError} if the graph has a cycle — callers should
 * catch it and keep the last valid schedule (spec §9).
 */
export function computeSchedule(
  phases: Phase[],
  config: ProjectConfig,
): Phase[] {
  const tasks: Task[] = [];
  for (const p of phases) for (const t of p.tasks) tasks.push(t);
  const byId = new Map(tasks.map((t) => [t.id, t]));

  // Kahn topological sort. Dangling dependency IDs are ignored so a deleted
  // predecessor doesn't wedge the whole schedule.
  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const t of tasks) indegree.set(t.id, 0);
  for (const t of tasks) {
    for (const dep of t.dependencies) {
      if (!byId.has(dep)) continue;
      indegree.set(t.id, (indegree.get(t.id) ?? 0) + 1);
      dependents.set(dep, [...(dependents.get(dep) ?? []), t.id]);
    }
  }

  const queue = tasks
    .filter((t) => (indegree.get(t.id) ?? 0) === 0)
    .map((t) => t.id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const next of dependents.get(id) ?? []) {
      const d = (indegree.get(next) ?? 0) - 1;
      indegree.set(next, d);
      if (d === 0) queue.push(next);
    }
  }

  if (order.length !== tasks.length) {
    const cycle = findCycle(byId);
    throw new DependencyCycleError(
      cycle,
      cycle.map((id) => byId.get(id)?.name ?? id),
    );
  }

  const scheduled = new Map<string, Task>();
  for (const id of order) {
    const t = byId.get(id)!;
    const validDeps = t.dependencies.filter((d) => byId.has(d));
    let start: Date;
    if (validDeps.length === 0) {
      start = getNextWorkingDay(config.startDate, config);
    } else {
      let maxEnd = new Date(-8640000000000000);
      for (const d of validDeps) {
        const de = scheduled.get(d)!.endDate!;
        if (de > maxEnd) maxEnd = de;
      }
      start = getNextWorkingDay(addDays(maxEnd, 1), config);
    }
    // Duration is validated >= 1 in the UI; clamp defensively here.
    const dur = Math.max(1, Math.floor(t.duration));
    const end = addWorkingDays(start, dur - 1, config);
    scheduled.set(id, { ...t, startDate: start, endDate: end });
  }

  return phases.map((p) => ({
    ...p,
    tasks: p.tasks.map((t) => scheduled.get(t.id) ?? t),
  }));
}
