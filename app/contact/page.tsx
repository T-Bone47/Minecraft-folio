import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { siteIdentity } from "@/data/site";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Terminal,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Box,
  Radio,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Communication Uplink — Asish Oliver M",
  description:
    "Get in touch with Asish Oliver M for discussions on motorsport software engineering, F1 telemetry pipelines, and applied AI/ML systems.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#f4f4f5] font-sans selection:bg-[#ff8000] selection:text-black">
      <PortfolioNav />

      {/* Redstone Status Bar */}
      <RedstoneStatusBar
        status="REDSTONE TRANSMITTER: ACTIVE"
        location="TRICHY, TAMIL NADU, INDIA [10.7905° N, 78.7047° E]"
        badgeText="SLA"
        badgeLabel="RESPONSE < 24 HOURS"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Header as Minecraft Oak Sign */}
        <header className="mc-sign p-6 sm:p-8 shadow-[0_6px_0_#000000]">
          <div className="font-pixel text-[10px] text-yellow-300 mc-text-shadow-gold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>COMMUNICATION UPLINK & REDSTONE BEACON</span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white mc-text-shadow uppercase tracking-wide leading-tight">
            Direct Transmission
          </h1>

          <div className="font-pixel text-xs sm:text-sm text-yellow-400 mc-text-shadow-gold mt-2 uppercase">
            LET&apos;S BUILD SOMETHING USEFUL AND MATHEMATICALLY RIGOROUS
          </div>

          <p className="text-xs sm:text-sm text-[#f5eedc] font-mono leading-relaxed mt-3 max-w-3xl">
            Open to engineering inquiries, technical discussions, and collaboration opportunities in motorsport software systems, real-time telemetry pipelines, physics-based simulation, and applied AI/ML architectures.
          </p>
        </header>

        {/* 3 Interactive Minecraft Uplink Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Email */}
          <div className="mc-gui-box p-6 space-y-4 flex flex-col justify-between hover:border-emerald-400 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-emerald-950 border border-emerald-500 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-pixel text-[8px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800 mc-text-shadow">
                  PRIMARY
                </span>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-zinc-400 uppercase">
                  DIRECT INBOX
                </div>
                <div className="text-xs font-bold text-white mt-1 break-all">
                  {siteIdentity.social.email}
                </div>
              </div>
            </div>

            <a
              href={`mailto:${siteIdentity.social.email}`}
              className="mc-btn-emerald py-2.5 px-3 text-[10px] flex items-center justify-between"
            >
              <span>SEND EMAIL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* LinkedIn */}
          <div className="mc-gui-box p-6 space-y-4 flex flex-col justify-between hover:border-cyan-400 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-cyan-950 border border-cyan-500 flex items-center justify-center">
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-pixel text-[8px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 border border-cyan-800 mc-text-shadow">
                  NETWORK
                </span>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-zinc-400 uppercase">
                  LINKEDIN PROFILE
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  linkedin.com/in/asish-oliver-56b454324
                </div>
              </div>
            </div>

            <a
              href={siteIdentity.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mc-btn-stone py-2.5 px-3 text-[10px] flex items-center justify-between !border-cyan-700 text-cyan-200"
            >
              <span>CONNECT ON LINKEDIN</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* GitHub */}
          <div className="mc-gui-box p-6 space-y-4 flex flex-col justify-between hover:border-zinc-400 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-zinc-900 border border-zinc-600 flex items-center justify-center">
                  <Github className="w-4 h-4 text-zinc-300" />
                </div>
                <span className="font-pixel text-[8px] text-zinc-300 bg-zinc-900 px-2 py-0.5 border border-zinc-700 mc-text-shadow">
                  CODE
                </span>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-zinc-400 uppercase">
                  GITHUB PROFILE
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  github.com/T-Bone47
                </div>
              </div>
            </div>

            <a
              href={siteIdentity.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mc-btn-stone py-2.5 px-3 text-[10px] flex items-center justify-between"
            >
              <span>INSPECT REPOSITORIES</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Command Block Transmission Panel */}
        <section className="mc-command-block p-6 sm:p-8 space-y-4 font-mono shadow-[0_0_24px_rgba(157,113,184,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#140f1a] pb-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#9d71b8] border border-purple-300 shadow-[0_0_6px_#c084fc]" />
              <span className="font-pixel text-xs text-white mc-text-shadow">
                COMMAND BLOCK // PROTOCOL TRANSMISSION
              </span>
            </div>
            <span className="max-w-full break-all font-pixel text-[9px] text-purple-300 bg-purple-950/80 px-2 py-0.5 border border-purple-700 mc-text-shadow">
              COMMAND_BLOCK_IMPULSE
            </span>
          </div>

          <div className="mc-slot-box p-3 font-mono text-xs text-emerald-400">
            <span className="text-zinc-500">&gt; </span>
            <span>/tell @asish_oliver &quot;Inquiring about Motorsport Software Engineering &amp; Simulation Pipelines&quot;</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="mc-slot-box p-3 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-pixel">GEOGRAPHIC BASE</span>
              <div className="text-white font-semibold">Trichy, Tamil Nadu, India</div>
              <div className="text-[11px] text-zinc-400">Coordinates: 10.7905° N, 78.7047° E</div>
            </div>

            <div className="mc-slot-box p-3 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-pixel">TRANSMISSION LATENCY</span>
              <div className="text-emerald-400 font-semibold">&lt; 24 Hours Response Guarantee</div>
              <div className="text-[11px] text-zinc-400">Directly monitored inbox</div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-zinc-300 leading-relaxed">
            Preferred discussion topics: live F1 telemetry packet decoding, quasi-steady vehicle simulation algorithms, race strategy optimization algorithms, offline speech recognition, and high-performance backend systems.
          </div>
        </section>

        {/* 3D Campus Quick Link */}
        <div className="mc-gui-box p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>
            <div className="font-pixel text-sm text-white mc-text-shadow">
              Want to see the interactive campus?
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Explore the 3D motorsport circuit and visit each engineering facility.
            </div>
          </div>
          <Link href="/world" className="mc-btn-gold px-4 py-2.5 text-xs flex items-center gap-2">
            <Box className="w-4 h-4" />
            <span>ENTER 3D WORLD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
