"use client";


import { gameplayBlocked, typingTarget } from "@/lib/frontier/input";
import React, { useEffect, useState, useCallback } from "react";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { useSettingsStore } from "@/state/settingsStore";
import { facilities, getFacilityById } from "@/data/facilities";
import { ProjectDirectory } from "./ProjectDirectory";
import { StationModal } from "./StationModal";
import { ProfileModal } from "../profile/ProfileModal";
import { AdvancementToasts } from "./AdvancementToasts";
import { AdvancementsModal } from "./AdvancementsModal";
import { F1DrivingHUD } from "./F1DrivingHUD";
import { DroneTourOverlay } from "./DroneTourOverlay";
import { RecruiterWalkthroughModal } from "@/components/frontier/RecruiterWalkthroughModal";
import { DeveloperDeepDiveModal } from "@/components/frontier/DeveloperDeepDiveModal";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";
import { useTrialsStore } from "@/state/trialsStore";
import { useNPCWorkforceStore } from "@/state/npcWorkforceStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useAdvancementStore } from "@/state/advancementStore";
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
  FileText,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  Video,
  PlayCircle,
  Code2,
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

function PlayerCoordinatesDisplay() {
  const playerPosition = useWorldStore((s) => s.playerPosition);
  return (
    <div className="text-zinc-400 font-mono text-[10px]">
      XYZ: {playerPosition[0].toFixed(1)} / {playerPosition[1].toFixed(1)} /{" "}
      {playerPosition[2].toFixed(1)}
    </div>
  );
}

