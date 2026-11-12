import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { CURATED_ROLE_PRESETS } from "@/lib/roleforge/skillTaxonomy";
import { createRequirementsFromPreset } from "@/lib/roleforge/requirementNormalizer";
import { compileMission } from "@/lib/roleforge/missionCompiler";
import { generateEvidenceBrief } from "@/lib/roleforge/evidenceBrief";
import {
  Target,
  ArrowLeft,
  Play,
  Share2,
  Printer,
  CheckCircle2,
} from "lucide-react";

interface MissionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return CURATED_ROLE_PRESETS.map((preset) => ({
    id: `mission-${preset.slug}-${preset.defaultBudget.toLowerCase()}`,
  }));
}

export async function generateMetadata({
  params,
}: MissionPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Campus Mission [${id}] | Frontier RoleForge`,
    description: "Adaptive 3D engineering campus walkthrough and verified evidence brief.",
  };
}

export default async function MissionOverviewPage({ params }: MissionPageProps) {
  const { id } = await params;

  // Find matching preset or fallback to motorsport preset
  const matchedPreset =
    CURATED_ROLE_PRESETS.find((p) => id.includes(p.slug)) ||
    CURATED_ROLE_PRESETS[0];

  const requirements = createRequirementsFromPreset(matchedPreset);
  const mission = compileMission({
    roleTitle: matchedPreset.title,
    roleSlug: matchedPreset.slug,
    requirements,
    budget: matchedPreset.defaultBudget,
    preferredGuideNpcId: matchedPreset.recommendedGuideNpcId,
  });
  const brief = generateEvidenceBrief(mission);

  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <PortfolioNav />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-6">
          <Link
            href="/roleforge"
            className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ROLEFORGE HUB</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-200">Mission: {id}</span>
        </div>

        {/* Mission Dossier Header */}
        <div className="bg-[#0d0f12] border border-cyan-500/30 rounded-xl p-6 sm:p-8 mb-8 shadow-[0_0_30px_rgba(34,211,238,0.15)] font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest mb-1">
                COMPILED CAMPUS MISSION PLAN
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {mission.roleTitle}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Assigned Guide: <strong className="text-zinc-200">{mission.assignedGuideNpc.name}</strong> ({mission.assignedGuideNpc.role})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/?roleforge=preset&preset=${matchedPreset.slug}`}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>START 3D WALKTHROUGH</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800">
              <div className="text-lg font-bold text-cyan-400">{mission.steps.length}</div>
              <div className="text-[10px] text-zinc-400 uppercase mt-0.5">Waypoints</div>
            </div>
            <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800">
              <div className="text-lg font-bold text-cyan-400">{mission.totalDurationSeconds}s</div>
              <div className="text-[10px] text-zinc-400 uppercase mt-0.5">Est. Duration</div>
            </div>
            <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800">
              <div className="text-lg font-bold text-emerald-400">{brief.directEvidenceCount}</div>
              <div className="text-[10px] text-zinc-400 uppercase mt-0.5">Direct Artifacts</div>
            </div>
          </div>
        </div>

        {/* Waypoints Sequence */}
        <div className="space-y-4 mb-8 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            Waypoint Sequence & Route Directives
          </h2>

          <div className="space-y-3">
            {mission.steps.map((step) => (
              <div
                key={step.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    {step.stepIndex}. {step.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-cyan-300">
                    {step.facilityId.toUpperCase()} · ~{step.estimatedDurationSeconds}s
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  {step.roleExplanation}
                </p>
                <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/80">
                  Coordinates: [{step.coordinates.join(", ")}] · Route: {step.routeDescription}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}

