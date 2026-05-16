import { cn } from "@/src/lib/cn";

export function Card({
  children,
  className,
  elevated = false,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Adds the restrained enterprise drop shadow. */
  elevated?: boolean;
  /** Adds a hover lift — use for clickable cards. */
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white p-6 sm:p-8",
        elevated && "shadow-card",
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}

const BADGE_TONES = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  neutral: "bg-surface text-muted ring-line",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-amber-100",
  danger: "bg-red-50 text-red-700 ring-red-100",
} as const;

const DOT_TONES = {
  brand: "bg-brand-600",
  neutral: "bg-faint",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
} as const;

export function Badge({
  children,
  tone = "brand",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: keyof typeof BADGE_TONES;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        BADGE_TONES[tone],
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", DOT_TONES[tone])}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
