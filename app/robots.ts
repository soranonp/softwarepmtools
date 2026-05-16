import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/content";

// Emit a static robots.txt at build time (required for `output: export`).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
