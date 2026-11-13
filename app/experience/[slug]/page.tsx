import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExperienceById, experiences } from "@/lib/frontierDirector/experienceRegistry";
import { getEvidenceRecord } from "@/lib/frontierDirector/evidenceRegistry";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import {
  VoxelPanel,
  VoxelButton,
  VoxelStatusLamp,
  VoxelBadge,
  VoxelRaceCarIcon,
  VoxelAiChipIcon,
  VoxelTelemetryTowerIcon,
  VoxelShieldIcon,
} from "@/components/ui/voxel";
import {
  Play,
  Shield,
  Box,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ mode?: string; layer?: string }>;
}

export async function generateStaticParams() {
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceById(slug);
  if (!exp) return { title: "Experience Not Found" };

  return {
    title: `${exp.title} — Asish Oliver M`,
    description: exp.subtitle,
  };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  motorsport: <VoxelRaceCarIcon size={20} />,
  "ai-ml": <VoxelAiChipIcon size={20} />,
  systems: <VoxelTelemetryTowerIcon size={20} />,
};

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = getExperienceById(slug);

  if (!exp) {
    notFound();
  }

  const record = getEvidenceRecord(exp.evidenceRecordId);
  const Icon = CATEGORY_ICONS[exp.id] || CATEGORY_ICONS[exp.slug] || <VoxelShieldIcon size={20} />;

  return (
    <div className="min-h-screen technical-grid-bg text-zinc-100 flex flex-col font-sans selection:bg-[#ff8000] selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Link href="/experience" className="hover:text-amber-400 flex items-center gap-1">
              <span>EXPERIENCE BOARD</span>
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold uppercase">{exp.badge}</span>
          </div>

          <div className="text-zinc-500 font-mono text-[10px]">
            FACILITY ANCHOR: <strong className="text-cyan-400 uppercase">{exp.primaryFacilityId}</strong>
          </div>
        </div>

        {/* Header Voxel Panel */}
        <VoxelPanel
          variant="iron"
          title={`ENGINEERING MISSION // ${exp.badge.toUpperCase()}`}
          icon={Icon}
          headerActions={
            <VoxelStatusLamp tone="emerald" label="READY" pulse />
          }
        >
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252a36]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-pixel text-[8px] bg-[#d71d35] text-white px-2.5 py-0.5 uppercase">
                  {exp.badge}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-[#121418] px-2 py-0.5 border border-[#2b3340]">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{exp.estimatedDurationSec}s Guided Experience</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-retro text-white tracking-tight uppercase">
                {exp.title}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-4xl">
                {exp.subtitle}
              </p>
            </div>

            {/* Key Metrics Chips */}
            <div className="mc-slot-box p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              {exp.keyMetrics.map((m, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-[9px] text-zinc-400 uppercase truncate">
                    {m.label}
                  </div>
                  <div className="font-pixel text-xs sm:text-sm text-white">
                    {m.value}
                  </div>
                  <div className="text-[8px] text-emerald-400 truncate">
                    {m.provenance}
                  </div>
                </div>
              ))}
            </div>

            {/* Recruiter Takeaway Callout */}
            <div className="bg-[#121418] border-l-3 border-[#d71d35] p-3 text-xs text-zinc-200 font-mono space-y-1">
              <div className="text-[#d71d35] font-bold text-[10px] uppercase font-pixel">
                RECRUITER EVALUATION:
              </div>
              <p className="leading-relaxed text-zinc-300">{exp.recruiterTakeaway}</p>
            </div>

            {/* Action Gateways */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <VoxelButton
                variant="red"
                href={`/world`}
                icon={<Play className="w-3.5 h-3.5 fill-white" />}
              >
                LAUNCH 3D SHOWCASE
              </VoxelButton>

              <VoxelButton
                variant="cyan"
                href={`/experience/${exp.slug}/evidence`}
                icon={<Shield className="w-3.5 h-3.5" />}
              >
                INSPECT 6-LAYER PROOF
              </VoxelButton>
            </div>
          </div>
        </VoxelPanel>

        {/* 4 Presentation Steps Overview */}
        <section aria-labelledby="steps-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#2b303c] pb-3">
            <h2 id="steps-heading" className="font-pixel text-sm text-white uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>PRESENTATION SEQUENCE & PHASES</span>
            </h2>
            <span className="font-mono text-xs text-zinc-400">4 STRUCTURED STAGES</span>
          </div>

          <div className="space-y-3">
            {exp.presentationSteps.map((step) => (
              <div
                key={step.id}
                className="voxel-panel-deepslate border-2 p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252a36] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[9px] text-[#d71d35]">
                      STEP {step.index + 1} &bull;
                    </span>
                    <span className="font-mono text-[9px] px-2 py-0.5 bg-[#121418] text-zinc-300 uppercase border border-[#2b3340]">
                      {step.phase}
                    </span>
                    <h3 className="font-pixel text-xs text-white">
                      {step.title}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400">
                    Duration: ~{step.durationSec}s
                  </span>
                </div>

                <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                  {step.narrative}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                  {step.technicalDetails.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="mc-slot-box p-2 text-[11px] font-mono text-zinc-300 flex items-start gap-1.5"
                    >
                      <span className="text-cyan-400">›</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/experience/${exp.slug}/evidence?layer=${step.associatedEvidenceLayer}`}
                    className="inline-flex items-center gap-1 font-mono text-xs text-cyan-400 hover:text-amber-400"
                  >
                    <span>View Layer Proof: {step.associatedEvidenceLayer.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Source Files Overview */}
        {record && (
          <VoxelPanel
            variant="iron"
            title="AUDITED SOURCE REPOSITORIES // VERIFIED COMMITS"
            icon={<Terminal className="w-4 h-4 text-amber-400" />}
            headerActions={
              <VoxelBadge tone="emerald">100% REPRODUCIBLE</VoxelBadge>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {record.layers.source.verifiedFiles.map((file, idx) => (
                <div key={idx} className="mc-slot-box p-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-pixel text-[10px] text-white">{file.fileName}</span>
                    <a
                      href={file.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    {file.relativePath} ({file.lines})
                  </div>
                  <p className="text-xs font-mono text-zinc-300 pt-0.5">{file.purpose}</p>
                </div>
              ))}
            </div>
          </VoxelPanel>
        )}
      </main>

      <PortfolioFooter />
    </div>
  );
}
