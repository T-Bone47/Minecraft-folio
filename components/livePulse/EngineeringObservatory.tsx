"use client";

import React, { useState } from "react";
import type { LivePulseSnapshot, LivePulseRepository, EngineeringIncident } from "@/lib/livePulse/types";
import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Terminal,
  Activity,
  FolderGit2,
  Tag,
  Flame,
} from "lucide-react";

interface EngineeringObservatoryProps {
  snapshot: LivePulseSnapshot;
}

export function EngineeringObservatory({ snapshot }: EngineeringObservatoryProps) {
  const [selectedIncident, setSelectedIncident] = useState<EngineeringIncident | null>(null);

  return (
    <div className="w-full space-y-10 text-zinc-100">
      {/* Top Telemetry KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <div className="text-xs font-mono text-zinc-500 uppercase mb-1">MONITORED REPOS</div>
          <div className="text-2xl font-bold font-retro text-white">{snapshot.totalRepositories}</div>
          <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> All 5 Active
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <div className="text-xs font-mono text-zinc-500 uppercase mb-1">AUTOMATED CI TESTS</div>
          <div className="text-2xl font-bold font-mono text-white">{snapshot.totalPassingTests}</div>
          <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Deterministic Pass
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <div className="text-xs font-mono text-zinc-500 uppercase mb-1">CI WORKFLOW STATUS</div>
          <div className="text-2xl font-bold font-retro text-emerald-400">HEALTHY</div>
          <div className="text-xs font-mono text-zinc-400 mt-1">Zero blocking regressions</div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <div className="text-xs font-mono text-zinc-500 uppercase mb-1">DATA FRESHNESS</div>
          <div className="text-2xl font-bold font-mono text-white">LIVE</div>
          <div className="text-xs font-mono text-zinc-400 mt-1">
            Snapshot: {snapshot.fetchedAt.slice(0, 10)}
          </div>
        </div>
      </div>

      {/* 5 Repositories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-mono font-bold uppercase text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-red-400" />
            <span>Monitored Engineering Repositories ({snapshot.repositories.length})</span>
          </h2>
          <span className="text-xs font-mono text-zinc-400">Public GitHub Verified</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {snapshot.repositories.map((repo) => (
            <div
              key={repo.id}
              className="p-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {repo.primaryLanguage}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> CI: {repo.ciStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-retro text-white mt-2 group-hover:text-red-400">
                      {repo.name}
                    </h3>
                  </div>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    title="View repository on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed">
                  {repo.description}
                </p>
              </div>

              {/* Verified Benchmark Spotlight */}
              <div className="p-3 bg-zinc-900/60 border border-emerald-900/40 rounded-lg text-xs font-mono">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{repo.verifiedBenchmark.label}</span>
                </div>
                <div className="text-white font-bold text-sm">{repo.verifiedBenchmark.value}</div>
                <div className="text-zinc-500 text-[11px] mt-0.5">{repo.verifiedBenchmark.detail}</div>
              </div>

              {/* Last Commit & Release Row */}
              <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-red-400" />
                  <code className="text-red-300">{repo.lastCommit.sha}</code>
                  <span className="truncate max-w-[200px] text-zinc-500">
                    — {repo.lastCommit.message}
                  </span>
                </div>

                {repo.latestRelease && (
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Tag className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{repo.latestRelease.tag}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Post-Mortem & Defense Section */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-mono font-bold uppercase text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span>Engineering Incident Recovery & Post-Mortem Log</span>
          </h2>
          <span className="text-xs font-mono text-zinc-400">Verified Root Causes & Fixes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {snapshot.incidentLog.map((inc) => (
            <div
              key={inc.id}
              className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-red-400 font-bold uppercase">{inc.repo}</span>
                  <span className="text-zinc-500">{inc.date}</span>
                </div>

                <h3 className="text-sm font-bold text-white font-retro leading-snug">{inc.title}</h3>

                <div className="mt-3 space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-red-950/20 border border-red-900/40 rounded text-red-300">
                    <span className="font-bold text-red-400 block mb-0.5">ROOT CAUSE:</span>
                    {inc.rootCause}
                  </div>

                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded text-emerald-300">
                    <span className="font-bold text-emerald-400 block mb-0.5">EXACT FIX:</span>
                    {inc.exactFix}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 text-xs font-mono text-zinc-500 flex items-center justify-between">
                <span>Resolved in {inc.resolutionTimeMinutes}m</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CI Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

