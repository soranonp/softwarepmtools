// Date engine — working days, holidays, schedule math
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §6

import { addDays, startOfDay } from "date-fns";
import type { ProjectConfig } from "./types";
import { isThaiHoliday } from "./thai-holidays";

/** Strip time so date math is calendar-day based and comparisons are stable. */
function dayOnly(date: Date): Date {
  return startOfDay(date);
}

/**
 * True if `date` is a custom holiday listed in config, or a Thai public
 * holiday when `config.includeThaiHolidays` is on.
 */
export function isHoliday(date: Date, config: ProjectConfig): boolean {
  const d = dayOnly(date);
  const hit = config.customHolidays.some(
    (h) => startOfDay(h).getTime() === d.getTime(),
  );
  if (hit) return true;
  return config.includeThaiHolidays ? isThaiHoliday(d) : false;
}

/**
 * True if `date` is a working day: not a configured weekend day, and not a
 * holiday. When `workingDaysOnly` is off, every non-holiday day counts.
 */
export function isWorkingDay(date: Date, config: ProjectConfig): boolean {
  const d = dayOnly(date);
  if (config.workingDaysOnly && config.weekendDays.includes(d.getDay())) {
    return false;
  }
  return !isHoliday(d, config);
}

/** The next working day on or after `date` (returns `date` if it qualifies). */
export function getNextWorkingDay(date: Date, config: ProjectConfig): Date {
  let cursor = dayOnly(date);
  // Bounded to avoid an infinite loop if a config marks every day non-working.
  for (let guard = 0; guard < 3650; guard++) {
    if (isWorkingDay(cursor, config)) return cursor;
    cursor = addDays(cursor, 1);
  }
  return cursor;
}

/**
 * Add `days` working days to `start`, skipping weekends and holidays.
 *
 * Convention (spec §6): the start day itself is day 0, so a task starting
 * Mon with duration 3 is scheduled as `addWorkingDays(start, 3 - 1)` = Wed
 * (Mon, Tue, Wed = 3 working days), NOT Thu. `start` is first normalized to
 * the next working day so callers never need to pre-align it.
 */
export function addWorkingDays(
  start: Date,
  days: number,
  config: ProjectConfig,
): Date {
  let cursor = getNextWorkingDay(start, config);
  let remaining = Math.max(0, Math.floor(days));
  while (remaining > 0) {
    cursor = addDays(cursor, 1);
    if (isWorkingDay(cursor, config)) remaining--;
  }
  return cursor;
}

/** Count working days in [start, end] inclusive. 0 if end is before start. */
export function countWorkingDays(
  start: Date,
  end: Date,
  config: ProjectConfig,
): number {
  let cursor = dayOnly(start);
  const last = dayOnly(end);
  if (last.getTime() < cursor.getTime()) return 0;
  let count = 0;
  while (cursor.getTime() <= last.getTime()) {
    if (isWorkingDay(cursor, config)) count++;
    cursor = addDays(cursor, 1);
  }
  return count;
}
