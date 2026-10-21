"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { useSettingsStore } from "@/state/settingsStore";
import { facilities, getFacilityById } from "@/data/facilities";
import { ProjectDirectory } from "./ProjectDirectory";
import { StationModal } from "./StationModal";
import { ProfileModal } from "../profile/ProfileModal";
import { worldSound } from "@/lib/audio";
import { getTerrainSurfaceY } from "@/lib/terrainModel";
import {
  QUALITY_OPTIONS,
  resolveQualityProfile,
} from "@/lib/renderQuality";
import {
  Map as MapIcon,
  Activity,
  Volume2,
  VolumeX,
  Layers,
  Search,
  User,
  Gauge,
} from "lucide-react";


interface HotbarItem {
  key: string;
  label: string;
  sublabel: string;
  icon: string;
  facilityId?: string;
  isMap?: boolean;
  isDirectory?: boolean;
}

const HOTBAR_ITEMS: HotbarItem[] = [
  { key: "1", label: "TELEMETRY", sublabel: "Race Control Tower", icon: "📡", facilityId: "telemetry" },
  { key: "2", label: "SIMULATION", sublabel: "Lap-Time Solver", icon: "🧪", facilityId: "simulation" },
  { key: "3", label: "RACEMIND", sublabel: "Race Engineering Garage", icon: "🏎️", facilityId: "garage" },
  { key: "4", label: "RACE MANAGER", sublabel: "Team Operations HQ", icon: "🏁", facilityId: "operations" },
  { key: "5", label: "MAP", sublabel: "Cartographer Campus Map", icon: "🗺️", isMap: true },
  { key: "6", label: "PROJECTS", sublabel: "Canonical Inventory [I]", icon: "📁", isDirectory: true },
  { key: "7", label: "AI LAB", sublabel: "EA FC & VyaparPulse", icon: "🧠", facilityId: "aiml" },
  { key: "8", label: "HQ", sublabel: "Engineering HQ & Profile", icon: "👤", facilityId: "hq" },
];

/** Eye height above the feet, matching the first-person controller. */
const EYE_HEIGHT = 1.65;

