import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { CURATED_ROLE_PRESETS } from "@/lib/roleforge/skillTaxonomy";
import { RoleForgeClientView } from "./RoleForgeClientView";
import {
  Target,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  GitBranch,
  FileCheck,
  CheckCircle2,
  Shield,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Frontier RoleForge — The Living Engineering Proof Compiler | Asish",
  description:
    "Transform technical job descriptions into explainable evidence graphs, verified GitHub commit citations, and adaptive 3D engineering campus missions. Zero fake ATS scores.",
};

export default function RoleForgeHubPage() {
  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <PortfolioNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 1. Hero Section */}
        <div className="max-w-4xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Target className="w-3.5 h-3.5" />
            <span>FRONTIER ROLEFORGE • LIVING PROOF COMPILER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Your Role. My Engineering. <span className="text-cyan-400">Real Proof.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Select a curated discipline or paste your team&apos;s exact technical job description.
            RoleForge deterministically extracts canonical requirements, categorizes verified evidence across public code repositories, and compiles an adaptive 3D campus mission tailored to your time budget.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/roleforge/defense"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <Shield className="w-4 h-4 text-white" />
              <span>ENTER DEFENSE ARENA 2.0</span>
            </Link>
            <Link
              href="/roleforge/passport"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              <FileText className="w-4 h-4 text-black" />
              <span>EVIDENCE PASSPORT</span>
            </Link>
            <Link
              href="/?roleforge=open"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 border border-zinc-800 transition-colors"
            >
              <span>🚀</span>
              <span>3D WORLD TERMINAL [R]</span>
            </Link>
            <Link
              href="/roleforge/review"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 border border-zinc-800 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>TECH REVIEW BOARD</span>
            </Link>
          </div>
        </div>

        {/* 2. Interactive RoleForge Operations Console */}
        <div className="mb-14 bg-[#0d0f12] border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <RoleForgeClientView />
        </div>

        {/* 3. Curated Role Presets Fast Track */}
        <div className="mb-14">
          <div className="border-b border-zinc-800 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold font-mono text-white">
                CURATED RECRUITER JOURNEYS
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Pre-compiled evidence briefs and 3D walkthroughs for senior engineering specializations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURATED_ROLE_PRESETS.map((preset) => (
              <Link
                key={preset.id}
                href={`/roleforge/role/${preset.slug}`}
                className="group bg-zinc-900/40 border border-zinc-800/80 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between transition-all hover:bg-zinc-900/80 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
                      {preset.discipline.split(",")[0]}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {preset.defaultBudget === "QUICK_90S" ? "90s Fast" : "5m Deep"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                    {preset.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="text-[10px] font-mono uppercase text-zinc-500">
                      Top Verified Competencies:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {preset.coreRequirements.slice(0, 3).map((req) => (
                        <span
                          key={req.canonicalSkillId}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300"
                        >
                          {req.skillName.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Guide: {preset.recommendedGuideNpcId.replace(/-/g, " ")}</span>
                  <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Role →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Verification Principles */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 sm:p-8">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4">
            Frontier RoleForge Verification Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400 leading-relaxed font-mono">
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero Fake ATS Scores
              </div>
              <p>
                No uncalibrated percentages or fabricated match metrics. Every capability is categorized into DIRECT, RELATED, PARTIAL, or honest NONE with human-readable rationale.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1.5">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                100% Client-Side Privacy
              </div>
              <p>
                Job specifications are parsed purely within your browser memory. No text is sent to third-party endpoints or stored on external servers.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1.5">
                <GitBranch className="w-4 h-4 text-purple-400" />
                Verifiable Git Permalinks
              </div>
              <p>
                Every direct claim cites specific repository commits, files, line ranges, and automated test commands runnable on clean machines.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}

