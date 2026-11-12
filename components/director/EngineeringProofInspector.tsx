"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  BarChart3,
  GitBranch,
  Terminal,
  FileCode,
  Share2,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import { useFrontierDirectorStore } from "@/state/frontierDirectorStore";
import { getEvidenceRecord } from "@/lib/frontierDirector/evidenceRegistry";
import { experiences } from "@/lib/frontierDirector/experienceRegistry";
import type { EvidenceLayerId, ExperienceId, ProvenanceLevel } from "@/lib/frontierDirector/types";

const LAYER_CONFIG: {
  id: EvidenceLayerId;
  label: string;
  numberKey: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "problem", label: "1. Problem & Invariants", numberKey: "1", icon: Info },
  { id: "architecture", label: "2. Architecture & Flow", numberKey: "2", icon: Layers },
  { id: "algorithm", label: "3. Algorithm & Code", numberKey: "3", icon: Cpu },
  { id: "evidence", label: "4. Test Proofs & Benchmarks", numberKey: "4", icon: BarChart3 },
  { id: "tradeoffs", label: "5. Trade-offs & Alternatives", numberKey: "5", icon: GitBranch },
  { id: "source", label: "6. Verified Source Files", numberKey: "6", icon: FileCode },
];

function ProvenanceBadge({ level }: { level: ProvenanceLevel }) {
  const styles: Record<ProvenanceLevel, { bg: string; text: string; border: string; label: string }> = {
    REAL_PROJECT_SOURCE: {
      bg: "bg-emerald-950/70",
      text: "text-emerald-300",
      border: "border-emerald-600/40",
      label: "REAL PROJECT SOURCE",
    },
    VERIFIED_TEST_RESULT: {
      bg: "bg-cyan-950/70",
      text: "text-cyan-300",
      border: "border-cyan-600/40",
      label: "VERIFIED TEST RESULT",
    },
    BROWSER_SIMULATION: {
      bg: "bg-amber-950/70",
      text: "text-amber-300",
      border: "border-amber-600/40",
      label: "BROWSER SIMULATION",
    },
    RECORDED_SIMULATOR_SESSION: {
      bg: "bg-blue-950/70",
      text: "text-blue-300",
      border: "border-blue-600/40",
      label: "RECORDED SESSION",
    },
    BUNDLED_REPRODUCIBLE_FIXTURE: {
      bg: "bg-purple-950/70",
      text: "text-purple-300",
      border: "border-purple-600/40",
      label: "REPRODUCIBLE FIXTURE",
    },
    HYPOTHETICAL_ENGINEERING_SCENARIO: {
      bg: "bg-zinc-800",
      text: "text-zinc-300",
      border: "border-zinc-600",
      label: "HYPOTHETICAL SCENARIO",
    },
    PREVIOUSLY_REPORTED_RESULT: {
      bg: "bg-indigo-950/70",
      text: "text-indigo-300",
      border: "border-indigo-600/40",
      label: "REPORTED RESULT",
    },
  };

  const style = styles[level] || styles.REAL_PROJECT_SOURCE;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide border ${style.bg} ${style.text} ${style.border}`}
      title={`Data Provenance: ${level}`}
    >
      <Shield className="w-2.5 h-2.5 shrink-0" />
      <span>{style.label}</span>
    </span>
  );
}

export function EngineeringProofInspector() {
  const {
    isInspectorOpen,
    activeExperienceId,
    activeEvidenceLayer,
    closeEvidence,
    switchEvidenceLayer,
    openEvidence,
  } = useFrontierDirectorStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const expId: ExperienceId = activeExperienceId || "motorsport";
  const record = getEvidenceRecord(expId);

  // Keyboard navigation: 1-6 keys switch layers, Esc closes modal
  useEffect(() => {
    if (!isInspectorOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeEvidence();
      } else if (["1", "2", "3", "4", "5", "6"].includes(e.key)) {
        const targetLayer = LAYER_CONFIG[parseInt(e.key, 10) - 1]?.id;
        if (targetLayer) {
          switchEvidenceLayer(targetLayer);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInspectorOpen, closeEvidence, switchEvidenceLayer]);

  const copyShareableLink = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/experience/${expId}/evidence?layer=${activeEvidenceLayer}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  }, [expId, activeEvidenceLayer]);

  const copyCode = (code: string, idx: number) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 2000);
    });
  };

  if (!isInspectorOpen || !record) return null;

  const currentLayer = record.layers[activeEvidenceLayer] || record.layers.problem;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-title"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
    >
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[900px] flex flex-col bg-[#171A20] text-[#C8CDD2] border border-[#C8CDD2]/30 rounded-xl shadow-2xl overflow-hidden font-sans">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#121418] border-b border-[#C8CDD2]/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D71D35] text-white font-bold shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-wider">
                  FRONTIER DIRECTOR 2.0 // PROOF MODE
                </span>
                <span className="text-zinc-600">|</span>
                <span className="font-mono text-[10px] text-zinc-400">
                  STRICT SCIENTIFIC INTEGRITY
                </span>
              </div>
              <h1 id="inspector-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{record.title}</span>
              </h1>
            </div>
          </div>

          {/* Experience Switcher & Quick Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Experience Pill Selector */}
            <div className="flex items-center bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-1 text-xs">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => openEvidence(exp.id, activeEvidenceLayer)}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
                    exp.id === expId
                      ? "bg-[#D71D35] text-white font-semibold shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {exp.id.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Share Link Button */}
            <button
              onClick={copyShareableLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs bg-[#1f242c] hover:bg-[#282f3a] text-zinc-200 border border-[#C8CDD2]/20 transition-colors"
              title="Copy deep link to this evidence layer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#22D3EE]" />}
              <span>{copiedLink ? "COPIED" : "SHARE LINK"}</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={closeEvidence}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Engineering Proof Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 6 Layer Navigation Tabs */}
        <nav
          aria-label="Engineering Proof Layers"
          className="flex items-center overflow-x-auto bg-[#15171d] border-b border-[#C8CDD2]/15 px-4 py-2 gap-1.5 scrollbar-thin"
        >
          {LAYER_CONFIG.map(({ id, label, numberKey, icon: Icon }) => {
            const isActive = activeEvidenceLayer === id;
            return (
              <button
                key={id}
                onClick={() => switchEvidenceLayer(id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-[#D71D35] text-white border-transparent shadow font-semibold"
                    : "bg-[#1c2027]/70 text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-[#252b35]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{label}</span>
                <kbd className={`hidden sm:inline-block ml-1 px-1 py-0.2 rounded text-[9px] font-sans ${isActive ? "bg-black/30 text-white" : "bg-zinc-800 text-zinc-500"}`}>
                  {numberKey}
                </kbd>
              </button>
            );
          })}
        </nav>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Layer Header with Provenance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C8CDD2]/10 pb-4">
            <div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                LAYER {LAYER_CONFIG.findIndex((c) => c.id === activeEvidenceLayer) + 1} OF 6 // {activeEvidenceLayer.toUpperCase()}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {currentLayer.title}
              </h2>
            </div>
            <ProvenanceBadge level={currentLayer.provenance} />
          </div>

          {/* ---------------- LAYER 1: PROBLEM & INVARIANTS ---------------- */}
          {activeEvidenceLayer === "problem" && (
            <div className="space-y-6">
              <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5">
                <h3 className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider mb-2">
                  Primary Objective
                </h3>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                  {record.layers.problem.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-3">
                  <h3 className="text-xs font-mono uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    <span>Engineering Constraints</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                    {record.layers.problem.engineeringConstraints.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-mono select-none">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-3">
                  <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                    <span>System Invariants</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                    {record.layers.problem.invariants.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-mono select-none">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-3">
                  <h3 className="text-xs font-mono uppercase text-rose-400 tracking-wider">
                    Known Failure Modes & Anti-Patterns
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                    {record.layers.problem.failureModes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-mono select-none">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-3">
                  <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-wider">
                    Industry Context & Motivation
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {record.layers.problem.industryContext}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- LAYER 2: ARCHITECTURE & FLOW ---------------- */}
          {activeEvidenceLayer === "architecture" && (
            <div className="space-y-6">
              <div className="bg-[#0f1115] border border-[#C8CDD2]/20 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between text-zinc-400 mb-2 border-b border-zinc-800 pb-2">
                  <span className="text-[#22D3EE] font-semibold">{record.layers.architecture.diagramTitle}</span>
                  <span className="text-[10px]">ASCII SYSTEM TOPOLOGY</span>
                </div>
                <pre className="text-zinc-300 leading-tight">
                  {record.layers.architecture.asciiDiagram}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                  Core Subsystems & Performance Budgets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {record.layers.architecture.components.map((c, idx) => (
                    <div key={idx} className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{c.name}</span>
                        <span className="text-[11px] font-mono text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded">
                          {c.throughputOrLatency}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{c.role}</p>
                      <div className="text-[10px] font-mono text-zinc-500 pt-1">
                        Source: {c.technology}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-2">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Data Flow Execution Stages
                  </h3>
                  <ol className="space-y-1.5 text-xs sm:text-sm text-zinc-300 list-none">
                    {record.layers.architecture.dataFlowDescription.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono text-[#D71D35] font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-2">
                  <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                    Boundary Guarantees
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                    {record.layers.architecture.boundaryGuarantees.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-mono">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- LAYER 3: ALGORITHM & CODE ---------------- */}
          {activeEvidenceLayer === "algorithm" && (
            <div className="space-y-6">
              <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Algorithm</span>
                    <h3 className="text-lg font-bold text-white">{record.layers.algorithm.algorithmName}</h3>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-zinc-400">Time: <strong className="text-emerald-400">{record.layers.algorithm.complexity.time}</strong></span>
                    <span className="text-zinc-400">Space: <strong className="text-emerald-400">{record.layers.algorithm.complexity.space}</strong></span>
                  </div>
                </div>

                {/* Mathematical Formulas */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Mathematical Formulations</span>
                  <div className="grid grid-cols-1 gap-3">
                    {record.layers.algorithm.mathematicalFormulas.map((f, idx) => (
                      <div key={idx} className="bg-[#13161c] border border-zinc-800 rounded p-3 space-y-1">
                        <div className="text-xs font-semibold text-[#22D3EE]">{f.name}</div>
                        <div className="font-mono text-xs text-white bg-black/40 px-3 py-1.5 rounded border border-zinc-800/80 overflow-x-auto">
                          {f.latexOrNotation}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{f.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Excerpts */}
              <div className="space-y-4">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Verified Source Excerpts</span>
                {record.layers.algorithm.codeExcerpts.map((excerpt, idx) => (
                  <div key={idx} className="bg-[#0e1014] border border-[#C8CDD2]/20 rounded-lg overflow-hidden font-mono text-xs">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#171a21] border-b border-zinc-800 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-[#22D3EE]" />
                        <span className="font-bold text-white">{excerpt.fileName}</span>
                        <span className="text-[11px] text-zinc-500">
                          ({excerpt.filePath}#L{excerpt.startLine}-L{excerpt.endLine})
                        </span>
                      </div>
                      <button
                        onClick={() => copyCode(excerpt.code, idx)}
                        className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                      >
                        {copiedCodeIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCodeIdx === idx ? "COPIED" : "COPY"}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed">
                      {excerpt.code}
                    </pre>
                    {excerpt.annotations && excerpt.annotations.length > 0 && (
                      <div className="px-4 py-2.5 bg-[#14171e] border-t border-zinc-800 space-y-1 text-[11px] text-zinc-400">
                        {excerpt.annotations.map((a, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-2">
                            <span className="text-[#22D3EE] font-bold">L{a.line}:</span>
                            <span>{a.note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- LAYER 4: TEST PROOFS & BENCHMARKS ---------------- */}
          {activeEvidenceLayer === "evidence" && (
            <div className="space-y-6">
              {/* Benchmark Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {record.layers.evidence.benchmarks.map((b, idx) => (
                  <div key={idx} className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">{b.metric}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {b.status}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white">{b.observedValue}</div>
                    <div className="text-[10px] font-mono text-zinc-500">Budget: {b.targetBudget}</div>
                  </div>
                ))}
              </div>

              {/* Reproducible Test Command */}
              <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>Reproducible Automated Test Suite</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Node.js Test Runner / TSX</span>
                </div>
                <div className="flex items-center justify-between bg-black/60 px-3 py-2 rounded border border-zinc-800 font-mono text-xs">
                  <span className="text-emerald-400 font-bold">$ {record.layers.evidence.reproducibleTestCommand}</span>
                  <span className="text-[10px] text-zinc-400">67 of 67 passing (100%)</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">Verified Passing Assertions</span>
                  <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto pr-2">
                    {record.layers.evidence.passingTests.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 px-2.5 rounded bg-[#13161c] border border-zinc-800/60">
                        <span className="text-zinc-300 flex items-center gap-2 truncate">
                          <span className="text-emerald-400">✔</span>
                          <span className="truncate">{t.testName}</span>
                        </span>
                        <span className="text-zinc-500 text-[11px] shrink-0 ml-2">{t.durationMs.toFixed(1)}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Output JSON */}
              {record.layers.evidence.sampleOutputJson && (
                <div className="bg-[#0e1014] border border-[#C8CDD2]/20 rounded-lg overflow-hidden font-mono text-xs">
                  <div className="px-4 py-2 bg-[#171a21] border-b border-zinc-800 text-zinc-400 flex items-center justify-between">
                    <span>Canonical Verification Output JSON</span>
                    <span className="text-[10px] text-zinc-500">Immutable Fixture</span>
                  </div>
                  <pre className="p-4 text-zinc-300 overflow-x-auto leading-tight">
                    {record.layers.evidence.sampleOutputJson}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ---------------- LAYER 5: TRADEOFFS & ALTERNATIVES ---------------- */}
          {activeEvidenceLayer === "tradeoffs" && (
            <div className="space-y-6">
              <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-2">
                <span className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider">
                  Chosen Architecture & Justification
                </span>
                <h3 className="text-lg font-bold text-white">
                  {record.layers.tradeoffs.chosenApproach.name}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {record.layers.tradeoffs.chosenApproach.justification}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                  Alternatives Evaluated & Rejection Reasons
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.layers.tradeoffs.alternativesEvaluated.map((alt, idx) => (
                    <div key={idx} className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-white">{alt.name}</h4>
                        <div className="space-y-1 text-xs">
                          <div className="text-emerald-400 font-semibold">Pros:</div>
                          <ul className="text-zinc-300 pl-3 list-disc space-y-0.5">
                            {alt.pros.map((p, pIdx) => <li key={pIdx}>{p}</li>)}
                          </ul>
                        </div>
                        <div className="space-y-1 text-xs pt-1">
                          <div className="text-rose-400 font-semibold">Cons:</div>
                          <ul className="text-zinc-300 pl-3 list-disc space-y-0.5">
                            {alt.cons.map((c, cIdx) => <li key={cIdx}>{c}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-zinc-800 text-xs font-mono text-amber-300 bg-amber-950/30 p-2 rounded">
                        <strong>Rejection:</strong> {alt.rejectionReason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Known Limitations</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300 list-disc pl-4">
                    {record.layers.tradeoffs.knownLimitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider">Future Planned Upgrades</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300 list-disc pl-4">
                    {record.layers.tradeoffs.futureOptimizations.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- LAYER 6: SOURCE & PROJECT EVIDENCE ---------------- */}
          {activeEvidenceLayer === "source" && (
            <div className="space-y-6">
              <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Git Repository Metadata</span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>T-Bone47 / Minecraft-folio</span>
                      <a
                        href={record.layers.source.repository}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#22D3EE] hover:underline inline-flex items-center gap-1 text-xs font-normal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </h3>
                  </div>
                  <div className="font-mono text-xs text-zinc-400 flex items-center gap-3">
                    <span>Branch: <strong className="text-white">{record.layers.source.branch}</strong></span>
                    <span>Commit: <strong className="text-white">{record.layers.source.commitHash}</strong></span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Audited Implementation Files
                  </span>
                  <div className="space-y-2">
                    {record.layers.source.verifiedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#121418] border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="font-bold text-white">{file.fileName}</span>
                            <span className="text-zinc-500">({file.relativePath} {file.lines})</span>
                            <ProvenanceBadge level={file.provenance} />
                          </div>
                          <p className="text-xs text-zinc-300">{file.purpose}</p>
                        </div>
                        <a
                          href={file.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded font-mono text-xs bg-[#1f242c] hover:bg-[#282f3a] text-zinc-200 border border-zinc-700 transition-colors shrink-0 self-start sm:self-auto"
                        >
                          <span>VIEW ON GITHUB</span>
                          <ExternalLink className="w-3 h-3 text-[#22D3EE]" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Local Verification Guide */}
              <div className="bg-[#1c2027] border border-[#C8CDD2]/20 rounded-lg p-5 space-y-3">
                <span className="text-xs font-mono uppercase text-[#22D3EE] tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>How to Verify Locally on Your Machine</span>
                </span>
                <div className="space-y-1 font-mono text-xs bg-black/60 p-4 rounded border border-zinc-800 text-zinc-300">
                  {record.layers.source.howToVerifyLocally.map((step, idx) => (
                    <div key={idx}>{step}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 bg-[#121418] border-t border-[#C8CDD2]/20 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#22D3EE]">● ACTIVE AUDIT</span>
            <span>PRESS 1-6 TO SWITCH LAYERS</span>
            <span>ESC TO CLOSE</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const currentIndex = LAYER_CONFIG.findIndex((c) => c.id === activeEvidenceLayer);
                const nextIndex = (currentIndex + 1) % LAYER_CONFIG.length;
                switchEvidenceLayer(LAYER_CONFIG[nextIndex].id);
              }}
              className="flex items-center gap-1 text-white hover:text-[#22D3EE] transition-colors"
            >
              <span>NEXT LAYER</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
