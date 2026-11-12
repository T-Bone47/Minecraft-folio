/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Curated Role Preset Selector
 */

"use client";

import React from "react";
import { CURATED_ROLE_PRESETS } from "@/lib/roleforge/skillTaxonomy";
import { useRoleForgeStore } from "@/state/roleforgeStore";

export const RoleSelector: React.FC = () => {
  const { selectedPresetSlug, selectPreset } = useRoleForgeStore();

  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-sm font-semibold tracking-wider text-cyan-400 uppercase">
          Curated Engineering Disciplines
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Select an engineering role preset to load verified skills, benchmark evidence, and an adaptive 3D campus mission.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[58vh] overflow-y-auto pr-1">
        {CURATED_ROLE_PRESETS.map((preset) => {
          const isSelected = selectedPresetSlug === preset.slug;
          return (
            <div
              key={preset.id}
              onClick={() => selectPreset(preset.slug)}
              className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700">
                    {preset.discipline.split(",")[0]}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {preset.defaultBudget === "QUICK_90S" ? "90s Fast" : "5m Pro"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{preset.title}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                  {preset.description}
                </p>

                <div className="space-y-1 mb-3">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Core Verified Requirements:</div>
                  <div className="flex flex-wrap gap-1">
                    {preset.coreRequirements.slice(0, 3).map((req) => (
                      <span
                        key={req.canonicalSkillId}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                      >
                        {req.skillName.split(" ")[0]}
                      </span>
                    ))}
                    {preset.coreRequirements.length > 3 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/40 text-zinc-500">
                        +{preset.coreRequirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-zinc-400">
                  Guide: <strong className="text-zinc-300">{preset.recommendedGuideNpcId.replace(/-/g, " ")}</strong>
                </span>
                <button
                  type="button"
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded transition-colors ${
                    isSelected
                      ? "bg-cyan-500 text-black"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {isSelected ? "ACTIVE" : "SELECT"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

