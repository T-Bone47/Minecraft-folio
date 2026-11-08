"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { profileData } from "@/data/profile";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { worldSound } from "@/lib/audio";
import { ProfileModal } from "./ProfileModal";
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
  FileText,
  Volume2,
  VolumeX,
  Play,
  Layers,
  Sparkles,
} from "lucide-react";

interface ProfileSpawnProps {
  onEnterWorld: () => void;
}

export const ProfileSpawn: React.FC<ProfileSpawnProps> = ({ onEnterWorld }) => {
  const { finishBoot } = useWorldStore();
  const { setTargetTransform, setCameraMode } = useCameraStore();
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [backdropMode, setBackdropMode] = useState<"panorama" | "dirt">("panorama");
  const rpmLevel = 12;
  const reducedMotion = useWorldStore(s=>s.reducedMotion);
  const [lightsCount, setLightsCount] = useState(5);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // F1 5-Red-Light Start Gantry sequence loop
  useEffect(() => {
    if (reducedMotion) return;
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
        setLightsCount(0);
        setIsLightsOut(true);
      }
    }, 900);

    return () => clearInterval(gantryInterval);
  }, [reducedMotion]);

  const handleEnterWorld = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("asish_world_intro_seen", "true");
      } catch {
        // Entering the campus remains available without preference storage.
      }
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

  // Keyboard shortcuts: Enter, Space, E -> Enter World; P -> Dossier; B -> Toggle backdrop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFullProfileModal) return;

      if (e.key === "Enter" || e.key === " " || e.key === "e" || e.key === "E") {
        e.preventDefault();
        handleEnterWorld();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setShowFullProfileModal(true);
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        setBackdropMode((prev) => (prev === "panorama" ? "dirt" : "panorama"));
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
        className={`fixed inset-0 z-50 flex flex-col justify-between p-2.5 sm:p-4 md:p-5 select-none overflow-y-auto overflow-x-hidden font-sans transition-colors duration-300 ${
          backdropMode === "dirt"
            ? "mc-dirt-bg text-[#f4f4f5]"
            : "bg-black/35 backdrop-blur-[1.5px] text-[#f4f4f5]"
        }`}
      >
        {/* Subtle vignette layer when in 3D Panorama mode so the live 3D voxel world shines through clearly */}
        {backdropMode === "panorama" && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)] z-0" />
        )}

        {/* 1. TOP HEADER: MINECRAFT OAK SIGN / TELEMETRY GANTRY */}
        <header className="relative z-10 flex flex-col gap-1.5 mc-panel-dark px-3 sm:px-4 py-2 border-2 border-[#52525b] shadow-2xl">
          <div className="flex items-center justify-between gap-2">
            {/* Left Brand Badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-1 mc-btn-gold text-white font-black text-[10px] font-pixel tracking-wider flex items-center gap-1">
                <span>ASISH ENG</span>
                <span className="text-yellow-200">#47</span>
              </span>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-white tracking-wider">
                <span className="text-white">{profileData.name}</span>
                <span className="text-zinc-500">·</span>
                <span className="text-[#00d2be]">FORMULA 1 MOTORSPORT & AI SYSTEMS</span>
              </div>
            </div>

            {/* Center F1 Steering Wheel RPM Shift Lights */}
            <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-black/80 border border-zinc-700 rounded-none shadow-inner">
              <span className="text-[8px] font-mono text-zinc-400 font-bold mr-1">DECORATIVE:</span>
              {/* 5 Green Shift LEDs */}
              {[...Array(5)].map((_, i) => (
                <span
                  key={`g-${i}`}
                  className={`w-1.5 h-2 rounded-[1px] transition-colors ${
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
                  className={`w-1.5 h-2 rounded-[1px] transition-colors ${
                    rpmLevel > i + 5
                      ? "bg-red-500 shadow-[0_0_6px_#ef4444]"
                      : "bg-red-950/40 border border-red-900/50"
                  }`}
                />
              ))}
              {/* 5 Blue Shift LEDs */}
              {[...Array(5)].map((_, i) => (
                <span
                  key={`b-${i}`}
                  className={`w-1.5 h-2 rounded-[1px] transition-colors ${
                    rpmLevel > i + 10
                      ? "bg-sky-400 shadow-[0_0_8px_#38bdf8]"
                      : "bg-sky-950/40 border border-sky-900/50"
                  }`}
                />
              ))}
              <span className="text-[9px] font-mono text-sky-300 font-bold ml-1.5">
                LIGHT BAR
              </span>
            </div>

            {/* Right: Backdrop Toggle, Audio, and Quick Launch */}
            <div className="flex items-center gap-2">
              {/* Toggle 3D Panorama vs Classic Dirt Wallpaper */}
              <button
                onClick={() => {
                  worldSound.playClick();
                  setBackdropMode((prev) => (prev === "panorama" ? "dirt" : "panorama"));
                }}
                title="Toggle between Live 3D World Panorama and Classic Minecraft Dirt Menu"
                className="mc-btn px-2 py-1 text-[9px] font-pixel flex items-center gap-1.5 text-amber-300 hover:text-white"
              >
                <Layers className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">THEME:</span>
                <span className="text-white uppercase font-bold">
                  {backdropMode === "panorama" ? "3D WORLD" : "MC DIRT"}
                </span>
              </button>

              <button
                onClick={toggleSound}
                aria-label={isAudioMuted ? "Unmute pit audio" : "Mute pit audio"}
                className="p-1 mc-btn text-zinc-300 hover:text-white"
              >
                {isAudioMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#ff8000]" />
                )}
              </button>

              <button
                onClick={handleEnterWorld}
                className="mc-btn mc-btn-primary px-3 py-1 text-[10px] font-pixel text-white flex items-center gap-1.5 animate-pulse"
                title="Enter 3D World immediately (Enter / Space)"
              >
                <Play className="w-3 h-3 text-emerald-300 fill-current" />
                <span>PLAY</span>
              </button>
            </div>
          </div>

          {/* Subheader Ticker */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 border-t border-zinc-700/80 pt-1">
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none">
              <span className="flex items-center gap-1 text-zinc-400">
                <Flag className="w-3 h-3 text-emerald-400" />
                <strong className="text-emerald-400">FICTIONAL CIRCUIT</strong>
              </span>
              <span className="text-zinc-500">|</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-zinc-500">CIRCUIT:</span>
                <strong className="text-white">ASISH MOTORSPORT PARK</strong>
              </span>
              <span className="text-zinc-500">|</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="text-zinc-500">SPEED TRAP:</span>
                <strong className="text-sky-300">SIMULATION DEMO</strong>
              </span>
            </div>

            <div className="hidden lg:block text-[9px] font-mono text-amber-300">
              [ ENTER / SPACE : PLAY ] · [ P : DOSSIER ] · [ B : TOGGLE THEME ]
            </div>
          </div>
        </header>

        {/* 2. HERO MINECRAFT TITLE SCREEN SECTION & PRIMARY CALL TO ACTION */}
        <main className="relative z-10 flex flex-col items-center justify-center my-auto py-2 px-2 text-center max-w-4xl mx-auto w-full">
          {/* Authentic Minecraft Title Banner */}
          <div className="relative mb-2 inline-block">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-pixel text-[#ffaa00] mc-text-shadow-gold tracking-wider uppercase">
              ASISH: THE ENGINEERING FRONTIER
            </h1>
            {/* Minecraft Pulsing Yellow Splash Text */}
            <div className="absolute -top-3 -right-4 sm:-right-8 z-20 pointer-events-none">
              <span className="mc-splash-text text-[9px] sm:text-[11px] md:text-xs">
                CHROME ERA ENGINEERING CAMPUS
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-mono text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] max-w-2xl mb-4 leading-relaxed">
            Motorsport Software & AI/ML Systems Engineer. Interactive 3D voxel campus showcasing
            F1 telemetry streaming, lap-time simulation solvers, and neural architectures.
          </p>

          {/* PRIMARY CALL-TO-ACTION CONTAINER — PROMINENT AND VISIBLE ON ALL SCREENS */}
          <div className="mc-panel-dark p-3 sm:p-4 border-4 border-[#71717a] shadow-2xl w-full max-w-2xl mb-3">
            {/* Minecraft XP Bar Level 47 Indicator */}
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-pixel text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>CAMPUS BADGE: 47</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-400 font-bold">
                CAMPUS: SIX ENGINEERING FACILITIES
              </span>
            </div>
            {/* XP Progress Bar */}
            <div className="w-full h-2.5 mc-xp-bar-bg rounded-none mb-3 overflow-hidden">
              <div className="h-full w-full mc-xp-bar-fill" />
            </div>

            {/* Giant Centered Gold Button: ENTER 3D WORLD */}
            <button
              onClick={handleEnterWorld}
              className="w-full py-3.5 px-6 mc-btn-gold text-sm sm:text-base font-pixel text-white flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wider group shadow-[0_0_24px_rgba(255,128,0,0.65)] hover:scale-[1.01] active:scale-[0.99] transition-transform"
            >
              <Play className="w-5 h-5 text-white fill-current group-hover:scale-110 transition-transform" />
              <span>▶ PLAY: ENTER 3D WORLD</span>
              <span className="text-[10px] text-yellow-200 font-mono bg-black/40 px-2 py-0.5 border border-yellow-400/50">
                [ ENTER ]
              </span>
            </button>

            {/* Secondary Action Buttons Row in Authentic Minecraft Stone Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 font-pixel text-[10px]">
              <button
                onClick={() => {
                  worldSound.playClick();
                  setShowFullProfileModal(true);
                }}
                className="mc-btn-stone py-2 px-2 flex items-center justify-center gap-1 text-zinc-100 hover:text-white"
                title="Open Technical Dossier (P)"
              >
                <span>DOSSIER</span>
                <span className="text-[8px] text-amber-300">[P]</span>
              </button>

              <a
                href="/Asish_Oliver_M_Resume.pdf"
                download="Asish_Oliver_M_Resume.pdf"
                onClick={() => worldSound.playClick()}
                className="mc-btn-stone py-2 px-2 flex items-center justify-center gap-1 text-sky-200 hover:text-white"
                title="Download Verified Resume (PDF)"
              >
                <FileText className="w-3 h-3 text-sky-400" />
                <span>RESUME</span>
              </a>

              <Link
                href="/work"
                onClick={() => worldSound.playClick()}
                className="mc-btn-stone py-2 px-2 flex items-center justify-center gap-1 text-emerald-200 hover:text-white"
                title="Accessible 2D Project Portfolio"
              >
                <span>2D LIST</span>
              </Link>

              <a
                href={profileData.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => worldSound.playClick()}
                className="mc-btn-stone py-2 px-2 flex items-center justify-center gap-1 text-zinc-200 hover:text-white"
                title="GitHub: T-Bone47"
              >
                <Github className="w-3 h-3" />
                <span>GITHUB</span>
              </a>
            </div>
          </div>

          {/* 3. COMPACT MINECRAFT INVENTORY CARDS (FITS COMFORTABLY IN VIEWPORT) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-3xl text-left font-mono">
            {/* Card A: Engineer Identity & Avatar */}
            <div className="mc-gui-box p-2.5 flex items-center gap-3">
              <div className="w-14 h-16 relative mc-slot-box p-1 shrink-0 bg-black/60">
                <Image
                  src={profileData.avatar.src}
                  alt={profileData.avatar.alt}
                  width={56}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 text-[11px]">
                <div className="font-pixel text-[9px] text-[#ffaa00] truncate">
                  {profileData.name}
                </div>
                <div className="text-[10px] text-zinc-300 font-bold truncate">
                  VIT-AP University
                </div>
                <div className="text-[9px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  <span>Trichy, Tamil Nadu</span>
                </div>
                <Link href="/avatar" className="underline text-zinc-100">Inspect 3D avatar →</Link>
              </div>
            </div>

            {/* Card B: Formula 1 Race Telemetry */}
            <div className="mc-gui-box p-2.5 text-[10px]">
              <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-700/80 pb-1 mb-1">
                <span className="font-bold text-[#00d2be] flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  <span>MOTORSPORT SPEC</span>
                </span>
                <span className="text-[#ff8000] font-bold">#47</span>
              </div>
              <div className="space-y-0.5 text-zinc-300 text-[9px]">
                <div>
                  <span className="text-zinc-500">SPEED:</span>{" "}
                  <strong className="text-sky-300">SIMULATION DEMO</strong>
                </div>
                <div>
                  <span className="text-zinc-500">MODEL:</span>{" "}
                  <span className="text-white">SIMPLIFIED FIXED-STEP</span>
                </div>
                <div className="truncate">
                  <span className="text-zinc-500">ROLE:</span>{" "}
                  <span className="text-amber-300">Race & Strategy Engineer</span>
                </div>
              </div>
            </div>

            {/* Card C: 6 Campus Facilities (Minecraft Hotbar Overview) */}
            <div className="mc-gui-box p-2.5 text-[10px]">
              <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-700/80 pb-1 mb-1">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>CAMPUS MAP</span>
                </span>
                <span className="text-emerald-400 font-bold">6 HUBS</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[8px] text-center font-mono">
                <span className="p-1 mc-slot-box truncate text-sky-300">📡 Telemetry</span>
                <span className="p-1 mc-slot-box truncate text-purple-300">🧪 Sim Lab</span>
                <span className="p-1 mc-slot-box truncate text-amber-300">🏎️ Garage</span>
                <span className="p-1 mc-slot-box truncate text-emerald-300">🏁 Ops HQ</span>
                <span className="p-1 mc-slot-box truncate text-rose-300">🧠 AI Lab</span>
                <span className="p-1 mc-slot-box truncate text-yellow-300">👤 HQ</span>
              </div>
            </div>
          </div>
        </main>

        {/* 4. BOTTOM ACTION BAR: REAL F1 5-LIGHT START GANTRY & FOOTER */}
        <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-white/10 text-[9px] font-mono text-zinc-400">
          {/* F1 5-Light Start Gantry */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-zinc-700 shadow-xl">
            <span className="text-[8px] text-zinc-400 font-bold">START GANTRY:</span>
            {[1, 2, 3, 4, 5].map((idx) => {
              const isRedActive = lightsCount >= idx && !isLightsOut;
              return (
                <div key={idx} className="flex flex-col items-center gap-0.5 bg-zinc-950 p-0.5 border border-zinc-800">
                  <span
                    className={`w-2 h-2 rounded-full transition-all ${
                      isRedActive
                        ? "bg-red-600 shadow-[0_0_6px_#dc2626]"
                        : "bg-red-950/30 border border-red-900/40"
                    }`}
                  />
                </div>
              );
            })}
            {isLightsOut ? (
              <span className="text-emerald-400 font-bold ml-1 animate-pulse">LIGHTS OUT!</span>
            ) : (
              <span className="text-zinc-500 ml-1">LIGHTS ({lightsCount}/5)</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span>INDEPENDENT PORTFOLIO · NO OFFICIAL F1 AFFILIATION</span>
            <span className="text-zinc-600">|</span>
            <span className="text-[#ffaa00]">ASISH OLIVER M</span>
          </div>
        </footer>
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
