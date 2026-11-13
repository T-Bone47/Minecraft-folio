"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DossierTrackId, DossierTrackProfile } from "@/lib/dossier/types";
import { DOSSIER_PROFILES, getCandidateDossier } from "@/lib/dossier/dossierData";
import {
  Printer,
  Copy,
  Download,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  ExternalLink,
  GitCommit,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  FileCheck,
  Share2,
} from "lucide-react";

export const HiringCommitteeDossierView: React.FC<{ initialTrack?: DossierTrackId }> = ({
  initialTrack = "motorsport",
}) => {
  const [activeTrack, setActiveTrack] = useState<DossierTrackId>(initialTrack);
  const [copied, setCopied] = useState(false);

  const manifest = getCandidateDossier(activeTrack);
  const profile: DossierTrackProfile = manifest.tracks[activeTrack];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRecruiterSnippet = () => {
    const text = `
=== HIRING COMMITTEE EXECUTIVE BRIEFING ===
Candidate: ${manifest.candidateName}
Education: ${manifest.degree} (${manifest.institution})
Location: ${manifest.location}
Target Role: ${profile.title}
Canonical Verification: ${manifest.canonicalOrigin}
GitHub: ${manifest.githubProfile}

EXECUTIVE SUMMARY:
${profile.executiveSummary}

VERIFIED PRODUCTION METRICS:
${profile.keyMetrics.map((m) => `• ${m.label}: ${m.value} (${m.subtext})`).join("\n")}

FEATURED SYSTEMS & PROVENANCE:
${profile.featuredProjects
  .map(
    (p) =>
      `• ${p.name} [Commit: ${p.commitSha}]: ${p.roleSummary} | Invariants: ${p.keyInvariants.join(", ")}`
  )
  .join("\n")}

COMMITTEE RECOMMENDATION:
${profile.hiringCommitteeRationale.recommendedLevel}
" ${profile.hiringCommitteeRationale.technicalMaturity} "
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Asish_Oliver_M_Hiring_Dossier_${activeTrack}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 font-mono print:space-y-0 print:p-0">
      {/* 1. TOP INTERACTION CONTROLS (HIDDEN IN PRINT) */}
      <div className="print:hidden bg-[#18191E] border-4 border-[#262A31] p-4 sm:p-6 shadow-[0_6px_0_#0D0E12] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#262A31] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 font-pixel text-[9px] uppercase mc-text-shadow">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>RECRUITER & HIRING COMMITTEE TOOLKIT</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase tracking-wide mt-2">
              1-CLICK EXECUTIVE DOSSIER
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Print or export an authoritative, 2-page candidate briefing packet containing production metrics,
              commit-level verification, mathematical derivations, and committee recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="voxel-btn voxel-btn-gold px-4 py-2.5 text-xs flex items-center gap-2 shadow-lg"
              title="Print 2-page document or Save as PDF"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>PRINT / SAVE PDF</span>
            </button>
            <button
              onClick={handleCopyRecruiterSnippet}
              className="voxel-btn voxel-btn-iron px-3 py-2.5 text-xs flex items-center gap-1.5"
              title="Copy formatted markdown snippet for Slack, Email, or ATS"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-300" />}
              <span>{copied ? "COPIED TO CLIPBOARD" : "COPY ATS BLURB"}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="voxel-btn voxel-btn-stone px-3 py-2.5 text-xs flex items-center gap-1.5"
              title="Download structured JSON candidate manifest"
            >
              <Download className="w-4 h-4 text-zinc-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* TRACK SWITCHER */}
        <div className="space-y-2">
          <span className="font-pixel text-[10px] text-zinc-400 uppercase tracking-wider block">
            SELECT COMMITTEE TARGET ROLE:
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { id: "motorsport", label: "MOTORSPORT / SIMULATION", icon: "🏎️" },
              { id: "systems", label: "DISTRIBUTED SYSTEMS", icon: "⚡" },
              { id: "aiml", label: "APPLIED AI / ML EVAL", icon: "🧠" },
              { id: "architect", label: "STAFF SYSTEMS ARCHITECT", icon: "🏛️" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTrack(t.id as DossierTrackId)}
                className={`p-2.5 text-left border-2 transition-all ${
                  activeTrack === t.id
                    ? "bg-[#252830] border-[#00d2be] text-white shadow-[0_2px_0_#00d2be]"
                    : "bg-[#141519] border-[#2B2E37] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
                }`}
              >
                <div className="font-pixel text-[10px] text-zinc-400">{t.icon} TRACK</div>
                <div className="font-pixel text-xs text-white uppercase mt-0.5">{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PRINTABLE DOCUMENT WRAPPER */}
      <div className="dossier-document max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none">
        {/* ========================================================= */}
        {/* PAGE 1: EXECUTIVE BRIEFING & PRODUCTION COMPETENCE       */}
        {/* ========================================================= */}
        <div className="dossier-page page-1 bg-[#101115] border-4 border-[#262A31] p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:border-2 print:border-black print:shadow-none print:p-6 print:m-0 print:min-h-screen">
          {/* Header Bar */}
          <div className="flex items-start justify-between border-b-2 border-[#262A31] print:border-black pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black text-[#00d2be] border border-[#00d2be] print:border-black print:text-black print:bg-transparent font-pixel text-[9px] uppercase">
                <FileCheck className="w-3 h-3 text-[#00d2be] print:text-black" />
                <span>CONFIDENTIAL CANDIDATE DOSSIER • {manifest.dossierVersion}</span>
              </div>
              <h2 className="font-pixel text-2xl sm:text-3xl text-white print:text-black uppercase tracking-wide mt-2">
                {manifest.candidateName}
              </h2>
              <div className="font-pixel text-xs text-yellow-400 print:text-black uppercase mt-0.5">
                {profile.title}
              </div>
              <div className="text-[11px] text-zinc-400 print:text-zinc-700 mt-1">
                {manifest.degree} — {manifest.institution} • {manifest.location}
              </div>
            </div>

            <div className="text-right text-[10px] space-y-1">
              <div className="font-pixel text-[9px] text-emerald-400 print:text-black uppercase">
                AUTHORITATIVE STATUS: VERIFIED
              </div>
              <div className="text-zinc-400 print:text-black">
                GitHub: <span className="text-[#00d2be] print:text-black underline">{manifest.githubProfile}</span>
              </div>
              <div className="text-zinc-400 print:text-black">
                Canonical: <span className="text-zinc-300 print:text-black">{manifest.canonicalOrigin}</span>
              </div>
              <div className="text-zinc-500 print:text-zinc-600 text-[9px]">
                Generated: {manifest.generatedDate}
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <span className="font-pixel text-[10px] text-zinc-400 print:text-black uppercase tracking-wider block">
              EXECUTIVE HIRING SUMMARY
            </span>
            <p className="text-xs text-zinc-300 print:text-black leading-relaxed bg-[#15161A] print:bg-zinc-100 p-3.5 border border-[#2B2E37] print:border-black">
              {profile.executiveSummary}
            </p>
          </div>

          {/* Key Production Metrics */}
          <div className="space-y-2">
            <span className="font-pixel text-[10px] text-zinc-400 print:text-black uppercase tracking-wider block">
              VERIFIED PRODUCTION METRICS & BOUNDS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {profile.keyMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-[#15161A] print:bg-white border-2 border-[#262A31] print:border-black p-3 space-y-1"
                >
                  <span className="text-zinc-500 print:text-zinc-700 block text-[9px] font-pixel uppercase">
                    {m.label}
                  </span>
                  <div className="font-pixel text-sm sm:text-base text-yellow-400 print:text-black">
                    {m.value}
                  </div>
                  <div className="text-[10px] text-zinc-400 print:text-zinc-600 leading-tight">
                    {m.subtext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Systems & Cryptographic Provenance */}
          <div className="space-y-2">
            <span className="font-pixel text-[10px] text-zinc-400 print:text-black uppercase tracking-wider block">
              CANONICAL DELIVERABLES & REPOSITORY AUDIT
            </span>
            <div className="space-y-2.5">
              {profile.featuredProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#15161A] print:bg-white border border-[#2B2E37] print:border-black p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-xs text-white print:text-black uppercase">{p.name}</span>
                      <span className="text-[9px] font-pixel text-sky-400 print:text-black px-1.5 py-0.2 bg-sky-950/60 print:bg-zinc-200 border border-sky-600 print:border-black">
                        {p.evidenceLayerCount}-LAYER EVIDENCE
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 print:text-black flex items-center gap-1">
                      <GitCommit className="w-3 h-3 text-[#ff8000] print:text-black" />
                      SHA: <code>{p.commitSha}</code>
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 print:text-black leading-snug">
                    {p.roleSummary}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-zinc-400 print:text-zinc-700 pt-1 border-t border-[#22242B] print:border-zinc-300">
                    <div>
                      <strong className="text-zinc-500 print:text-black">Metrics:</strong> {p.impactMetrics.join(" • ")}
                    </div>
                    <div>
                      <strong className="text-zinc-500 print:text-black">Invariants:</strong> {p.keyInvariants.join(" • ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Technical Arsenal */}
          <div className="space-y-2">
            <span className="font-pixel text-[10px] text-zinc-400 print:text-black uppercase tracking-wider block">
              TECHNICAL COMPETENCY INVENTORY
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-[#15161A] print:bg-white border border-[#2B2E37] print:border-black p-2.5 space-y-1">
                <span className="font-pixel text-[9px] text-[#00d2be] print:text-black uppercase block">PRIMARY STACK</span>
                <div className="space-y-0.5 text-zinc-300 print:text-black text-[10px]">
                  {profile.coreCompetencies.primaryStack.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))}
                </div>
              </div>
              <div className="bg-[#15161A] print:bg-white border border-[#2B2E37] print:border-black p-2.5 space-y-1">
                <span className="font-pixel text-[9px] text-yellow-400 print:text-black uppercase block">SYSTEMS ARCH</span>
                <div className="space-y-0.5 text-zinc-300 print:text-black text-[10px]">
                  {profile.coreCompetencies.systemsArchitecture.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))}
                </div>
              </div>
              <div className="bg-[#15161A] print:bg-white border border-[#2B2E37] print:border-black p-2.5 space-y-1">
                <span className="font-pixel text-[9px] text-[#ff8000] print:text-black uppercase block">DOMAIN MATH</span>
                <div className="space-y-0.5 text-zinc-300 print:text-black text-[10px]">
                  {profile.coreCompetencies.mathematicalModeling.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))}
                </div>
              </div>
              <div className="bg-[#15161A] print:bg-white border border-[#2B2E37] print:border-black p-2.5 space-y-1">
                <span className="font-pixel text-[9px] text-emerald-400 print:text-black uppercase block">RELIABILITY / QA</span>
                <div className="space-y-0.5 text-zinc-300 print:text-black text-[10px]">
                  {profile.coreCompetencies.reliabilityAndQA.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#262A31] print:border-black text-[9px] text-zinc-500 print:text-zinc-600">
            <span>ASISH OLIVER M — HIRING COMMITTEE DOSSIER (PAGE 1 OF 2)</span>
            <span>VERIFICATION CANONICAL: ASISH-ENGINEERING-WORLD.VERCEL.APP</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PAGE 2: ARCHITECTURAL DEFENSE & COMMITTEE RATIONALE      */}
        {/* ========================================================= */}
        <div className="dossier-page page-2 bg-[#101115] border-4 border-[#262A31] p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:border-2 print:border-black print:shadow-none print:p-6 print:m-0 print:min-h-screen print:break-before-page">
          {/* Header Bar */}
          <div className="flex items-start justify-between border-b-2 border-[#262A31] print:border-black pb-3">
            <div>
              <span className="font-pixel text-[9px] text-sky-400 print:text-black uppercase tracking-wider block">
                PART II: MATHEMATICAL INVARIANTS & COMMITTEE EVALUATION
              </span>
              <h3 className="font-pixel text-xl sm:text-2xl text-white print:text-black uppercase tracking-wide mt-1">
                ARCHITECTURAL DEFENSE EVIDENCE
              </h3>
            </div>
            <div className="text-right text-[10px] text-zinc-400 print:text-black">
              CANDIDATE: <span className="font-pixel text-white print:text-black">{manifest.candidateName}</span>
            </div>
          </div>

          {/* Mathematical Formulations & Invariant Verification */}
          <div className="space-y-2">
            <span className="font-pixel text-[10px] text-zinc-400 print:text-black uppercase tracking-wider block">
              FORMAL MATHEMATICAL SPECIFICATIONS & INVARIANTS
            </span>
            <div className="space-y-3">
              {profile.architecturalInvariants.map((inv, idx) => (
                <div
                  key={idx}
                  className="bg-[#15161A] print:bg-zinc-50 border border-[#2B2E37] print:border-black p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-white print:text-black uppercase">
                      {idx + 1}. {inv.name}
                    </span>
                    <span className="text-[9px] font-pixel text-emerald-400 print:text-black">
                      [{inv.domain.toUpperCase()}]
                    </span>
                  </div>

                  <div className="bg-[#090A0D] print:bg-white border border-[#22242B] print:border-zinc-400 p-2 text-center text-xs font-mono text-yellow-300 print:text-black">
                    <code>{inv.formulationLatex}</code>
                  </div>

                  <p className="text-[11px] text-zinc-300 print:text-black leading-snug">
                    {inv.explanation}
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-zinc-500 print:text-zinc-600 pt-1 border-t border-[#22242B] print:border-zinc-300">
                    <span>Verified in: <code>{inv.testSuite}</code></span>
                    <span>Source: <code>{inv.codeLocation}</code></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6-Layer Evidence Framework Topology */}
          <div className="space-y-2">
            <span className="font-pixel text-[10px] text-zinc-400 print:text-black uppercase tracking-wider block">
              6-LAYER RIGOROUS EVIDENCE FRAMEWORK
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
              {[
                { layer: "L1: Code Provenance", desc: "Verifiable Git commit SHAs, line-number citations, repo metadata." },
                { layer: "L2: Math Derivations", desc: "KaTeX mathematical equations, physics lemmas, ODE solvers." },
                { layer: "L3: Benchmark Audits", desc: "Real throughput, latency distributions, P99 guarantees." },
                { layer: "L4: Architectural Invariants", desc: "Non-recovering wear, monotonic time, energy conservation." },
                { layer: "L5: Trade-Off Analysis", desc: "Chosen methodology defended against 2+ discarded alternatives." },
                { layer: "L6: Interactive Proof Lab", desc: "Push-to-prove browser labs, counterfactuals, live execution." },
              ].map((l, i) => (
                <div key={i} className="bg-[#15161A] print:bg-white border border-[#2B2E37] print:border-black p-2.5 space-y-1">
                  <div className="font-pixel text-[9px] text-[#00d2be] print:text-black uppercase">{l.layer}</div>
                  <div className="text-zinc-400 print:text-zinc-700 text-[10px] leading-tight">{l.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Committee Rationale & Recommended Level */}
          <div className="bg-[#15161A] print:bg-zinc-100 border-2 border-yellow-500/50 print:border-black p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#262A31] print:border-black pb-2">
              <span className="font-pixel text-xs text-yellow-400 print:text-black uppercase">
                HIRING COMMITTEE DELIBERATION & RECOMMENDATION
              </span>
              <span className="font-pixel text-[10px] text-white print:text-black bg-yellow-950/80 print:bg-transparent border border-yellow-500 print:border-black px-2 py-0.5">
                TIER: {profile.hiringCommitteeRationale.recommendedLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="space-y-1">
                <span className="font-pixel text-[9px] text-zinc-400 print:text-black uppercase block">TECHNICAL MATURITY</span>
                <p className="text-zinc-300 print:text-black leading-snug">
                  {profile.hiringCommitteeRationale.technicalMaturity}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-pixel text-[9px] text-zinc-400 print:text-black uppercase block">EXECUTION SPEED</span>
                <p className="text-zinc-300 print:text-black leading-snug">
                  {profile.hiringCommitteeRationale.executionSpeed}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-pixel text-[9px] text-zinc-400 print:text-black uppercase block">DIFFERENTIATION</span>
                <p className="text-zinc-300 print:text-black leading-snug">
                  {profile.hiringCommitteeRationale.domainDifferentiation}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Verification Links & Sign-Off */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-[#262A31] print:border-black text-[10px]">
            <div className="text-zinc-400 print:text-black space-y-0.5">
              <div><strong>Direct Verification:</strong> {manifest.canonicalOrigin}/roleforge</div>
              <div><strong>Digital Twin & Telemetry:</strong> {manifest.canonicalOrigin}/world</div>
            </div>

            <div className="font-pixel text-[10px] text-emerald-400 print:text-black text-right">
              <div>STATUS: READY FOR IMMEDIATE OFFER</div>
              <div className="text-zinc-500 print:text-zinc-600 text-[8px]">SIGNATURE: AUTHOR-VERIFIED PRODUCTION CANDIDATE</div>
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#262A31] print:border-black text-[9px] text-zinc-500 print:text-zinc-600">
            <span>ASISH OLIVER M — HIRING COMMITTEE DOSSIER (PAGE 2 OF 2)</span>
            <span>END OF EXECUTIVE BRIEFING</span>
          </div>
        </div>
      </div>
    </div>
  );
};
