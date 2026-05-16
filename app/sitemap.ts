import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/content";

const ROUTES = [
  "",
  "/tools",
  "/tools/project-estimation",
  "/services",
  "/about",
  "/contact",
  "/disclaimer",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" || path === "/tools/project-estimation" ? 1 : 0.7,
  }));
}
