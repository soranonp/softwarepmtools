import { SERVICE_PACKAGES, SITE } from "@/src/lib/content";
import { Card, Badge } from "@/src/components/ui/Card";
import { ButtonLink } from "@/src/components/ui/Button";

export function ServicePackages({
  highlightId,
}: {
  highlightId?: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {SERVICE_PACKAGES.map((pkg, i) => {
        const highlight = pkg.id === highlightId;
        return (
          <Card
            key={pkg.id}
            elevated
            className={
              highlight
                ? "relative flex h-full flex-col overflow-hidden ring-2 ring-brand-600"
                : "relative flex h-full flex-col overflow-hidden"
            }
          >
            <span
              className={
                highlight
                  ? "absolute inset-x-0 top-0 h-1 bg-brand-600"
                  : "absolute inset-x-0 top-0 h-1 bg-navy-900"
              }
              aria-hidden
            />
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-semibold tracking-widest text-faint">
                PKG · {String(i + 1).padStart(2, "0")}
              </span>
              {highlight && (
                <Badge tone="brand" dot>
                  แนะนำสำหรับคุณ
                </Badge>
              )}
            </div>

            <h3 className="mt-4 text-xl font-bold text-navy-900">
              {pkg.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-brand-600">
              {pkg.tagline}
            </p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-xs text-muted">เริ่มต้น</span>
              <span className="text-2xl font-bold text-navy-900">
                {pkg.startingPrice}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              {pkg.description}
            </p>

            <div className="mt-5 rounded-lg bg-surface px-4 py-3 ring-1 ring-line ring-inset">
              <p className="text-xs font-semibold tracking-wide text-navy-900 uppercase">
                เหมาะสำหรับ
              </p>
              <ul className="mt-2 space-y-1.5">
                {pkg.forWho.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-muted"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-faint" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-xs font-semibold tracking-wide text-navy-900 uppercase">
              สิ่งที่คุณจะได้รับ
            </p>
            <ul className="mt-2 space-y-2">
              {pkg.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2.5 text-sm text-navy-800"
                >
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between border-t border-line pt-5 sm:mt-auto">
              <span className="text-xs text-faint">
                ค่าบริการแบบ{pkg.billing}
              </span>
              <ButtonLink
                href={SITE.googleFormUrl}
                external
                variant={highlight ? "primary" : "secondary"}
              >
                ปรึกษาบริการนี้
              </ButtonLink>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
