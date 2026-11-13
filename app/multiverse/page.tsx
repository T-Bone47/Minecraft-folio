import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { multiverseProjects } from "@/lib/multiverse/projectRegistry";
import {
  VoxelPanel,
  VoxelButton,
  VoxelCard,
  VoxelStatusLamp,
  VoxelBadge,
  VoxelRaceCarIcon,
  VoxelTelemetryTowerIcon,
  VoxelShieldIcon,
  VoxelAiChipIcon,
  VoxelPortalIcon,
} from "@/components/ui/voxel";
import {
  Globe,
  ArrowRight,
  ExternalLink,
  Layers,
  GitBranch,
  Play,
  Cpu,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Frontier Multiverse — The Connected Engineering Universe | Asish",
  description:
    "Direct gateways into four distinct, production-grade software repositories spanning motorsport strategy, telemetry normalization, continuous AI governance, and offline voice accounting.",
};

const PROJECT_EMBLEMS: Record<string, React.ReactNode> = {
  racemind: <VoxelRaceCarIcon size={24} />,
  "live-f1": <VoxelTelemetryTowerIcon size={24} />,
  sentinel: <VoxelShieldIcon size={24} />,
  vyaparpulse: <VoxelAiChipIcon size={24} />,
};

export default function MultiverseHubPage() {
  return (
    <div className="min-h-screen technical-grid-bg text-zinc-100 flex flex-col font-sans selection:bg-[#ff8000] selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* 1. Voxel Engineering Gateway Hero */}
        <section aria-labelledby="multiverse-hero-title">
          <VoxelPanel
            variant="iron"
            title="GATEWAY ARCHIVE // FOUR PRODUCTION SYSTEMS"
            icon={<VoxelPortalIcon size={16} />}
            headerActions={
              <VoxelStatusLamp tone="emerald" label="4 PORTALS ACTIVE" pulse />
            }
          >
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#121418] border border-[#3f4756] font-mono text-[10px] text-amber-400 uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>FRONTIER MULTIVERSE • PRODUCTION SYSTEMS BRIDGE</span>
              </div>

              <h1
                id="multiverse-hero-title"
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-retro tracking-tight text-white uppercase"
              >
                THE CONNECTED ENGINEERING UNIVERSE
              </h1>

              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-3xl">
                Direct portals into four independent, verified software systems. Experience real client-side
                simulation slices, audit 6-layer mathematical evidence manifests, and inspect genuine Git commits
                with zero fabricated metrics.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <VoxelButton
                  variant="gold"
                  href="/world"
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  EXPLORE IN 3D LAUNCH BAY
                </VoxelButton>

                <VoxelButton
                  variant="stone"
                  href="https://github.com/T-Bone47"
                  external
                  icon={<GitBranch className="w-3.5 h-3.5 text-amber-400" />}
                >
                  GITHUB PROFILE (@T-BONE47)
                </VoxelButton>
              </div>
            </div>
          </VoxelPanel>
        </section>

        {/* 2. Voxel Project Portal Terminals Grid */}
        <section aria-label="Project Portal Terminals" className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#2b303c] pb-3">
            <h2 className="text-sm sm:text-base font-pixel text-white uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ff8000]" />
              <span>VOXEL PROJECT PORTAL TERMINALS</span>
            </h2>
            <span className="font-mono text-xs text-zinc-400">4 PRODUCTION REPOSITORIES</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {multiverseProjects.map((project) => {
              const Emblem = PROJECT_EMBLEMS[project.id] || <VoxelPortalIcon size={24} />;

              return (
                <article
                  key={project.id}
                  className="voxel-panel-deepslate border-3 p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all hover:border-[#ff8000] relative overflow-hidden group shadow-2xl"
                  style={{
                    borderTopColor: project.themeColor,
                  }}
                >
                  {/* Top Domain Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#252a36]">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 p-1 bg-[#121418] border-2 border-[#384050] flex items-center justify-center shrink-0 shadow-inner"
                          style={{ borderColor: project.themeColor }}
                        >
                          {Emblem}
                        </div>
                        <div>
                          <span className="font-pixel text-[8px] text-amber-400 uppercase block">
                            {project.category}
                          </span>
                          <span className="font-mono text-[11px] text-zinc-300 font-bold block truncate max-w-[200px] sm:max-w-xs">
                            {project.domain.split(",")[0]}
                          </span>
                        </div>
                      </div>

                      <VoxelBadge tone="gold">
                        {project.provenance.replace(/_/g, " ")}
                      </VoxelBadge>
                    </div>

                    {/* Project Title & Tagline */}
                    <div className="mt-4 space-y-1.5">
                      <h3 className="font-pixel text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Inset Metrics Screen */}
                    <div className="mc-slot-box p-3 grid grid-cols-2 gap-3 my-4">
                      {project.keyMetrics.slice(0, 4).map((m, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="font-mono text-[9px] text-zinc-400 uppercase leading-tight truncate">
                            {m.label}
                          </div>
                          <div className="font-pixel text-xs sm:text-sm text-white">
                            {m.value}
                          </div>
                          <div className="font-mono text-[8px] text-zinc-400 truncate">
                            {m.detail}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Technology Inventory Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="mc-item-chip px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t-2 border-[#202530] flex flex-wrap items-center justify-between gap-3">
                    <VoxelButton
                      variant="cyan"
                      size="sm"
                      href={`/multiverse/${project.slug}`}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      LAUNCH PORTAL
                    </VoxelButton>

                    <Link
                      href={`/multiverse/${project.slug}/engineering`}
                      className="font-pixel text-[9px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors underline underline-offset-4"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>6-LAYER PROOF</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. Voxel Architectural Comparison Matrix */}
        <section aria-labelledby="matrix-heading">
          <VoxelPanel
            variant="iron"
            title="CROSS-PROJECT ARCHITECTURAL MATRIX // COMMIT LEVEL"
            icon={<Layers className="w-4 h-4 text-sky-400" />}
          >
            <div className="voxel-data-screen overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-[#262c36] text-amber-400 font-pixel text-[9px]">
                    <th className="p-3">SYSTEM</th>
                    <th className="p-3">CORE PROBLEM</th>
                    <th className="p-3">VERIFIED BENCHMARK</th>
                    <th className="p-3">TECHNOLOGIES</th>
                    <th className="p-3">COMMIT SHA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e232b]">
                  {multiverseProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#141820] transition-colors">
                      <td className="p-3 font-pixel text-[10px] text-white">
                        <Link href={`/multiverse/${p.slug}`} className="hover:text-amber-400">
                          {p.name}
                        </Link>
                      </td>
                      <td className="p-3 text-zinc-300 max-w-xs truncate">{p.tagline}</td>
                      <td className="p-3 text-emerald-400 font-bold">
                        {p.keyMetrics[0].label}: {p.keyMetrics[0].value}
                      </td>
                      <td className="p-3 text-zinc-400">{p.technologies.slice(0, 3).join(", ")}</td>
                      <td className="p-3 text-amber-400 font-mono">
                        <a
                          href={`${p.repositoryUrl}/commit/${p.commitSha}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          <code>{p.commitSha}</code>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VoxelPanel>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