export const WorldHUD: React.FC = () => {
  const mode = useWorldStore((s) => s.mode);
  const activeLocation = useWorldStore((s) => s.activeLocation);
  const nearbyTarget = useWorldStore((s) => s.nearbyTarget);
  const inspectProject = useWorldStore((s) => s.inspectProject);
  const closeInspection = useWorldStore((s) => s.closeInspection);
  const focusLocation = useWorldStore((s) => s.focusLocation);
  const audioEnabled = useWorldStore((s) => s.audioEnabled);
  const toggleAudio = useWorldStore((s) => s.toggleAudio);
  const deviceTier = useWorldStore((s) => s.deviceTier);
  const perspective = useWorldStore((s) => s.perspective);
  const togglePerspective = useWorldStore((s) => s.togglePerspective);
  const isDriving = useWorldStore((s) => s.isDriving);
  const f1Telemetry = useWorldStore((s) => s.f1Telemetry);
  const isDroneTourActive = useWorldStore((s) => s.isDroneTourActive);
  const startDroneTour = useWorldStore((s) => s.startDroneTour);
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
    timeOfDay,
    setTimeOfDay,
  } = useSettingsStore();

  const unlockAdvancement = useAdvancementStore((s) => s.unlockAdvancement);
  const openAdvancementsModal = useAdvancementStore((s) => s.openModal);

  const [activeSlot, setActiveSlot] = useState(0);
  const { directoryOpen, setDirectoryOpen } = useSettingsStore();
  const [showSpawnObjective, setShowSpawnObjective] = useState(true);
  const [developerDeepDiveOpen, setDeveloperDeepDiveOpen] = useState(false);
  const startRecruiterWalkthrough = useDigitalTwinStore((s) => s.startRecruiterWalkthrough);
  const missionStep = useDigitalTwinStore((s) => s.missionStep);

  useEffect(() => {
    unlockAdvancement("FIRST_FOOTPRINT");
    const timer = setTimeout(() => setShowSpawnObjective(false), 7000);
    if (typeof window !== "undefined") {
      (window as unknown as { __openStationModal: (id: string | null) => void }).__openStationModal = (id: string | null) => {
        useInteractionRegistry.getState().openStationModal(id);
      };
      (window as unknown as { __digitalTwin: typeof useDigitalTwinStore.getState }).__digitalTwin = useDigitalTwinStore.getState;
      (window as unknown as { __trials: typeof useTrialsStore.getState }).__trials = useTrialsStore.getState;
      (window as unknown as { __npcWorkforce: typeof useNPCWorkforceStore.getState }).__npcWorkforce = useNPCWorkforceStore.getState;
    }
    return () => clearTimeout(timer);
  }, [unlockAdvancement]);

  const currentFacility = activeLocation ? getFacilityById(activeLocation) : null;
  const activeQuality = resolveQualityProfile(qualityTierOverride, deviceTier);

  // Handle hotbar selection
  const selectSlot = useCallback(
    (index: number) => {
      setActiveSlot(index);
      useWorldStore.getState().setActiveHotbarSlot(index);
      useWorldStore.getState().stopDroneTour();
      worldSound.playClick();
      if (typeof document !== "undefined") (document.activeElement as HTMLElement)?.blur();
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
        if (item.facilityId === "telemetry") unlockAdvancement("TELEMETRY_UPLINK");
        if (item.facilityId === "simulation") unlockAdvancement("LAP_SOLVER");
        if (item.facilityId === "operations") unlockAdvancement("PIT_STRATEGIST");
        if (item.facilityId === "aiml") unlockAdvancement("AI_ARCHITECT");

        focusLocation(item.facilityId);
        const fac = getFacilityById(item.facilityId);
        if (fac) {
          // Land at the facility's safe approach position clear of all walls and obstacles.
          const [sx, , sz] = fac.approachPosition;
          const eyeY = getTerrainSurfaceY(sx, sz) + EYE_HEIGHT;
          setTargetTransform([sx, eyeY, sz], fac.approachLookAt);
        }
      }
    },
    [focusLocation, setTargetTransform, unlockAdvancement, setDirectoryOpen]
  );

  const handleToggleAudio = () => {
    toggleAudio();
    worldSound.toggleMute();
  };


  // Keyboard shortcuts (1-7 for hotbar, E for inspect, M for map, I for inventory, P for profile, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || typingTarget(e.target) || useWorldStore.getState().isDriving) return;
      if (gameplayBlocked() && !["Escape", "m", "M", "i", "I", "p", "P"].includes(e.key)) return;
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
        if (nearbyTarget?.action) {
          nearbyTarget.action();
        } else if (nearbyTarget?.projectSlug) {
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
      } else if (e.key === "t" || e.key === "T") {
        startDroneTour();
      } else if (e.key === "l" || e.key === "L") {
        openAdvancementsModal();
      } else if (e.key === "n" || e.key === "N") {
        const next = timeOfDay === "day" ? "sunset" : timeOfDay === "sunset" ? "night" : "day";
        setTimeOfDay(next);
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
    setDirectoryOpen,
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
    startDroneTour,
    openAdvancementsModal,
    timeOfDay,
    setTimeOfDay,
  ]);

  if (mode === "boot") return null;
  if (isDriving) return <><F1DrivingHUD {...f1Telemetry} /><StationModal /></>;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-3 md:p-5 select-none font-silkscreen text-xs">
        {/* 1. Center Crosshair (classic Minecraft style in First-Person) */}
        {mode === "explore" && perspective === "first-person" && (
          <div className="mc-crosshair" />
        )}

        {/* 2. TOP BAR */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          {/* Top-Left: Minecraft F3-style Coordinates & Biome Readout */}
          <div className="pointer-events-auto shrink-0 mc-panel-dark px-3.5 py-2.5 text-[11px] leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse inline-block" />
              <span className="font-pixel text-[9px] text-amber-300 tracking-wider">
                ASISH OLIVER M // WORLD
              </span>
            </div>
            <PlayerCoordinatesDisplay />
            <div className="text-zinc-400 text-[10px]">
              Biome: <span className="text-emerald-300">Motorsport Island</span>
            </div>
            <div className="text-zinc-400 text-[10px]">
              Camera:{" "}
              <span className="text-amber-300 font-bold uppercase">{perspective}</span>
            </div>
            {currentFacility && (
              <div className="text-zinc-300 text-[10px]">
                Facility: <span className="text-sky-300">{currentFacility.name}</span>
              </div>
            )}
            {/* Living Digital Twin Guided Mission Objective */}
            <div className="mt-1 pt-1 border-t border-zinc-800 text-[9px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
              <span className="text-zinc-400 uppercase">MISSION:</span>
              <span className="text-cyan-300 font-bold truncate max-w-[160px]">
                {missionStep === "DRIVE_OR_LOAD"
                  ? "1. Drive or Load Lap"
                  : missionStep === "INGEST_PIPELINE"
                  ? "2. Telemetry Ingestion"
                  : missionStep === "ANALYSE_FEATURES"
                  ? "3. AI Feature Extraction"
                  : missionStep === "ENGINEERING_DECISION"
                  ? "4. What-If Decision"
                  : "5. Frontier Twin Complete"}
              </span>
            </div>
          </div>

          {/* Top-Right: Controls & Quick Nav Bar */}
          <div className="pointer-events-auto hidden sm:flex min-w-0 max-w-[70%] flex-col items-end gap-1.5">
            {/* Primary Action Ribbon: Recruiter Fast-Track & Engineering Highlights */}
            <div className="flex flex-wrap justify-end items-center gap-1.5">
              <button
                onClick={() => {
                  worldSound.playClick();
                  startRecruiterWalkthrough();
                }}
                className="mc-btn px-3 py-1.5 text-[10px] flex items-center gap-1.5 text-cyan-300 hover:text-white !bg-cyan-950/80 border-cyan-400 font-bold shadow-md shadow-cyan-950/50"
                title="Recruiter Fast-Track Demonstration (2 Min)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>DEMO</span>
              </button>
              <button
                onClick={() => {
                  worldSound.playClick();
                  setDeveloperDeepDiveOpen(true);
                }}
                className="mc-btn px-3 py-1.5 text-[10px] flex items-center gap-1.5 text-purple-300 hover:text-white !bg-purple-950/80 border-purple-400 font-bold"
                title="Senior Developer Code & Architecture Inspection"
              >
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>CODE</span>
              </button>
              <a
                href="/Asish_Oliver_M_Resume.pdf"
                download="Asish_Oliver_M_Resume.pdf"
                className="mc-btn px-2.5 py-1.5 text-[10px] flex items-center gap-1.5 text-sky-300 hover:text-white !bg-sky-950/80 border-sky-400 font-bold"
                title="Download Official Resume (PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>RESUME</span>
              </a>
              <button
                onClick={() => {
                  worldSound.playClick();
                  startDroneTour();
                }}
                className="mc-btn px-2.5 py-1.5 text-[10px] flex items-center gap-1.5 text-red-300 hover:text-white !bg-red-950/80 border-red-400 font-bold"
                title="45-Second Recruiter Drone Tour (T)"
              >
                <Video className="w-3.5 h-3.5 text-red-400" />
                <span>[T] TOUR</span>
              </button>
            </div>

            {/* Secondary Navigation Row: Campus Facilities & Modals */}
            <div className="flex flex-wrap justify-end items-center gap-1">
              <button
                onClick={() => {
                  worldSound.playClick();
                  togglePerspective();
                }}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1 text-amber-300 hover:text-white"
                title="Toggle First-Person / Third-Person (V)"
              >
                <Eye className="w-3 h-3 text-amber-400" />
                <span>[V] {perspective === "first-person" ? "1ST" : "3RD"}</span>
              </button>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1 text-amber-300 hover:text-white"
                title="Personal Profile (P)"
              >
                <User className="w-3 h-3 text-amber-300" />
                <span>[P] PROFILE</span>
              </button>
              <button
                onClick={() => setDirectoryOpen(true)}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1 text-zinc-300 hover:text-white"
                title="Project Inventory (I)"
              >
                <Layers className="w-3 h-3 text-amber-300" />
                <span>[I] PROJECTS</span>
              </button>
              <button
                onClick={() => setMinimapOpen(!minimapOpen)}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1 text-zinc-300 hover:text-white"
                title="Toggle Campus Map (M)"
              >
                <MapIcon className="w-3 h-3 text-sky-300" />
                <span>[M] MAP</span>
              </button>
              <button
                onClick={() => setCommandPaletteOpen(!commandPaletteOpen)}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1 text-zinc-300 hover:text-white"
                title="Command palette ( / or Ctrl+K )"
              >
                <Search className="w-3 h-3 text-emerald-300" />
                <span>[⌘K] CMD</span>
              </button>
              <button
                onClick={() => {
                  worldSound.playClick();
                  openAdvancementsModal();
                }}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1 text-amber-300 hover:text-white !bg-amber-950/60 border-amber-500/60"
                title="Engineering Advancements (L)"
              >
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>[L] AWARDS</span>
              </button>
              <button
                onClick={() => {
                  worldSound.playClick();
                  const next = timeOfDay === "day" ? "sunset" : timeOfDay === "sunset" ? "night" : "day";
                  setTimeOfDay(next);
                }}
                className="mc-btn px-2 py-1 text-[9px] flex items-center gap-1 text-sky-200 hover:text-white"
                title="Toggle Time of Day (N)"
              >
                <span>{timeOfDay === "day" ? "☀️ DAY" : timeOfDay === "sunset" ? "🌇 DUSK" : "🌙 NIGHT"}</span>
              </button>
            </div>

            {/* Tertiary Controls Strip & Diagnostics */}
            <div className="flex flex-wrap justify-end items-center gap-1.5 text-[9px] font-mono">
              <div className="mc-panel-dark px-2 py-0.5 text-zinc-400 flex items-center gap-1.5">
                <span>WASD: Move</span>
                <span>•</span>
                <span>Space: Jump</span>
                <span>•</span>
                <span className="text-amber-400">E: Inspect</span>
              </div>
              <div
                className="mc-btn px-1.5 py-0.5 flex items-center gap-1"
                title={`Render quality — active: ${activeQuality.label}`}
              >
                <Gauge className="w-3 h-3 text-purple-300" />
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQualityTierOverride(option.value)}
                    className={`px-1 text-[8px] leading-none ${
                      qualityTierOverride === option.value
                        ? "text-purple-300 font-bold underline"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                onClick={togglePerformanceHUD}
                className="mc-btn px-1.5 py-0.5 text-[8px] flex items-center gap-1 text-zinc-400 hover:text-zinc-200"
                title="Toggle Performance HUD (F3)"
              >
                <Activity className="w-2.5 h-2.5 text-emerald-400" />
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
          <div className="chrome-interaction-prompt pointer-events-auto">
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
          <div className="frontier-hotbar pointer-events-auto flex items-center gap-1.5 p-1.5 bg-zinc-900/90 border-2 border-zinc-700 shadow-2xl">
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

      {/* F1 Driving Telemetry HUD Overlay (Track Test Drive Mode) */}
      {isDriving && <F1DrivingHUD {...f1Telemetry} />}

      {/* 45-Second Recruiter Drone Tour Broadcast Overlay */}
      {isDroneTourActive && <DroneTourOverlay />}

      {/* Minecraft Engineering Advancement Toast Toasts */}
      <AdvancementToasts />

      {/* Engineering Advancements Modal [L] */}
      <AdvancementsModal />

      {/* Recruiter Fast-Track Engineering Walkthrough Modal */}
      <RecruiterWalkthroughModal />

      {/* Senior Developer Technical Deep Dive Modal */}
      <DeveloperDeepDiveModal
        isOpen={developerDeepDiveOpen}
        onClose={() => setDeveloperDeepDiveOpen(false)}
      />
    </>
  );
};
