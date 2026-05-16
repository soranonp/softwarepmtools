// Excel export — 3 sheets, Juslaws-style (spec §11)
//
// exceljs is dynamically imported inside the function so its ~1MB of code
// stays out of the initial page bundle (static-export friendly).
//
// NOTE: Spec §11 suggests Excel formulas like `=D6+C6` for end dates. A naive
// `start + duration` formula is WRONG in a working-day context (it ignores
// weekends and Thai holidays), so we write the engine-computed dates as real
// date values instead. Flagged per spec §21 (correctness over formula).

import type { Phase, ProjectConfig } from "../types";
import { CATEGORY_META } from "../categories";
import { formatThaiDate } from "../date-format";
import { getThaiHolidaysInRange } from "../thai-holidays";
import { countWorkingDays } from "../date-utils";
import { differenceInCalendarDays, startOfWeek } from "date-fns";

const HEADER_FILL = "FF0A2540"; // navy-900
const PHASE_FILL = "FFD9E1F2"; // spec §11

function argb(hex: string): string {
  return "FF" + hex.replace("#", "").toUpperCase();
}

function sanitize(name: string): string {
  // Keep letters, combining marks (Thai vowels/tones are \p{M}), and digits.
  return (
    name
      .trim()
      .replace(/[^\p{L}\p{M}\p{N}_-]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "timeline"
  );
}

/**
 * Build the workbook (pure — no DOM). Returns the workbook plus the
 * suggested filename. Separated from {@link exportTimelineExcel} so it can
 * be unit-tested in Node without a browser.
 */
export async function buildTimelineWorkbook(
  phases: Phase[],
  config: ProjectConfig,
) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "softwarepmtools.com";
  wb.created = new Date();

  const tasks = phases.flatMap((p) => p.tasks);
  const starts = tasks.map((t) => t.startDate).filter(Boolean) as Date[];
  const ends = tasks.map((t) => t.endDate).filter(Boolean) as Date[];
  const minStart =
    starts.length > 0
      ? new Date(Math.min(...starts.map((d) => +d)))
      : config.startDate;
  const maxEnd =
    ends.length > 0 ? new Date(Math.max(...ends.map((d) => +d))) : minStart;
  const totalWorkingDays = countWorkingDays(minStart, maxEnd, config);

  // Sequence number per task (used for Dependencies references).
  const seq = new Map<string, number>();
  let n = 0;
  for (const p of phases) for (const t of p.tasks) seq.set(t.id, ++n);

  // ── Sheet 1: Project Info ────────────────────────────────────────────────
  const s1 = wb.addWorksheet("Project Info");
  s1.mergeCells("A1:F1");
  const title = s1.getCell("A1");
  title.value = config.name || "โปรเจกต์ใหม่";
  title.font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } };
  title.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: HEADER_FILL },
  };
  title.alignment = { vertical: "middle", horizontal: "left" };
  s1.getRow(1).height = 32;

  s1.getCell("A3").value = "สร้างเมื่อ";
  s1.getCell("B3").value = formatThaiDate(new Date());
  s1.getCell("A4").value = "วันที่เริ่ม";
  s1.getCell("B4").value = formatThaiDate(minStart);
  s1.getCell("A5").value = "วันที่สิ้นสุด";
  s1.getCell("B5").value = formatThaiDate(maxEnd);
  s1.getCell("A6").value = "รวมวันทำการ";
  s1.getCell("B6").value = `${totalWorkingDays} วัน`;
  ["A3", "A4", "A5", "A6"].forEach((c) => {
    s1.getCell(c).font = { bold: true };
  });

  const phaseHeaderRow = 8;
  s1.getRow(phaseHeaderRow).values = [
    "Phase",
    "เริ่ม",
    "สิ้นสุด",
    "วันทำการ",
    "จำนวน Task",
  ];
  s1.getRow(phaseHeaderRow).font = { bold: true };
  let r = phaseHeaderRow + 1;
  for (const p of phases) {
    const ps = p.tasks.map((t) => t.startDate).filter(Boolean) as Date[];
    const pe = p.tasks.map((t) => t.endDate).filter(Boolean) as Date[];
    const pStart = ps.length ? new Date(Math.min(...ps.map((d) => +d))) : null;
    const pEnd = pe.length ? new Date(Math.max(...pe.map((d) => +d))) : null;
    s1.getRow(r).values = [
      p.name,
      pStart ? formatThaiDate(pStart) : "—",
      pEnd ? formatThaiDate(pEnd) : "—",
      pStart && pEnd ? countWorkingDays(pStart, pEnd, config) : 0,
      p.tasks.length,
    ];
    r++;
  }
  s1.columns.forEach((c) => (c.width = 22));

  // ── Sheet 2: Timeline Detail ─────────────────────────────────────────────
  const s2 = wb.addWorksheet("Timeline Detail");
  const weekStart = startOfWeek(minStart, { weekStartsOn: 1 });
  const weekCount =
    Math.floor(differenceInCalendarDays(maxEnd, weekStart) / 7) + 1;
  const baseHeaders = [
    "ลำดับ",
    "รายละเอียดการดำเนินงาน",
    "ระยะเวลา (วันทำการ)",
    "วันที่เริ่มต้น",
    "วันที่สิ้นสุด",
    "Dependencies",
    "ผู้ดำเนินการ",
    "Progress (%)",
  ];
  const weekHeaders = Array.from({ length: weekCount }, (_, i) => `W${i + 1}`);
  const headerRow = s2.addRow([...baseHeaders, ...weekHeaders]);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: HEADER_FILL },
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });

  for (const p of phases) {
    const ps = p.tasks.map((t) => t.startDate).filter(Boolean) as Date[];
    const pe = p.tasks.map((t) => t.endDate).filter(Boolean) as Date[];
    const pStart = ps.length ? new Date(Math.min(...ps.map((d) => +d))) : null;
    const pEnd = pe.length ? new Date(Math.max(...pe.map((d) => +d))) : null;
    const phaseRow = s2.addRow([
      "",
      p.name,
      pStart && pEnd ? countWorkingDays(pStart, pEnd, config) : 0,
      pStart ? formatThaiDate(pStart) : "",
      pEnd ? formatThaiDate(pEnd) : "",
      "",
      "",
      "",
    ]);
    phaseRow.font = { bold: true };
    phaseRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: PHASE_FILL },
      };
    });

    for (const t of p.tasks) {
      const deps = t.dependencies
        .map((id) => seq.get(id))
        .filter(Boolean)
        .join(", ");
      const row = s2.addRow([
        seq.get(t.id),
        `   ${t.name}`,
        t.duration,
        t.startDate ? formatThaiDate(t.startDate) : "",
        t.endDate ? formatThaiDate(t.endDate) : "",
        deps,
        t.assignee ?? "",
        t.progress,
      ]);
      // Gantt-in-Excel: shade week columns the task spans.
      if (t.startDate && t.endDate) {
        const fill = argb(CATEGORY_META[t.category].color);
        const startW = Math.floor(
          differenceInCalendarDays(t.startDate, weekStart) / 7,
        );
        const endW = Math.floor(
          differenceInCalendarDays(t.endDate, weekStart) / 7,
        );
        for (let w = startW; w <= endW; w++) {
          const cell = row.getCell(baseHeaders.length + w + 1);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fill },
          };
        }
      }
    }
  }
  s2.getColumn(1).width = 7;
  s2.getColumn(2).width = 42;
  for (let i = 3; i <= 8; i++) s2.getColumn(i).width = 16;
  for (let i = 0; i < weekCount; i++)
    s2.getColumn(baseHeaders.length + i + 1).width = 5;
  s2.views = [{ state: "frozen", xSplit: 2, ySplit: 1 }];

  // ── Sheet 3: Holidays ────────────────────────────────────────────────────
  const s3 = wb.addWorksheet("Holidays");
  const hHeader = s3.addRow(["วันที่", "ชื่อวันหยุด"]);
  hHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
  hHeader.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: HEADER_FILL },
    };
  });
  const holidays = config.includeThaiHolidays
    ? getThaiHolidaysInRange(minStart, maxEnd)
    : [];
  if (holidays.length === 0) {
    s3.addRow(["—", "ไม่มีวันหยุดราชการในช่วงโปรเจกต์"]);
  } else {
    for (const h of holidays) s3.addRow([formatThaiDate(h.date), h.name]);
  }
  s3.getColumn(1).width = 18;
  s3.getColumn(2).width = 36;

  const filename = `timeline-${sanitize(config.name)}-${formatFileDate(
    new Date(),
  )}.xlsx`;
  return { wb, filename };
}

/**
 * Build and download an .xlsx for the given (already-scheduled) phases.
 * Returns the filename used. Throws on failure (caller shows a toast).
 */
export async function exportTimelineExcel(
  phases: Phase[],
  config: ProjectConfig,
): Promise<string> {
  const { wb, filename } = await buildTimelineWorkbook(phases, config);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, filename);
  return filename;
}

function formatFileDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the click has had a chance to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
