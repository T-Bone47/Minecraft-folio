"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { profileData } from "@/data/profile";
import { worldSound } from "@/lib/audio";
import { X, ExternalLink, Mail, Github, Linkedin, MapPin, GraduationCap, Wrench, Briefcase, FileText } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterWorld?: () => void;
  showEnterCta?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onEnterWorld,
  showEnterCta = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    worldSound.playClick();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm select-none"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="mc-panel-dark w-full max-w-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 border-4 border-[#52525b] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="mc-btn absolute top-4 right-4 p-2 text-zinc-300 hover:text-white"
          title="Close Profile (Esc)"
          aria-label="Close Profile"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header with Avatar & Identity */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b-2 border-zinc-700 pb-5 mb-6">
          {/* Avatar Container with Voxel Border */}
          <div className="relative shrink-0 w-28 h-36 sm:w-32 sm:h-40 bg-[#1e1b18] border-3 border-[#ff8000]/70 shadow-lg flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#ff7a00 15%, transparent 16%), radial-gradient(#0aa6c4 15%, transparent 16%)`,
                backgroundSize: "8px 8px",
              }}
            />
            <Image
              src={profileData.avatar.src}
              alt={profileData.avatar.alt}
              width={120}
              height={150}
              className="object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)]"
              priority
            />
            <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 text-[8px] font-pixel text-[#ff8000] border border-[#ff8000]/40">
              ASISH-07
            </div>
          </div>

          {/* Identity Info */}
          <div className="text-center sm:text-left flex-1">
            <div className="font-pixel text-[9px] text-amber-400 tracking-widest uppercase mb-1">
              {profileData.metadata.discipline} {"//"} {profileData.metadata.year}
            </div>
            <h1
              id="profile-modal-title"
              className="font-pixel text-xl sm:text-2xl text-white font-bold tracking-tight mb-1"
            >
              {profileData.name}
            </h1>
            <div className="text-xs sm:text-sm font-bold text-sky-300 mb-2 font-mono">
              {profileData.roles.join(" · ")}
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed max-w-xl">
              {profileData.statement}
            </p>

            {/* Quick Meta Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>{profileData.location.display}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-amber-400" />
                <span>{profileData.education.institution}</span>
              </span>
            </div>
          </div>
        </div>

        <Link href="/avatar" className="inline-block mb-4 underline text-zinc-100">Inspect the ASISH Race Engineer in 3D →</Link>
        {/* Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Left: Experience & Education */}
          <div className="space-y-4">
            {/* Experience */}
            <div>
              <div className="flex items-center gap-1.5 font-silkscreen text-xs text-amber-400 font-bold mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>CURRENTLY BUILDING</span>
              </div>
              <div className="space-y-2.5">
                {profileData.experience.map((exp, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/90 border border-zinc-800">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-zinc-100">{exp.title}</span>
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 border border-amber-800/60">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-sky-400 mt-0.5">
                      {exp.company}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans mt-1.5 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-1.5 font-silkscreen text-xs text-sky-400 font-bold mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>EDUCATION</span>
              </div>
              <div className="p-3 bg-zinc-900/90 border border-zinc-800 font-mono text-xs">
                <div className="font-bold text-zinc-100">
                  {profileData.education.institution}
                </div>
                <div className="text-amber-400 text-[11px] mt-0.5">
                  {profileData.education.degree} — {profileData.education.specialization}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Capabilities & Systems Status */}
          <div className="space-y-4">
            {/* Focus Capabilities */}
            <div>
              <div className="flex items-center gap-1.5 font-silkscreen text-xs text-emerald-400 font-bold mb-2">
                <Wrench className="w-3.5 h-3.5" />
                <span>ENGINEERING CAPABILITIES</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {profileData.focusAreas.map((f, i) => (
                  <div
                    key={i}
                    className="p-2 bg-zinc-900/80 border border-zinc-800 font-mono text-[10px] text-zinc-200 flex items-center gap-1.5"
                  >
                    <span className="text-emerald-400 font-bold">◈</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical System Status (Availability, not fake skills!) */}
            <div>
              <div className="font-silkscreen text-xs text-zinc-300 font-bold mb-2">
                ENGINEERING AVAILABILITY
              </div>
              <div className="p-3 bg-black/60 border border-zinc-800 space-y-2 font-mono text-[11px]">
                {profileData.systemStatus.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-zinc-400">{s.system}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold tracking-tighter">
                        {"█".repeat(s.bars)}
                      </span>
                      <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950 px-1.5 py-0.2 border border-emerald-800/60">
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Links */}
            <div>
              <div className="font-silkscreen text-xs text-zinc-300 font-bold mb-2">
                VERIFIED LINKS
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={profileData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => worldSound.playClick()}
                  className="mc-btn p-2 text-center text-[10px] font-mono flex flex-col items-center justify-center gap-1 text-zinc-200 hover:text-white"
                >
                  <Github className="w-4 h-4 text-zinc-300" />
                  <span>GITHUB</span>
                </a>
                <a
                  href={profileData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => worldSound.playClick()}
                  className="mc-btn p-2 text-center text-[10px] font-mono flex flex-col items-center justify-center gap-1 text-zinc-200 hover:text-white"
                >
                  <Linkedin className="w-4 h-4 text-sky-400" />
                  <span>LINKEDIN</span>
                </a>
                <a
                  href={`mailto:${profileData.links.email}`}
                  onClick={() => worldSound.playClick()}
                  className="mc-btn p-2 text-center text-[10px] font-mono flex flex-col items-center justify-center gap-1 text-zinc-200 hover:text-white"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>EMAIL</span>
                </a>
                <a
                  href="/Asish_Oliver_M_Resume.pdf"
                  download="Asish_Oliver_M_Resume.pdf"
                  onClick={() => worldSound.playClick()}
                  className="mc-btn p-2 text-center text-[10px] font-mono flex flex-col items-center justify-center gap-1 text-sky-300 hover:text-white !bg-sky-950/60 border-sky-600"
                >
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>RESUME</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Options */}
        <div className="pt-4 border-t-2 border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[10px] font-mono text-zinc-500 text-center sm:text-left">
            ASISH OLIVER M {"//"} MOTORSPORT & AI SYSTEMS {"//"} SPAWN PROFILE
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {showEnterCta && onEnterWorld && (
              <button
                onClick={() => {
                  worldSound.playClick();
                  onEnterWorld();
                }}
                className="mc-btn mc-btn-primary w-full sm:w-auto px-6 py-2.5 text-xs font-silkscreen font-bold text-white flex items-center justify-center gap-2"
              >
                <span>▶ ENTER ENGINEERING WORLD</span>
              </button>
            )}
            <button
              onClick={handleClose}
              className="mc-btn w-full sm:w-auto px-5 py-2 text-xs font-silkscreen text-zinc-300"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
