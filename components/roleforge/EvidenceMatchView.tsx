/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Explainable Evidence Match View
 */

"use client";

import React from "react";
import { summarizeEvidenceMatches } from "@/lib/roleforge/evidenceMatcher";
import { useRoleForgeStore } from "@/state/roleforgeStore";
import type { EvidenceStrength } from "@/lib/roleforge/types";

const STRENGTH_BADGES: Record<EvidenceStrength, { label: string; badge: string }> = {
  DIRECT: {
    label: "DIRECT VERIFIED EVIDENCE",
    badge: "bg-emerald-950/60 text-emerald-400 border-emerald-500/40",
  },
  RELATED: {
    label: "RELATED ARCHITECTURAL EVIDENCE",
    badge: "bg-cyan-950/60 text-cyan-400 border-cyan-500/40",
  },
  PARTIAL: {
    label: "PARTIAL / FOUNDATIONAL EVIDENCE",
    badge: "bg-amber-950/60 text-amber-400 border-amber-500/40",
  },
  NONE: {
    label: "DISCLOSED GAP (NO VERIFIED ARTIFACT)",
    badge: "bg-zinc-900 text-zinc-400 border-zinc-700",
  },
};

export const EvidenceMatchView: React.FC = () => {
  const { compiledMission } = useRoleForgeStore();

  if (!compiledMission) {
    return (
      <div className="py-12 text-center text-zinc-500 font-mono text-xs">
        No active mission compiled. Please select a role or paste a job description.
      </div>
    );
  }

  const matches = compiledMission.matchedRequirements;
  const stats = summarizeEvidenceMatches(matches);

  return (
    <div className="space-y-4">
      {/* Header & Truth Invariant */}
      <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-cyan-400 uppercase">
            Explainable Evidence Mapping
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Every match is backed by verified code commits, test suites, and honest limitations.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
          <span className="text-cyan-400">●</span> Zero Fake ATS Scores • 100% Verifiable Git Hashes
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded">
          <div className="text-[10px] font-mono uppercase text-emerald-400">Direct Matches</div>
          <div className="text-xl font-mono font-bold text-emerald-300">{stats.directCount}</div>
        </div>
        <div className="bg-cyan-950/30 border border-cyan-500/30 p-2.5 rounded">
          <div className="text-[10px] font-mono uppercase text-cyan-400">Related Skills</div>
          <div className="text-xl font-mono font-bold text-cyan-300">{stats.relatedCount}</div>
        </div>
        <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded">
          <div className="text-[10px] font-mono uppercase text-amber-400">Partial Skills</div>
          <div className="text-xl font-mono font-bold text-amber-300">{stats.partialCount}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Disclosed Gaps</div>
          <div className="text-xl font-mono font-bold text-zinc-300">{stats.noneCount}</div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {matches.map((item) => {
          const badge = STRENGTH_BADGES[item.strength];
          return (
            <div
              key={item.requirement.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded p-3.5 space-y-2.5 transition-all hover:border-zinc-700"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">
                    {item.requirement.skillName}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item.requirement.category}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    ({item.requirement.priority})
                  </span>
                </div>

                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border inline-block ${badge.badge}`}
                >
                  {badge.label}
                </span>
              </div>

              {/* Rationale */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-2 rounded border border-zinc-800/80">
                {item.reason}
              </p>

              {/* Matched Evidence Artifacts */}
              {item.matchedEvidence.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-zinc-800/60">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">
                    Verified Repository Artifacts:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.matchedEvidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="bg-zinc-950/80 border border-zinc-800 rounded p-2 text-xs font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-cyan-300 text-[11px] truncate">
                            {ev.title}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400">
                            {ev.sourceCommit.slice(0, 7)}
                          </span>
                        </div>

                        <div className="text-[10px] text-zinc-400 truncate">
                          📁 {ev.sourceFilePath}
                        </div>

                        {ev.testReferences && ev.testReferences.length > 0 && (
                          <div className="text-[9px] text-emerald-400/90 truncate">
                            ✓ {ev.testReferences[0]}
                          </div>
                        )}

                        {ev.limitations && ev.limitations.length > 0 && (
                          <div className="text-[9px] text-amber-400/80 italic line-clamp-1">
                            ⚠ {ev.limitations[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

