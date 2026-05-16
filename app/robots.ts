import type { MetadataRoute } from "next";

// Emit a static robots.txt at build time (required for `output: export`).
export const dynamic = "force-static";

const BASE_URL = "https://softwarepmtools.com";

// B2B lead-gen tool: we want LLM/search crawlers to index the tools, so
// each AI/search bot is explicitly allowed in addition to the default rule.
const ALLOWED_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Claude-Web",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/draft/", "/*.json$"],
      },
      ...ALLOWED_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
