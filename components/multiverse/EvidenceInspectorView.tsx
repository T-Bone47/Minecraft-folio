"use client";

import React from "react";
import { useMultiverseStore } from "@/state/multiverseStore";
import { getMultiverseProjectById } from "@/lib/multiverse/projectRegistry";
import {
  Layers,
  FileCode2,
  Cpu,
  BarChart3,
  Scale,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Copy,
} from "lucide-react";

export const EvidenceInspectorView: React.FC = () => {
  const activePortalId = useMultiverseStore((s) => s.activePortalId);
  const activeLayerIndex = useMultiverseStore((s) => s.activeLayerIndex);
  const setActiveLayerIndex = useMultiverseStore((s) => s.setActiveLayerIndex);

  const project = getMultiverseProjectById(activePortalId || "racemind")!;
  const layers = project.evidenceLayers;

  const layerTabs = [
    { id: 0, label: "LAYER 1", title: "Problem & Constraints", icon: Layers },
    { id: 1, label: "LAYER 2", title: "Architecture & Data Flow", icon: Cpu },
    { id: 2, label: "LAYER 3", title: "Algorithms & Formulas", icon: FileCode2 },
    { id: 3, label: "LAYER 4", title: "Benchmarks & Proof", icon: BarChart3 },
    { id: 4, label: "LAYER 5", title: "Decisions & Trade-offs", icon: Scale },
    { id: 5, label: "LAYER 6", title: "Source Code & Links", icon: GitBranch },
  ];

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans" data-testid="evidence-inspector-container">
      {/* 1. Layer Selection Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {layerTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeLayerIndex === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLayerIndex(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-md shadow-sky-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}:</span>
              <span className="hidden sm:inline">{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Layer Content Area */}
      {/* LAYER 1: PROBLEM & CONSTRAINTS */}
      {activeLayerIndex === 0 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-mono font-bold uppercase text-sky-400 mb-2">
              {layers.problem.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {layers.problem.objective}
            </p>
            <div className="text-xs text-slate-400 italic border-l-2 border-sky-500 pl-3 py-1">
              {layers.problem.industryContext}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Constraints */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 block mb-2">
                Engineering Constraints
              </span>
              <ul className="flex flex-col gap-2">
                {layers.problem.engineeringConstraints.map((c, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Invariants */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 block mb-2">
                System Invariants
              </span>
              <ul className="flex flex-col gap-2">
                {layers.problem.invariants.map((inv, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Failure Modes */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono font-bold uppercase text-red-400 block mb-2">
                Failure Modes & Edge Cases
              </span>
              <ul className="flex flex-col gap-2">
                {layers.problem.failureModes.map((fm, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{fm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 2: ARCHITECTURE & DATA FLOW */}
      {activeLayerIndex === 1 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono uppercase font-bold text-sky-400 block mb-2">
              {layers.architecture.diagramTitle}
            </span>
            <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto p-3 bg-slate-900/90 rounded border border-slate-800 leading-tight">
              {layers.architecture.asciiDiagram}
            </pre>
          </div>

          {/* Subsystem Components */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block mb-3">
              Subsystem Component Matrix
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {layers.architecture.components.map((comp) => (
                <div key={comp.name} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-sky-300">{comp.name}</div>
                    <div className="text-[11px] text-slate-300 mt-1">{comp.role}</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400">Tech: {comp.tech}</div>
                    <div className="text-[10px] font-mono text-amber-400/80 mt-0.5">Fail: {comp.failureHandling}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Flow */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block mb-2">
              Chronological Data Transit Pipeline
            </span>
            <div className="flex flex-col gap-1.5 font-mono text-xs text-slate-300">
              {layers.architecture.dataFlow.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LAYER 3: ALGORITHMS & FORMULAS */}
      {activeLayerIndex === 2 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-mono font-bold uppercase text-sky-400 mb-2">
              {layers.algorithms.title}
            </h4>
            <p className="text-xs text-slate-300 mb-4">{layers.algorithms.description}</p>

            {/* LaTeX Formula Block */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-sm text-sky-300 my-2 overflow-x-auto">
              <code>{layers.algorithms.mathFormulaLatex}</code>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {layers.algorithms.mathExplanation}
            </p>
            <div className="flex gap-4 mt-3 pt-3 border-t border-slate-800 font-mono text-xs text-slate-400">
              <span>Time: <strong className="text-emerald-400">{layers.algorithms.complexity.time}</strong></span>
              <span>Space: <strong className="text-emerald-400">{layers.algorithms.complexity.space}</strong></span>
            </div>
          </div>

          {/* Verified Code Snippet */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-mono font-bold text-slate-300">
                {layers.algorithms.codeSnippet.fileName} ({layers.algorithms.codeSnippet.language})
              </span>
              <span className="text-[10px] font-mono text-emerald-400">VERIFIED CANONICAL CODE</span>
            </div>
            <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto p-3 bg-slate-900/90 rounded border border-slate-800 leading-tight">
              <code>{layers.algorithms.codeSnippet.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* LAYER 4: BENCHMARKS & PROOF */}
      {activeLayerIndex === 3 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-mono font-bold uppercase text-sky-400 mb-2">
              {layers.benchmarks.title}
            </h4>
            <p className="text-xs text-slate-300 mb-4">{layers.benchmarks.benchmarkSummary}</p>

            {/* Benchmark Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Metric / Objective</th>
                    <th className="pb-2">Performance Target</th>
                    <th className="pb-2">Measured Result</th>
                    <th className="pb-2">Audit Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {layers.benchmarks.metrics.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-bold text-slate-200">{m.name}</td>
                      <td className="py-2.5 text-slate-400">{m.target}</td>
                      <td className="py-2.5 font-bold text-sky-300">{m.measured}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Reproduction CLI Command:</span>
                <code className="text-sky-300">{layers.benchmarks.reproductionCommand}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 5: DECISIONS & TRADE-OFFS */}
      {activeLayerIndex === 4 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-mono font-bold uppercase text-sky-400 mb-3">
              {layers.tradeoffs.title}
            </h4>

            <div className="flex flex-col gap-4">
              {layers.tradeoffs.decisions.map((dec, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      CHOSEN: {dec.chosen}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    Alternative Considered: <span className="line-through">{dec.alternative}</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    <strong className="text-sky-300 font-mono">Rationale:</strong> {dec.rationale}
                  </div>
                  <div className="text-xs text-amber-300/90 font-mono mt-1 bg-amber-950/20 p-2 rounded border border-amber-500/20">
                    <strong>Trade-off Accepted:</strong> {dec.tradeoffAccepted}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LAYER 6: SOURCES & DEEP LINKS */}
      {activeLayerIndex === 5 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-mono font-bold uppercase text-sky-400">
                  {layers.sources.title}
                </h4>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Verified Canonical Commit: <code className="text-amber-400">{layers.sources.commitSha}</code>
                </div>
              </div>

              <a
                href={layers.sources.treeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-sky-950"
              >
                <span>OPEN REPOSITORY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Files List */}
            <div className="flex flex-col gap-2">
              {layers.sources.files.map((file) => (
                <div
                  key={file.path}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between font-mono text-xs hover:border-sky-500/40 transition-colors"
                >
                  <div>
                    <a
                      href={file.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-sky-400 hover:underline flex items-center gap-1.5"
                    >
                      <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{file.path}</span>
                    </a>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                      {file.description}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded bg-slate-900">
                    {file.primaryLanguage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

