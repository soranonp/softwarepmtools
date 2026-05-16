/**
 * Renders a schema.org JSON-LD <script>. Server component — safe because the
 * payload is our own static data, not user input.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
