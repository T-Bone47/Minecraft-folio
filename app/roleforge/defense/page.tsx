/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * 2D Web Route: /roleforge/defense
 * Engineering Defense Arena Hub
 */

import React from "react";
import Link from "next/link";
import { getAllDefenseTracks } from "@/lib/defense/scenarioRegistry";
import { DefenseArenaClientView } from "./DefenseArenaClientView";

export const metadata = {
  title: "Engineering Defense Arena | ASISH: The Engineering Frontier",
  description:
    "Don't just show engineering capability. Challenge and verify it. Interactive fault injection, spatial lap delta sensitivity, and AI leakage labs.",
};

export default function DefenseArenaPage() {
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
          <span className="text-xs font-mono font-bold text-red-400">
            ENGINEERING DEFENSE ARENA
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <Link
            href="/roleforge/review"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Technical Review Board
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

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        {/* Hero Section */}
        <div className="mb-8 bg-[#11141c] border border-red-500/30 rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-red-400 tracking-wider uppercase">
              FRONTIER ROLEFORGE 2.0 DEFENSE SYSTEM
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-mono text-white tracking-tight mb-3">
            THE ENGINEERING DEFENSE ARENA
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
            Most portfolios present only the happy path. Real engineering happens at the boundaries.
            Act as a senior software engineering review board and stress-test three live software systems
            under injected network faults, spatial discretization limits, and machine learning leakage.
          </p>
        </div>

        {/* Client Interactive Console */}
        <DefenseArenaClientView />
      </main>
    </div>
  );
}
