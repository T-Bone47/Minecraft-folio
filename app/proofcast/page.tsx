import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { ProofCastPlayer } from "@/components/proofcast/ProofCastPlayer";
import { getAvailableProofCastRoles } from "@/lib/proofcast/storyCompiler";
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
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Hero */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/80 rounded font-mono text-xs text-red-400 uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>Pillar 1: Frontier Reality Documentary</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-retro tracking-tight text-white uppercase">
                FRONTIER PROOFCAST
              </h1>
              <p className="text-base sm:text-lg font-mono text-zinc-300">
                Interactive 60-Second Engineering Reality Documentary
              </p>
              <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed max-w-2xl">
                Watch verified engineering achievements stream in real time. Pause at any moment to inspect
                exact GitHub commits, test commands, and source-level implementation details. Zero fabricated
                claims.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/forge"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs font-bold uppercase rounded transition-colors"
              >
                <Cpu className="w-4 h-4 text-red-400" />
                <span>Systems Forge</span>
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
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-mono font-bold uppercase text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Specialized Documentary Tracks</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">5 Role Presets Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => (
              <div
                key={r.role}
                className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-red-500/50 transition-colors flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-red-400 mb-1">
                    Track: {r.role}
                  </div>
                  <h3 className="text-base font-bold text-white font-retro">{r.label}</h3>
                  <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 6 Verified Chapters
                  </span>
                  <Link
                    href={`/proofcast/${r.role}`}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                  >
                    <span>Watch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}

