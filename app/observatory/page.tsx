import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { EngineeringObservatory } from "@/components/livePulse/EngineeringObservatory";
import { getLivePulseSnapshot } from "@/lib/livePulse/githubSnapshot";
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
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Hero */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/80 rounded font-mono text-xs text-red-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Pillar 3: Living Multi-Repository Observatory</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-retro tracking-tight text-white uppercase">
                FRONTIER LIVE PULSE
              </h1>
              <p className="text-base sm:text-lg font-mono text-zinc-300">
                Multi-Repository CI, Release & Incident Engineering Observatory
              </p>
              <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed max-w-2xl">
                Observe live operational health across 5 public GitHub repositories. Inspect commit feeds,
                verified benchmarks, passing CI workflow matrices, and transparent incident post-mortems.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/proofcast"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs font-bold uppercase rounded transition-colors"
              >
                <Film className="w-4 h-4 text-red-400" />
                <span>ProofCast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/forge"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase rounded transition-colors shadow-lg shadow-red-950/40"
              >
                <Cpu className="w-4 h-4" />
                <span>Systems Forge</span>
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

