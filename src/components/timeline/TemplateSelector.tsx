"use client";

// Preset template picker with replace-confirmation
// Spec: docs/specs/TIMELINE_PLANNER_SPEC.md §10.2

import { useMemo, useState } from "react";
import type { ProjectType } from "@/src/lib/timeline/types";
import {
  ALL_TEMPLATE_TYPES,
  getTemplateMeta,
} from "@/src/lib/timeline/templates";

export function TemplateSelector({
  onSelect,
  hasExistingTasks,
}: {
  onSelect: (type: ProjectType) => void;
  hasExistingTasks: boolean;
}) {
  const metas = useMemo(
    () => ALL_TEMPLATE_TYPES.map((t) => getTemplateMeta(t)),
    [],
  );
  const [pending, setPending] = useState<ProjectType | null>(null);

  function handlePick(type: ProjectType) {
    if (hasExistingTasks) {
      setPending(type);
    } else {
      onSelect(type);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 className="text-lg font-bold text-ink">เลือก Template เริ่มต้น</h2>
      <p className="mt-1 text-sm text-muted">
        เลือกประเภทโปรเจกต์เพื่อสร้าง Phase และ Task อัตโนมัติ
        แล้วปรับแก้ได้ตามต้องการ
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metas.map((m) => (
          <button
            key={m.type}
            type="button"
            onClick={() => handlePick(m.type)}
            className="group rounded-xl border border-line bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <p className="text-base font-bold text-navy-900 group-hover:text-brand-700">
              {m.label}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">{m.description}</p>
            <p className="mt-3 text-xs font-semibold text-brand-600">
              {m.phaseCount} phases · ~{m.workingDays} วันทำการ
            </p>
          </button>
        ))}
      </div>

      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tl-confirm-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
            <h3
              id="tl-confirm-title"
              className="text-base font-bold text-ink"
            >
              ยืนยันการใช้ Template
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              ใช้ template นี้จะแทนที่ tasks ที่มีอยู่ทั้งหมด
              ต้องการดำเนินการต่อ?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-navy-900 ring-1 ring-line hover:ring-brand-600"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelect(pending);
                  setPending(null);
                }}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                ดำเนินการต่อ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
