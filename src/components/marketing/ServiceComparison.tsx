import {
  SERVICE_PACKAGES,
  SERVICE_COMPARISON,
} from "@/src/lib/content";

export function ServiceComparison() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line shadow-card">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="bg-navy-900 text-white">
            <th className="px-5 py-4 text-sm font-semibold">
              เปรียบเทียบแพ็กเกจ
            </th>
            {SERVICE_PACKAGES.map((p) => (
              <th
                key={p.id}
                className="px-5 py-4 text-center align-bottom"
              >
                <span className="block text-sm font-bold">{p.name}</span>
                <span className="mt-1 block text-xs font-medium text-brand-100">
                  เริ่มต้น {p.startingPrice}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {SERVICE_COMPARISON.map((row, ri) => (
            <tr
              key={row.label}
              className={ri % 2 === 1 ? "bg-surface" : undefined}
            >
              <td className="px-5 py-3.5 text-sm font-medium text-navy-900">
                {row.label}
              </td>
              {row.values.map((v, ci) => (
                <td
                  key={ci}
                  className="px-5 py-3.5 text-center text-sm"
                >
                  {v ? (
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700"
                      aria-label="รวมอยู่ในแพ็กเกจ"
                    >
                      ✓
                    </span>
                  ) : (
                    <span className="text-faint" aria-label="ไม่รวม">
                      —
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-line">
            <td className="px-5 py-3.5 text-sm font-medium text-navy-900">
              รูปแบบค่าบริการ
            </td>
            {SERVICE_PACKAGES.map((p) => (
              <td
                key={p.id}
                className="px-5 py-3.5 text-center text-sm text-muted"
              >
                {p.billing}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
