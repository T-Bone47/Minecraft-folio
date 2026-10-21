import React from "react";
import Link from "next/link";
import { siteIdentity } from "@/data/site";
import { Github, Linkedin, Mail, MapPin, Box, ArrowUpRight, ShieldCheck, Sparkles, Terminal } from "lucide-react";

export const PortfolioFooter: React.FC = () => {
  return (
    <footer className="border-t-4 border-[#121214] bg-[#1a1a1e] font-mono text-xs text-zinc-300 mt-20 shadow-[0_-4px_0_#000000]">
      {/* Upper Footer: Minecraft GUI Panel */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Column 1: Identity & Server Beacon (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              {/* 3D Voxel Cube */}
              <div className="w-4 h-4 bg-[#ff8000] border border-white/60 shadow-[inset_1px_1px_0_#ffb866,inset_-1px_-1px_0_#663000,1px_1px_0_#000]" />
              <span className="font-pixel text-xs sm:text-sm text-white mc-text-shadow tracking-wider">
                {siteIdentity.name}
              </span>
            </div>

            <div className="font-pixel text-[10px] text-[#00d2be] mc-text-shadow uppercase tracking-wide">
              MOTORSPORT SOFTWARE · AI / ML SYSTEMS
            </div>

            {/* Inset Statement Box */}
            <div className="mc-slot-box p-3 text-zinc-300 text-xs leading-relaxed">
              {siteIdentity.supportingStatement} Built with authentic engineering rigor, mathematical telemetry guarantees, and interactive voxel architecture.
            </div>

            <div className="flex items-center gap-2 text-[10px] text-zinc-400 pt-1">
              <span className="w-2 h-2 bg-emerald-400 border border-emerald-200 shadow-[0_0_6px_#34d399] shrink-0" />
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-pixel text-[8px] text-zinc-300 mc-text-shadow">
                TRICHY, TAMIL NADU, INDIA [10.7905° N, 78.7047° E]
              </span>
            </div>
          </div>

          {/* Column 2: World Architecture Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="font-pixel text-[10px] text-yellow-400 mc-text-shadow uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#ff8000]" />
              <span>PORTFOLIO MAP</span>
            </div>

            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <Link href="/" className="mc-item-chip px-2.5 py-1 text-[11px] block hover:text-white hover:border-[#ff8000] transition-colors">
                  &gt; Overview & Story
                </Link>
              </li>
              <li>
                <Link href="/work" className="mc-item-chip px-2.5 py-1 text-[11px] block hover:text-white hover:border-[#ff8000] transition-colors">
                  &gt; Six Canonical Systems
                </Link>
              </li>
              <li>
                <Link href="/experience" className="mc-item-chip px-2.5 py-1 text-[11px] block hover:text-white hover:border-[#ff8000] transition-colors">
                  &gt; Experience & Roles
                </Link>
              </li>
              <li>
                <Link href="/about" className="mc-item-chip px-2.5 py-1 text-[11px] block hover:text-white hover:border-[#ff8000] transition-colors">
                  &gt; Engineering Philosophy
                </Link>
              </li>
              <li>
                <Link href="/recruiter" className="mc-item-chip px-2.5 py-1 text-[11px] block text-emerald-400 hover:text-emerald-300 border-emerald-900/60 transition-colors flex items-center justify-between">
                  <span>&gt; Recruiter Fast Track</span>
                  <Sparkles className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/world" className="mc-item-chip px-2.5 py-1 text-[11px] block text-yellow-300 hover:text-white border-amber-900/60 transition-colors flex items-center justify-between">
                  <span>&gt; 3D Engineering World</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Verified Uplinks as Minecraft Buttons (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="font-pixel text-[10px] text-emerald-400 mc-text-shadow uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DIRECT UPLINKS</span>
            </div>

            <div className="space-y-2">
              <a
                href={siteIdentity.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mc-btn-stone p-2 text-[10px] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                  <span>GITHUB REPOSITORIES</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
              </a>

              <a
                href={siteIdentity.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mc-btn-stone p-2 text-[10px] flex items-center justify-between group !border-cyan-800"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-cyan-400 group-hover:text-cyan-200" />
                  <span className="text-cyan-200">LINKEDIN PROFILE</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-200" />
              </a>

              <a
                href={`mailto:${siteIdentity.social.email}`}
                className="mc-btn-emerald p-2 text-[10px] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-200" />
                  <span>DIRECT EMAIL TRANSMISSION</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-200" />
              </a>
            </div>

            <div className="mc-slot-box p-2 text-[9px] text-zinc-400 flex items-center justify-between">
              <span>ACTIVE PING RESPONSE</span>
              <span className="font-pixel text-[8px] text-emerald-400 mc-text-shadow">&lt; 24 HOURS</span>
            </div>
          </div>
        </div>

        {/* Lower Bedrock Bar */}
        <div className="pt-6 border-t-2 border-[#121214] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ff8000] border border-amber-600" />
            <span className="font-pixel text-[8px] text-zinc-400 mc-text-shadow">
              © {new Date().getFullYear()} ASISH OLIVER M
            </span>
          </div>

          <div className="font-pixel text-[8px] text-zinc-400 mc-text-shadow text-center sm:text-right">
            CHUNK GEN: DETERMINISTIC · PROTOCOL: CANONICAL F1
          </div>
        </div>
      </div>
    </footer>
  );
};
