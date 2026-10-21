"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/state/settingsStore";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { projects } from "@/data/projects";
import { facilities, getFacilityById } from "@/data/facilities";
import { Terminal, X, ChevronRight } from "lucide-react";


interface CommandItem {
  command: string;
  category: "NAVIGATION" | "PROJECTS" | "SYSTEMS" | "PROFILE";
  title: string;
  description: string;
  action: () => void;
}

export const WorldCommandPalette: React.FC = () => {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setMinimapOpen,
    setTimeOfDay,
    setProfileModalOpen,
  } = useSettingsStore();
  const { inspectProject, focusLocation } = useWorldStore();
  const { setTargetTransform } = useCameraStore();
  const { openStationModal } = useInteractionRegistry();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const travelTo = (facId: string, slug?: string) => {
    const fac = getFacilityById(facId);
    if (fac) {
      focusLocation(fac.id);
      setTargetTransform(
        [fac.coordinates[0], fac.coordinates[1] + 1.65, fac.coordinates[2] + 4],
        fac.coordinates
      );
    }
    if (slug) {
      inspectProject(slug);
    }
    setCommandPaletteOpen(false);
  };

  const commands: CommandItem[] = [
    // NAVIGATION
    {
      command: "/telemetry",
      category: "NAVIGATION",
      title: "TELEMETRY TOWER",
      description: "Focus Race Control & 1,067,193 canonical F1 event streams",
      action: () => travelTo("telemetry"),
    },
    {
      command: "/simulation",
      category: "NAVIGATION",
      title: "SIMULATION LAB",
      description: "Focus Vehicle Simulation Lab & G-G friction circle",
      action: () => travelTo("simulation"),
    },
    {
      command: "/racemind",
      category: "NAVIGATION",
      title: "RACE ENGINEERING GARAGE",
      description: "Focus RaceMind-AI garage & strategy board",
      action: () => travelTo("garage"),
    },
    {
      command: "/race-manager",
      category: "NAVIGATION",
      title: "TEAM OPERATIONS HQ",
      description: "Focus F1 Race Manager control center",
      action: () => travelTo("operations"),
    },
    {
      command: "/ai-lab",
      category: "NAVIGATION",
      title: "AI / ML DATA LAB",
      description: "Focus EA FC Intelligence (East) & VyaparPulse (West)",
      action: () => travelTo("aiml"),
    },
    {
      command: "/hq",
      category: "NAVIGATION",
      title: "ENGINEERING HQ",
      description: "Focus Asish Oliver M Engineering Monolith",
      action: () => travelTo("hq"),
    },
    {
      command: "/map",
      category: "NAVIGATION",
      title: "CARTOGRAPHER MAP",
      description: "Open campus 2D voxel navigation & telemetry map",
      action: () => {
        setCommandPaletteOpen(false);
        setMinimapOpen(true);
      },
    },

    // PROJECTS
    {
      command: "/live-f1",
      category: "PROJECTS",
      title: "LIVE F1 INTELLIGENCE",
      description: "Inspect distributed stream ingestion (1.06M events, 0 malformed)",
      action: () => travelTo("telemetry", "live-f1-intelligence"),
    },
    {
      command: "/simulator",
      category: "PROJECTS",
      title: "F1 LAP-TIME SIMULATOR",
      description: "Inspect numerical vehicle performance engineering solver",
      action: () => travelTo("simulation", "f1-lap-time-simulator"),
    },
    {
      command: "/racemind-ai",
      category: "PROJECTS",
      title: "RACEMIND-AI",
      description: "Inspect race engineer telemetry & stint degradation advisor",
      action: () => travelTo("garage", "racemind-ai"),
    },
    {
      command: "/f1-manager",
      category: "PROJECTS",
      title: "F1 RACE MANAGER",
      description: "Inspect browser F1 team management simulation game",
      action: () => travelTo("operations", "f1-race-manager"),
    },
    {
      command: "/ea-fc",
      category: "PROJECTS",
      title: "EA FC INTELLIGENCE",
      description: "Inspect player vector embeddings & similarity engine",
      action: () => travelTo("aiml", "ea-fc-intelligence"),
    },
    {
      command: "/vyaparpulse",
      category: "PROJECTS",
      title: "VYAPARPULSE",
      description: "Inspect Vosk voice ledger & XGBoost demand pipeline",
      action: () => travelTo("aiml", "vyaparpulse"),
    },

    // SYSTEMS
    {
      command: "/day",
      category: "SYSTEMS",
      title: "SET DAYLIGHT ATMOSPHERE",
      description: "Switch sky to clear blue daylight with warm sun",
      action: () => {
        setTimeOfDay("day");
        setCommandPaletteOpen(false);
      },
    },
    {
      command: "/sunset",
      category: "SYSTEMS",
      title: "SET SUNSET ATMOSPHERE",
      description: "Switch sky to warm golden hour dusk",
      action: () => {
        setTimeOfDay("sunset");
        setCommandPaletteOpen(false);
      },
    },
    {
      command: "/night",
      category: "SYSTEMS",
      title: "SET NIGHT ATMOSPHERE",
      description: "Switch sky to starry midnight with square moon",
      action: () => {
        setTimeOfDay("night");
        setCommandPaletteOpen(false);
      },
    },

    // PROFILE
    {
      command: "/profile",
      category: "PROFILE",
      title: "ASISH OLIVER M PROFILE",
      description: "Open personal spawn profile overlay with avatar, focus & experience",
      action: () => {
        setCommandPaletteOpen(false);
        setProfileModalOpen(true);
      },
    },
    {
      command: "/about",
      category: "PROFILE",
      title: "ABOUT ASISH OLIVER M",
      description: "Profile overview, specialization, and engineering background",
      action: () => {
        setCommandPaletteOpen(false);
        setProfileModalOpen(true);
      },
    },
    {
      command: "/experience",
      category: "PROFILE",
      title: "CAREER TIMELINE",
      description: "View verified motorsport engineering & AI positions",
      action: () => {
        setCommandPaletteOpen(false);
        openStationModal("career_wall");
      },
    },
    {
      command: "/contact",
      category: "PROFILE",
      title: "CONTACT TERMINAL",
      description: "Open verified contact channels (dreamteamoliver@gmail.com)",
      action: () => {
        setCommandPaletteOpen(false);
        openStationModal("contact");
      },
    },
    {
      command: "/recruiter",
      category: "PROFILE",
      title: "RECRUITER FAST TRACK",
      description: "Open 30-second executive dossier for recruiters and hiring managers",
      action: () => {
        setCommandPaletteOpen(false);
        router.push("/recruiter");
      },
    },
    {
      command: "/work",
      category: "NAVIGATION",
      title: "SYSTEMS & CASE STUDIES",
      description: "Browse all six canonical systems and 10-step technical narratives",
      action: () => {
        setCommandPaletteOpen(false);
        router.push("/work");
      },
    },
    {
      command: "/world",
      category: "NAVIGATION",
      title: "ENGINEERING WORLD",
      description: "Focus 3D campus first-person exploration",
      action: () => {
        setCommandPaletteOpen(false);
        router.push("/world");
      },
    },
    {
      command: "/race-manager",
      category: "PROJECTS",
      title: "F1 RACE MANAGER [GAME]",
      description: "Inspect browser F1 team management simulation game",
      action: () => travelTo("operations", "f1-race-manager"),
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.command.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev === 0 ? filtered.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4 select-none font-silkscreen">
      <div className="w-full max-w-xl mc-panel-dark border-4 border-[#52525b] shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b-2 border-zinc-700 bg-zinc-900">
          <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-pixel text-[11px] text-amber-300">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. /telemetry, /simulation, /map)..."
            className="w-full bg-transparent text-white text-xs outline-none placeholder-zinc-500 font-mono"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              Unknown command &ldquo;{query}&rdquo;. Try /telemetry, /simulation, /map.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.command}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2 flex items-center justify-between text-xs cursor-pointer border transition-colors ${
                    isSelected
                      ? "bg-amber-400/20 border-amber-400 text-white"
                      : "border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[9px] text-amber-300 shrink-0">
                      {item.command}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {item.category}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs leading-none">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t-2 border-zinc-700 bg-zinc-900 flex items-center justify-between text-[9px] text-zinc-400 font-pixel">
          <span>USE ↑ ↓ TO NAVIGATE | ENTER TO RUN</span>
          <span>ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
};
