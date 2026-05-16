import { formatTHB } from "@/src/lib/estimation";
import type { EstimationResult } from "@/src/types/estimation";

const RISK_LABEL: Record<EstimationResult["riskLevel"], string> = {
  low_medium: "Low–Medium",
  medium: "Medium",
  medium_high: "Medium–High",
  high: "High",
};

/** A compact, dashboard-style preview of an estimation result. */
export function EstimatePreviewCard({ result }: { result: EstimationResult }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-faint uppercase">
          Estimation Result
        </span>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted">Total Man-day</p>
            <p className="text-4xl font-bold tracking-tight text-navy-900">
              {result.totalMD}
              <span className="ml-1 text-lg font-semibold text-faint">MD</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100 ring-inset">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Risk: {RISK_LABEL[result.riskLevel]}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ["Conservative", result.budgetRange.conservative],
            ["Expected", result.budgetRange.expected],
            ["High", result.budgetRange.highComplexity],
          ].map(([label, value], i) => (
            <div
              key={label as string}
              className={
                i === 1
                  ? "rounded-xl border border-brand-100 bg-brand-50 p-3"
                  : "rounded-xl border border-line bg-surface p-3"
              }
            >
              <p className="text-[11px] font-medium text-muted">
                {label as string}
              </p>
              <p className="mt-1 text-sm font-bold text-navy-900">
                {formatTHB(value as number)}
              </p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs text-muted">
            <span>Role Allocation</span>
            <span>{result.timeline.label}</span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface">
            {result.roleBreakdown.map((r, i) => (
              <div
                key={r.role}
                className={i % 2 === 0 ? "bg-brand-600" : "bg-navy-700"}
                style={{ width: `${Math.round(r.percent * 100)}%` }}
                title={`${r.role} ${Math.round(r.percent * 100)}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-faint">
            {result.roleBreakdown.slice(0, 4).map((r) => (
              <span key={r.role}>
                {r.role} · {Math.round(r.percent * 100)}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
