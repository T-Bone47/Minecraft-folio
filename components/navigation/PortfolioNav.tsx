"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteIdentity } from "@/data/site";
import {
  Box,
  Terminal,
  Cpu,
  Activity,
  User,
  Mail,
  Menu,
  X,
  Sparkles,
  FileText,
  Globe,
  Target,
  ChevronDown,
  Shield,
  Compass,
  Film,
} from "lucide-react";

export const PortfolioNav: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Primary engineering navigation links
  const primaryLinks = [
    { href: "/work", label: "SYSTEMS", icon: Cpu },
    { href: "/multiverse", label: "MULTIVERSE", icon: Globe },
    { href: "/roleforge", label: "ROLEFORGE", icon: Target },
    { href: "/experience", label: "EXPERIENCE", icon: Activity },
  ];

  // Secondary links shown directly on wide 2XL desktop (1536px+)
  const secondaryLinks = [
    { href: "/about", label: "ABOUT", icon: User },
    { href: "/contact", label: "CONTACT", icon: Mail },
  ];

  // More menu items
  const moreMenuItems = [
    { href: "/proofcast", label: "PROOFCAST", icon: Film, desc: "Interactive 60s engineering documentary" },
    { href: "/forge", label: "SYSTEMS FORGE", icon: Cpu, desc: "Executable software architecture builder" },
    { href: "/observatory", label: "LIVE PULSE", icon: Activity, desc: "5-repository GitHub observatory" },
    { href: "/", label: "HOME OVERVIEW", icon: Terminal, desc: "Portfolio summary & story" },
    { href: "/roleforge?tab=defense", label: "DEFENSE ARENA", icon: Shield, desc: "Challenge engineering claims" },
    { href: "/visit", label: "FIELD GUIDE", icon: Compass, desc: "3D campus visitor guide" },
    { href: "/about", label: "ABOUT ASISH", icon: User, desc: "Engineering philosophy & background" },
    { href: "/contact", label: "CONTACT DOSSIER", icon: Mail, desc: "Direct communication uplink" },
  ];

  return (
    <nav className="border-b-4 border-[#121214] bg-[#222226] sticky top-0 z-40 shadow-[0_4px_0_#000000]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Minecraft Pixel Identity — Fixed width, Never squished */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          {/* Animated Minecraft Voxel Block Icon */}
          <div className="w-5 h-5 bg-[#ff8000] border-2 border-white/60 shadow-[inset_1px_1px_0_#ffb866,inset_-1px_-1px_0_#663000,2px_2px_0_#000] group-hover:rotate-12 transition-transform shrink-0" />
          <div className="shrink-0">
            <div className="font-pixel text-[11px] sm:text-xs text-white mc-text-shadow tracking-wider whitespace-nowrap group-hover:text-[#ff8000] transition-colors">
              {siteIdentity.name}
            </div>
            <div className="text-[10px] font-mono text-zinc-300 tracking-wider uppercase whitespace-nowrap hidden md:block mt-0.5">
              MOTORSPORT SOFTWARE · AI / ML
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links (xl: 1280px+) — Clutter-free & Hierarchical */}
        <div className="hidden xl:flex items-center gap-1.5 font-mono text-xs">
          {primaryLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`h-8 px-2.5 text-[11px] font-pixel flex items-center justify-center transition-all ${
                  isActive
                    ? "mc-btn-stone !bg-[#7a7a80] !border-white text-yellow-300 mc-text-shadow"
                    : "mc-btn-stone text-zinc-200 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Secondary links visible on ultra-wide desktop (2xl: 1536px+) */}
          <div className="hidden 2xl:flex items-center gap-1.5">
            {secondaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`h-8 px-2.5 text-[11px] font-pixel flex items-center justify-center transition-all ${
                    isActive
                      ? "mc-btn-stone !bg-[#7a7a80] !border-white text-yellow-300 mc-text-shadow"
                      : "mc-btn-stone text-zinc-200 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* MORE Dropdown for Secondary & Deep Intel Routes */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              className={`h-8 px-2.5 text-[11px] font-pixel flex items-center gap-1.5 transition-all ${
                moreOpen
                  ? "mc-btn-stone !bg-[#7a7a80] text-yellow-300 mc-text-shadow"
                  : "mc-btn-stone text-zinc-200 hover:text-white"
              }`}
            >
              <span>MORE</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-68 mc-gui-box p-2.5 shadow-2xl z-50 border-2 border-[#52525b] space-y-1">
                <div className="px-2 py-1 text-[11px] font-pixel text-zinc-300 border-b border-zinc-800">
                  PORTFOLIO DIRECTORY
                </div>
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="block p-2 rounded hover:bg-[#2a2a30] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#ff8000] shrink-0" />
                        <span className="font-pixel text-[11px] text-white group-hover:text-yellow-300 mc-text-shadow">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-zinc-400 pl-6 mt-0.5">
                        {item.desc}
                      </div>
                    </Link>
                  );
                })}

                <div className="pt-1.5 border-t border-zinc-800">
                  <a
                    href="/Asish_Oliver_M_Resume.pdf"
                    download="Asish_Oliver_M_Resume.pdf"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2 p-2 rounded hover:bg-sky-950/60 transition-colors text-sky-200 hover:text-white"
                  >
                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="font-pixel text-[11px]">DOWNLOAD RESUME (PDF)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Recruiter Fast-Track + Enter 3D World */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Recruiter Fast-Track Button (shown on sm: 640px+) */}
          <Link
            href="/recruiter"
            className="hidden sm:flex mc-btn-emerald h-8 px-3 text-[11px] font-pixel items-center gap-1.5 shrink-0"
            title="Recruiter 30-second evidence briefing"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            <span>RECRUITER</span>
          </Link>

          {/* 3D Engineering World CTA */}
          <Link
            href="/world"
            className="mc-btn-gold h-8 px-3 sm:px-3.5 text-[11px] font-pixel flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(255,128,0,0.4)]"
            title="Launch interactive 3D voxel campus"
          >
            <Box className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="hidden md:inline">ENTER 3D WORLD</span>
            <span className="md:hidden">3D WORLD</span>
          </Link>

          {/* Menu Toggle for Screens < xl (1280px) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="xl:hidden mc-btn-stone h-8 w-8 flex items-center justify-center p-0 shrink-0"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Drawer Styled as Minecraft Inventory Grid */}
      {mobileOpen && (
        <div className="xl:hidden border-t-2 border-[#121214] bg-[#1a1a1e] p-4 space-y-3 font-mono text-xs shadow-2xl">
          <div className="text-[11px] font-pixel text-zinc-300 uppercase tracking-wider px-1">
            CANONICAL PORTALS
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/", label: "HOME", icon: Terminal },
              { href: "/proofcast", label: "PROOFCAST", icon: Film },
              { href: "/forge", label: "FORGE", icon: Cpu },
              { href: "/observatory", label: "LIVE PULSE", icon: Activity },
              { href: "/work", label: "SYSTEMS", icon: Cpu },
              { href: "/multiverse", label: "MULTIVERSE", icon: Globe },
              { href: "/roleforge", label: "ROLEFORGE", icon: Target },
              { href: "/experience", label: "EXPERIENCE", icon: Activity },
              { href: "/about", label: "ABOUT", icon: User },
              { href: "/contact", label: "CONTACT", icon: Mail },
              { href: "/visit", label: "FIELD GUIDE", icon: Compass },
            ].map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`p-2.5 text-[11px] font-pixel flex items-center gap-2 transition-all ${
                    isActive
                      ? "mc-btn-stone !border-white text-yellow-300"
                      : "mc-btn-stone text-zinc-200 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#ff8000] shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <Link
              href="/recruiter"
              onClick={() => setMobileOpen(false)}
              className="mc-btn-emerald p-2.5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span className="font-pixel text-[11px]">RECRUITER BRIEFING (30s)</span>
              </div>
              <span className="text-xs text-emerald-200 font-mono">FAST TRACK</span>
            </Link>

            <Link
              href="/roleforge?tab=defense"
              onClick={() => setMobileOpen(false)}
              className="mc-btn-stone p-2.5 flex items-center justify-between text-xs text-yellow-300"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="font-pixel text-[11px]">DEFENSE ARENA</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">VERIFY</span>
            </Link>

            <a
              href="/Asish_Oliver_M_Resume.pdf"
              download="Asish_Oliver_M_Resume.pdf"
              onClick={() => setMobileOpen(false)}
              className="mc-btn p-2.5 flex items-center justify-between text-xs text-sky-200 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="font-pixel text-[11px]">DOWNLOAD RESUME (PDF)</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">PDF</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
