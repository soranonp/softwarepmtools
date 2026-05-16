import { Section } from "@/src/components/ui/Section";
import { ButtonLink } from "@/src/components/ui/Button";
import {
  SITE,
  LEAD_CTAS,
  LEAD_REASSURANCE,
  type LeadCtaKey,
} from "@/src/lib/content";

/**
 * Reusable lead-capture block. Every button opens the Google Form in a new
 * tab (ButtonLink `external` sets target=_blank rel=noopener noreferrer).
 * The first button is the primary action; the rest are secondary so the
 * conversion path stays clear without being pushy.
 */
export function LeadCtaSection({
  headline,
  buttons,
  tone = "surface",
}: {
  headline: string;
  buttons: LeadCtaKey[];
  tone?: "surface" | "navy";
}) {
  const navy = tone === "navy";

  return (
    <Section tone={tone}>
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className={
            navy
              ? "text-2xl font-bold tracking-tight text-white sm:text-3xl"
              : "text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          }
        >
          {headline}
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {buttons.map((key, i) => (
            <ButtonLink
              key={key}
              href={SITE.googleFormUrl}
              external
              size="lg"
              variant={
                i === 0 ? (navy ? "white" : "primary") : "secondary"
              }
            >
              {LEAD_CTAS[key]}
            </ButtonLink>
          ))}
        </div>

        <p
          className={
            navy
              ? "mt-5 text-sm text-brand-100"
              : "mt-5 text-sm text-faint"
          }
        >
          {LEAD_REASSURANCE}
        </p>
      </div>
    </Section>
  );
}
