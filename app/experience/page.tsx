import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { experience, education } from "@/data/experience";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
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
} from "lucide-react";

export const metadata: Metadata = {
  title: "Experience Trajectory & Credentials — Asish Oliver M",
  description:
    "Professional experience and engineering trajectory across motorsport race strategy, telemetry data analysis, and AI/ML systems.",
};

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />

      {/* Redstone Status Bar */}
      <div className="bg-[#18181c] border-b-2 border-[#101012] px-3 sm:px-4 py-1.5 font-mono text-[10px] text-zinc-400 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 border border-emerald-200 shadow-[0_0_6px_#34d399] shrink-0" />
          <span className="font-pixel text-[9px] text-white mc-text-shadow">CAREER QUEST LOG: VERIFIED</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">STRICT ACCREDITATION · ZERO HYPERBOLE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/recruiter" className="font-pixel text-[9px] text-emerald-400 hover:text-white mc-text-shadow flex items-center gap-1">
            <span>RECRUITER 30s SUMMARY</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Header as Minecraft Oak Sign */}
        <header className="mc-sign p-6 sm:p-8 shadow-[0_6px_0_#000000]">
          <div className="font-pixel text-[10px] text-yellow-300 mc-text-shadow-gold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>PROFESSIONAL TRAJECTORY & QUEST ARCHIVE</span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white mc-text-shadow uppercase tracking-wide leading-tight">
            Experience Trajectory
          </h1>

          <div className="font-pixel text-xs sm:text-sm text-yellow-400 mc-text-shadow-gold mt-2 uppercase">
            MOTORSPORT RACE STRATEGY · TELEMETRY ANALYSIS · APPLIED AI/ML
          </div>

          <p className="text-xs sm:text-sm text-[#f5eedc] font-mono leading-relaxed mt-3 max-w-3xl">
            Practical engineering experience at the intersection of high-frequency motorsport telemetry, deterministic lap-time simulation, and applied machine learning systems. Grounded in verifiable responsibilities, tools, and technical deliverables without inflated claims.
          </p>

          {/* Minecraft XP Progress Bar */}
          <div className="mt-6 pt-4 border-t border-amber-800/60 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-pixel text-yellow-300 mc-text-shadow-gold">
              <span>EXPERIENCE LEVEL: MOTORSPORT & AI SYSTEMS</span>
              <span className="text-[#80ff00] mc-text-shadow-green">LVL 24 [88% EXP]</span>
            </div>
            <div className="mc-xp-bar-bg h-3.5 w-full p-0.5">
              <div className="mc-xp-bar-fill h-full w-[88%]" />
            </div>
          </div>
        </header>

        {/* Experience Roles Styled as Completed Quest Cards */}
        <div className="space-y-8">
          {/* Role 01: Independent Motorsport */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 font-mono hover:border-[#ff8000] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#121214] pb-3">
              <div>
                <div className="font-pixel text-[9px] text-[#ff8000] mc-text-shadow uppercase">
                  QUEST 01 // MOTORSPORT & SIMULATION
                </div>
                <h2 className="font-pixel text-lg sm:text-2xl text-white mc-text-shadow mt-1">
                  Race & Strategy Engineer
                </h2>
                <div className="font-pixel text-xs text-yellow-400 mc-text-shadow mt-1">
                  Independent Motorsport / eSports
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
                <span className="mc-btn-gold px-2.5 py-1 text-[9px]">
                  2025 — PRESENT
                </span>
                <span className="text-[10px] text-zinc-400">Remote / Global Circuits</span>
              </div>
            </div>

            <div className="mc-slot-box p-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-[#ff8000]">
              Serving as a race and strategy engineer responsible for pre-race lap simulation, dynamic stint planning, and live in-race telemetry analysis. Translating complex numerical simulation outputs into operational decisions for drivers and team personnel under high-pressure competitive conditions.
            </div>

            {/* Inset Deliverables Slot */}
            <div className="mc-slot-box p-4 space-y-2">
              <div className="font-pixel text-[9px] text-yellow-400 mc-text-shadow uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff8000]" />
                <span>CORE TECHNICAL DELIVERABLES</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2 pl-4 list-disc marker:text-[#ff8000]">
                <li>
                  <strong className="text-white">Proprietary Lap Simulation:</strong> Modeling track-specific downforce/drag compromises, gear ratios, and fuel burn rates to establish benchmark stint lap times.
                </li>
                <li>
                  <strong className="text-white">Race Strategy Formulation:</strong> Designing multi-stop strategy matrices, undercut/overcut trigger deltas, and fuel conservation targets.
                </li>
                <li>
                  <strong className="text-white">Telemetry & Data Analysis:</strong> Ingesting UDP telemetry streams, analyzing tyre surface/core thermal deltas, and detecting driver micro-sector pace loss.
                </li>
                <li>
                  <strong className="text-white">Decision Engineering:</strong> Communicating concise, actionable strategy recommendations during safety car deployments, sudden weather shifts, and traffic re-entry.
                </li>
              </ul>
            </div>

            {/* Focus Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {experience[0]?.focus?.map((item, i) => (
                <span
                  key={i}
                  className="mc-item-chip px-2.5 py-1 text-[10px] text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>

          {/* Role 02: IGNICT */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 font-mono hover:border-emerald-500 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#121214] pb-3">
              <div>
                <div className="font-pixel text-[9px] text-emerald-400 mc-text-shadow uppercase">
                  QUEST 02 // LEADERSHIP & SYSTEM ARCHITECTURE
                </div>
                <h2 className="font-pixel text-lg sm:text-2xl text-white mc-text-shadow mt-1">
                  President & Technical Lead
                </h2>
                <div className="font-pixel text-xs text-emerald-400 mc-text-shadow mt-1">
                  IGNICT (Technical Club)
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
                <span className="mc-btn-emerald px-2.5 py-1 text-[9px]">
                  2024 — 2025
                </span>
                <span className="text-[10px] text-zinc-400">VIT-AP University</span>
              </div>
            </div>

            <div className="mc-slot-box p-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-emerald-500">
              Headed technical student organisation overseeing 500+ active student members. Directed the development of technical hackathon evaluation systems, mentored engineering student cohorts in systems programming, and coordinated technical workshops.
            </div>

            {/* Inset Deliverables Slot */}
            <div className="mc-slot-box p-4 space-y-2">
              <div className="font-pixel text-[9px] text-emerald-400 mc-text-shadow uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CORE LEADERSHIP DELIVERABLES</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2 pl-4 list-disc marker:text-emerald-400">
                <li>
                  <strong className="text-white">Technical Infrastructure:</strong> Designed and deployed automated project submission pipelines and live leaderboard platforms for student hackathons.
                </li>
                <li>
                  <strong className="text-white">Workshops & Mentorship:</strong> Conducted hands-on technical sessions covering software architecture, asynchronous systems, and collaborative Git workflows.
                </li>
                <li>
                  <strong className="text-white">Team Governance:</strong> Managed executive committee members, coordinated industry speaker symposiums, and instituted peer-review quality standards.
                </li>
              </ul>
            </div>

            {/* Focus Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {experience[1]?.focus?.map((item, i) => (
                <span
                  key={i}
                  className="mc-item-chip px-2.5 py-1 text-[10px] text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>

          {/* Academic Quest: VIT-AP University */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 font-mono hover:border-sky-500 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#121214] pb-3">
              <div>
                <div className="font-pixel text-[9px] text-sky-400 mc-text-shadow uppercase">
                  ACADEMIC DEGREE // FOUNDATIONAL COMPUTER SCIENCE
                </div>
                <h2 className="font-pixel text-lg sm:text-2xl text-white mc-text-shadow mt-1">
                  Integrated M.Tech in Computer Science & Engineering
                </h2>
                <div className="font-pixel text-xs text-sky-400 mc-text-shadow mt-1">
                  VIT-AP University, Andhra Pradesh, India
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
                <span className="mc-btn-stone px-2.5 py-1 text-[9px] text-sky-300">
                  2022 — 2027
                </span>
                <span className="text-[10px] text-zinc-400">In Progress</span>
              </div>
            </div>

            <div className="mc-slot-box p-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l-4 border-l-sky-500">
              Rigorous 5-year integrated masters curriculum bridging theoretical computer science, systems programming, numerical analysis, and machine learning foundations. Emphasis on practical software engineering and deterministic algorithms.
            </div>

            {/* Coursework Inset Slot */}
            <div className="mc-slot-box p-4 space-y-2">
              <div className="font-pixel text-[9px] text-sky-400 mc-text-shadow uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                <span>CORE ENGINEERING COURSEWORK & PROFICIENCIES</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  "Data Structures & Algorithm Design",
                  "Operating Systems & Concurrency",
                  "Database Management & Time-Series",
                  "Computer Networks & UDP/TCP Sockets",
                  "Machine Learning & Pattern Recognition",
                  "Numerical Methods & Optimization",
                ].map((course, i) => (
                  <div key={i} className="mc-item-chip p-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-400" />
                    <span className="text-zinc-200">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="mc-gui-box p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>
            <div className="font-pixel text-sm text-white mc-text-shadow">
              Looking for project evidence?
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Inspect all 6 canonical systems with full architecture diagrams and source repositories.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/work" className="mc-btn-gold px-4 py-2.5 text-xs flex items-center gap-2">
              <span>EXPLORE ALL SYSTEMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
