import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/data/site";

/**
 * Route manifest for search engines.
 *
 * `SITE_URL` is the single canonical origin, also used for `metadataBase` and
 * `alternates.canonical` in the root layout. Changing the domain means editing
 * it in exactly one place.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/world`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/experience`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/recruiter`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}

export const dynamic = "force-static";