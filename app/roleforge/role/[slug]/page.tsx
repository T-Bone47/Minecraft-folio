import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import {
  CURATED_ROLE_PRESETS,
  getRolePresetBySlug,
} from "@/lib/roleforge/skillTaxonomy";
import { createRequirementsFromPreset } from "@/lib/roleforge/requirementNormalizer";
import { compileMission } from "@/lib/roleforge/missionCompiler";
import { generateEvidenceBrief } from "@/lib/roleforge/evidenceBrief";
import { summarizeEvidenceMatches } from "@/lib/roleforge/evidenceMatcher";
import {
  Target,
  ArrowLeft,
  GitBranch,
  ShieldCheck,
  Play,
  FileCheck,
} from "lucide-react";

interface RolePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return CURATED_ROLE_PRESETS.map((preset) => ({
    slug: preset.slug,
  }));
}

export async function generateMetadata({
  params,
}: RolePageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = getRolePresetBySlug(slug);

  if (!preset) {
    return {
      title: "Role Not Found | Frontier RoleForge",
    };
  }

  return {
    title: `${preset.title} — Verified Evidence Brief | Asish`,
    description: `Inspect verified code commits, automated tests, and adaptive 3D campus walkthrough for ${preset.title}.`,
  };
}

export default async function CuratedRolePage({ params }: RolePageProps) {
  const { slug } = await params;
  const preset = getRolePresetBySlug(slug);

  if (!preset) {
    notFound();
  }

  // Pre-compile mission and evidence brief server-side
  const requirements = createRequirementsFromPreset(preset);
  const mission = compileMission({
    roleTitle: preset.title,
    roleSlug: preset.slug,
    requirements,
    budget: preset.defaultBudget,
    preferredGuideNpcId: preset.recommendedGuideNpcId,
  });
  const brief = generateEvidenceBrief(mission);
  const matchStats = summarizeEvidenceMatches(mission.matchedRequirements);

  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <PortfolioNav />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-6">
          <Link
            href="/roleforge"
            className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ROLEFORGE HUB</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-200">{preset.title}</span>
        </div>

        {/* Role Header Dossier */}
        <div className="bg-[#0d0f12] border border-cyan-500/30 rounded-xl p-6 sm:p-8 mb-8 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 uppercase tracking-wider mb-2">
                <span>{preset.discipline}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {preset.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-2 max-w-2xl leading-relaxed">
                {preset.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href={`/?roleforge=preset&preset=${preset.slug}`}
                className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>START 3D WALKTHROUGH</span>
              </Link>
              <a
                href="https://github.com/T-Bone47"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>INSPECT GIT COMMITS</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 font-mono">
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-lg">
              <div className="text-[10px] uppercase text-emerald-400">Direct Matches</div>
              <div className="text-xl font-bold text-emerald-300 mt-0.5">{matchStats.directCount}</div>
            </div>
            <div className="bg-cyan-950/20 border border-cyan-500/20 p-3 rounded-lg">
              <div className="text-[10px] uppercase text-cyan-400">Related Skills</div>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">{matchStats.relatedCount}</div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
              <div className="text-[10px] uppercase text-zinc-400">Time Budget</div>
              <div className="text-xl font-bold text-zinc-200 mt-0.5">{mission.totalDurationSeconds}s</div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
              <div className="text-[10px] uppercase text-zinc-400">Assigned Guide</div>
              <div className="text-xs font-bold text-cyan-300 truncate mt-1">
                {mission.assignedGuideNpc.name}
              </div>
            </div>
          </div>
        </div>

        {/* Campus Mission Waypoints */}
        <div className="mb-10">
          <div className="border-b border-zinc-800 pb-3 mb-6">
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              Compiled Campus Mission Waypoints ({mission.steps.length} Stops)
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Optimized 3D navigation route through relevant engineering facilities.
            </p>
          </div>

          <div className="space-y-3">
            {mission.steps.map((step) => (
              <div
                key={step.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      STOP {step.stepIndex} · {step.facilityId.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      ~{step.estimatedDurationSeconds}s
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    {step.roleExplanation}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    href={`/?facility=${step.facilityId}`}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-cyan-400 border border-zinc-700 transition-colors"
                  >
                    View Facility ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Technical Evidence Highlights */}
        <div className="mb-10">
          <div className="border-b border-zinc-800 pb-3 mb-6">
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              Verified Technical Evidence & Permalinks
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Direct links into production codebases and automated test suites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {brief.technicalHighlights.map((hl, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 font-mono text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[12px]">{hl.title}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                    {hl.category}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {hl.detail}
                </p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500 truncate max-w-[220px]">
                    {hl.sourcePath}
                  </span>
                  <a
                    href={hl.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Inspect GitHub ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclosed Verification Limitations */}
        {brief.disclosedGaps.length > 0 && (
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl p-5 mb-10 font-mono text-xs">
            <div className="font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Disclosed Verification Bounds
            </div>
            <div className="space-y-1.5 text-zinc-400 text-[11px]">
              {brief.disclosedGaps.map((g, idx) => (
                <div key={idx}>
                  <strong className="text-zinc-300">• {g.skillName}:</strong> {g.reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <PortfolioFooter />
    </div>
  );
}

