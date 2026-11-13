import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { ProofCastPlayer } from "@/components/proofcast/ProofCastPlayer";
import { getAvailableProofCastRoles } from "@/lib/proofcast/storyCompiler";
import { VoxelCard, VoxelBadge } from "@/components/ui/voxel";
import { canonicalUrl } from "@/lib/siteMetadata";
import { Play, ShieldCheck, Film, Code2, Cpu, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  alternates: canonicalUrl("/proofcast") ? { canonical: canonicalUrl("/proofcast") } : undefined,
  title: "Frontier ProofCast — Interactive 60-Second Engineering Documentary",
  description:
    "Interactive, evidence-backed 60-second engineering documentaries proving Asish Oliver M's architecture, 60 Hz physics loops, and real-time telemetry systems.",
};

export default function ProofCastPage() {
  const roles = getAvailableProofCastRoles();

  return (
    <div className="technical-grid-bg min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Hero */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2">
            <VoxelBadge tone="redstone" size="md">
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                <span>PILLAR 1: FRONTIER REALITY DOCUMENTARY</span>
              </span>
            </VoxelBadge>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-pixel tracking-tight text-white uppercase mc-text-shadow">
                FRONTIER PROOFCAST
              </h1>
              <p className="text-sm sm:text-base font-mono text-[#00d2be] font-bold">
                Interactive 60-Second Engineering Reality Documentary
              </p>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-2xl bg-black/40 p-3.5 border-l-2 border-red-500 shadow-sm">
                Watch verified engineering achievements stream in real time. Pause at any moment to inspect
                exact GitHub commits, test commands, and source-level implementation details. Zero fabricated
                claims.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/forge"
                className="voxel-btn voxel-btn-stone px-4 py-2.5 font-pixel text-xs text-zinc-200 hover:text-white flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>SYSTEMS FORGE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Embedded ProofCast Player */}
        <section aria-label="Interactive ProofCast documentary player">
          <ProofCastPlayer initialRole="motorsport" initialMode="RECRUITER_60S" />
        </section>

        {/* Role Matrix */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b-2 border-zinc-800/80 pb-3">
            <h2 className="text-sm sm:text-base font-pixel uppercase text-white flex items-center gap-2 mc-text-shadow">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Specialized Documentary Tracks</span>
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">5 Role Presets Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => (
              <VoxelCard
                key={r.role}
                material="dark-iron"
                className="p-5 hover:border-red-500/50 transition-colors flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="text-[10px] font-pixel uppercase text-red-400 mb-1 mc-text-shadow">
                    TRACK: {r.role}
                  </div>
                  <h3 className="text-sm font-pixel text-white mc-text-shadow">{r.label}</h3>
                  <p className="text-xs font-mono text-zinc-300 mt-2 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-pixel text-[9px] flex items-center gap-1 mc-text-shadow">
                    <ShieldCheck className="w-3 h-3" /> 6 Verified Chapters
                  </span>
                  <Link
                    href={`/proofcast/${r.role}`}
                    className="voxel-btn voxel-btn-stone px-2.5 py-1 text-[9px] font-pixel text-yellow-300 hover:text-white flex items-center gap-1"
                  >
                    <span>WATCH</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </VoxelCard>
            ))}
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}

