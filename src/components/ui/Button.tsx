import Link from "next/link";
import { cn } from "@/src/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Size = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const VARIANT: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary:
    "bg-white text-navy-900 ring-1 ring-line hover:ring-brand-600 hover:text-brand-700",
  ghost: "text-brand-600 hover:text-brand-700 hover:underline",
  white: "bg-white text-navy-900 hover:bg-brand-50",
};

const SIZE: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string; external?: boolean }) {
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
