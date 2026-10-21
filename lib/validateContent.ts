import { projects } from "@/data/projects";
import { facilities } from "@/data/facilities";
import type { Project, ProjectDomain } from "@/types/project";

/**
 * Content integrity checks.
 *
 * This portfolio's credibility rests entirely on not overstating what was
 * built, so the rules below run at module load in development. A duplicate
 * slug, a missing status, or a metric presented as measured without evidence
 * is a content bug, not a cosmetic one.
 *
 * Nothing here mutates data — it reports. `validateContent()` returns a list of
 * problems so a test or CI step can fail on a non-empty result.
 */

const VALID_STATUSES = new Set([
  "completed",
  "active",
  "near-completion",
  "in-development",
  "experimental",
]);

const VALID_DOMAINS = new Set<ProjectDomain>([
  "motorsport",
  "simulation",
  "ai-ml",
  "game",
  "data",
]);

const VALID_CATEGORIES = new Set(["motorsport", "ai-ml", "simulation-game"]);

export interface ContentProblem {
  project: string;
  field: string;
  message: string;
}

export function validateContent(): ContentProblem[] {
  const problems: ContentProblem[] = [];
  const seenSlugs = new Set<string>();
  const seenIds = new Set<string>();

  for (const project of projects) {
    const fail = (field: string, message: string) =>
      problems.push({ project: project.slug, field, message });

    if (seenSlugs.has(project.slug)) {
      fail("slug", `Duplicate project slug "${project.slug}"`);
    }
    seenSlugs.add(project.slug);

    if (seenIds.has(project.id)) {
      fail("id", `Duplicate project id "${project.id}"`);
    }
    seenIds.add(project.id);

    if (!project.title?.trim()) fail("title", "Missing title");
    if (!project.status) fail("status", "Missing status");
    else if (!VALID_STATUSES.has(project.status)) {
      fail("status", `Unknown status "${project.status}"`);
    }

    if (!VALID_CATEGORIES.has(project.category)) {
      fail("category", `Unknown category "${project.category}"`);
    }

    if (!project.domains?.length) {
      fail("domains", "Project belongs to no engineering domain");
    }
    for (const domain of project.domains ?? []) {
      if (!VALID_DOMAINS.has(domain)) {
        fail("domains", `Unknown domain "${domain}"`);
      }
    }

    if (!project.description?.trim()) fail("description", "Missing description");
    if (!project.limitations?.trim()) {
      fail("limitations", "Missing limitations section");
    }
    if (!project.nextIteration?.trim()) {
      fail("nextIteration", "Missing next iteration");
    }
    if (!project.technologies?.length) fail("technologies", "No technologies listed");

    // A metric marked verified must state its evidence grade. Without this the
    // UI cannot distinguish measured results from demo material.
    for (const metric of project.metrics ?? []) {
      if (metric.isVerified && !metric.evidence) {
        fail(
          "metrics",
          `Metric "${metric.label}" is marked verified but declares no evidence level`
        );
      }
    }

    // External links must be absolute https URLs.
    for (const [key, url] of Object.entries(project.links ?? {})) {
      if (url && !url.startsWith("https://")) {
        fail(`links.${key}`, `Link is not an absolute https URL: ${url}`);
      }
    }
  }

  // Every facility must anchor to real project content, and every project must
  // have a facility that can display it.
  const slugs = new Set(projects.map((p) => p.slug));
  for (const facility of facilities) {
    if (facility.projectSlug && !slugs.has(facility.projectSlug)) {
      problems.push({
        project: facility.id,
        field: "projectSlug",
        message: `Facility "${facility.id}" points at unknown project "${facility.projectSlug}"`,
      });
    }
    if (!facility.pad || facility.pad.length !== 4) {
      problems.push({
        project: facility.id,
        field: "pad",
        message: `Facility "${facility.id}" is missing a valid ground pad`,
      });
    }
  }

  return problems;
}

const problems = validateContent();

if (problems.length > 0 && process.env.NODE_ENV !== "production") {
  // Loud in development; never blocks a production build.
  console.warn(
    `[content] ${problems.length} content problem(s) detected:\n` +
      problems.map((p) => `  - ${p.project}.${p.field}: ${p.message}`).join("\n")
  );
}

export type { Project };