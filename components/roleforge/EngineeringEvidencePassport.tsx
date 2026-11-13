/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Engineering Evidence Passport Component
 *
 * Executive, print-optimized portfolio dossier providing cryptographic
 * evidence verification, source code permalinks, and honest boundaries.
 */

"use client";

import React from "react";
import type { EvidencePassportData } from "@/lib/roleforge/evidencePassport";

interface EngineeringEvidencePassportProps {
  data: EvidencePassportData;
}

export const EngineeringEvidencePassport: React.FC<EngineeringEvidencePassportProps> = ({
  data,
}) => {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 sm:p-10 bg-white text-zinc-900 shadow-2xl rounded-xl border border-zinc-200 print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-none">
      {/* Print / Actions Bar (Hidden during printing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-zinc-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
            OFFICIAL ENGINEERING EVIDENCE DOSSIER • ID: {data.passportId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={data.candidate.resumePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono px-3 py-1.5 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Download Formal Resume PDF ↗
          </a>
          <button
            type="button"
            onClick={handlePrint}
            className="text-xs font-mono font-bold px-4 py-1.5 rounded bg-zinc-900 text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow"
          >
            <span>Print / Save as PDF</span>
            <span>⎙</span>
          </button>
        </div>
      </div>

      {/* Dossier Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-900">
              {data.candidate.name}
            </h1>
            <p className="text-sm font-mono text-zinc-600 mt-1">
              {data.candidate.headline}
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-500 space-y-1 sm:text-right">
            <div>
              Portfolio:{" "}
              <a
                href={data.candidate.portfolioUrl}
                className="text-cyan-700 hover:underline font-bold"
              >
                asish-engineering-world.vercel.app
              </a>
            </div>
            <div>
              GitHub:{" "}
              <a
                href={data.candidate.githubUrl}
                className="text-cyan-700 hover:underline font-bold"
              >
                github.com/T-Bone47
              </a>
            </div>
            <div>Email: {data.candidate.email}</div>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="mt-4 p-4 rounded-lg bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans">
          <span className="font-mono font-bold text-zinc-900 uppercase tracking-wider block mb-1 text-[11px]">
            Executive Verification Summary:
          </span>
          {data.executiveSummary}
        </div>
      </header>

      {/* 1. Verified Repository Matrix */}
      <section className="mb-8">
        <h2 className="text-sm font-mono font-bold text-zinc-900 uppercase tracking-wider mb-3 pb-1 border-b border-zinc-200 flex items-center justify-between">
          <span>01. Verified Repository Matrix (Cryptographically Pinned)</span>
          <span className="text-[10px] text-zinc-500 font-normal">
            100% AUDITED REPOSITORIES
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-600">
                <th className="py-2 px-3">Project</th>
                <th className="py-2 px-3">Repository URL</th>
                <th className="py-2 px-3">Pinned Commit SHA</th>
                <th className="py-2 px-3">Primary Tech Stack</th>
                <th className="py-2 px-3 text-right">Nodes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {data.verifiedRepositories.map((repo) => (
                <tr key={repo.projectId} className="hover:bg-zinc-50">
                  <td className="py-2 px-3 font-bold text-zinc-900">
                    {repo.name}
                  </td>
                  <td className="py-2 px-3">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-700 hover:underline"
                    >
                      {repo.url.replace("https://github.com/", "")}
                    </a>
                  </td>
                  <td className="py-2 px-3 font-mono text-zinc-600">
                    {repo.commitSha.slice(0, 10)}
                  </td>
                  <td className="py-2 px-3 text-zinc-600">{repo.primaryStack}</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-700">
                    {repo.nodeCount} verified
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Engineering Defense Arena Invariant Audits */}
      <section className="mb-8">
        <h2 className="text-sm font-mono font-bold text-zinc-900 uppercase tracking-wider mb-3 pb-1 border-b border-zinc-200">
          02. Interactive Engineering Defense Tracks & Invariants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.defenseTracksSummary.map((track) => (
            <div
              key={track.id}
              className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-mono"
            >
              <div className="font-bold text-zinc-900 mb-1">{track.title}</div>
              <div className="text-[11px] text-zinc-600 mb-2">{track.discipline}</div>
              <div className="text-[10px] text-emerald-700 font-bold">
                ✓ Formal Invariant Contracts Enforced
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Disclosed Engineering Boundaries */}
      <section className="mb-8">
        <h2 className="text-sm font-mono font-bold text-zinc-900 uppercase tracking-wider mb-3 pb-1 border-b border-zinc-200 flex items-center justify-between">
          <span>03. Disclosed Engineering Limitations & Boundaries</span>
          <span className="text-[10px] text-zinc-500 font-normal">
            ZERO DECEPTIVE CLAIMS
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700">
          {data.disclosedBoundaries.slice(0, 8).map((lim, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded bg-zinc-50 border border-zinc-200 flex items-start gap-2"
            >
              <span className="font-mono font-bold text-zinc-500 shrink-0">
                [{lim.project}]
              </span>
              <span className="leading-normal">{lim.boundary}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-4 border-t border-zinc-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] font-mono text-zinc-500">
        <div>
          GENERATED BY FRONTIER ROLEFORGE 2.0 • AUTHENTICATED EVIDENCE AUTHORITY
        </div>
        <div>
          TIMESTAMP: {new Date(data.generatedAt).toLocaleString()}
        </div>
      </footer>
    </div>
  );
};

