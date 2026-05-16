import { FAQ } from "@/src/lib/content";

export function FaqList({
  items = FAQ,
}: {
  items?: { q: string; a: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, i) => (
        <details
          key={item.q}
          className="group rounded-xl border border-line bg-white px-6 py-5 shadow-card transition-colors open:border-brand-100 open:bg-brand-50/30"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-navy-900">
            <span className="flex items-start gap-3">
              <span className="font-mono text-xs font-semibold text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.q}
            </span>
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-brand-600 transition-transform group-open:rotate-45"
              aria-hidden
            >
              +
            </span>
          </summary>
          <p className="mt-3 pl-7 text-sm leading-7 text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
