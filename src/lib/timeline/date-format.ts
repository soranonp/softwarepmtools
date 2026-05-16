// Date <-> string helpers shared by UI, table, and exports.
// Kept separate from date-utils.ts (the scheduling engine) on purpose.

import { format } from "date-fns";
import { th } from "date-fns/locale";

/** Date -> `YYYY-MM-DD` for <input type="date"> (local, no UTC shift). */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** `YYYY-MM-DD` -> local Date at midnight. Returns null on bad input. */
export function fromDateInputValue(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Thai-localized `dd MMM yyyy`, e.g. "01 มิ.ย. 2026" (spec §11). */
export function formatThaiDate(date: Date): string {
  return format(date, "dd MMM yyyy", { locale: th });
}
