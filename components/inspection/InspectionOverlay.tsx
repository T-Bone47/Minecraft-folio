"use client";

import React from "react";
import Link from "next/link";
import { useWorldStore } from "@/state/worldStore";
import { getProjectBySlug, projects } from "@/data/projects";
import { getFacilityByProjectSlug, getFacilityById } from "@/data/facilities";
import { siteIdentity } from "@/data/site";
import { experience, education } from "@/data/experience";
import {
  X,
  ExternalLink,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Zap,
  Mail,
} from "lucide-react";

export const InspectionOverlay: React.FC = () => {
  const { mode, activeProject, activeLocation, closeInspection } = useWorldStore();

  if (mode !== "inspect" && activeLocation !== "hq") return null;

  // If inspecting Engineering HQ
  if (activeLocation === "hq" && (!activeProject || activeProject === "hq")) {
    return (
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-xl mc-panel-dark border-l-4 border-cyan-500 shadow-2xl p-6 md:p-8 flex flex-col justify-between font-silkscreen text-xs overflow-y-auto">
        <div>
          <div className="flex items-start justify-between gap-4 border-b-2 border-zinc-700 pb-4 mb-6">
            <div>
              <span className="font-pixel text-[9px] text-cyan-400 uppercase tracking-widest block mb-1">
                COMMAND MONOLITH // FAC-00
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-pixel">
                {siteIdentity.name}
              </h2>
              <p className="text-xs text-zinc-300 font-sans mt-1">
                Motorsport Software & AI/ML Engineer
              </p>
            </div>
            <button
              onClick={closeInspection}
              className="mc-btn p-1.5 text-zinc-300 hover:text-white"
              title="Close (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Statement */}
          <div className="mb-6 bg-zinc-900 border border-zinc-700 p-3.5 text-zinc-300 font-sans text-xs leading-relaxed italic">
            &ldquo;{siteIdentity.supportingStatement}&rdquo;
          </div>

          {/* Engineering Timeline Wall */}
          <div className="mb-6">
            <h3 className="font-pixel text-[9px] text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              ENGINEERING TIMELINE WALL
            </h3>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-zinc-900/90 border border-zinc-700 p-3"
                >
                  <div className="flex justify-between items-start text-xs text-sky-400 font-bold mb-1">
                    <span>{exp.role}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-xs text-white mb-2 font-semibold">
                    {exp.organization}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exp.focus.map((f, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h3 className="font-pixel text-[9px] text-emerald-300 uppercase tracking-wider mb-2">
              EDUCATION & BACKGROUND
            </h3>
            <div className="bg-zinc-900 border border-zinc-700 p-3">
              <div className="text-xs font-bold text-white mb-1">
                {education.institution}
              </div>
              <div className="text-xs text-zinc-400 font-sans">
                {education.program}
              </div>
            </div>
          </div>

          {/* Direct Contact Terminal */}
          <div className="mb-6">
            <h3 className="font-pixel text-[9px] text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              CONTACT TERMINAL
            </h3>
            <div className="bg-zinc-900 border border-zinc-700 p-3.5 flex items-center justify-between">
              <div className="text-xs text-white font-mono">
                {siteIdentity.social.email}
              </div>
              <a
                href={`mailto:${siteIdentity.social.email}`}
                className="mc-btn px-3 py-1.5 text-[10px] text-white !bg-cyan-700 hover:!bg-cyan-600 border-cyan-400"
              >
                DIRECT UPLINK
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-zinc-700">
          <button
            onClick={closeInspection}
            className="mc-btn w-full py-2.5 text-xs text-zinc-300 hover:text-white"
          >
            [ESC] RETURN TO CAMPUS EXPLORATION
          </button>
        </div>
      </div>
    );
  }

  const project = getProjectBySlug(activeProject || "");
  const facility = getFacilityByProjectSlug(activeProject || "");

  if (!project) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-xl mc-panel-dark border-l-4 border-sky-500 shadow-2xl p-6 md:p-8 flex flex-col justify-between font-silkscreen text-xs overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4 border-b-2 border-zinc-700 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 font-pixel text-[9px] uppercase tracking-widest text-sky-400 mb-1">
              <span>{facility?.code || "FACILITY"}</span>
              <span>•</span>
              <span>SYSTEM INSPECTION</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-pixel">
              {project.title}
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">{project.tagline}</p>
          </div>

          <button
            onClick={closeInspection}
            className="mc-btn p-1.5 text-zinc-300 hover:text-white"
            title="Close (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Discipline Tag Row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 uppercase font-semibold text-[10px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            STATUS: {project.status}
          </span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-200 text-[10px] uppercase font-semibold">
            {project.category}
          </span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px]">
            {project.year}
          </span>
        </div>

        {/* Facility-Specific Important Notes */}
        {project.slug === "f1-race-manager" && (
          <div className="mb-5 bg-amber-950/40 border-2 border-amber-500/60 p-3 text-amber-300 text-[11px] font-mono leading-relaxed">
            [NOTE] F1 TEAM MANAGEMENT & STRATEGY SIMULATION GAME. Features deterministic race logic, weather volatility, safety cars, and driver operations.
          </div>
        )}

        {project.slug === "f1-lap-time-simulator" && (
          <div className="mb-5 bg-emerald-950/40 border-2 border-emerald-500/60 p-3 text-emerald-300 text-[11px] font-mono leading-relaxed">
            [NOTE] NUMERICAL VEHICLE DYNAMICS & QUASI-STATIC SOLVER. Point-mass friction circles, aero balance, and grip sensitivity analysis. (Numerical engineering, not AI/ML).
          </div>
        )}

        {project.slug === "racemind-ai" && (
          <div className="mb-5 bg-red-950/40 border-2 border-red-500/60 p-3 text-red-300 text-[11px] font-mono leading-relaxed">
            [NOTE] RACE STRATEGY & UDP TELEMETRY BRIDGE. Game-agnostic abstraction core with stint degradation and pit window intelligence.
          </div>
        )}

        {/* Engineering Problem & Challenge */}
        <div className="mb-6">
          <h3 className="font-pixel text-[9px] uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            ENGINEERING PROBLEM & CHALLENGE
          </h3>
          <p className="text-xs leading-relaxed text-zinc-300 bg-zinc-900/90 p-3.5 border border-zinc-700 font-sans">
            {project.description}
          </p>
        </div>

        {/* System Architecture */}
        <div className="mb-6">
          <h3 className="font-pixel text-[9px] uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            SYSTEM ARCHITECTURE
          </h3>
          <div className="bg-zinc-900 border border-zinc-700 p-3.5 text-xs font-sans text-zinc-300 leading-relaxed">
            {project.architecture?.summary || project.tagline}
          </div>
        </div>

        {/* Key Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-6">
            <h3 className="font-pixel text-[9px] uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              KEY TECHNOLOGIES
            </h3>
            <div className="flex flex-wrap gap-1.5 bg-zinc-900/90 border border-zinc-700 p-3">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[10px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verified Engineering Metrics / Evidence */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-6">
            <h3 className="font-pixel text-[9px] uppercase tracking-wider text-emerald-300 mb-2.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              VERIFIED ENGINEERING EVIDENCE
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {project.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-700 p-3 flex flex-col justify-between"
                >
                  <div className="text-base font-bold text-sky-400 tracking-tight font-mono">
                    {metric.value}
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-1 uppercase leading-tight font-pixel">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current State */}
        <div className="mb-6">
          <h3 className="font-pixel text-[9px] uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            CURRENT STATE
          </h3>
          <div className="bg-zinc-900 border border-zinc-700 p-3 text-xs font-mono text-zinc-300 flex items-center justify-between">
            <span>DEVELOPMENT STATUS:</span>
            <span className="text-emerald-400 font-bold uppercase">{project.status} ({project.year})</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="pt-4 border-t-2 border-zinc-700 flex items-center justify-between gap-3">
        <button
          onClick={closeInspection}
          className="mc-btn px-4 py-2.5 text-xs text-zinc-300 hover:text-white"
        >
          [ESC] EXIT
        </button>

        <Link
          href={`/work/${project.slug}`}
          onClick={() => {
            // Save state confirmation
            if (typeof window !== "undefined") {
              sessionStorage.setItem("asish_world_last_case_study", project.slug);
            }
          }}
          className="mc-btn flex-1 py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 text-white !bg-sky-700 hover:!bg-sky-600 border-sky-400"
        >
          <span>OPEN FULL CASE STUDY</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

