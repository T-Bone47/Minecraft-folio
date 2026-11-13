import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { experience, education } from "@/data/experience";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { experiences } from "@/lib/frontierDirector/experienceRegistry";
import {
  VoxelPanel,
  VoxelButton,
  VoxelStatusLamp,
  VoxelBadge,
  VoxelMissionFlagIcon,
  VoxelRaceCarIcon,
  VoxelAiChipIcon,
  VoxelTelemetryTowerIcon,
  VoxelShieldIcon,
} from "@/components/ui/voxel";
import {
  Activity,
  Briefcase,
  GraduationCap,
  Terminal,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Box,
  ChevronRight,
  Sparkles,
  Play,
  Shield,
  Layers,
  Cpu,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Experiences & Trajectory — Asish Oliver M",
  description:
    "Explore interactive engineering demonstrations and verified technical evidence across motorsport vehicle simulation, AI/ML systems, and distributed telemetry pipelines.",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  motorsport: <VoxelRaceCarIcon size={22} />,
  "ai-ml": <VoxelAiChipIcon size={22} />,
  systems: <VoxelTelemetryTowerIcon size={22} />,
};

export default function ExperiencePage() {
  return (
    <div className="min-h-screen technical-grid-bg text-zinc-100 flex flex-col font-sans selection:bg-[#ff8000] selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* 1. Voxel Engineering Mission Board Hero */}
        <section aria-labelledby="experience-hero-title">
          <VoxelPanel
            variant="iron"
            title="CAMPUS MISSION DISPATCH BOARD // TECHNICAL SHOWCASES"
            icon={<Shield className="w-4 h-4 text-amber-400" />}
            headerActions={
              <VoxelStatusLamp tone="emerald" label="3 MISSIONS READY" pulse />
            }
          >
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#121418] border border-[#3f4756] font-mono text-[10px] text-amber-400 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>FRONTIER DIRECTOR 2.0 • INTERACTIVE ENGINEERING SHOWCASES</span>
              </div>

              <h1
                id="experience-hero-title"
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-retro text-white tracking-tight uppercase"
              >
                THE ENGINEERING MISSION BOARD
              </h1>

              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-3xl">
                Inspect live engineering simulations, telemetry pipelines, and machine learning models built by Asish Oliver M. Every demonstration features a 60-second guided showcase and an unredacted 6-layer Engineering Proof Inspector backed by verified project source code.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <VoxelButton
                  variant="gold"
                  href="/world"
                  icon={<Box className="w-3.5 h-3.5" />}
                >
                  EXPLORE 3D CAMPUS
                </VoxelButton>

                <VoxelButton
                  variant="emerald"
                  href="/recruiter"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  RECRUITER BRIEFING
                </VoxelButton>
              </div>
            </div>
          </VoxelPanel>
        </section>

        {/* 2. Three Flagship Showcase Mission Panels */}
        <section aria-labelledby="showcases-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#2b303c] pb-3">
            <h2 id="showcases-heading" className="font-pixel text-sm sm:text-base text-white uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ff8000]" />
              <span>FLAGSHIP ENGINEERING MISSIONS</span>
            </h2>
            <span className="font-mono text-xs text-zinc-400">3 DIRECT DEEP ROUTES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp) => {
              const Icon = CATEGORY_ICONS[exp.id] || CATEGORY_ICONS[exp.slug] || <VoxelShieldIcon size={22} />;

              return (
                <article
                  key={exp.id}
                  className="voxel-panel-deepslate border-3 p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all hover:border-[#ff8000] relative overflow-hidden group shadow-2xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#252a36]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#121418] border border-[#384050] flex items-center justify-center shrink-0">
                          {Icon}
                        </div>
                        <span className="font-pixel text-[8px] text-amber-400 uppercase">
                          {exp.badge}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 bg-[#121418] px-2 py-0.5 border border-[#2b3340]">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>~{exp.estimatedDurationSec}s</span>
                      </span>
                    </div>

                    <h3 className="font-pixel text-sm text-white group-hover:text-amber-400 transition-colors leading-snug">
                      {exp.title}
                    </h3>

                    <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                      {exp.subtitle}
                    </p>

                    {/* Top Inset Metric Screen */}
                    <div className="mc-slot-box p-3 font-mono space-y-1">
                      <div className="text-zinc-400 text-[10px] uppercase">
                        {exp.keyMetrics[0].label}:
                      </div>
                      <div className="font-pixel text-sm text-white">
                        {exp.keyMetrics[0].value}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t-2 border-[#202530]">
                    <VoxelButton
                      variant="red"
                      size="sm"
                      href={`/experience/${exp.slug}`}
                      className="w-full"
                      icon={<Play className="w-3 h-3 fill-white" />}
                    >
                      LAUNCH MISSION
                    </VoxelButton>

                    <VoxelButton
                      variant="stone"
                      size="sm"
                      href={`/experience/${exp.slug}/evidence`}
                      className="w-full"
                      icon={<Shield className="w-3 h-3 text-cyan-400" />}
                    >
                      INSPECT 6-LAYER PROOF
                    </VoxelButton>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. Career Trajectory & Project Portfolio */}
        <section aria-labelledby="career-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#2b303c] pb-3">
            <h2 id="career-heading" className="font-pixel text-sm sm:text-base text-white uppercase flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>CAREER TRAJECTORY & INDUSTRIAL ROLES</span>
            </h2>
            <span className="font-mono text-xs text-zinc-400">STRICT ACCREDITATION</span>
          </div>

          <div className="space-y-4">
            {experience.map((item, idx) => (
              <VoxelPanel
                key={item.id || idx}
                variant="iron"
                title={`ROLE ${String(idx + 1).padStart(2, "0")} // ${item.organization.toUpperCase()}`}
                headerActions={
                  <span className="font-mono text-[10px] bg-[#121418] text-amber-400 px-2 py-0.5 border border-[#3a4354]">
                    {item.period}
                  </span>
                }
              >
                <div className="space-y-3 font-mono">
                  <h3 className="font-pixel text-sm text-white">
                    {item.role}
                  </h3>

                  <div className="space-y-1.5 pt-2 border-t border-[#262c36]">
                    <span className="text-[10px] uppercase text-zinc-400 block font-bold">
                      CORE TECHNICAL FOCUS AREAS:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-300 pl-4 list-disc font-mono">
                      {item.focus.map((point: string, fIdx: number) => (
                        <li key={fIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </VoxelPanel>
            ))}
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
