"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import type { EvidenceLevel, Project, ProjectDomain } from "@/types/project";
import { ArrowRight, Cpu, ShieldCheck, FlaskConical } from "lucide-react";
import { VoxelCard, VoxelBadge, VoxelButton } from "@/components/ui/voxel";

/**
 * ENGINEERING INDEX — the recruiter fast path.
 *
 * Everything reachable here is also reachable in the 3D world, but nothing
 * *requires* the world. Immersion is the optional layer; this index is the
 * guaranteed one.
 */

const FILTERS: ReadonlyArray<{ value: "all" | ProjectDomain; label: string }> = [
  { value: "all", label: "ALL SYSTEMS" },
  { value: "motorsport", label: "MOTORSPORT" },
  { value: "simulation", label: "SIMULATION" },
  { value: "ai-ml", label: "AI / ML" },
  { value: "game", label: "GAME" },
  { value: "data", label: "DATA" },
];

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "COMPLETED",
  active: "ACTIVE",
  "near-completion": "NEAR COMPLETION",
  "in-development": "IN DEVELOPMENT",
  experimental: "EXPERIMENTAL",
};

const STATUS_TONE: Record<Project["status"], string> = {
  completed: "text-emerald-300 border-emerald-700/60 bg-emerald-950/60",
  active: "text-emerald-300 border-emerald-700/60 bg-emerald-950/60",
  "near-completion": "text-amber-300 border-amber-700/60 bg-amber-950/60",
  "in-development": "text-sky-300 border-sky-700/60 bg-sky-950/60",
  experimental: "text-purple-300 border-purple-700/60 bg-purple-950/60",
};

const EVIDENCE_TONE: Record<EvidenceLevel, string> = {
  "repository-reported": "text-amber-300 border-amber-700/60",
  unverified: "text-zinc-400 border-zinc-700",
  verified: "text-emerald-300 border-emerald-700/60",
  measured: "text-emerald-300 border-emerald-700/60",
  tested: "text-sky-300 border-sky-700/60",
  illustrative: "text-amber-300 border-amber-700/60",
  synthetic: "text-amber-300 border-amber-700/60",
  planned: "text-zinc-400 border-zinc-700",
  "in-development": "text-zinc-400 border-zinc-700",
};

/** Evidence grade for a metric, honouring the legacy boolean flag. */
function evidenceOf(metric: NonNullable<Project["metrics"]>[number]): EvidenceLevel {
  if (metric.evidence) return metric.evidence;
  return metric.isVerified ? "verified" : "in-development";
}

export const EngineeringIndex: React.FC = () => {
  const [filter, setFilter] = useState<"all" | ProjectDomain>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.domains.includes(filter)),
    [filter]
  );

  return (
    <section className="space-y-6" aria-label="Engineering index">
      {/* Domain filters */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter systems by engineering domain"
      >
        {FILTERS.map((option) => {
          const isActive = filter === option.value;
          const count =
            option.value === "all"
              ? projects.length
              : projects.filter((p) =>
                  p.domains.includes(option.value as ProjectDomain)
                ).length;

          return (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 font-pixel text-[9px] uppercase transition-all ${
                isActive
                  ? "voxel-btn voxel-btn-gold text-yellow-300 shadow-[0_0_8px_rgba(255,170,0,0.4)]"
                  : "voxel-btn voxel-btn-stone text-zinc-300 hover:text-white"
              }`}
            >
              {option.label}
              <span className="ml-1.5 text-zinc-500 font-mono">[{count}]</span>
            </button>
          );
        })}
      </div>

      {/* Result count, announced so screen readers hear filter changes */}
      <p className="font-mono text-[11px] text-zinc-400" aria-live="polite">
        Showing <span className="text-white font-bold">{visible.length}</span> of {projects.length} engineering systems
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visible.map((project) => (
          <VoxelCard
            key={project.slug}
            material="dark-iron"
            className="p-5 sm:p-6 flex flex-col gap-3 group hover:border-[#ff8000] transition-colors"
          >
            {/* Header: status + domain + evidence key */}
            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-2">
              <VoxelBadge
                tone={project.status === "completed" || project.status === "active" ? "emerald" : "amber"}
                size="sm"
              >
                {STATUS_LABEL[project.status]}
              </VoxelBadge>
              {project.domains.map((domain) => (
                <VoxelBadge
                  key={domain}
                  tone="neutral"
                  size="sm"
                >
                  {domain.toUpperCase()}
                </VoxelBadge>
              ))}
              {project.isGame && (
                <VoxelBadge tone="amber" size="sm">
                  GAME
                </VoxelBadge>
              )}
            </div>

            <h3 className="font-pixel text-sm sm:text-base text-white group-hover:text-yellow-300 mc-text-shadow leading-snug transition-colors">
              {project.title}
            </h3>

            <p className="font-mono text-[11px] font-bold text-[#00d2be]">
              {project.tagline}
            </p>

            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              {project.description}
            </p>

            {/* Evidence */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="mc-slot-box p-3 grid grid-cols-2 gap-3 font-mono">
                {project.metrics.slice(0, 4).map((metric) => {
                  const grade = evidenceOf(metric);
                  return (
                    <div key={metric.label}>
                      <div className="font-pixel text-[11px] text-white mc-text-shadow">
                        {metric.value}
                      </div>
                      <div className="text-[9px] text-zinc-500 uppercase mt-0.5 leading-tight">
                        {metric.label}
                      </div>
                      <span
                        className={`inline-block mt-1 font-pixel text-[7px] px-1 border ${EVIDENCE_TONE[grade]}`}
                      >
                        {grade.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="mc-slot-box px-2 py-0.5 text-[9px] font-mono text-zinc-300 border border-zinc-800"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-1 mt-auto border-t border-zinc-800 pt-3">
              <Link
                href={`/work/${project.slug}`}
                className="font-pixel text-[9px] text-yellow-300 hover:text-white flex items-center gap-1.5 mc-text-shadow transition-colors"
              >
                <span>OPEN CASE STUDY</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="font-mono text-[9px] text-zinc-500 flex items-center gap-1 ml-auto">
                <Cpu className="w-3 h-3 text-zinc-400" />
                {project.facility}
              </span>
            </div>
          </VoxelCard>
        ))}
      </div>

      {/* Evidence key — makes the trust model explicit rather than implied */}
      <div className="mc-gui-box p-5 space-y-3">
        <div className="font-pixel text-[9px] text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HOW TO READ THIS INDEX</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[10px] text-zinc-400">
          <p>
            <span className="text-emerald-300">VERIFIED / MEASURED</span> — engineering
            results measured on the real system.
          </p>
          <p>
            <span className="text-sky-300">TESTED</span> — validated by an automated test
            suite or verification harness.
          </p>
          <p>
            <span className="text-amber-300">ILLUSTRATIVE / SYNTHETIC</span> — demo
            visualisation, not a measured result.
          </p>
          <p>
            <span className="text-zinc-400">IN DEVELOPMENT / PLANNED</span> — stated
            honestly rather than presented as finished.
          </p>
        </div>
        <p className="font-mono text-[10px] text-zinc-500 flex items-center gap-2 pt-1">
          <FlaskConical className="w-3 h-3 shrink-0" />
          Metrics identify their provenance. Repository-reported results have not been independently reproduced here. Where a number is not sourced, it is not
          shown.
        </p>
      </div>
    </section>
  );
};