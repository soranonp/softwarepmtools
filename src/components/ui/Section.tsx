import { cn } from "@/src/lib/cn";
import { Container } from "./Container";

type Tone = "white" | "surface" | "navy";

const TONE: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-surface",
  navy: "bg-navy-900 text-white",
};

export function Section({
  children,
  tone = "white",
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section className={cn("py-16 sm:py-24", TONE[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  invert?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold tracking-wide uppercase",
            invert ? "text-brand-100" : "text-brand-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          invert ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-8",
            invert ? "text-brand-100" : "text-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
