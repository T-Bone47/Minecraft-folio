"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteIdentity } from "@/data/site";
import { profileData } from "@/data/profile";
import { projects } from "@/data/projects";
import { facilities } from "@/data/facilities";
import type { FacilityLocation } from "@/types/world";
import { experience, education } from "@/data/experience";
import {
  Terminal,
  Activity,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Mail,
  CheckCircle2,
  Compass,
  MapPin,
  Layers,
  Radio,
  ExternalLink,
  ChevronRight,
  FileText,
} from "lucide-react";

export const WorldFallback: React.FC = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("telemetry");

  const selectedFacility: FacilityLocation =
    (facilities.find((f) => f.id === selectedFacilityId) ?? facilities[0]) as FacilityLocation;

  const connectedProject = projects.find(
    (p) => p.slug === selectedFacility.projectSlug
  );

  // Map scale constants for SVG projection
  // World bounds roughly X: [-36, 36], Z: [-36, 36] mapped to 500x500 SVG
  const worldToSvg = (x: number, z: number) => {
    const svgX = ((x + 36) / 72) * 460 + 20;
    const svgY = ((z + 36) / 72) * 460 + 20;
    return { x: svgX, y: svgY };
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-[#f4f4f5] font-mono p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Fallback Notice Banner */}
      <div className="border-2 border-[#f59e0b]/40 bg-[#f59e0b]/10 p-3.5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#f59e0b] shadow-[0_4px_12px_rgba(245,158,11,0.08)]">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#f59e0b]" />
          <span className="font-bold tracking-wide">
            2D ENGINEERING WORLD MAP ACTIVE — WEBGL ACCELERATION OPTIONAL
          </span>
        </div>
        <span className="text-[10px] font-semibold bg-[#f59e0b]/20 px-2 py-0.5 border border-[#f59e0b]/30">
          ALL 6 FACILITIES OPERATIONAL
        </span>
      </div>

      {/* Header & Identity with Voxel Avatar */}
      <header className="border-b-2 border-[#27272a] pb-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2.5 text-xs text-[#3b82f6] uppercase tracking-[0.25em] mb-2 font-bold">
              <Terminal className="w-4 h-4" />
              <span>ASISH OLIVER M // ENGINEERING WORLD</span>
            </div>
            <a href="/visit" className="underline text-cyan-300">Visitor journeys, project depths and architecture exhibits</a><h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
              {profileData.name}
            </h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {profileData.roles.map((role) => (
                <span
                  key={role}
                  className="text-xs px-3 py-1 bg-[#18181b] border-2 border-[#3f3f46] text-[#e4e4e7] font-bold shadow-[2px_2px_0px_#000]"
                >
                  {role}
                </span>
              ))}
            </div>
            <p className="text-sm text-[#a1a1aa] max-w-2xl leading-relaxed mb-4">
              {profileData.statement}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717a]">
              <span>LOCATION: <strong className="text-zinc-300">{profileData.location.display}</strong></span>
              <span>•</span>
              <span>EDUCATION: <strong className="text-zinc-300">{profileData.education.institution} (M.Tech CSE)</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-[#27272a]">
              <a
                href="/Asish_Oliver_M_Resume.pdf"
                download="Asish_Oliver_M_Resume.pdf"
                className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold border border-[#38bdf8] shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>
              <a
                href={siteIdentity.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white text-xs border border-[#3f3f46] shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-colors"
              >
                <span>GITHUB</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
              <a
                href={siteIdentity.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white text-xs border border-[#3f3f46] shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-colors"
              >
                <span>LINKEDIN</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
              <a
                href={`mailto:${siteIdentity.social.email}`}
                className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-emerald-400 text-xs border border-emerald-800 shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>EMAIL</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="w-36 h-48 bg-[#18181b] border-4 border-[#3f3f46] p-2 flex items-center justify-center relative shadow-[4px_4px_0px_#000]">
              <Image
                src={profileData.avatar.src}
                alt={profileData.avatar.alt}
                width={120}
                height={160}
                className="object-contain"
                priority
              />
            </div>
            <div className="text-[10px] text-[#f59e0b] font-bold mt-2 tracking-wider">
              ASISH OLIVER M // VOXEL AVATAR
            </div>
          </div>
        </div>
      </header>

      {/* SECTION: 2D MINECRAFT-STYLE CAMPUS WORLD MAP */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs sm:text-sm uppercase tracking-widest text-[#71717a] flex items-center gap-2 font-bold">
            <Compass className="w-4 h-4 text-[#3b82f6]" />
            CAMPUS CARTOGRAPHER RADAR // 2D VOXEL WORLD LAYOUT
          </h2>
          <span className="text-[10px] text-[#71717a] hidden sm:inline-block">
            CLICK ANY FACILITY PINPOINT TO INSPECT
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#14151b] border-2 border-[#3f3f46] p-4 sm:p-6 shadow-[4px_4px_0px_#000]">
          {/* Left / Top: Interactive 2D World Map */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[500px] bg-[#1a1b23] border-2 border-[#2d2e39] overflow-hidden">
              {/* Grid Background simulating Voxel Blocks */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #4b5563 1px, transparent 1px), linear-gradient(to bottom, #4b5563 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Compass Rose */}
              <div className="absolute top-3 right-3 flex flex-col items-center text-[10px] font-bold text-[#71717a] bg-[#14151b]/80 px-2 py-1 border border-[#2d2e39]">
                <span className="text-[#ef4444]">N</span>
                <div className="flex gap-2">
                  <span>W</span>
                  <span>E</span>
                </div>
                <span>S</span>
              </div>

              {/* World Coordinates HUD */}
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#a1a1aa] bg-[#14151b]/90 px-2.5 py-1 border border-[#2d2e39]">
                <span>CAMPUS EXTENT: ~72x72 BLOCKS</span>
              </div>

              <svg
                viewBox="0 0 500 500"
                className="w-full h-full relative z-10 select-none"
              >
                {/* Circuit Track (Asphalt ribbon) */}
                <path
                  d="M 120 180 C 120 100, 360 80, 380 160 C 400 240, 390 340, 320 380 C 240 420, 160 380, 130 320 Z"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="38"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 120 180 C 120 100, 360 80, 380 160 C 400 240, 390 340, 320 380 C 240 420, 160 380, 130 320 Z"
                  fill="none"
                  stroke="#3f3f46"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Pit Lane Branch */}
                <path
                  d="M 140 160 L 140 320"
                  fill="none"
                  stroke="#52525b"
                  strokeWidth="12"
                  strokeDasharray="4 4"
                />

                {/* Cobblestone Pathways to Facilities */}
                <line
                  x1={worldToSvg(14, -18).x}
                  y1={worldToSvg(14, -18).y}
                  x2={worldToSvg(-12, -8).x}
                  y2={worldToSvg(-12, -8).y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <line
                  x1={worldToSvg(-12, -8).x}
                  y1={worldToSvg(-12, -8).y}
                  x2={worldToSvg(-22, 10).x}
                  y2={worldToSvg(-22, 10).y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <line
                  x1={worldToSvg(-22, 10).x}
                  y1={worldToSvg(-22, 10).y}
                  x2={worldToSvg(0, 24).x}
                  y2={worldToSvg(0, 24).y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <line
                  x1={worldToSvg(0, 24).x}
                  y1={worldToSvg(0, 24).y}
                  x2={worldToSvg(22, 8).x}
                  y2={worldToSvg(22, 8).y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />

                {/* Start / Finish Gantry */}
                <rect
                  x="122"
                  y="235"
                  width="36"
                  height="8"
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth="1"
                />
                <text
                  x="140"
                  y="230"
                  fill="#f4f4f5"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  START / FINISH
                </text>

                {/* Facility Node Markers */}
                {facilities.map((fac) => {
                  const pt = worldToSvg(fac.coordinates[0], fac.coordinates[2]);
                  const isSelected = fac.id === selectedFacilityId;

                  return (
                    <g
                      key={fac.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setSelectedFacilityId(fac.id)}
                    >
                      {/* Highlight Aura */}
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="22"
                          fill={fac.colorAccent}
                          opacity="0.25"
                          className="animate-pulse"
                        />
                      )}

                      {/* Voxel Square Pin */}
                      <rect
                        x={pt.x - 12}
                        y={pt.y - 12}
                        width="24"
                        height="24"
                        fill={isSelected ? fac.colorAccent : "#18181b"}
                        stroke={isSelected ? "#ffffff" : fac.colorAccent}
                        strokeWidth={isSelected ? "3" : "2"}
                        className="transition-colors"
                      />

                      {/* Pin Center Marker */}
                      <rect
                        x={pt.x - 4}
                        y={pt.y - 4}
                        width="8"
                        height="8"
                        fill={isSelected ? "#000000" : fac.colorAccent}
                      />

                      {/* Label Text */}
                      <text
                        x={pt.x}
                        y={pt.y + 24}
                        fill={isSelected ? "#ffffff" : "#a1a1aa"}
                        fontSize="9"
                        fontWeight={isSelected ? "bold" : "normal"}
                        textAnchor="middle"
                        className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      >
                        {fac.name.split("/")[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Minecraft Hotbar Selector for Quick Facility Navigation */}
            <div className="mt-4 flex flex-wrap justify-center gap-1.5 p-2 bg-[#18181b] border-2 border-[#3f3f46]">
              {facilities.map((fac, idx) => {
                const isSelected = fac.id === selectedFacilityId;
                return (
                  <button
                    key={fac.id}
                    onClick={() => setSelectedFacilityId(fac.id)}
                    className={`px-3 py-1.5 text-[11px] font-bold border transition-all ${
                      isSelected
                        ? "bg-[#2563eb] text-white border-white shadow-[2px_2px_0px_#000]"
                        : "bg-[#27272a] text-[#a1a1aa] border-[#3f3f46] hover:bg-[#3f3f46] hover:text-white"
                    }`}
                  >
                    <span className="text-[#f59e0b] mr-1">[{idx + 1}]</span>
                    {fac.code.split("/")[1]?.trim() || fac.id.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right / Bottom: Selected Facility Dossier */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t-2 lg:border-t-0 lg:border-l-2 border-[#27272a] pt-4 lg:pt-0 lg:pl-6">
            <div>
              {/* Facility Sector Badge */}
              <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
                <span className="font-bold text-[#f59e0b]">
                  {selectedFacility.code}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#a1a1aa]">
                  <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />X:{" "}
                  {selectedFacility.coordinates[0]}, Z:{" "}
                  {selectedFacility.coordinates[2]}
                </span>
              </div>

              {/* Facility Title & Tagline */}
              <h3 className="text-xl font-bold text-white mb-1">
                {selectedFacility.name}
              </h3>
              <p className="text-xs font-semibold text-[#3b82f6] mb-3">
                {selectedFacility.tagline}
              </p>
              <p className="text-xs text-[#a1a1aa] leading-relaxed mb-4">
                {selectedFacility.description}
              </p>

              {/* Discipline */}
              <div className="text-[11px] bg-[#18181b] border border-[#27272a] p-2.5 mb-4">
                <span className="text-[#71717a] block text-[9px] uppercase tracking-wider mb-0.5">
                  CORE DISCIPLINE
                </span>
                <span className="text-[#f4f4f5] font-bold">
                  {selectedFacility.discipline}
                </span>
              </div>

              {/* Key Facility Architecture Features */}
              <div className="mb-4">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider block mb-2 font-bold">
                  FACILITY ARCHITECTURE & INSTRUMENTATION:
                </span>
                <ul className="space-y-1.5">
                  {selectedFacility.features.map((feat, i) => (
                    <li
                      key={i}
                      className="text-xs text-[#d4d4d8] flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3 text-[#3b82f6] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connected Project Verification Details */}
              {connectedProject && (
                <div className="border border-[#27272a] bg-[#0c0d12] p-3.5 mb-4">
                  <div className="flex items-center justify-between text-[10px] text-[#71717a] mb-2">
                    <span className="uppercase text-[#3b82f6] font-bold">
                      PROJECT: {connectedProject.shortTitle}
                    </span>
                    <span className="text-[#10b981] flex items-center gap-1 uppercase font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {connectedProject.status}
                    </span>
                  </div>

                  {connectedProject.metrics &&
                    connectedProject.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#27272a]">
                        {connectedProject.metrics.slice(0, 4).map((m, idx) => (
                          <div key={idx}>
                            <div className="text-xs font-bold text-white">
                              {m.value}
                            </div>
                            <div className="text-[9px] text-[#71717a] uppercase">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              {connectedProject ? (
                <Link
                  href={`/work/${connectedProject.slug}`}
                  className="w-full px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-between border-2 border-[#60a5fa] shadow-[2px_2px_0px_#000] transition-transform active:translate-y-0.5"
                >
                  <span>INSPECT SYSTEM CASE STUDY</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <a
                  href={`mailto:${siteIdentity.social.email}`}
                  className="w-full px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-between border-2 border-[#34d399] shadow-[2px_2px_0px_#000]"
                >
                  <span>CONTACT ENGINEERING HQ</span>
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMPLETE ALL 6 FACILITIES DIRECTORY */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm uppercase tracking-widest text-[#71717a] flex items-center gap-2 font-bold">
            <Cpu className="w-4 h-4 text-[#3b82f6]" />
            COMPLETE CAMPUS INVENTORY ({facilities.length} FACILITIES)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => {
            const proj = projects.find((p) => p.slug === fac.projectSlug);

            return (
              <div
                key={fac.id}
                className={`border-2 p-5 flex flex-col justify-between transition-all ${
                  fac.id === selectedFacilityId
                    ? "border-[#3b82f6] bg-[#171822] shadow-[4px_4px_0px_#2563eb]"
                    : "border-[#27272a] bg-[#121215] hover:border-[#3f3f46]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#71717a] mb-2">
                    <span className="font-bold text-[#f59e0b]">{fac.code}</span>
                    <span className="text-[10px] text-[#a1a1aa]">
                      [{fac.coordinates[0]}, {fac.coordinates[2]}]
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {fac.name}
                  </h3>
                  <div className="text-xs text-[#3b82f6] font-semibold mb-3">
                    {fac.tagline}
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed mb-4">
                    {fac.description}
                  </p>

                  {proj && proj.metrics && proj.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4 bg-[#09090b] p-2.5 border border-[#27272a]">
                      {proj.metrics.slice(0, 2).map((m, idx) => (
                        <div key={idx}>
                          <div className="text-xs font-bold text-[#3b82f6]">
                            {m.value}
                          </div>
                          <div className="text-[9px] text-[#71717a] uppercase">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-[#27272a]">
                  <button
                    onClick={() => setSelectedFacilityId(fac.id)}
                    className="flex-1 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] text-xs font-bold border border-[#3f3f46] text-center"
                  >
                    SELECT
                  </button>
                  {proj ? (
                    <Link
                      href={`/work/${proj.slug}`}
                      className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-1 border border-[#60a5fa]"
                    >
                      <span>STUDY</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <a
                      href={`mailto:${siteIdentity.social.email}`}
                      className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center gap-1 border border-[#34d399]"
                    >
                      <span>CONTACT</span>
                      <Mail className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: EXPERIENCE & EDUCATION TIMELINE WALL */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 border-t-2 border-[#27272a] pt-12">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-[#71717a] mb-4 flex items-center gap-2 font-bold">
            <Activity className="w-4 h-4 text-[#10b981]" />
            ENGINEERING TIMELINE WALL
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="border-2 border-[#27272a] bg-[#121215] p-4 shadow-[2px_2px_0px_#000]"
              >
                <div className="flex justify-between items-start text-xs text-[#3b82f6] font-bold mb-1">
                  <span>{exp.role}</span>
                  <span className="text-[#71717a] text-[10px]">
                    {exp.period}
                  </span>
                </div>
                <div className="text-xs text-white mb-2 font-semibold">
                  {exp.organization}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.focus.map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 bg-[#18181b] text-[#a1a1aa] border border-[#27272a]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-widest text-[#71717a] mb-4 font-bold">
            EDUCATION
          </h2>
          <div className="border-2 border-[#27272a] bg-[#121215] p-4 mb-6 shadow-[2px_2px_0px_#000]">
            <div className="text-xs font-bold text-white mb-1">
              {education.institution}
            </div>
            <div className="text-xs text-[#a1a1aa]">{education.program}</div>
          </div>

          <h2 className="text-sm uppercase tracking-widest text-[#71717a] mb-4 font-bold">
            ENGINEERING HQ TERMINAL
          </h2>
          <div className="border-2 border-[#27272a] bg-[#121215] p-4 flex items-center justify-between shadow-[2px_2px_0px_#000]">
            <div className="text-xs text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3b82f6]" />
              <span>{siteIdentity.social.email}</span>
            </div>
            <a
              href={`mailto:${siteIdentity.social.email}`}
              className="text-xs px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold border border-[#60a5fa] shadow-[2px_2px_0px_#000]"
            >
              TRANSMIT MESSAGE
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};