export const WorldHUD: React.FC = () => {
  const {
    mode,
    activeLocation,
    nearbyTarget,
    inspectProject,
    closeInspection,
    focusLocation,
    audioEnabled,
    toggleAudio,
    playerPosition,
    deviceTier,
  } = useWorldStore();
  const { setTargetTransform } = useCameraStore();
  const {
    minimapOpen,
    setMinimapOpen,
    commandPaletteOpen,
    setCommandPaletteOpen,
    profileModalOpen,
    setProfileModalOpen,
    togglePerformanceHUD,
    qualityTierOverride,
    setQualityTierOverride,
  } = useSettingsStore();

  const [activeSlot, setActiveSlot] = useState(0);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [showSpawnObjective, setShowSpawnObjective] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpawnObjective(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  const currentFacility = activeLocation ? getFacilityById(activeLocation) : null;
  const activeQuality = resolveQualityProfile(qualityTierOverride, deviceTier);

  // Handle hotbar selection
  const selectSlot = useCallback(
    (index: number) => {
      setActiveSlot(index);
      worldSound.playClick();
      const item = HOTBAR_ITEMS[index];
      if (!item) return;

      if (item.isDirectory) {
        setDirectoryOpen(true);
        return;
      }

      if (item.isMap) {
        const state = useSettingsStore.getState();
        state.setMinimapOpen(!state.minimapOpen);
        return;
      }

      if (item.facilityId) {
        focusLocation(item.facilityId);
        const fac = getFacilityById(item.facilityId);
        if (fac) {
          // Stand just outside the facility's frontage and look at it. The
          // eye height comes from the terrain model so fast travel never
          // drops the player inside a hill or below the ground.
          const [fx, , fz] = fac.coordinates;
          const approachZ = fz + 4;
          const eyeY = getTerrainSurfaceY(fx, approachZ) + EYE_HEIGHT;
          setTargetTransform([fx, eyeY, approachZ], fac.coordinates);
        }
      }
    },
    [focusLocation, setTargetTransform]
  );

  const handleToggleAudio = () => {
    toggleAudio();
    worldSound.toggleMute();
  };


  // Keyboard shortcuts (1-7 for hotbar, E for inspect, M for map, I for inventory, P for profile, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Hotbar numbers 1 through 7
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= HOTBAR_ITEMS.length) {
        selectSlot(num - 1);
        return;
      }

      if (e.key === "e" || e.key === "E") {
        if (nearbyTarget?.projectSlug) {
          inspectProject(nearbyTarget.projectSlug);
        } else if (currentFacility?.projectSlug && mode !== "inspect") {
          inspectProject(currentFacility.projectSlug);
        }
      } else if (e.key === "p" || e.key === "P") {
        setProfileModalOpen(!profileModalOpen);
      } else if (e.key === "i" || e.key === "I") {
        setDirectoryOpen(!directoryOpen);
      } else if (e.key === "m" || e.key === "M") {
        setMinimapOpen(!minimapOpen);
      } else if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === "Escape") {
        if (mode === "inspect") {
          closeInspection();
        }
        if (profileModalOpen) setProfileModalOpen(false);
        if (directoryOpen) setDirectoryOpen(false);
        if (minimapOpen) setMinimapOpen(false);
        if (commandPaletteOpen) setCommandPaletteOpen(false);
      } else if (e.key === "F3") {
        e.preventDefault();
        togglePerformanceHUD();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    nearbyTarget,
    currentFacility,
    mode,
    directoryOpen,
    profileModalOpen,
    setProfileModalOpen,
    minimapOpen,
    commandPaletteOpen,
    inspectProject,
    closeInspection,
    setMinimapOpen,
    setCommandPaletteOpen,
    togglePerformanceHUD,
    selectSlot,
  ]);

  if (mode === "boot") return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-3 md:p-5 select-none font-silkscreen text-xs">
        {/* 1. Center Crosshair (classic Minecraft style) */}
        {mode === "explore" && <div className="mc-crosshair" />}

        {/* 2. TOP BAR */}
        <div className="flex items-start justify-between gap-4">
          {/* Top-Left: Minecraft F3-style Coordinates & Biome Readout */}
          <div className="pointer-events-auto mc-panel-dark px-3.5 py-2.5 text-[11px] leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse inline-block" />
              <span className="font-pixel text-[9px] text-amber-300 tracking-wider">
                ASISH OLIVER M // WORLD
              </span>
            </div>
            <div className="text-zinc-400 font-mono text-[10px]">
              XYZ: {playerPosition[0].toFixed(1)} / {playerPosition[1].toFixed(1)} /{" "}
              {playerPosition[2].toFixed(1)}
            </div>
            <div className="text-zinc-400 text-[10px]">
              Biome: <span className="text-emerald-300">Motorsport Island</span>
            </div>
            {currentFacility && (
              <div className="text-zinc-300 text-[10px]">
                Facility: <span className="text-sky-300">{currentFacility.name}</span>
              </div>
            )}
          </div>

          {/* Top-Right: Controls & Quick Nav Bar */}
          <div className="pointer-events-auto hidden sm:flex flex-col items-end gap-1.5">
            <div className="mc-panel-dark px-3 py-2 text-[10px] text-zinc-300 text-right">
              <div>WASD : Move | SPACE : Jump</div>
              <div>CLICK WORLD : Mouse Look | ESC : Unlock</div>
              <div className="text-amber-400 mt-0.5">E : Inspect | I : Inventory</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProfileModalOpen(true)}
                className="mc-btn px-2.5 py-1 text-[9px] flex items-center gap-1.5 text-amber-300 hover:text-white"
                title="Personal Profile (P)"
              >
                <User className="w-3 h-3 text-amber-300" />
                <span>[P] PROFILE</span>
              </button>
              <button
                onClick={() => setDirectoryOpen(true)}
                className="mc-btn px-2.5 py-1 text-[9px] flex items-center gap-1.5"
                title="Project Inventory (I)"
              >
                <Layers className="w-3 h-3 text-amber-300" />
                <span>[I] PROJECTS</span>
              </button>
              <button
                onClick={() => setMinimapOpen(!minimapOpen)}
                className="mc-btn px-2.5 py-1 text-[9px] flex items-center gap-1.5"
              >
                <MapIcon className="w-3 h-3 text-sky-300" />
                <span>[M] MAP</span>
              </button>
              <button
                onClick={() => setCommandPaletteOpen(!commandPaletteOpen)}
                className="mc-btn px-2.5 py-1 text-[9px] flex items-center gap-1.5"
                title="Command palette ( / or Ctrl+K )"
              >
                <Search className="w-3 h-3 text-emerald-300" />
                <span>[⌘K] CMD</span>
              </button>
              <button
                onClick={handleToggleAudio}
                className="mc-btn p-1 text-[9px]"
                title={audioEnabled ? "Audio On" : "Audio Muted"}
              >
                {audioEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
              {/* Manual render quality. The detected device tier is only a
                  guess, so visitors on capable hardware can override it. */}
              <div
                className="mc-btn px-1.5 py-1 flex items-center gap-1"
                title={`Render quality — active: ${activeQuality.label}`}
              >
                <Gauge className="w-3 h-3 text-purple-300" />
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQualityTierOverride(option.value)}
                    className={`px-1 text-[8px] leading-none ${
                      qualityTierOverride === option.value
                        ? "text-purple-300 underline"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                onClick={togglePerformanceHUD}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1"
                title="Telemetry Debug (F3)"
              >
                <Activity className="w-3 h-3" />
                <span>[F3]</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. CENTER INTERACTION TOAST / SPAWN OBJECTIVE */}
        {showSpawnObjective && !nearbyTarget && mode === "explore" && (
          <div className="self-center mb-10 pointer-events-none transition-opacity duration-1000">
            <div className="mc-panel-dark px-5 py-3 text-center border-2 border-emerald-400/80 shadow-2xl">
              <div className="font-pixel text-[9px] text-emerald-400 mb-1 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 animate-ping inline-block" />
                <span>OBJECTIVE: EXPLORE THE ENGINEERING WORLD</span>
              </div>
              <div className="text-[11px] text-zinc-300 font-mono">
                [WASD] MOVE | [SPACE] JUMP | [CLICK WORLD] MOUSE LOOK | [E] INTERACT
              </div>
            </div>
          </div>
        )}

        {nearbyTarget && mode === "explore" && (
          <div className="self-center mb-8 pointer-events-auto animate-bounce">
            <button
              onClick={() => nearbyTarget.action()}
              className="mc-panel-dark border-2 border-amber-400 px-5 py-3 text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="font-pixel text-[10px] text-amber-300 mb-1">
                [E] INTERACT / INSPECT
              </div>
              <div className="text-white text-xs uppercase font-bold tracking-wide">
                {nearbyTarget.label}
              </div>
              <div className="text-zinc-400 text-[10px] mt-0.5">
                {nearbyTarget.sublabel}
              </div>
            </button>
          </div>
        )}

        {/* 4. BOTTOM MINECRAFT HOTBAR & STATUS BARS */}
        <div className="flex flex-col items-center gap-2 pb-1">
          {/* Engineering System Availability Bar (Authentic Minecraft-styled status) */}
          <div className="flex items-center justify-between w-full max-w-sm px-2 font-mono text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 inline-block" />
              <span className="text-zinc-300 font-pixel text-[8px]">ENGINEERING STATUS:</span>
            </div>
            <div className="flex items-center gap-1 text-[9px]">
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 border border-emerald-700/60">SYS: READY</span>
              <span className="text-sky-400 font-bold bg-sky-950/80 px-1.5 py-0.5 border border-sky-700/60">SIM: READY</span>
              <span className="text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.5 border border-amber-700/60">TEL: LIVE</span>
            </div>
          </div>

          {/* System Sub-Bus Indicator */}
          <div className="w-full max-w-sm h-1.5 bg-zinc-900 border border-zinc-700 relative overflow-hidden flex items-center px-0.5 gap-1">
            <div className="h-0.5 bg-emerald-400 flex-1" />
            <div className="h-0.5 bg-sky-400 flex-1" />
            <div className="h-0.5 bg-amber-400 flex-1" />
            <div className="h-0.5 bg-purple-400 flex-1" />
          </div>

          {/* The 8-Slot Minecraft Hotbar */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-zinc-900/90 border-2 border-zinc-700 shadow-2xl">
            {HOTBAR_ITEMS.map((item, idx) => (
              <button
                key={item.key}
                onClick={() => selectSlot(idx)}
                className={`mc-slot flex flex-col items-center justify-center relative cursor-pointer ${
                  activeSlot === idx ? "mc-slot-active" : ""
                }`}
                title={`${item.label} (${item.sublabel})`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {/* Hotbar Slot Number */}
                <span className="absolute bottom-0.5 right-1 font-pixel text-[8px] text-white/90 drop-shadow">
                  {item.key}
                </span>
              </button>
            ))}
          </div>

          {/* Active Hotbar Label */}
          <div className="font-pixel text-[9px] text-amber-300 drop-shadow">
            [{HOTBAR_ITEMS[activeSlot]?.key}] {HOTBAR_ITEMS[activeSlot]?.label} —{" "}
            <span className="text-zinc-300 font-sans text-[10px]">
              {HOTBAR_ITEMS[activeSlot]?.sublabel}
            </span>
          </div>
        </div>
      </div>

      {/* Minecraft Project Inventory Directory Modal */}
      <ProjectDirectory
        isOpen={directoryOpen}
        onClose={() => setDirectoryOpen(false)}
      />

      {/* Engineering Station Interactive Modal */}
      <StationModal />

      {/* Asish Oliver M Personal Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};
