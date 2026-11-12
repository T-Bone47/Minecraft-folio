/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Executive Engineering Evidence Brief
 */

"use client";

import React from "react";
import { useRoleForgeStore } from "@/state/roleforgeStore";

export const EngineeringEvidenceBrief: React.FC = () => {
  const { evidenceBrief, compiledMission, generateBrief } = useRoleForgeStore();

  React.useEffect(() => {
    if (!evidenceBrief && compiledMission) {
      generateBrief();
    }
  }, [evidenceBrief, compiledMission, generateBrief]);

  if (!evidenceBrief) {
    return (
      <div className="py-12 text-center text-zinc-500 font-mono text-xs">
        Generating evidence brief...
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      {/* Executive Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              ROLEFORGE VERIFIED CANDIDATE DOSSIER
            </div>
            <h2 className="text-lg font-bold text-white font-mono mt-0.5">
              {evidenceBrief.targetRole}
            </h2>
            <div className="text-xs text-zinc-400 font-mono">
              Candidate: <strong className="text-white">Asish</strong> · Frontier Engineering Portfolio
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono border border-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <span>🖨️</span> PRINT / SAVE PDF
            </button>
          </div>
        </div>

        {/* Candidate Direct Links */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
          <a
            href={evidenceBrief.candidateLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700"
          >
            GitHub: T-Bone47 ↗
          </a>
          <a
            href={evidenceBrief.candidateLinks.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700"
          >
            Live Engineering World ↗
          </a>
          <a
            href={evidenceBrief.candidateLinks.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700"
          >
            Resume PDF ↗
          </a>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded text-center">
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {evidenceBrief.directEvidenceCount}
          </div>
          <div className="text-[10px] font-mono uppercase text-emerald-300 mt-0.5">
            Direct Verified Evidence
          </div>
        </div>
        <div className="bg-cyan-950/30 border border-cyan-500/30 p-3 rounded text-center">
          <div className="text-2xl font-mono font-bold text-cyan-400">
            {evidenceBrief.relatedEvidenceCount}
          </div>
          <div className="text-[10px] font-mono uppercase text-cyan-300 mt-0.5">
            Related Competencies
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-center">
          <div className="text-2xl font-mono font-bold text-zinc-400">
            {evidenceBrief.uncoveredCount}
          </div>
          <div className="text-[10px] font-mono uppercase text-zinc-400 mt-0.5">
            Disclosed Non-Matches
          </div>
        </div>
      </div>

      {/* Technical Highlights Section */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          Technical Highlights & Verified Source Permalinks
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {evidenceBrief.technicalHighlights.map((hl, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 rounded p-3 text-xs font-mono space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-[11px] truncate">
                  {hl.title}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                  {hl.category}
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 line-clamp-2">
                {hl.detail}
              </p>

              <div className="pt-1 flex items-center justify-between text-[10px]">
                <span className="text-zinc-500 truncate max-w-[200px]">
                  {hl.sourcePath}
                </span>
                <a
                  href={hl.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Inspect Git Blob ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Repositories Table */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          Verified Repository Registry
        </div>

        <div className="border border-zinc-800 rounded overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-[10px] uppercase text-zinc-400">
                <th className="p-2">Repository</th>
                <th className="p-2">Verified Commit</th>
                <th className="p-2">Verification Artifact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {evidenceBrief.verifiedRepositories.map((repo) => (
                <tr key={repo.name} className="hover:bg-zinc-900/40">
                  <td className="p-2 font-semibold">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      {repo.name} ↗
                    </a>
                  </td>
                  <td className="p-2 text-zinc-400 font-mono text-[11px]">
                    {repo.commit}
                  </td>
                  <td className="p-2 text-zinc-300 text-[11px]">
                    {repo.provenance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclosed Limitations / Honest Gaps */}
      {evidenceBrief.disclosedGaps.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Disclosed Competency Gaps & Verification Bounds
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded p-3 space-y-2 text-xs font-mono">
            {evidenceBrief.disclosedGaps.map((gap, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px]">
                <span className="text-zinc-500">•</span>
                <div>
                  <strong className="text-zinc-300">{gap.skillName}:</strong>{" "}
                  <span className="text-zinc-400">{gap.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

