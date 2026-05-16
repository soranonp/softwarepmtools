import { Container } from "@/src/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-100 to-transparent"
        aria-hidden
      />
      <Container className="relative py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide text-brand-700 uppercase ring-1 ring-brand-100 ring-inset">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg leading-8 text-muted">{description}</p>
          )}
        </div>
      </Container>
    </div>
  );
}
