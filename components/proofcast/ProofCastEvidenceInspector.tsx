"use client";

import React from "react";
import { ExternalLink, CheckCircle2, Copy, X, Terminal, GitCommit, FileCode, Play } from "lucide-react";
import type { ProofCastBeat } from "@/lib/proofcast/types";

interface ProofCastEvidenceInspectorProps {
  beat: ProofCastBeat;
  onClose: () => void;
  onResume: () => void;
}

export function ProofCastEvidenceInspector({ beat, onClose, onResume }: ProofCastEvidenceInspectorProps) {
  const [copied, setCopied] = React.useState(false);
  const { evidenceProof, keyMetric, architectureStep } = beat;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(evidenceProof.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proofcast-inspector-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-zinc-950 border-2 border-red-500/60 rounded-xl shadow-2xl shadow-red-950/40 overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase bg-red-900/50 text-red-300 border border-red-700/60 rounded">
              VERIFIED IMPLEMENTATION
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Commit: <code className="text-red-400">{evidenceProof.commitSha}</code>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResume}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume Story
            </button>
            <button
              onClick={onClose}
              aria-label="Close inspector"
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Architecture Context */}
          <div>
            <h2 id="proofcast-inspector-title" className="text-xl sm:text-2xl font-bold font-retro text-white tracking-wide">
              {beat.title}
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-1">{beat.roleHeadline}</p>
          </div>

          {/* Metric & Subsystem Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
              <div className="text-xs font-mono uppercase text-zinc-400 mb-1">Subsystem</div>
              <div className="text-sm font-bold text-white">{architectureStep.subsystem}</div>
              <div className="text-xs font-mono text-zinc-400 mt-1">{architectureStep.description}</div>
            </div>

            <div className="p-4 bg-zinc-900/60 border border-emerald-900/50 rounded-lg">
              <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Benchmark
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {keyMetric.value} <span className="text-xs text-zinc-400 font-normal">{keyMetric.unit || ""}</span>
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">{keyMetric.label}</div>
            </div>
          </div>

          {/* Evidence Repository & Path */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs font-mono">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-red-400" />
              <span className="text-zinc-300">{evidenceProof.filePath}</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`${evidenceProof.repoUrl}/blob/${evidenceProof.commitSha}/${evidenceProof.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-black">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <span>Language: {evidenceProof.language}</span>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{evidenceProof.codeSnippet}</code>
            </pre>
          </div>

          {/* Explanation */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-lg">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-300 mb-1">Architecture Analysis</h3>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">{evidenceProof.explanation}</p>
          </div>

          {/* Verifiable Command */}
          {evidenceProof.verifiableCommand && (
            <div className="p-4 bg-zinc-900/60 border border-red-900/40 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-red-300 font-bold mb-2">
                <Terminal className="w-4 h-4" /> Local Reproduction Command
              </div>
              <code className="block p-2.5 bg-black rounded font-mono text-xs text-red-200 border border-red-950 select-all">
                {evidenceProof.verifiableCommand}
              </code>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-900/90 border-t border-zinc-800 text-xs font-mono text-zinc-400">
          <div>Interactive Engineering Reality Engine • ASISH OLIVER M</div>
          <button
            onClick={onResume}
            className="px-4 py-1.5 font-bold uppercase bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
          >
            Resume Documentary
          </button>
        </div>
      </div>
    </div>
  );
}

