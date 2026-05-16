import type { MetadataRoute } from "next";

// Emit a static sitemap.xml at build time (required for `output: export`).
export const dynamic = "force-static";

const BASE_URL = "https://softwarepmtools.com";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
};

// Listed highest-priority first so the generated XML is in priority order.
const ENTRIES: Entry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.95, changeFrequency: "weekly" },
  {
    path: "/tools/project-estimation",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/tools/timeline-planner",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  { path: "/services", priority: 0.85, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ENTRIES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
