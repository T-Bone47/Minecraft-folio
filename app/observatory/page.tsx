import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { EngineeringObservatory } from "@/components/livePulse/EngineeringObservatory";
import { getLivePulseSnapshot } from "@/lib/livePulse/githubSnapshot";
import { VoxelBadge } from "@/components/ui/voxel";
import { canonicalUrl } from "@/lib/siteMetadata";
import { Activity, ShieldCheck, Film, Cpu, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  alternates: canonicalUrl("/observatory") ? { canonical: canonicalUrl("/observatory") } : undefined,
  title: "Frontier Live Pulse — Multi-Repository Engineering Observatory",
  description:
    "Real-time engineering observatory monitoring commit telemetry, CI health, release tags, and incident recovery across Asish's 5 software repositories.",
};

export default function ObservatoryPage() {
  const snapshot = getLivePulseSnapshot();

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
                <Activity className="w-3.5 h-3.5" />
                <span>PILLAR 3: LIVING MULTI-REPOSITORY OBSERVATORY</span>
              </span>
            </VoxelBadge>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-pixel tracking-tight text-white uppercase mc-text-shadow">
                FRONTIER LIVE PULSE
              </h1>
              <p className="text-sm sm:text-base font-mono text-[#00d2be] font-bold">
                Multi-Repository CI, Release & Incident Engineering Observatory
              </p>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-2xl bg-black/40 p-3.5 border-l-2 border-red-500 shadow-sm">
                Observe live operational health across 5 public GitHub repositories. Inspect commit feeds,
                verified benchmarks, passing CI workflow matrices, and transparent incident post-mortems.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/proofcast"
                className="voxel-btn voxel-btn-stone px-4 py-2.5 font-pixel text-xs text-zinc-200 hover:text-white flex items-center gap-2"
              >
                <Film className="w-4 h-4 text-red-400" />
                <span>PROOFCAST</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/forge"
                className="voxel-btn voxel-btn-redstone px-4 py-2.5 font-pixel text-xs text-white flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>SYSTEMS FORGE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Embedded Observatory Dashboard */}
        <section aria-label="Live pulse multi-repository engineering observatory">
          <EngineeringObservatory snapshot={snapshot} />
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}

