import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { SystemsForgeEditor } from "@/components/forge/SystemsForgeEditor";
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
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Hero */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/80 rounded font-mono text-xs text-red-400 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pillar 2: Executable Architecture Builder</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-retro tracking-tight text-white uppercase">
                FRONTIER SYSTEMS FORGE
              </h1>
              <p className="text-base sm:text-lg font-mono text-zinc-300">
                Playable Software Architecture & Invariant Verifier
              </p>
              <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed max-w-2xl">
                Don&apos;t just read architecture diagrams. Assemble modular stream blocks (Validators,
                Deduplicators, Transformers, Sinks), compile typed directed acyclic graphs, execute real
                deterministic telemetry fixtures, and inspect post-mortem engineering debriefs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/proofcast"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs font-bold uppercase rounded transition-colors"
              >
                <Film className="w-4 h-4 text-red-400" />
                <span>Watch ProofCast</span>
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
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-mono font-bold uppercase text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Compilation & Execution Invariants</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">Deterministic Browser Sandbox</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                01 • Strict Port Typing
              </div>
              <h3 className="text-sm font-bold text-white font-retro">Compile-Time Type Safety</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Raw socket bytes cannot bypass the validation boundary to enter canonical transformers.
                Type signatures enforce boundary defense at graph compile time.
              </p>
            </div>

            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                02 • Deduplication & LRU Cache
              </div>
              <h3 className="text-sm font-bold text-white font-retro">Replay Protection</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                UDP retransmits and network jitter create duplicate packet floods. The LRU deduplicator
                intercepts resends to guarantee idempotent storage invariants.
              </p>
            </div>

            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-blue-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                03 • Deterministic Fixture Suite
              </div>
              <h3 className="text-sm font-bold text-white font-retro">Chaos & Fault Injection</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Test fixtures embed corrupted speeds (&gt;800 kph) and duplicate sequence numbers.
                Removing the validator crashes downstream transformers with descriptive tracebacks.
              </p>
            </div>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}

