import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { CURATED_ROLE_PRESETS } from "@/lib/roleforge/skillTaxonomy";
import { RoleForgeClientView } from "./RoleForgeClientView";
import {
  VoxelPanel,
  VoxelButton,
  VoxelCard,
  VoxelStatusLamp,
  VoxelBadge,
  VoxelWrenchIcon,
  VoxelShieldIcon,
  VoxelAiChipIcon,
} from "@/components/ui/voxel";
import {
  Target,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  GitBranch,
  FileCheck,
  Shield,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Frontier RoleForge — The Living Engineering Proof Compiler | Asish",
  description:
    "Transform technical job descriptions into explainable evidence graphs, verified GitHub commit citations, and adaptive 3D engineering campus missions. Zero fake ATS scores.",
};

export default function RoleForgeHubPage() {
  return (
    <div className="min-h-screen technical-grid-bg text-zinc-100 flex flex-col font-sans selection:bg-[#ff8000] selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* 1. Voxel Workbench Hero Panel */}
        <section aria-labelledby="roleforge-hero-title">
          <VoxelPanel
            variant="iron"
            title="ENGINEERING SKILL FORGE // LIVING PROOF COMPILER"
            icon={<VoxelWrenchIcon size={16} />}
            headerActions={
              <VoxelStatusLamp tone="cyan" label="COMPILER READY" pulse />
            }
          >
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#121418] border border-[#3f4756] font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>FRONTIER ROLEFORGE • EVIDENCE COMPILATION WORKBENCH</span>
              </div>

              <h1
                id="roleforge-hero-title"
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-retro text-white tracking-tight uppercase"
              >
                YOUR ROLE. MY ENGINEERING. <span className="text-amber-400">REAL PROOF.</span>
              </h1>

              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-3xl">
                Select a curated discipline or paste your team&apos;s exact technical job description.
                RoleForge deterministically extracts canonical requirements, categorizes verified evidence across public code repositories, and compiles an adaptive 3D campus mission tailored to your time budget.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <VoxelButton
                  variant="red"
                  href="/roleforge/defense"
                  icon={<Shield className="w-3.5 h-3.5" />}
                >
                  ENTER DEFENSE ARENA 2.0
                </VoxelButton>

                <VoxelButton
                  variant="cyan"
                  href="/roleforge/passport"
                  icon={<FileText className="w-3.5 h-3.5" />}
                >
                  EVIDENCE PASSPORT
                </VoxelButton>

                <VoxelButton
                  variant="gold"
                  href="/world"
                  icon={<span>🚀</span>}
                >
                  3D WORLD TERMINAL [R]
                </VoxelButton>

                <VoxelButton
                  variant="stone"
                  href="/roleforge/review"
                  icon={<FileCheck className="w-3.5 h-3.5 text-cyan-400" />}
                >
                  TECH REVIEW BOARD
                </VoxelButton>
              </div>
            </div>
          </VoxelPanel>
        </section>

        {/* 2. Interactive RoleForge Operations Console in Voxel Frame */}
        <section aria-label="RoleForge Operations Console">
          <div className="voxel-panel-deepslate border-3 border-[#3f4756] overflow-hidden shadow-2xl">
            <RoleForgeClientView />
          </div>
        </section>

        {/* 3. Curated Role Presets Fast Track */}
        <section aria-labelledby="curated-roles-title" className="space-y-4">
          <div className="border-b-2 border-[#2b303c] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 id="curated-roles-title" className="font-pixel text-sm sm:text-base text-white uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ff8000]" />
                <span>CURATED RECRUITER JOURNEYS</span>
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Pre-compiled evidence briefs and 3D walkthroughs for senior engineering specializations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURATED_ROLE_PRESETS.map((preset) => (
              <Link
                key={preset.id}
                href={`/roleforge/role/${preset.slug}`}
                className="voxel-panel-deepslate border-2 p-5 flex flex-col justify-between hover:border-amber-400 transition-all group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#252a36]">
                    <span className="font-pixel text-[8px] text-amber-400 uppercase">
                      {preset.discipline.split(",")[0]}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#121418] border border-[#2d3542] text-zinc-400">
                      {preset.defaultBudget === "QUICK_90S" ? "90s Fast" : "5m Deep"}
                    </span>
                  </div>

                  <h3 className="font-pixel text-xs text-white group-hover:text-amber-400 transition-colors mb-2 leading-snug">
                    {preset.title}
                  </h3>

                  <p className="font-mono text-xs text-zinc-300 line-clamp-2 mb-4 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="font-pixel text-[8px] text-zinc-400 uppercase">
                      VERIFIED COMPETENCIES:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {preset.coreRequirements.slice(0, 3).map((req) => (
                        <span
                          key={req.canonicalSkillId}
                          className="mc-item-chip px-2 py-0.5 text-[9px] font-mono text-zinc-300"
                        >
                          {req.skillName.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#252a36] flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="text-[10px]">Guide: {preset.recommendedGuideNpcId.replace(/-/g, " ")}</span>
                  <span className="text-amber-400 font-pixel text-[9px] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    INSPECT &gt;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Verification Principles Voxel Panel */}
        <section aria-labelledby="principles-title">
          <VoxelPanel
            variant="iron"
            title="ROLEFORGE VERIFICATION PRINCIPLES // ZERO ATS DRIFT"
            icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300 leading-relaxed font-mono">
              <div className="p-3 bg-[#121418] border border-[#29303d]">
                <div className="flex items-center gap-2 text-white font-bold mb-1.5 font-pixel text-[10px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Fake ATS Scores</span>
                </div>
                <p className="text-zinc-400">
                  No uncalibrated percentages or fabricated match metrics. Every capability is categorized into DIRECT, RELATED, PARTIAL, or honest NONE with human-readable rationale.
                </p>
              </div>

              <div className="p-3 bg-[#121418] border border-[#29303d]">
                <div className="flex items-center gap-2 text-white font-bold mb-1.5 font-pixel text-[10px]">
                  <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>100% Client-Side Privacy</span>
                </div>
                <p className="text-zinc-400">
                  Job specifications are parsed purely within your browser memory. No text is sent to third-party endpoints or stored on external servers.
                </p>
              </div>

              <div className="p-3 bg-[#121418] border border-[#29303d]">
                <div className="flex items-center gap-2 text-white font-bold mb-1.5 font-pixel text-[10px]">
                  <GitBranch className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Verifiable Git Permalinks</span>
                </div>
                <p className="text-zinc-400">
                  Every direct claim cites specific repository commits, files, line ranges, and automated test commands runnable on clean machines.
                </p>
              </div>
            </div>
          </VoxelPanel>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
