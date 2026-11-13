/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Technical Review Board Component
 */

"use client";

import React from "react";
import type { TechnicalReviewSection } from "@/lib/defense/types";

interface TechnicalReviewBoardProps {
  review: TechnicalReviewSection;
  title: string;
}

export const TechnicalReviewBoard: React.FC<TechnicalReviewBoardProps> = ({
  review,
  title,
}) => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
            Senior Staff Architecture Review Board
          </span>
          <h2 className="text-base sm:text-lg font-bold font-mono text-white">
            {title}
          </h2>
        </div>

        <a
          href={review.sourceCodePermalink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View Verified Git Commit Blob</span>
          <span>↗</span>
        </a>
      </div>

      {/* 1. Problem Context */}
      <div className="bg-[#11141a] border border-zinc-800 rounded-lg p-4">
        <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="text-cyan-400">01.</span>
          <span>Core Engineering Constraint & Problem Context</span>
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {review.problemContext}
        </p>
      </div>

      {/* 2. Architectural Decisions & 3. Core Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#11141a] border border-zinc-800 rounded-lg p-4">
          <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-cyan-400">02.</span>
            <span>Architectural Decisions</span>
          </h3>
          <ul className="space-y-2 text-xs text-zinc-300">
            {review.architecturalDecisions.map((dec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-normal">{dec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#11141a] border border-zinc-800 rounded-lg p-4">
          <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-cyan-400">03.</span>
            <span>Core Assumptions</span>
          </h3>
          <ul className="space-y-2 text-xs text-zinc-300">
            {review.coreAssumptions.map((assump, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-normal">{assump}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Automated Test Coverage */}
      <div className="bg-[#11141a] border border-zinc-800 rounded-lg p-4">
        <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="text-cyan-400">04.</span>
          <span>Automated Verification Commands</span>
        </h3>
        <p className="text-[11px] text-zinc-400 mb-2">
          Run these verified commands locally to reproduce all test suites:
        </p>
        <div className="space-y-1.5 font-mono text-xs">
          {review.testCoverageCommands.map((cmd, idx) => (
            <div
              key={idx}
              className="bg-black/80 px-3 py-2 rounded border border-zinc-800 text-emerald-400 flex items-center justify-between"
            >
              <span>$ {cmd}</span>
              <span className="text-[10px] text-zinc-600 uppercase">LOCAL / CI</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Trade-offs & Compromises */}
      <div className="bg-[#11141a] border border-zinc-800 rounded-lg overflow-hidden">
        <div className="bg-[#151922] px-4 py-2.5 border-b border-zinc-800">
          <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span className="text-cyan-400">05.</span>
            <span>Trade-offs & Technical Compromises</span>
          </h3>
        </div>

        <div className="divide-y divide-zinc-800">
          {review.tradeoffsAndCompromises.map((trade, idx) => (
            <div key={idx} className="p-3.5 sm:px-4 flex flex-col gap-1.5 text-xs">
              <span className="font-mono font-bold text-white">
                {trade.decision}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                <div className="bg-emerald-950/30 border border-emerald-900/40 p-2 rounded text-[11px]">
                  <span className="text-emerald-400 font-bold block mb-0.5">UPSIDE:</span>
                  <span className="text-zinc-300">{trade.upside}</span>
                </div>
                <div className="bg-amber-950/30 border border-amber-900/40 p-2 rounded text-[11px]">
                  <span className="text-amber-400 font-bold block mb-0.5">COMPROMISE:</span>
                  <span className="text-zinc-300">{trade.compromise}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Honest Engineering Boundaries */}
      <div className="bg-[#1a1215] border border-red-900/40 rounded-lg p-4">
        <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>⚠</span>
          <span>Honest Engineering Boundaries & Known Limitations</span>
        </h3>
        <p className="text-[11px] text-zinc-400 mb-2">
          Every production system has operational limits. These boundaries are explicitly documented:
        </p>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {review.honestBoundaries.map((bound, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
              <span className="leading-normal">{bound}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

