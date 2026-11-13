import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { experience, education } from "@/data/experience";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { experiences } from "@/lib/frontierDirector/experienceRegistry";
import {
  Activity,
  Briefcase,
  GraduationCap,
  Terminal,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Box,
  ChevronRight,
  Sparkles,
  Play,
  Shield,
  Layers,
  Cpu,
  BarChart3,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Experiences & Trajectory — Asish Oliver M",
  description:
    "Explore interactive engineering demonstrations and verified technical evidence across motorsport vehicle simulation, AI/ML systems, and distributed telemetry pipelines.",
  openGraph: {
    title: "Engineering Demonstrations & Trajectory — Asish Oliver M",
    description:
      "Interactive 60-second showcases and 6-layer engineering proof across Motorsport, AI/ML, and Software Systems.",
    type: "website",
  },
};

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f4f4f5] font-sans selection:bg-[#D71D35] selection:text-white">
      <PortfolioNav />

      {/* Status Bar — Resilient single-row layout */}
      <div className="bg-[#18181c] border-b border-[#252830] px-4 sm:px-6 py-2 font-mono text-[11px] text-zinc-400 flex items-center justify-between gap-3 shadow-inner overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] shrink-0 animate-pulse" />
          <span className="font-mono text-zinc-200 font-bold uppercase tracking-wider shrink-0">
            FRONTIER DIRECTOR 2.0
          </span>
          <span className="text-zinc-600 shrink-0">|</span>
          <span className="text-zinc-400 truncate">VERIFIED CODE · REPRODUCIBLE BENCHMARKS</span>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/recruiter"
            className="font-mono text-emerald-400 hover:text-white flex items-center gap-1 transition-colors whitespace-nowrap text-[10px]"
          >
            <span>RECRUITER 30s SUMMARY</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Header Hero */}
        <header className="bg-[#171A20] border border-[#C8CDD2]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-[#22D3EE] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            <span>Curated Engineering Demonstrations</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Engineering Demonstrations & Proof Mode
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed font-sans">
            Inspect live engineering simulations, telemetry pipelines, and machine learning models built by Asish Oliver M. Every demonstration features a 60-second guided showcase and an unredacted 6-layer Engineering Proof Inspector backed by verified project source code.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link
              href="/?mode=explore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D71D35] hover:bg-[#b01428] text-white font-mono text-xs font-bold transition-all shadow-md"
            >
              <Box className="w-4 h-4" />
              <span>EXPLORE 3D CAMPUS</span>
            </Link>
            <Link
              href="/recruiter"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1f242c] hover:bg-[#282f3a] text-zinc-200 border border-zinc-700 font-mono text-xs transition-colors"
            >
              <span>RECRUITER BRIEFING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* 3 Showcase Experiences Cards */}
        <section aria-labelledby="showcases-heading" className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 id="showcases-heading" className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#22D3EE]" />
              <span>Flagship Engineering Experiences</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">3 DIRECT DEEP ROUTES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <article
                key={exp.id}
                className="bg-[#171A20] border border-[#C8CDD2]/25 hover:border-[#C8CDD2]/60 rounded-xl p-5 flex flex-col justify-between transition-all shadow-xl group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/30">
                      {exp.badge}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>~{exp.estimatedDurationSec}s</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#22D3EE] transition-colors leading-snug">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {exp.subtitle}
                  </p>

                  {/* Top Metric */}
                  <div className="bg-[#121418] border border-zinc-800 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 text-[11px]">{exp.keyMetrics[0].label}:</span>
                    <span className="text-white font-bold">{exp.keyMetrics[0].value}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <Link
                    href={`/experience/${exp.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#D71D35] hover:bg-[#b01428] text-white font-mono text-xs font-bold transition-all shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>LAUNCH SHOWCASE</span>
                  </Link>

                  <Link
                    href={`/experience/${exp.slug}/evidence`}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#252b36] text-zinc-300 hover:text-white font-mono text-xs border border-zinc-700 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>INSPECT 6-LAYER PROOF</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Existing Career Trajectory & Quest Archive */}
        <section aria-labelledby="career-heading" className="space-y-6 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 id="career-heading" className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <span>Career Trajectory & Project Portfolio</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">STRICT ACCREDITATION</span>
          </div>

          <div className="space-y-6">
            {experience.map((item, idx) => (
              <article
                key={item.id || idx}
                className="bg-[#171A20] border border-[#C8CDD2]/20 rounded-xl p-6 font-mono space-y-4 hover:border-[#D71D35]/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <div className="text-[10px] font-mono text-[#D71D35] uppercase font-bold">
                      ROLE {String(idx + 1).padStart(2, "0")} &bull; {item.organization}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      {item.role}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded bg-[#121418] text-zinc-300 border border-zinc-800 self-start sm:self-auto">
                    {item.period}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Core Technical Focus Areas:</span>
                  <ul className="space-y-1.5 text-xs text-zinc-300 pl-4 list-disc font-sans">
                    {item.focus.map((point: string, fIdx: number) => (
                      <li key={fIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
