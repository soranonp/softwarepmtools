// Thai public holiday calendar
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §7
//
// Source: ราชกิจจานุเบกษา / กรมการปกครอง — verify yearly
//
// ⚠️ VERIFICATION PENDING: The dates below are taken verbatim from the spec,
// which marks them as an approximation. Buddhist holidays follow the lunar
// calendar and shift each year. These MUST be cross-checked against the
// official Thai government announcement before public launch.
// (Owner opted to ship the spec list + flag on 2026-05-16.)

export const THAI_HOLIDAYS: Record<
  number,
  { date: string; name: string }[]
> = {
  2025: [
    { date: "2025-01-01", name: "วันขึ้นปีใหม่" },
    { date: "2025-02-12", name: "วันมาฆบูชา" },
    { date: "2025-04-07", name: "ชดเชยวันจักรี" },
    { date: "2025-04-14", name: "วันสงกรานต์" },
    { date: "2025-04-15", name: "วันสงกรานต์" },
    { date: "2025-05-01", name: "วันแรงงานแห่งชาติ" },
    { date: "2025-05-05", name: "ชดเชยวันฉัตรมงคล" },
    { date: "2025-05-12", name: "วันวิสาขบูชา" },
    { date: "2025-06-03", name: "วันเฉลิมพระชนมพรรษา ราชินี" },
    { date: "2025-07-10", name: "วันอาสาฬหบูชา" },
    { date: "2025-07-11", name: "วันเข้าพรรษา" },
    { date: "2025-07-28", name: "วันเฉลิมพระชนมพรรษา ร.10" },
    { date: "2025-08-12", name: "วันแม่แห่งชาติ" },
    { date: "2025-10-13", name: "วันคล้ายวันสวรรคต ร.9" },
    { date: "2025-10-23", name: "วันปิยมหาราช" },
    { date: "2025-12-05", name: "วันพ่อแห่งชาติ" },
    { date: "2025-12-10", name: "วันรัฐธรรมนูญ" },
    { date: "2025-12-31", name: "วันสิ้นปี" },
  ],
  2026: [
    { date: "2026-01-01", name: "วันขึ้นปีใหม่" },
    { date: "2026-01-02", name: "วันหยุดราชการเพิ่มเติม" },
    { date: "2026-03-03", name: "วันมาฆบูชา" },
    { date: "2026-04-06", name: "วันจักรี" },
    { date: "2026-04-13", name: "วันสงกรานต์" },
    { date: "2026-04-14", name: "วันสงกรานต์" },
    { date: "2026-04-15", name: "วันสงกรานต์" },
    { date: "2026-05-01", name: "วันแรงงานแห่งชาติ" },
    { date: "2026-05-04", name: "วันฉัตรมงคล" },
    { date: "2026-06-01", name: "วันวิสาขบูชา" },
    { date: "2026-06-03", name: "วันเฉลิมพระชนมพรรษา ราชินี" },
    { date: "2026-07-28", name: "วันเฉลิมพระชนมพรรษา ร.10" },
    { date: "2026-07-29", name: "วันอาสาฬหบูชา" },
    { date: "2026-07-30", name: "วันเข้าพรรษา" },
    { date: "2026-08-12", name: "วันแม่แห่งชาติ" },
    { date: "2026-10-13", name: "วันคล้ายวันสวรรคต ร.9" },
    { date: "2026-10-23", name: "วันปิยมหาราช" },
    { date: "2026-12-05", name: "วันพ่อแห่งชาติ" },
    { date: "2026-12-07", name: "ชดเชยวันรัฐธรรมนูญ" },
    { date: "2026-12-10", name: "วันรัฐธรรมนูญ" },
    { date: "2026-12-31", name: "วันสิ้นปี" },
  ],
};

/** Format a Date to a local `YYYY-MM-DD` key (no timezone shift). */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** True if the given date is a Thai public holiday in our static calendar. */
export function isThaiHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const list = THAI_HOLIDAYS[year];
  if (!list) return false;
  const key = toDateKey(date);
  return list.some((h) => h.date === key);
}

/** Returns the Thai holiday name for a date, or null if not a holiday. */
export function getThaiHolidayName(date: Date): string | null {
  const list = THAI_HOLIDAYS[date.getFullYear()];
  if (!list) return null;
  const key = toDateKey(date);
  return list.find((h) => h.date === key)?.name ?? null;
}

/**
 * All Thai holidays whose date falls within [start, end] inclusive.
 * Used by StatsPanel and the Excel "Holidays" sheet.
 */
export function getThaiHolidaysInRange(
  start: Date,
  end: Date,
): { date: Date; name: string }[] {
  const result: { date: Date; name: string }[] = [];
  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    const list = THAI_HOLIDAYS[year];
    if (!list) continue;
    for (const h of list) {
      const [y, m, d] = h.date.split("-").map(Number);
      const hd = new Date(y, m - 1, d);
      if (hd >= start && hd <= end) result.push({ date: hd, name: h.name });
    }
  }
  return result.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Whether the static calendar covers the given year. The UI can warn the
 * user (and prompt for custom holidays) when planning beyond covered years.
 */
export function isYearCovered(year: number): boolean {
  return year in THAI_HOLIDAYS;
}
