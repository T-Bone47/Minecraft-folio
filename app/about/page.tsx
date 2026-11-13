import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { siteIdentity } from "@/data/site";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import {
  User,
  Terminal,
  Zap,
  Activity,
  Cpu,
  Brain,
  Gauge,
  Box,
  ArrowRight,
  ShieldCheck,
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Asish Oliver M — Engineering Philosophy & Background",
  description:
    "Learn about Asish Oliver M's background, engineering philosophy, and focus on motorsport software, numerical simulation, and AI/ML.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />

      {/* Redstone Status Bar */}
      <RedstoneStatusBar
        status="LORE CODEX: INSCRIBED"
        location="TRICHY, TAMIL NADU, INDIA [10.7905° N, 78.7047° E]"
        badgeText="CAMPUS"
        badgeLabel="VISIT 3D WORLD"
        badgeHref="/world"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Header as Minecraft Oak Sign */}
        <header className="mc-sign p-6 sm:p-8 shadow-[0_6px_0_#000000]">
          <div className="font-pixel text-[10px] text-yellow-300 mc-text-shadow-gold uppercase tracking-wider mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>ENGINEERING BACKGROUND & INSCRIBED LORE</span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white mc-text-shadow uppercase tracking-wide leading-tight">
            About Asish Oliver M
          </h1>

          <div className="font-pixel text-xs sm:text-sm text-yellow-400 mc-text-shadow-gold mt-2 uppercase">
            MOTORSPORT SOFTWARE ENGINEER · AI / ML SYSTEMS ENGINEER
          </div>

          <p className="text-xs sm:text-sm text-[#f5eedc] font-mono leading-relaxed mt-3 max-w-3xl">
            Based in Trichy, Tamil Nadu, India. Developing high-consequence software, numerical lap simulation solvers, real-time telemetry architectures, and intelligent decision systems for engineering problems.
          </p>

          <div className="flex items-center gap-2 text-[10px] text-amber-200/90 font-pixel mt-4 pt-3 border-t border-amber-800/60 mc-text-shadow-gold">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>COORDINATES: 10.7905° N, 78.7047° E · AVAILABLE GLOBALLY</span>
          </div>
        </header>

        {/* Narrative Chapters as Minecraft Lectern / Stone Panels */}
        <div className="space-y-8 font-mono">
          {/* Chapter I: Identity */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 hover:border-[#ff8000] transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-3">
              <span className="w-2.5 h-2.5 bg-[#ff8000]" />
              <h2 className="font-pixel text-xs sm:text-sm text-white mc-text-shadow uppercase">
                CHAPTER I // WHO AM I & WHAT DRIVES MY WORK?
              </h2>
            </div>

            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 border-l-4 border-l-[#ff8000]">
              <p>
                I am an engineer driven by high-consequence technical systems. While many developers build consumer CRUD interfaces or marketing pages, I am drawn to domains where physical constraints dictate software architecture, milliseconds matter, and real-time data informs critical competitive decisions.
              </p>
              <p>
                Engineering problems are fascinating because they require extracting decisive, deterministic actions from noisy, incomplete, high-velocity data. Code, simulation physics, telemetry streams, and machine learning models are the modern instruments for solving them.
              </p>
            </div>
          </article>

          {/* Chapter II: Why Motorsport? */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 hover:border-sky-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-3">
              <span className="w-2.5 h-2.5 bg-sky-400" />
              <h2 className="font-pixel text-xs sm:text-sm text-white mc-text-shadow uppercase">
                CHAPTER II // WHY MOTORSPORT?
              </h2>
            </div>

            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 border-l-4 border-l-sky-500">
              <p>
                Motorsport is the ultimate proving ground for software systems and engineering discipline. On an F1 pit wall, there is zero tolerance for architectural hand-waving:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-sky-400 text-xs">
                <li>
                  <strong className="text-white">High Frequency & Harsh Streams:</strong> Hundreds of telemetry channels stream at 10 to 200 Hz across suspension strain, tyre thermography, hydraulic pressure, and GPS position.
                </li>
                <li>
                  <strong className="text-white">Mathematical Ground Truth:</strong> Aerodynamic drag, friction circles, and vehicle inertia are governed by physics. If your numerical lap simulator diverges, no marketing can hide it.
                </li>
                <li>
                  <strong className="text-white">Decisive Decision Loops:</strong> An undercut pit window delta calculation is useless if it takes 30 seconds to compute. It must execute deterministically in sub-second time before the car reaches the next apex.
                </li>
              </ul>
            </div>
          </article>

          {/* Chapter III: Why Software? */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 hover:border-emerald-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-3">
              <span className="w-2.5 h-2.5 bg-emerald-400" />
              <h2 className="font-pixel text-xs sm:text-sm text-white mc-text-shadow uppercase">
                CHAPTER III // WHY SOFTWARE & SIMULATION?
              </h2>
            </div>

            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 border-l-4 border-l-emerald-500">
              <p>
                Software is how engineering equations become operational reality. In my work, software is not an afterthought layer—it is the deterministic foundation that ingests UDP packets, runs quasi-steady numerical solvers, and coordinates distributed strategy simulations.
              </p>
              <p>
                I build systems with clear boundary decoupling: network packet ingestors do not touch UI rendering; numerical ODE solvers run independently of database writes; and telemetry feeds maintain mathematical guarantees regardless of consumer load.
              </p>
            </div>
          </article>

          {/* Chapter IV: Why AI/ML? */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-3">
              <span className="w-2.5 h-2.5 bg-purple-400" />
              <h2 className="font-pixel text-xs sm:text-sm text-white mc-text-shadow uppercase">
                CHAPTER IV // WHY AI & MACHINE LEARNING?
              </h2>
            </div>

            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 border-l-4 border-l-purple-500">
              <p>
                Machine learning should only be deployed where closed-form physics equations fail. For predicting non-linear tyre thermal degradation, transcribing cockpit radio through offline speech models (Vosk), or synthesizing multi-dimensional tactical options, AI provides powerful approximations.
              </p>
              <p>
                My philosophy is grounded: physics-first where physics exists, machine learning where empirical complexity demands representation learning.
              </p>
            </div>
          </article>

          {/* Chapter V: The Voxel World Philosophy */}
          <article className="mc-gui-box p-6 sm:p-8 space-y-4 hover:border-yellow-500 transition-colors">
            <div className="flex items-center gap-2 border-b-2 border-[#121214] pb-3">
              <span className="w-2.5 h-2.5 bg-yellow-400" />
              <h2 className="font-pixel text-xs sm:text-sm text-white mc-text-shadow uppercase">
                CHAPTER V // WHY THE MINECRAFT VOXEL WORLD?
              </h2>
            </div>

            <div className="mc-slot-box p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 border-l-4 border-l-yellow-500">
              <p>
                Most developer portfolios are identical: clean white or dark SaaS templates that visitors skim and forget in 15 seconds.
              </p>
              <p>
                Minecraft is the universal language of spatial exploration, block construction, and creativity. By building an interactive voxel motorsport engineering facility with circuits, telemetry towers, and lab buildings, visitors can physically inspect my projects as tangible research facilities.
              </p>
              <p className="italic text-yellow-300">
                &ldquo;Minecraft is the visual language. Motorsport is the world. Software is the infrastructure. Simulation is the laboratory. AI/ML is the intelligence layer. Engineering decisions are the purpose.&rdquo;
              </p>
            </div>
          </article>
        </div>

        {/* Bottom CTA to Experience or World */}
        <div className="mc-gui-box p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>
            <div className="font-pixel text-sm text-white mc-text-shadow">
              Ready to explore the campus?
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Walk the 3D circuit, inspect the McLaren F1 car, and trigger all 6 facilities.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/world" className="mc-btn-gold px-4 py-2.5 text-xs flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span>ENTER 3D WORLD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
