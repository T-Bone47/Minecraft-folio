"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export const PortfolioNav: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [{ href: "/visit", label: "FIELD GUIDE", icon: Box },
    { href: "/", label: "HOME", icon: Terminal },
    { href: "/work", label: "SYSTEMS & WORK", icon: Cpu },
    { href: "/experience", label: "EXPERIENCE", icon: Activity },
    { href: "/about", label: "ABOUT", icon: User },
    { href: "/contact", label: "CONTACT", icon: Mail },
  ];

  return (
    <nav className="border-b-4 border-[#121214] bg-[#222226] sticky top-0 z-40 shadow-[0_4px_0_#000000]">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between">
        {/* Brand & Minecraft Pixel Identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Animated Minecraft Voxel Block Icon */}
          <div className="w-5 h-5 bg-[#ff8000] border-2 border-white/60 shadow-[inset_1px_1px_0_#ffb866,inset_-1px_-1px_0_#663000,2px_2px_0_#000] group-hover:rotate-12 transition-transform shrink-0" />
          <div>
            <div className="font-pixel text-[11px] sm:text-xs text-white mc-text-shadow tracking-wider group-hover:text-[#ff8000] transition-colors">
              {siteIdentity.name}
            </div>
            <div className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase hidden sm:block mt-0.5">
              MOTORSPORT SOFTWARE · AI / ML
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links as Minecraft Hotbar Slots */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-[10px] font-pixel transition-all ${
                  isActive
                    ? "mc-btn-stone !bg-[#7a7a80] !border-white text-yellow-300 mc-text-shadow scale-[1.02]"
                    : "mc-btn-stone text-zinc-300 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Recruiter Fast-Track as Minecraft Emerald Button */}
          <Link
            href="/recruiter"
            className="mc-btn-emerald px-3 py-1.5 text-[10px] flex items-center gap-1.5 ml-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>RECRUITER</span>
          </Link>

          {/* Direct Resume Download */}
          <a
            href="/Asish_Oliver_M_Resume.pdf"
            download="Asish_Oliver_M_Resume.pdf"
            className="mc-btn px-2.5 py-1.5 text-[10px] font-pixel flex items-center gap-1.5 text-sky-300 hover:text-white"
            title="Download Asish Oliver M Resume (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>RESUME</span>
          </a>
        </div>

        {/* Right CTA: 3D Engineering World as Minecraft Gold/Papaya Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/world"
            className="mc-btn-gold px-3.5 sm:px-4 py-2 text-[10px] sm:text-[11px] flex items-center gap-2 shadow-[0_0_12px_rgba(255,128,0,0.5)]"
          >
            <Box className="w-4 h-4 text-white shrink-0" />
            <span className="hidden sm:inline">ENTER 3D WORLD</span>
            <span className="sm:hidden">3D WORLD</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden mc-btn-stone p-1.5"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Styled as Minecraft Inventory Grid */}
      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-[#121214] bg-[#1a1a1e] p-3 space-y-2 font-mono text-xs shadow-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between p-2.5 text-xs font-pixel transition-all ${
                  isActive
                    ? "mc-btn-stone !border-white text-yellow-300"
                    : "mc-btn-stone text-zinc-300 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                <span className="text-[9px] text-zinc-500 font-mono">GO</span>
              </Link>
            );
          })}
          <Link
            href="/recruiter"
            onClick={() => setMobileOpen(false)}
            className="mc-btn-emerald p-2.5 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>RECRUITER FAST TRACK</span>
            </div>
            <span className="text-[10px] text-emerald-200 font-mono">30s</span>
          </Link>
          <a
            href="/Asish_Oliver_M_Resume.pdf"
            download="Asish_Oliver_M_Resume.pdf"
            onClick={() => setMobileOpen(false)}
            className="mc-btn p-2.5 flex items-center justify-between text-xs text-sky-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>DOWNLOAD RESUME (PDF)</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">PDF</span>
          </a>
        </div>
      )}
    </nav>
  );
};

