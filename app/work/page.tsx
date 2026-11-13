import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { projects } from "@/data/projects";
import { canonicalUrl } from "@/lib/siteMetadata";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { EngineeringIndex } from "@/components/work/EngineeringIndex";
import {
  Cpu,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Layers,
  Box,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  alternates: canonicalUrl("/projects") ? { canonical: canonicalUrl("/projects") } : undefined,
  title: "Canonical Systems & Projects — Asish Oliver M",
  description:
    "Explore the six canonical engineering systems: Live F1 Intelligence, F1 Lap-Time Simulator, RaceMind-AI, F1 Race Manager, EA FC Intelligence, and VyaparPulse.",
};

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />

      {/* Redstone Status Bar */}
      <RedstoneStatusBar
        status={`SYSTEMS INDEXED: ${projects.length} / ${projects.length}`}
        location="ALL CANONICAL ENGINEERING SYSTEMS DOCUMENTED"
        badgeText="WORLD"
        badgeLabel="ENTER 3D CAMPUS"
        badgeHref="/world"
      />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Page Header as Minecraft Oak / Iron Banner */}
        <header className="mc-sign p-6 sm:p-8 shadow-[0_6px_0_#000000]">
          <div className="font-pixel text-[10px] text-yellow-300 mc-text-shadow-gold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>CANONICAL SYSTEM ARCHIVE & LABORATORIES</span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white mc-text-shadow uppercase tracking-wide leading-tight">
            Engineering Systems
          </h1>

          <div className="font-pixel text-xs sm:text-sm text-yellow-400 mc-text-shadow-gold mt-2 uppercase">
            {projects.length} ENGINEERING SYSTEMS · TELEMETRY, SIMULATION & APPLIED AI
          </div>

          <p className="text-xs sm:text-sm text-[#f5eedc] font-mono leading-relaxed mt-3 max-w-3xl">Canonical engineering systems spanning high-throughput telemetry pipelines, quasi-steady-state
              numerical lap simulation, AI virtual race engineering, and applied machine learning models.
              Every system prioritizes strict architectural boundary separation, mathematical verification, and
              decisive engineering utility. Metrics are labelled by evidence grade — nothing here is presented as
              verified unless it was measured on the real system.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-amber-800/60 font-mono text-xs">
            <Link
              href="/world"
              className="mc-btn-gold px-4 py-2.5 text-[10px] flex items-center gap-2"
            >
              <Box className="w-3.5 h-3.5" />
              <span>EXPLORE ALL IN 3D WORLD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="font-pixel text-[9px] text-amber-200/80 mc-text-shadow-gold">
              TOTAL SPECIFICATIONS: 6 CANONICAL REPOSITORIES
            </span>
          </div>
        </header>

        {/* ENGINEERING INDEX — filterable fast path, no 3D required */}
        <section className="space-y-6">
          <div className="border-b-4 border-[#121214] pb-3">
            <div className="font-pixel text-[10px] uppercase tracking-wider text-emerald-400 mc-text-shadow flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ENGINEERING INDEX</span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-white mc-text-shadow mt-1">
              All Systems, Filterable by Domain
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-2 max-w-2xl">
              Every system is reachable here without entering the 3D world. Each
              entry carries its status, domain and evidence grade.
            </p>
          </div>
          <EngineeringIndex />
        </section>

        {/* Detailed system dossiers */}
        <div className="space-y-8">
          {projects.map((proj, idx) => (
            <article
              key={proj.id}
              className="mc-gui-box p-6 sm:p-8 space-y-5 font-mono group hover:border-[#ff8000] transition-colors"
            >
              {/* Header: System ID & Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#121214] pb-3">
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase">
                  <span className="font-pixel text-[10px] text-[#ff8000] mc-text-shadow">
                    SYS-0{idx + 1} {"//"} {proj.facility.toUpperCase()}
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span className="font-pixel text-[9px] text-emerald-400 mc-text-shadow flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {proj.status.toUpperCase()}
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400">YEAR: {proj.year}</span>
                </div>

                <div className="font-pixel text-[9px] text-zinc-400 mc-text-shadow">
                  TIER: CANONICAL PRODUCTION
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="font-pixel text-xl sm:text-2xl text-white mc-text-shadow group-hover:text-[#ff8000] transition-colors">
                  {proj.title}
                </h2>

                {proj.isGame && (
                  <div className="mt-2 text-[10px] font-pixel text-amber-300 bg-amber-950/80 px-2.5 py-1 border-2 border-amber-600 mc-text-shadow inline-block">
                    [GAME — IN DEVELOPMENT] F1 STRATEGY & TEAM MANAGEMENT
                  </div>
                )}

                <div className="font-pixel text-xs text-[#00d2be] mc-text-shadow mt-2">
                  {proj.tagline}
                </div>
              </div>

              {/* Description Inset */}
              <div className="mc-slot-box p-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-[#ff8000]">
                {proj.description}
              </div>

              {/* Inset Slot 1: Key Engineering Decisions */}
              {proj.engineeringDecisions && proj.engineeringDecisions.length > 0 && (
                <div className="mc-slot-box p-3.5 space-y-2">
                  <div className="font-pixel text-[9px] text-yellow-400 mc-text-shadow uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff8000]" />
                    <span>ARCHITECTURAL GUARANTEES &amp; KEY DECISIONS</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 pl-4 list-disc marker:text-[#ff8000]">
                    {proj.engineeringDecisions.slice(0, 3).map((dec, i) => (
                      <li key={i}>
                        <strong className="text-white">{dec.title}:</strong> {dec.rationale}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Inset Slot 2: Architecture Pipeline Stages */}
              {proj.architecture?.pipeline && proj.architecture.pipeline.length > 0 && (
                <div className="mc-slot-box p-3 space-y-2">
                  <div className="font-pixel text-[9px] text-[#00d2be] mc-text-shadow uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#00d2be]" />
                    <span>SYSTEM ARCHITECTURE PIPELINE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {proj.architecture.pipeline.slice(0, 4).map((stage, i) => (
                      <div key={i} className="mc-item-chip p-2">
                        <strong className="text-white block font-pixel text-[9px] mc-text-shadow">
                          STAGE 0{i + 1}: {stage.label}
                        </strong>
                        {stage.children && stage.children.length > 0 && (
                          <span className="text-zinc-400 text-[10px] block mt-0.5 truncate">
                            {stage.children.join(", ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {proj.technologies.map((t) => (
                  <span
                    key={t}
                    className="mc-item-chip px-2 py-1 text-[10px] text-zinc-300 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons: 3D Beveled Minecraft Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t-2 border-[#121214]">
                <Link
                  href={`/work/${proj.slug}`}
                  className="mc-btn-gold px-4 py-2.5 text-[10px] sm:text-xs flex items-center gap-2"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>VIEW 10-CHAPTER CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/world"
                  className="mc-btn-stone px-3.5 py-2.5 text-[10px] sm:text-xs flex items-center gap-2"
                >
                  <Box className="w-3.5 h-3.5 text-yellow-300" />
                  <span>LOCATE IN 3D CAMPUS</span>
                </Link>

                {proj.links?.repository && (
                  <a
                    href={proj.links.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mc-btn-stone px-3 py-2.5 text-[10px] sm:text-xs flex items-center gap-1.5 ml-auto text-zinc-300 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>SOURCE REPO</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
