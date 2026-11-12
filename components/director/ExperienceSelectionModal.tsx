"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  Shield,
  Clock,
  Compass,
  FileText,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useFrontierDirectorStore } from "@/state/frontierDirectorStore";
import { experiences } from "@/lib/frontierDirector/experienceRegistry";
import type { ExperienceId } from "@/lib/frontierDirector/types";

export function ExperienceSelectionModal() {
  const {
    isExperienceModalOpen,
    closeExperienceModal,
    startShowcase,
    openEvidence,
    fastTravelToFacility,
  } = useFrontierDirectorStore();

  const [recruiterFastPath, setRecruiterFastPath] = useState(true);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    if (!isExperienceModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeExperienceModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExperienceModalOpen, closeExperienceModal]);

  if (!isExperienceModalOpen) return null;

  const roles = [
    { id: "ALL", label: "All Engineering Tracks" },
    { id: "MOTORSPORT", label: "Motorsport & Simulation" },
    { id: "AIML", label: "AI / Machine Learning" },
    { id: "SYSTEMS", label: "Distributed Systems" },
  ];

  const filteredExperiences = experiences.filter((exp) => {
    if (selectedRoleFilter === "ALL") return true;
    if (selectedRoleFilter === "MOTORSPORT") return exp.id === "motorsport";
    if (selectedRoleFilter === "AIML") return exp.id === "ai-ml";
    if (selectedRoleFilter === "SYSTEMS") return exp.id === "systems";
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-hidden animate-fadeIn font-sans"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#171A20] text-[#C8CDD2] border border-[#C8CDD2]/30 rounded-xl shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <header className="px-5 sm:px-7 py-4 bg-[#121418] border-b border-[#C8CDD2]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#D71D35] bg-[#D71D35]/15 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                FRONTIER DIRECTOR 2.0
              </span>
              <span className="text-zinc-600">|</span>
              <span className="font-mono text-[10px] text-zinc-400">
                CURATED PROFESSIONAL SHOWCASES
              </span>
            </div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Select Engineering Demonstration
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Recruiter Fast Path Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-[#1c2027] border border-[#C8CDD2]/20 px-3 py-1.5 rounded-lg text-xs font-mono select-none">
              <input
                type="checkbox"
                checked={recruiterFastPath}
                onChange={(e) => setRecruiterFastPath(e.target.checked)}
                className="w-4 h-4 rounded text-[#D71D35] focus:ring-0 cursor-pointer"
              />
              <span className="text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>60s Recruiter Path</span>
              </span>
            </label>

            <button
              onClick={closeExperienceModal}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Filter Pills */}
        <div className="px-5 sm:px-7 py-2.5 bg-[#14171d] border-b border-[#C8CDD2]/15 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoleFilter(r.id)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all whitespace-nowrap ${
                selectedRoleFilter === r.id
                  ? "bg-[#D71D35] text-white font-semibold shadow"
                  : "bg-[#1c2027] text-zinc-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Experience Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {filteredExperiences.map((exp) => (
            <article
              key={exp.id}
              className="bg-[#1c2027] border border-[#C8CDD2]/20 hover:border-[#C8CDD2]/50 rounded-xl p-5 sm:p-6 transition-all space-y-4 shadow-lg group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/30">
                      {exp.badge}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>~{exp.estimatedDurationSec}s GUIDED SHOWCASE</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {exp.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.targetRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-[#121418] border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Metrics Chips */}
                <div className="grid grid-cols-2 gap-2 sm:min-w-[260px] bg-[#121418] border border-zinc-800/80 p-3 rounded-lg">
                  {exp.keyMetrics.slice(0, 4).map((m, mIdx) => (
                    <div key={mIdx} className="space-y-0.5">
                      <div className="text-[9px] font-mono text-zinc-500 uppercase truncate">
                        {m.label}
                      </div>
                      <div className="text-sm font-mono font-bold text-white flex items-center gap-1">
                        <span>{m.value}</span>
                        {m.unit && <span className="text-[9px] font-normal text-zinc-400">{m.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Takeaway Callout */}
              <div className="bg-[#13161c] border-l-2 border-[#D71D35] px-3.5 py-2 text-xs text-zinc-300">
                <span className="font-mono text-[#D71D35] font-bold mr-1.5 uppercase text-[10px]">
                  Recruiter Takeaway:
                </span>
                <span>{exp.recruiterTakeaway}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
                <div className="text-[11px] font-mono text-zinc-500">
                  Campus Anchor: <strong className="text-zinc-300 uppercase">{exp.primaryFacilityId}</strong>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Walk to Facility */}
                  <button
                    onClick={() => {
                      closeExperienceModal();
                      fastTravelToFacility(exp.primaryFacilityId);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs text-zinc-300 hover:text-white bg-[#15181f] hover:bg-[#202530] border border-zinc-700 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-zinc-400" />
                    <span>WALK FACILITY</span>
                  </button>

                  {/* Inspect Proof */}
                  <button
                    onClick={() => {
                      closeExperienceModal();
                      openEvidence(exp.id, "problem");
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs text-[#22D3EE] bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/30 transition-colors font-semibold"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>INSPECT PROOF</span>
                  </button>

                  {/* Start Showcase */}
                  <button
                    onClick={() => {
                      closeExperienceModal();
                      startShowcase(exp.id, recruiterFastPath);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-mono text-xs text-white bg-[#D71D35] hover:bg-[#b01428] shadow-md transition-all font-bold"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>START SHOWCASE</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="px-5 sm:px-7 py-3 bg-[#121418] border-t border-[#C8CDD2]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-500">
          <span>ALL DEMONSTRATIONS ARE BACKED BY REAL PROJECT SOURCE & UNIT TESTS</span>
          <span>SELECT ANY EXPERIENCE TO BEGIN</span>
        </footer>
      </div>
    </div>
  );
}

