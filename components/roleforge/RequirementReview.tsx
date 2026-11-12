/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Requirement Review & Adjustment Table
 */

"use client";

import React, { useState } from "react";
import { CANONICAL_SKILL_TAXONOMY } from "@/lib/roleforge/skillTaxonomy";
import { useRoleForgeStore } from "@/state/roleforgeStore";
import type { RequirementPriority } from "@/lib/roleforge/types";

const PRIORITY_STYLES: Record<RequirementPriority, { badge: string; bg: string }> = {
  REQUIRED: {
    badge: "text-red-400 border-red-500/40 bg-red-950/30",
    bg: "border-red-500/20",
  },
  PREFERRED: {
    badge: "text-amber-400 border-amber-500/40 bg-amber-950/30",
    bg: "border-amber-500/20",
  },
  OPTIONAL: {
    badge: "text-blue-400 border-blue-500/40 bg-blue-950/30",
    bg: "border-blue-500/20",
  },
  UNCLEAR: {
    badge: "text-zinc-400 border-zinc-500/40 bg-zinc-900",
    bg: "border-zinc-700/20",
  },
};

export const RequirementReview: React.FC = () => {
  const {
    activeRequirements,
    updatePriority,
    updateImportance,
    removeRequirement,
    addRequirementBySkillId,
    compileCurrentMission,
  } = useRoleForgeStore();

  const [selectedAddSkillId, setSelectedAddSkillId] = useState<string>("");

  const requiredCount = activeRequirements.filter((r) => r.priority === "REQUIRED").length;
  const preferredCount = activeRequirements.filter((r) => r.priority === "PREFERRED").length;
  const optionalCount = activeRequirements.filter((r) => r.priority === "OPTIONAL").length;

  const handleAddSkill = () => {
    if (!selectedAddSkillId) return;
    addRequirementBySkillId(selectedAddSkillId, "REQUIRED", 4);
    setSelectedAddSkillId("");
  };

  // Filter skills not already in activeRequirements
  const existingSkillIds = new Set(activeRequirements.map((r) => r.canonicalSkillId));
  const availableSkills = CANONICAL_SKILL_TAXONOMY.filter(
    (s) => !existingSkillIds.has(s.id)
  );

  return (
    <div className="space-y-4">
      {/* Header & Stats */}
      <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-cyan-400 uppercase">
            Requirement Review & Prioritization
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Adjust priorities or importance weights to calibrate the evidence graph and campus mission.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/30">
            {requiredCount} Required
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
            {preferredCount} Preferred
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-500/30">
            {optionalCount} Optional
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded overflow-hidden max-h-[50vh] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-[10px] font-mono uppercase text-zinc-400">
              <th className="py-2.5 px-3">Canonical Competency</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Importance</th>
              <th className="py-2.5 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {activeRequirements.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No requirements currently selected. Choose a preset or paste a job description.
                </td>
              </tr>
            ) : (
              activeRequirements.map((req) => {
                const style = PRIORITY_STYLES[req.priority];
                return (
                  <tr key={req.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{req.skillName}</div>
                      {req.originalTextSpan && (
                        <div className="text-[10px] text-zinc-500 line-clamp-1 italic mt-0.5">
                          &ldquo;{req.originalTextSpan}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {req.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        aria-label={`Priority for ${req.skillName}`}
                        value={req.priority}
                        onChange={(e) =>
                          updatePriority(req.id, e.target.value as RequirementPriority)
                        }
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border focus:outline-none focus:ring-1 focus:ring-cyan-500 ${style.badge}`}
                      >
                        <option value="REQUIRED" className="bg-zinc-900 text-red-400">REQUIRED</option>
                        <option value="PREFERRED" className="bg-zinc-900 text-amber-400">PREFERRED</option>
                        <option value="OPTIONAL" className="bg-zinc-900 text-blue-400">OPTIONAL</option>
                        <option value="UNCLEAR" className="bg-zinc-900 text-zinc-400">UNCLEAR</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          aria-label={`Importance weight for ${req.skillName}`}
                          type="range"
                          min={1}
                          max={5}
                          value={req.importance}
                          onChange={(e) => updateImportance(req.id, Number(e.target.value))}
                          className="w-16 accent-cyan-400 h-1 bg-zinc-800 rounded cursor-pointer"
                        />
                        <span className="text-[10px] text-zinc-300 w-3">{req.importance}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeRequirement(req.id)}
                        className="text-zinc-500 hover:text-red-400 text-xs px-2 py-1 transition-colors"
                        title="Remove requirement"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Custom Skill Row */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/40 p-3 rounded border border-zinc-800/80">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            aria-label="Add canonical skill to requirement review"
            value={selectedAddSkillId}
            onChange={(e) => setSelectedAddSkillId(e.target.value)}
            className="bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
          >
            <option value="">+ Add Skill from Taxonomy...</option>
            {availableSkills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selectedAddSkillId}
            onClick={handleAddSkill}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-mono font-semibold text-zinc-200 transition-colors"
          >
            ADD
          </button>
        </div>

        <div className="text-[10px] font-mono text-zinc-500">
          Changes compile deterministically into evidence matching and 3D waypoints.
        </div>
      </div>
    </div>
  );
};

