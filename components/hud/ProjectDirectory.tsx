"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { facilities, getFacilityByProjectSlug } from "@/data/facilities";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { X, ExternalLink, Compass, CheckCircle2, Search } from "lucide-react";

interface ProjectDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDirectory: React.FC<ProjectDirectoryProps> = ({
  isOpen,
  onClose,
}) => {
  const { focusLocation } = useWorldStore();
  const { setTargetTransform } = useCameraStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      } else if ((e.key === "i" || e.key === "I") && !isOpen) {
        if (
          !(document.activeElement instanceof HTMLInputElement) &&
          !(document.activeElement instanceof HTMLTextAreaElement)
        ) {
          // Can be toggled open
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.facility.toLowerCase().includes(search.toLowerCase())
  );

  const handleFocusProject = (slug: string) => {
    const fac = getFacilityByProjectSlug(slug);
    if (fac) {
      focusLocation(fac.id);
      const [sx, , sz] = fac.approachPosition;
      setTargetTransform(
        [sx, fac.coordinates[1] + 1.65, sz],
        fac.approachLookAt
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none font-silkscreen">
      <div className="w-full max-w-3xl mc-panel-dark border-4 border-[#52525b] shadow-2xl p-5 md:p-7 max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-3 mb-4">
            <div>
              <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block mb-0.5">
                ENGINEERING INVENTORY
              </span>
              <h2 className="font-pixel text-base md:text-lg text-white font-bold">
                PROJECT DIRECTORY ({projects.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="mc-btn p-1.5 text-zinc-300 hover:text-white"
              title="Close (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 mb-4 bg-zinc-900/90 border-2 border-zinc-700 px-3 py-2">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search engineering projects or facilities..."
              className="w-full bg-transparent text-white text-xs outline-none placeholder-zinc-500 font-mono"
            />
          </div>

          {/* Project Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[52vh] pr-1">
            {filteredProjects.map((proj, idx) => {
              const fac = getFacilityByProjectSlug(proj.slug);
              return (
                <div
                  key={proj.id}
                  className="mc-panel-dark border-2 border-zinc-700 p-3.5 flex flex-col justify-between hover:border-amber-400/80 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span className="font-pixel text-amber-300 text-[8px]">
                        [{String(idx + 1).padStart(2, "0")}] {fac?.code || "FAC"}
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1 font-mono text-[9px]">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {proj.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-0.5">
                      {proj.title}
                    </h3>
                    <div className="text-[10px] text-sky-400 mb-2">
                      {proj.tagline}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans leading-snug line-clamp-2 mb-3">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => handleFocusProject(proj.slug)}
                      className="mc-btn flex-1 py-1.5 px-2 text-[9px] flex items-center justify-center gap-1 text-zinc-200 hover:text-white"
                    >
                      <Compass className="w-3 h-3 text-amber-300" />
                      <span>FOCUS IN WORLD</span>
                    </button>
                    <Link
                      href={`/work/${proj.slug}`}
                      className="mc-btn flex-1 py-1.5 px-2 text-[9px] flex items-center justify-center gap-1 text-white !bg-sky-700 hover:!bg-sky-600 border-sky-400"
                    >
                      <span>CASE STUDY</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t-2 border-zinc-700 mt-4 flex items-center justify-between text-[9px] text-zinc-400 font-pixel">
          <span>PRESS [ESC] TO RESUME EXPLORATION</span>
          <span className="text-amber-300">{projects.length} CANONICAL SYSTEMS</span>
        </div>
      </div>
    </div>
  );
};
