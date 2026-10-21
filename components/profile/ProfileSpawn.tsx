"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { profileData } from "@/data/profile";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { worldSound } from "@/lib/audio";
import { ProfileModal } from "./ProfileModal";
import { VoxelEngineerAvatar } from "./VoxelEngineerAvatar";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  Mail,
  Activity,
  Cpu,
  Gauge,
  Flag,
  Radio,
  ExternalLink,
  ChevronRight,
  Zap,
  Flame,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ProfileSpawnProps {
  onEnterWorld: () => void;
}

export const ProfileSpawn: React.FC<ProfileSpawnProps> = ({ onEnterWorld }) => {
  const { finishBoot } = useWorldStore();
  const { setTargetTransform, setCameraMode } = useCameraStore();
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [rpmLevel, setRpmLevel] = useState(11); // 0 to 15 LED shift lights
  const [lightsCount, setLightsCount] = useState(5); // 0 to 5 red lights
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Dynamic F1 RPM Shift Lights simulation (8,000 - 13,000 RPM idle blip)
  useEffect(() => {
    const rpmInterval = setInterval(() => {
      setRpmLevel((prev) => {
        // fluctuate realistically between 8 and 15 LEDs
        const delta = (Math.random() - 0.45) * 3;
        const next = Math.round(prev + delta);
        return Math.max(6, Math.min(15, next));
      });
    }, 180);

    return () => clearInterval(rpmInterval);
  }, []);

  // F1 5-Red-Light Start Gantry sequence loop
  useEffect(() => {
    let step = 0;
    const gantryInterval = setInterval(() => {
      step = (step + 1) % 10;
      if (step <= 5) {
        setLightsCount(step);
        setIsLightsOut(false);
      } else if (step === 6) {
        setLightsCount(5);
        setIsLightsOut(false);
      } else {
        // Lights out!
        setLightsCount(0);
        setIsLightsOut(true);
      }
    }, 900);

    return () => clearInterval(gantryInterval);
  }, []);

  const handleEnterWorld = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("asish_world_intro_seen", "true");
    }
    worldSound.playRadioChirp();
    setTimeout(() => {
      worldSound.playF1Rev();
    }, 80);
    // Spawn player in front of the pit garage, looking into the race engineering bay
    setTargetTransform([-12, 1.65, 4], [-12, 0.5, -8]);
    setCameraMode("explore");
    finishBoot();
    onEnterWorld();
  }, [finishBoot, onEnterWorld, setCameraMode, setTargetTransform]);

  // Keyboard shortcut: Press Enter, E or P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFullProfileModal) return;

      if (e.key === "Enter" || e.key === "e" || e.key === "E") {
        e.preventDefault();
        handleEnterWorld();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setShowFullProfileModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullProfileModal, handleEnterWorld]);

  const toggleSound = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    worldSound.setMuted(nextMute);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex flex-col justify-between p-2.5 sm:p-4 md:p-5 select-none overflow-y-auto overflow-x-hidden font-sans"
        style={{ backgroundColor: "#050608", color: "#f4f4f5" }}
      >          {/* 1. VOXEL CAMPUS BACKGROUND */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#0c0f14] via-[#0a0c10] to-[#111319]"
            />
            {/* Subtle voxel-style dot grid behind the spawn panel */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 12% 12%, #ff8000 1.5px, transparent 2px), radial-gradient(circle at 88% 88%, #0aa6c4 1.5px, transparent 2px)`,
                backgroundSize: "22px 22px",
              }}
            />
            {/* Warm upper glow and cooler lower depth so the panel stays legible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-black/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
          </div>

        {/* 2. TOP FORMULA 1 PIT WALL TELEMETRY & SHIFT LIGHT GANTRY */}
        <header className="relative z-10 flex flex-col gap-1.5 border-b border-white/15 pb-2 bg-black/75 backdrop-blur-md px-3 sm:px-4 py-2 border-l-4 border-l-[#ff8000] shadow-2xl">
          {/* Top Row: F1 Steering Wheel RPM Shift Light Array */}
          <div className="flex items-center justify-between">
            {/* Left Brand Badge */}
            <div className="flex items-center gap-2 sm:gap-3">                  <span className="px-2.5 py-0.5 bg-[#ff8000] text-black font-black text-[11px] font-mono tracking-wider shadow-[0_0_12px_rgba(255,128,0,0.7)] flex items-center gap-1">
                <span>ASISH</span>
                <span className="text-black/70">ENG</span>
              </span>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-white tracking-wider">
                <span className="text-white">{profileData.name}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-[#00d2be]">RACE PIT WALL</span>
              </div>
            </div>

            {/* Center F1 Steering Wheel RPM Shift Lights */}
            <div className="flex items-center gap-1 px-3 py-1 bg-zinc-950/90 border border-zinc-800 rounded-sm shadow-inner">
              <span className="text-[8px] font-mono text-zinc-400 font-bold mr-1 hidden md:inline">RPM:</span>
              {/* 5 Green Shift LEDs */}
              {[...Array(5)].map((_, i) => (
                <span
                  key={`g-${i}`}
                  className={`w-2 h-2.5 rounded-[1px] transition-colors ${
                    rpmLevel > i
                      ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                      : "bg-emerald-950/40 border border-emerald-900/50"
                  }`}
                />
              ))}
              {/* 5 Red Shift LEDs */}
              {[...Array(5)].map((_, i) => (
                <span
                  key={`r-${i}`}
                  className={`w-2 h-2.5 rounded-[1px] transition-colors ${
                    rpmLevel > i + 5
                      ? "bg-red-500 shadow-[0_0_6px_#ef4444]"
                      : "bg-red-950/40 border border-red-900/50"
                  }`}
                />
              ))}
              {/* 5 Blue Shift LEDs (Optimal Shift Point) */}
              {[...Array(5)].map((_, i) => (
                <span
                  key={`b-${i}`}
                  className={`w-2 h-2.5 rounded-[1px] transition-colors ${
                    rpmLevel > i + 10
                      ? "bg-sky-400 shadow-[0_0_8px_#38bdf8]"
                      : "bg-sky-950/40 border border-sky-900/50"
                  }`}
                />
              ))}
              <span className="text-[9px] font-mono text-sky-300 font-bold ml-1.5 hidden sm:inline">
                {(8200 + rpmLevel * 310).toLocaleString()} RPM
              </span>
            </div>

            {/* Right: Sound Toggle & Quick Status */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSound}
                aria-label={isAudioMuted ? "Unmute pit audio" : "Mute pit audio"}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#ff8000]" />}
              </button>
              <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/90 px-2.5 py-0.5 border border-emerald-600/80 text-emerald-400 text-[10px] font-mono font-bold">
                <Flag className="w-3 h-3 text-emerald-400" />
                <span>FIA: TRACK CLEAR</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Live F1 Track Telemetry Ticker */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 border-t border-zinc-800/80 pt-1.5">
            <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none py-0.5">
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-zinc-500">CIRCUIT:</span>
                <strong className="text-white">ASISH MOTORSPORT PARK</strong>
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-zinc-500">TRACK:</span>
                <strong className="text-amber-400">38.4°C</strong>
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-zinc-500">AIR:</span>
                <strong className="text-white">27.1°C</strong>
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-zinc-500">TIRES:</span>
                <strong className="text-yellow-400">PIRELLI P-ZERO C3</strong>
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-zinc-500">DRS:</span>
                <strong className="text-emerald-400">AVAILABLE</strong>
              </span>
            </div>

            <div className="hidden md:block text-[10px] font-mono text-zinc-400 italic">
              &ldquo;Engineering ideas into real systems.&rdquo;
            </div>
          </div>
        </header>

        {/* 3. MAIN COCKPIT: LEFT DRIVER/ENGINEER PASS + RIGHT PIT WALL TELEMETRY */}
        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 my-auto py-3 items-start">
          {/* LEFT COLUMN: FIA FORMULA 1 PADDOCK & CREDENTIAL PASS (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-2.5 max-w-xl">
            {/* Bespoke Voxel Engineer Avatar — present next to identity */}
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0">
              <div className="absolute inset-0 bg-[#1b1d21] border border-[#3a3e44] shadow-[4px_4px_0_#000] overflow-hidden" />
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 30% 30%, #ff7a00 2px, transparent 3px), radial-gradient(circle at 70% 70%, #0aa6c4 2px, transparent 3px)`, backgroundSize: "10px 10px" }} />
              <Image
                src={profileData.avatar.src}
                alt={profileData.avatar.alt}
                width={80}
                height={96}
                className="w-full h-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
              />
              <div className="absolute bottom-0.5 left-0.5 bg-black/80 px-1 border border-[#ff8000]/60 text-[7px] font-pixel text-[#ff8000] uppercase tracking-wider">
                ASISH-07
              </div>
            </div>

            {/* Header Tag */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-[#ff8000]/25 to-black border-l-4 border-l-[#ff8000] border-y border-r border-white/10 text-[10px] font-mono text-[#ff8000] font-bold tracking-widest uppercase">
              <span>🏎️</span>
              <span>FORMULA 1 TELEMETRY & AI SYSTEMS ARCHITECTURE</span>
            </div>

            {/* Giant Motorsport Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tight text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,1)] flex items-baseline gap-2">
                <span>{profileData.name}</span>
                <span className="text-xs font-mono not-italic text-[#ff8000] font-black tracking-widest bg-black/80 px-2 py-0.5 border border-[#ff8000]/80">
                  #47
                </span>
              </h1>
              <div className="text-xs sm:text-sm font-bold text-[#00d2be] font-mono tracking-wider mt-1 uppercase flex items-center gap-2">
                <span>MOTORSPORT SOFTWARE ENGINEER</span>
                <span className="text-zinc-500">·</span>
                <span>AI / ML SYSTEMS</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed mt-2 max-w-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Building high-performance motorsport software, vehicle physics simulation solvers, real-time pit telemetry pipelines, and predictive AI systems for competitive engineering impact.
              </p>
            </div>

            {/* Paddock Location & Engineering Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {/* Location Card */}
              <div className="p-2.5 bg-black/75 backdrop-blur-md border border-zinc-700/80 shadow-2xl hover:border-[#ff8000] transition-colors group">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>LOCATION BASE</span>
                </div>
                <div className="text-white font-bold group-hover:text-[#ff8000] transition-colors">
                  {profileData.location.display}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  GPS: 10.7905° N, 78.7047° E
                </div>
              </div>

              {/* Education Card */}
              <div className="p-2.5 bg-black/75 backdrop-blur-md border border-zinc-700/80 shadow-2xl hover:border-[#ff8000] transition-colors group">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-[#ff8000] shrink-0" />
                  <span>ACADEMIC CREDENTIALS</span>
                </div>
                <div className="text-white font-bold group-hover:text-[#ff8000] transition-colors">
                  {profileData.education.institution}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Integrated M.Tech · Computer Science & Engineering
                </div>
              </div>
            </div>

            {/* Current Active Engagements */}
            <div className="p-3 bg-black/75 backdrop-blur-md border border-zinc-700/80 shadow-2xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 border-b border-zinc-800 pb-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span>CURRENT MOTORSPORT & AI ENGAGEMENTS</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 border border-emerald-700">
                  VERIFIED ACTIVE
                </span>
              </div>
              <div className="space-y-1.5 font-mono">
                {profileData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-zinc-950/80 p-2 border border-zinc-800 hover:border-zinc-600 transition-colors"
                  >
                    <div>
                      <div className="text-white font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-[#ff8000] rounded-sm" />
                        <span>{exp.company}</span>
                      </div>
                      <div className="text-[#00d2be] text-[11px] mt-0.5 pl-3.5 font-medium">
                        {exp.title}
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 border border-amber-800/60 mt-1 sm:mt-0 self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Uplink // Verified Profiles */}
            <div className="p-2.5 bg-black/75 backdrop-blur-md border border-zinc-700/80 shadow-2xl">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                <Radio className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>TELEMETRY UPLINK // VERIFIED PROFILES</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                <a
                  href={profileData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => worldSound.playClick()}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-white transition-all group"
                >
                  <Github className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                  <div className="text-left leading-none">
                    <div className="text-[8px] text-zinc-400 uppercase">GitHub</div>
                    <div className="text-[11px] text-zinc-100 font-bold">T-Bone47</div>
                  </div>
                </a>

                <a
                  href={profileData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => worldSound.playClick()}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-[#00d2be] transition-all group"
                >
                  <Linkedin className="w-4 h-4 text-[#00d2be] group-hover:text-sky-300" />
                  <div className="text-left leading-none">
                    <div className="text-[8px] text-zinc-400 uppercase">LinkedIn</div>
                    <div className="text-[10px] text-zinc-100 font-bold truncate max-w-[130px]">asish-oliver-56b</div>
                  </div>
                </a>

                <a
                  href={`mailto:${profileData.links.email}`}
                  onClick={() => worldSound.playClick()}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-400 transition-all group"
                >
                  <Mail className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                  <div className="text-left leading-none">
                    <div className="text-[8px] text-zinc-400 uppercase">Direct Email</div>
                    <div className="text-[11px] text-zinc-100 font-bold truncate max-w-[90px]">dreamteamoliver</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ASISH ENGINEERING PARK PIT WALL TELEMETRY (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-2.5 w-full lg:max-w-md ml-auto">
            {/* Live Chassis Telemetry: Voxel Single-Seater Reference */}
            <div className="p-3 bg-black/75 backdrop-blur-md border border-zinc-700/80 shadow-2xl font-mono text-[10px]">
              <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-1 mb-2">
                <span className="font-bold text-[#ff8000] flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#ff8000]" />
                  <span>LIVE CHASSIS TELEMETRY // VOXEL CAMPUS</span>
                </span>
                <span className="text-zinc-400 text-[9px]">ASISH-07</span>
              </div>

              {/* Speed & Throttle/Brake G-Force */}
              <div className="grid grid-cols-2 gap-2 text-zinc-300 mb-2.5">
                <div className="bg-zinc-950/80 p-1.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[8px] uppercase">SPEED TRAP</span>
                  <span className="text-white text-sm font-black text-sky-400">334.8 KM/H</span>
                </div>
                <div className="bg-zinc-950/80 p-1.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[8px] uppercase">ENGINE SPEC</span>
                  <span className="text-white font-bold">1.6L V6 TURBO-HYBRID</span>
                </div>
              </div>

              {/* Live Throttle & Brake Traces */}
              <div className="space-y-1.5 bg-zinc-950/80 p-2 border border-zinc-800 mb-2">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-emerald-400 font-bold">THROTTLE (98.5%)</span>
                  <div className="w-32 bg-zinc-900 h-2 rounded-sm overflow-hidden border border-zinc-800">
                    <div className="bg-emerald-400 h-full w-[98%]" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-red-400 font-bold">BRAKE (0.0%)</span>
                  <div className="w-32 bg-zinc-900 h-2 rounded-sm overflow-hidden border border-zinc-800">
                    <div className="bg-red-500 h-full w-[0%]" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-amber-400 font-bold">ERS HYBRID DEPLOYMENT</span>
                  <div className="w-32 bg-zinc-900 h-2 rounded-sm overflow-hidden border border-zinc-800">
                    <div className="bg-amber-400 h-full w-[88%]" />
                  </div>
                </div>
              </div>

              {/* 4-Corner Pirelli Tire Thermal Matrix */}
              <div className="border border-zinc-800 bg-zinc-950/80 p-2">
                <div className="flex items-center justify-between text-[9px] text-zinc-400 mb-1">
                  <span>PIRELLI TIRE THERMAL MATRIX</span>
                  <span className="text-yellow-400 font-bold">OPTIMAL WINDOW</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-[9px]">
                  <div className="bg-emerald-950/50 border border-emerald-700/60 py-1">
                    <span className="text-zinc-400 block text-[8px]">FL TIRE</span>
                    <strong className="text-emerald-300">102°C</strong>
                  </div>
                  <div className="bg-emerald-950/50 border border-emerald-700/60 py-1">
                    <span className="text-zinc-400 block text-[8px]">FR TIRE</span>
                    <strong className="text-emerald-300">104°C</strong>
                  </div>
                  <div className="bg-emerald-950/50 border border-emerald-700/60 py-1">
                    <span className="text-zinc-400 block text-[8px]">RL TIRE</span>
                    <strong className="text-emerald-300">98°C</strong>
                  </div>
                  <div className="bg-emerald-950/50 border border-emerald-700/60 py-1">
                    <span className="text-zinc-400 block text-[8px]">RR TIRE</span>
                    <strong className="text-emerald-300">100°C</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Engineering Focus Disciplines */}
            <div className="p-2.5 bg-black/75 backdrop-blur-md border border-zinc-700/80 shadow-2xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 uppercase tracking-wider mb-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Cpu className="w-3.5 h-3.5 text-[#ff8000]" />
                  <span>ENGINEERING DISCIPLINES</span>
                </div>
                <span className="text-[9px] font-mono text-[#ff8000]">6 DOMAINS</span>
              </div>
              <div className="grid grid-cols-2 gap-1 font-mono">
                {profileData.focusAreas.map((focus, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-[9px] text-zinc-200 flex items-center gap-1.5 hover:border-[#ff8000] hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-sm bg-[#ff8000]" />
                    <span className="truncate font-semibold">{focus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Availability Meters */}
            <div className="p-2.5 bg-black/75 backdrop-blur-md border border-zinc-700/80 shadow-2xl font-mono text-[10px]">
              <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
                <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SYSTEM AVAILABILITY</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ALL SYSTEMS ONLINE</span>
                </div>
              </div>

              <div className="space-y-1 text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-400">SOFTWARE SYSTEMS</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">[ ▇▇▇▇▇▇▇▇▇▇ ]</span>
                    <span className="text-emerald-400 text-[8px] font-bold bg-emerald-950/80 px-1 py-0.2 border border-emerald-800/80">ONLINE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-400">SIMULATION SOLVER</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">[ ▇▇▇▇▇▇▇▇▇▇ ]</span>
                    <span className="text-emerald-400 text-[8px] font-bold bg-emerald-950/80 px-1 py-0.2 border border-emerald-800/80">ONLINE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-400">TELEMETRY PIPELINE</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">[ ▇▇▇▇▇▇▇▇▇▇ ]</span>
                    <span className="text-emerald-400 text-[8px] font-bold bg-emerald-950/80 px-1 py-0.2 border border-emerald-800/80">ONLINE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-400">AI / NEURAL ENGINE</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">[ ▇▇▇▇▇▇▇▇▇▇ ]</span>
                    <span className="text-emerald-400 text-[8px] font-bold bg-emerald-950/80 px-1 py-0.2 border border-emerald-800/80">ONLINE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-400">3D VOXEL CAMPUS</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">[ ▇▇▇▇▇▇▇▇▇▇ ]</span>
                    <span className="text-[#ff8000] text-[8px] font-bold bg-[#ff8000]/20 px-1 py-0.2 border border-[#ff8000]/80">READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 4. BOTTOM ACTION BAR: REAL F1 5-LIGHT START GANTRY & LAUNCH CTA */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2 pt-1 border-t border-white/10">
          {/* Authentic F1 5-Red-Light Start Gantry */}
          <div className="flex items-center gap-2 px-3 py-1 bg-black/90 border border-zinc-700/80 shadow-2xl rounded-sm">
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mr-1 font-bold">
              START GANTRY:
            </span>
            {/* 5 Light Columns */}
            {[1, 2, 3, 4, 5].map((idx) => {
              const isRedActive = lightsCount >= idx && !isLightsOut;
              return (
                <div key={idx} className="flex flex-col items-center gap-0.5 bg-zinc-950 p-1 border border-zinc-800">
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isRedActive
                        ? "bg-red-600 shadow-[0_0_8px_#dc2626]"
                        : "bg-red-950/30 border border-red-900/40"
                    }`}
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isRedActive
                        ? "bg-red-600 shadow-[0_0_8px_#dc2626]"
                        : "bg-red-950/30 border border-red-900/40"
                    }`}
                  />
                </div>
              );
            })}

            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />

            {/* Lights Out Status */}
            {isLightsOut ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/90 border border-emerald-500 text-emerald-400 font-mono text-[9px] font-black animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <span>LIGHTS OUT AND AWAY WE GO!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px]">
                <span>REV COUNTDOWN ({lightsCount}/5)</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl">
            {/* Primary Action Button: Launch / Enter Engineering World as Minecraft Gold Button */}
            <button
              onClick={handleEnterWorld}
              className="flex-1 py-3 px-7 text-center mc-btn-gold text-xs sm:text-sm font-pixel text-white flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto uppercase tracking-wider group shadow-[0_0_24px_rgba(255,128,0,0.6)]"
            >
              <Zap className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>ENTER 3D WORLD</span>
              <span className="text-[9px] text-yellow-200">[ ENTER ]</span>
            </button>

            {/* Secondary Action Button: Technical Dossier as Minecraft Stone Button */}
            <button
              onClick={() => {
                worldSound.playClick();
                setShowFullProfileModal(true);
              }}
              className="py-3 px-5 text-center mc-btn-stone text-xs font-pixel text-zinc-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto uppercase"
            >
              <span>DOSSIER</span>
              <span className="text-[9px] text-zinc-400">[ P ]</span>
            </button>
          </div>

          {/* 5. METADATA FOOTER */}
          <footer className="w-full flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-zinc-500 border-t border-white/5 pt-1">
            <span>FIA FORMULA 1 MOTORSPORT SPECIFICATION // ASISH OLIVER M</span>
            <span className="tracking-widest">MINECRAFT VOXEL ARCHITECTURE × F1 TELEMETRY × AI SYSTEMS</span>
          </footer>
        </div>
      </div>

      {/* Full Detailed Profile Modal Overlay */}
      <ProfileModal
        isOpen={showFullProfileModal}
        onClose={() => setShowFullProfileModal(false)}
        onEnterWorld={handleEnterWorld}
        showEnterCta={true}
      />
    </>
  );
};
