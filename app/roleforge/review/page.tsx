/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * 2D Web Route: /roleforge/review
 * Standalone Senior Staff Technical Review Board
 */

import React from "react";
import Link from "next/link";
import { getAllDefenseTracks } from "@/lib/defense/scenarioRegistry";
import { TechnicalReviewBoard } from "@/components/defense/TechnicalReviewBoard";

export const metadata = {
  title: "Senior Staff Technical Review Board | ASISH: The Engineering Frontier",
  description:
    "Rigorous architectural review board covering constraints, decisions, assumptions, test commands, trade-offs, and honest boundaries for all systems.",
};

export default function TechnicalReviewPage() {
  const tracks = getAllDefenseTracks();

  return (
    <div className="min-h-screen bg-[#090b0e] text-zinc-100 flex flex-col font-sans">
      {/* Navigation Top Bar */}
      <nav className="bg-[#0f1217] border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/roleforge"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            ← RoleForge
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            TECHNICAL REVIEW BOARD
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <Link
            href="/roleforge/defense"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Defense Arena
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/roleforge/passport"
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
          >
            Evidence Passport ↗
          </Link>
        </div>
      </nav>

      {/* Main Review Document */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-8">
        {/* Review Header Banner */}
        <div className="bg-[#12151c] border border-cyan-500/30 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 uppercase">
              STAFF+ ENGINEERING AUDIT
            </span>
            <span className="text-xs font-mono text-zinc-500">
              3 ACTIVE DEFENSE TRACKS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight mb-2">
            TECHNICAL REVIEW BOARD
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
            Modeled after Staff+ architecture reviews at leading infrastructure companies.
            Below is the full evaluation breakdown for our streaming pipelines, spatial numerical
            solvers, and machine learning evaluation methodologies.
          </p>
        </div>

        {/* Reviews for each track */}
        <div className="space-y-12">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-[#0e1117] border border-zinc-800 rounded-xl p-4 sm:p-6"
            >
              <TechnicalReviewBoard review={track.review} title={track.title} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

