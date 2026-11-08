import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteConfig } from "@/lib/siteMetadata";

/**
 * Route manifest for search engines.
 *
 * Publish only configured production URLs. Preview/unconfigured builds emit no entries.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable) return [];
  const SITE_URL = siteConfig.productionOrigin;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/world`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/visit`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/engineering`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/avatar`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/experience`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/recruiter`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}

export const dynamic = "force-static";
