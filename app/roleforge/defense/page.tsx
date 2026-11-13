/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * 2D Web Route: /roleforge/defense
 * Engineering Defense Arena Hub
 */

import React from "react";
import Link from "next/link";
import { getAllDefenseTracks } from "@/lib/defense/scenarioRegistry";
import { DefenseArenaClientView } from "./DefenseArenaClientView";
import { VoxelPanel, VoxelBadge } from "@/components/ui/voxel";

export const metadata = {
  title: "Engineering Defense Arena | ASISH: The Engineering Frontier",
  description:
    "Don't just show engineering capability. Challenge and verify it. Interactive fault injection, spatial lap delta sensitivity, and AI leakage labs.",
};

export default function DefenseArenaPage() {
  const tracks = getAllDefenseTracks();

  return (
    <div className="technical-grid-bg min-h-screen text-zinc-100 flex flex-col font-sans">
      {/* Navigation Top Bar */}
      <nav className="bg-[#191B20] border-b-2 border-zinc-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/roleforge"
            className="voxel-btn voxel-btn-stone px-2.5 py-1 text-[10px] font-pixel text-zinc-300 hover:text-white"
          >
            ← ROLEFORGE
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-pixel text-red-400 mc-text-shadow">
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
            className="voxel-btn voxel-btn-cyan px-2.5 py-1 text-[9px] font-pixel text-cyan-200"
          >
            Evidence Passport ↗
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Hero Section */}
        <VoxelPanel
          material="carbon"
          title="FRONTIER ROLEFORGE 2.0 DEFENSE SYSTEM"
          titleLamp="redstone"
          className="p-6 sm:p-8 shadow-[0_0_30px_rgba(220,38,38,0.15)]"
        >
          <h1 className="text-xl sm:text-3xl font-pixel text-white tracking-tight mb-3 mc-text-shadow">
            THE ENGINEERING DEFENSE ARENA
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-300 max-w-3xl leading-relaxed">
            Most portfolios present only the happy path. Real engineering happens at the boundaries.
            Act as a senior software engineering review board and stress-test three live software systems
            under injected network faults, spatial discretization limits, and machine learning leakage.
          </p>
        </VoxelPanel>

        {/* Client Interactive Console */}
        <DefenseArenaClientView />
      </main>
    </div>
  );
}
