"use client";

import React, { useEffect } from "react";
import { useMultiverseStore } from "@/state/multiverseStore";
import {
  multiverseProjects,
  getMultiverseProjectById,
} from "@/lib/multiverse/projectRegistry";
import { RaceMindDemoView } from "./demos/RaceMindDemoView";
import { LiveF1DemoView } from "./demos/LiveF1DemoView";
import { SentinelDemoView } from "./demos/SentinelDemoView";
import { VyaparPulseDemoView } from "./demos/VyaparPulseDemoView";
import { EvidenceInspectorView } from "./EvidenceInspectorView";
import { RecruiterPathwaysView } from "./RecruiterPathwaysView";
import {
  X,
  ExternalLink,
  Zap,
  Play,
  Layers,
  Briefcase,
  GitBranch,
} from "lucide-react";

export const MultiverseModal: React.FC = () => {
  const activePortalId = useMultiverseStore((s) => s.activePortalId);
  const activeViewMode = useMultiverseStore((s) => s.activeViewMode);
  const closePortal = useMultiverseStore((s) => s.closePortal);
  const openPortal = useMultiverseStore((s) => s.openPortal);
  const setViewMode = useMultiverseStore((s) => s.setViewMode);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePortalId) {
        closePortal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePortalId, closePortal]);

  if (!activePortalId) return null;

  const project = getMultiverseProjectById(activePortalId)!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200"
      data-testid="multiverse-modal"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* 1. Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
          {/* Project Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {multiverseProjects.map((p) => {
              const isSelected = p.id === activePortalId;
              return (
                <button
                  key={p.id}
                  onClick={() => openPortal(p.id, activeViewMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.themeColor }}
                  />
                  <span>{p.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <GitBranch className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">SHA: {project.commitSha}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={() => closePortal()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Portal Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Secondary Navigation Tabs (Universal Portal Actions) */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("demo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                activeViewMode === "demo"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>EXPERIENCE PROJECT</span>
            </button>

            <button
              onClick={() => setViewMode("engineering")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                activeViewMode === "engineering"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>6-LAYER PROOF INSPECTOR</span>
            </button>

            <button
              onClick={() => setViewMode("recruiter")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                activeViewMode === "recruiter"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>RECRUITER PATHWAYS</span>
            </button>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400">
            {project.keyMetrics.slice(0, 2).map((m, idx) => (
              <span key={idx}>
                {m.label}: <strong className="text-slate-200">{m.value}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* 3. Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeViewMode === "demo" && (
            <>
              {activePortalId === "racemind" && <RaceMindDemoView />}
              {activePortalId === "live-f1" && <LiveF1DemoView />}
              {activePortalId === "sentinel" && <SentinelDemoView />}
              {activePortalId === "vyaparpulse" && <VyaparPulseDemoView />}
            </>
          )}

          {activeViewMode === "engineering" && <EvidenceInspectorView />}

          {activeViewMode === "recruiter" && <RecruiterPathwaysView />}
        </div>
      </div>
    </div>
  );
};
