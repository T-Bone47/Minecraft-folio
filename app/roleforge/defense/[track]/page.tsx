/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * 2D Web Route: /roleforge/defense/[track]
 * Direct Track Deep-Dive Route
 */

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefenseTrack, getAllDefenseTracks } from "@/lib/defense/scenarioRegistry";
import { DefenseArenaClientView } from "../DefenseArenaClientView";
import type { DefenseTrackId } from "@/lib/defense/types";

interface TrackPageProps {
  params: Promise<{
    track: string;
  }>;
}

export async function generateStaticParams() {
  const tracks = getAllDefenseTracks();
  return tracks.map((t) => ({ track: t.id }));
}

export async function generateMetadata({ params }: TrackPageProps) {
  const resolvedParams = await params;
  const track = getDefenseTrack(resolvedParams.track as DefenseTrackId);
  if (!track) return { title: "Defense Track Not Found" };

  return {
    title: `${track.title} | Engineering Defense Arena`,
    description: track.description,
  };
}

export default async function DefenseTrackPage({ params }: TrackPageProps) {
  const resolvedParams = await params;
  const track = getDefenseTrack(resolvedParams.track as DefenseTrackId);
  if (!track) notFound();

  const allTracks = getAllDefenseTracks();

  return (
    <div className="min-h-screen bg-[#090b0e] text-zinc-100 flex flex-col font-sans">
      {/* Navigation Top Bar */}
      <nav className="bg-[#0f1217] border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/roleforge/defense"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            ← Defense Arena
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono font-bold text-red-400 uppercase">
            {track.shortTitle}
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
        <DefenseArenaClientView initialTrackId={track.id} />
      </main>
    </div>
  );
}
