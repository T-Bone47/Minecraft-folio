"use client";

import React from "react";
import { useMultiverseStore } from "@/state/multiverseStore";
import { getMultiverseProjectById } from "@/lib/multiverse/projectRegistry";
import type { RecruiterRolePathway } from "@/lib/multiverse/projectTypes";
import { Briefcase, CheckCircle2, FileCode2, HelpCircle, Zap, Code2, Brain, Car, Globe } from "lucide-react";

export const RecruiterPathwaysView: React.FC = () => {
  const activePortalId = useMultiverseStore((s) => s.activePortalId);
  const recruiterPathway = useMultiverseStore((s) => s.recruiterPathway);
  const setRecruiterPathway = useMultiverseStore((s) => s.setRecruiterPathway);

  const project = getMultiverseProjectById(activePortalId || "racemind")!;
  const pathwayData = project.roleRelevance[recruiterPathway];

  const pathways: { id: RecruiterRolePathway; label: string; icon: any }[] = [
    { id: "software-engineering", label: "Software Engineering", icon: Code2 },
    { id: "ai-ml", label: "AI / ML Engineering", icon: Brain },
    { id: "motorsport", label: "Motorsport Systems", icon: Car },
    { id: "full-stack", label: "Full-Stack & Offline", icon: Globe },
  ];

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans" data-testid="recruiter-pathways-container">
      {/* 1. Pathway Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {pathways.map((p) => {
          const Icon = p.icon;
          const isActive = recruiterPathway === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setRecruiterPathway(p.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Headline & Overview */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Role Competency Alignment</span>
        </div>
        <h4 className="text-sm font-mono font-bold text-slate-100 mb-2">
          {pathwayData.headline}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          How Asish&apos;s architecture in <strong>{project.name}</strong> satisfies the strict standards of technical screening, systems design, and production reliability for {recruiterPathway} roles.
        </p>
      </div>

      {/* 3. Takeaways & Highlighted Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Takeaways */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-emerald-400 block mb-3">
              Core Engineering Proof Points
            </span>
            <ul className="flex flex-col gap-2.5">
              {pathwayData.takeaways.map((takeaway, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-slate-500">
            Validated against canonical codebase commit: <code className="text-amber-400">{project.commitSha}</code>
          </div>
        </div>

        {/* Recommended Interview Questions */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-sky-400 block mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Recommended Screening & Interview Questions</span>
            </span>
            <div className="flex flex-col gap-2.5">
              {pathwayData.interviewQuestions.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-200">
                  <span className="text-sky-400 font-mono font-bold mr-1.5">Q{idx + 1}:</span>
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-slate-400">
            Ask these during technical deep-dive calls to verify design depth and constraint awareness.
          </div>
        </div>
      </div>

      {/* 4. Highlighted Source Files */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span className="text-xs font-mono uppercase font-bold text-slate-400 block mb-2">
          Critical Files for Technical Reviewers
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pathwayData.highlightedFiles.map((f, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{f.path}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">
                {f.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
