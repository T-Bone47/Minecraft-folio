import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { SystemsForgeEditor } from "@/components/forge/SystemsForgeEditor";
import { VoxelCard, VoxelBadge, VoxelPanel } from "@/components/ui/voxel";
import { canonicalUrl } from "@/lib/siteMetadata";
import { Cpu, ShieldCheck, Film, ArrowRight, Zap, Play, Terminal } from "lucide-react";

export const metadata: Metadata = {
  alternates: canonicalUrl("/forge") ? { canonical: canonicalUrl("/forge") } : undefined,
  title: "Frontier Systems Forge — Executable Architecture Builder",
  description:
    "Assemble software architecture blocks, compile typed DAGs, inject faults, and evaluate deterministic telemetry pipelines in your browser.",
};

export default function ForgePage() {
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
                <Cpu className="w-3.5 h-3.5" />
                <span>PILLAR 2: EXECUTABLE ARCHITECTURE BUILDER</span>
              </span>
            </VoxelBadge>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-pixel tracking-tight text-white uppercase mc-text-shadow">
                FRONTIER SYSTEMS FORGE
              </h1>
              <p className="text-sm sm:text-base font-mono text-[#00d2be] font-bold">
                Playable Software Architecture & Invariant Verifier
              </p>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-2xl bg-black/40 p-3.5 border-l-2 border-red-500 shadow-sm">
                Don&apos;t just read architecture diagrams. Assemble modular stream blocks (Validators,
                Deduplicators, Transformers, Sinks), compile typed directed acyclic graphs, execute real
                deterministic telemetry fixtures, and inspect post-mortem engineering debriefs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/proofcast"
                className="voxel-btn voxel-btn-stone px-4 py-2.5 font-pixel text-xs text-zinc-200 hover:text-white flex items-center gap-2"
              >
                <Film className="w-4 h-4 text-red-400" />
                <span>WATCH PROOFCAST</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Embedded Systems Forge Editor */}
        <section aria-label="Interactive Systems Forge graph builder">
          <SystemsForgeEditor />
        </section>

        {/* Architecture Principles Grid */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b-2 border-zinc-800/80 pb-3">
            <h2 className="text-sm sm:text-base font-pixel uppercase text-white flex items-center gap-2 mc-text-shadow">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Compilation & Execution Invariants</span>
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Deterministic Browser Sandbox</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VoxelCard material="dark-iron" className="p-5 space-y-2">
              <div className="text-[10px] font-pixel uppercase text-red-400 flex items-center gap-1.5 mc-text-shadow">
                <Zap className="w-3.5 h-3.5" />
                01 • Strict Port Typing
              </div>
              <h3 className="text-xs font-pixel text-white mc-text-shadow">Compile-Time Type Safety</h3>
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                Raw socket bytes cannot bypass the validation boundary to enter canonical transformers.
                Type signatures enforce boundary defense at graph compile time.
              </p>
            </VoxelCard>

            <VoxelCard material="dark-iron" className="p-5 space-y-2">
              <div className="text-[10px] font-pixel uppercase text-emerald-400 flex items-center gap-1.5 mc-text-shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
                02 • Deduplication & LRU Cache
              </div>
              <h3 className="text-xs font-pixel text-white mc-text-shadow">Replay Protection</h3>
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                UDP retransmits and network jitter create duplicate packet floods. The LRU deduplicator
                intercepts resends to guarantee idempotent storage invariants.
              </p>
            </VoxelCard>

            <VoxelCard material="dark-iron" className="p-5 space-y-2">
              <div className="text-[10px] font-pixel uppercase text-sky-400 flex items-center gap-1.5 mc-text-shadow">
                <Terminal className="w-3.5 h-3.5" />
                03 • Deterministic Fixture Suite
              </div>
              <h3 className="text-xs font-pixel text-white mc-text-shadow">Chaos & Fault Injection</h3>
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                Test fixtures embed corrupted speeds (&gt;800 kph) and duplicate sequence numbers.
                Removing the validator crashes downstream transformers with descriptive tracebacks.
              </p>
            </VoxelCard>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}

