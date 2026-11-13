import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExperienceById, experiences } from "@/lib/frontierDirector/experienceRegistry";
import { getEvidenceRecord } from "@/lib/frontierDirector/evidenceRegistry";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import type { EvidenceLayerId } from "@/lib/frontierDirector/types";
import {
  VoxelPanel,
  VoxelButton,
  VoxelStatusLamp,
  VoxelBadge,
  VoxelBlueprintPanel,
  VoxelShieldIcon,
  VoxelRaceCarIcon,
  VoxelAiChipIcon,
  VoxelTelemetryTowerIcon,
} from "@/components/ui/voxel";
import {
  Shield,
  Layers,
  Cpu,
  BarChart3,
  GitBranch,
  FileCode,
  Info,
  Play,
  Box,
  ChevronRight,
  ExternalLink,
  Terminal,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceById(slug);
  if (!exp) return { title: "Evidence Not Found" };

  return {
    title: `Engineering Proof: ${exp.title} — Asish Oliver M`,
    description: `6-layer technical evidence audit for ${exp.title}: Problem, Architecture, Algorithms, Benchmarks, Trade-offs, and Source code.`,
  };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  motorsport: <VoxelRaceCarIcon size={20} />,
  "ai-ml": <VoxelAiChipIcon size={20} />,
  systems: <VoxelTelemetryTowerIcon size={20} />,
};

export default async function EvidenceDeepLinkPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = await searchParams;
  const exp = getExperienceById(slug);

  if (!exp) {
    notFound();
  }

  const record = getEvidenceRecord(exp.evidenceRecordId);
  if (!record) {
    notFound();
  }

  const rawLayer = typeof sParams?.layer === "string" ? sParams.layer : undefined;
  const activeLayer: EvidenceLayerId = (rawLayer && ["problem", "architecture", "algorithm", "evidence", "tradeoffs", "source"].includes(rawLayer))
    ? (rawLayer as EvidenceLayerId)
    : "problem";

  const layerTabs: { id: EvidenceLayerId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "problem", label: "1. Problem & Invariants", icon: Info },
    { id: "architecture", label: "2. Architecture & Flow", icon: Layers },
    { id: "algorithm", label: "3. Algorithm & Code", icon: Cpu },
    { id: "evidence", label: "4. Test Proofs & Benchmarks", icon: BarChart3 },
    { id: "tradeoffs", label: "5. Trade-offs & Alternatives", icon: GitBranch },
    { id: "source", label: "6. Verified Source Files", icon: FileCode },
  ];

  const Icon = CATEGORY_ICONS[exp.id] || CATEGORY_ICONS[exp.slug] || <VoxelShieldIcon size={20} />;

  return (
    <div className="min-h-screen technical-grid-bg text-zinc-100 flex flex-col font-sans selection:bg-[#ff8000] selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Link href="/experience" className="hover:text-amber-400">
              <span>EXPERIENCE BOARD</span>
            </Link>
            <span>/</span>
            <Link href={`/experience/${exp.slug}`} className="hover:text-amber-400 uppercase">
              {exp.badge}
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold uppercase">6-LAYER PROOF INSPECTOR</span>
          </div>

          <Link
            href={`/experience/${exp.slug}`}
            className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
          >
            <span>SHOWCASE OVERVIEW</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Header Voxel Panel */}
        <VoxelPanel
          variant="iron"
          title={`TECHNICAL BLUEPRINT ARCHIVE // ${record.title.toUpperCase()}`}
          icon={Icon}
          headerActions={
            <VoxelStatusLamp tone="emerald" label="UNREDACTED AUDIT" pulse />
          }
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">
                  {record.domain}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-retro text-white tracking-wide uppercase">
                  {record.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <VoxelButton
                  variant="gold"
                  href={`/world`}
                  icon={<Box className="w-3.5 h-3.5" />}
                >
                  OPEN IN 3D WORLD
                </VoxelButton>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-mono text-zinc-300 max-w-4xl leading-relaxed">
              Every technical layer below is cross-referenced with genuine source code, mathematical derivations, and automated unit tests running in continuous integration.
            </p>

            {/* Layer Selector Tabs */}
            <nav aria-label="Evidence Layers" className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-[#252a36] scrollbar-thin">
              {layerTabs.map(({ id, label, icon: TabIcon }) => {
                const isActive = activeLayer === id;
                return (
                  <Link
                    key={id}
                    href={`/experience/${exp.slug}/evidence?layer=${id}`}
                    className={`flex items-center gap-2 px-3 py-1.5 font-pixel text-[9px] uppercase whitespace-nowrap transition-all border-2 ${
                      isActive
                        ? "bg-[#d71d35] text-white border-white shadow-md mc-text-shadow"
                        : "bg-[#181d24] text-zinc-400 border-[#2b3340] hover:text-white hover:bg-[#202730]"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </VoxelPanel>

        {/* Layer Content Surface */}
        <VoxelBlueprintPanel title={`LAYER INSPECTOR: ${activeLayer.toUpperCase()}`} blueprintCode={`AUDIT-${exp.badge.toUpperCase()}`}>
          {/* Layer 1: Problem */}
          {activeLayer === "problem" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e3857] pb-3">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">LAYER 1 OF 6</span>
                <h2 className="font-pixel text-base sm:text-lg text-white mt-1">
                  {record.layers.problem.title}
                </h2>
              </div>

              <div className="mc-slot-box p-4 space-y-1.5 font-mono">
                <h3 className="text-xs font-bold uppercase text-cyan-400">OBJECTIVE</h3>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  {record.layers.problem.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
                <div className="mc-slot-box p-4 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-amber-400">ENGINEERING CONSTRAINTS</h3>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {record.layers.problem.engineeringConstraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">›</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mc-slot-box p-4 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-emerald-400">SYSTEM INVARIANTS</h3>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {record.layers.problem.invariants.map((inv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{inv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Layer 2: Architecture */}
          {activeLayer === "architecture" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e3857] pb-3">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">LAYER 2 OF 6</span>
                <h2 className="font-pixel text-base sm:text-lg text-white mt-1">
                  {record.layers.architecture.title}
                </h2>
              </div>

              <div className="voxel-data-screen p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-zinc-300 leading-tight">
                  {record.layers.architecture.asciiDiagram}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {record.layers.architecture.components.map((c, idx) => (
                  <div key={idx} className="mc-slot-box p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{c.name}</span>
                      <span className="text-[10px] text-cyan-400 font-bold">{c.throughputOrLatency}</span>
                    </div>
                    <p className="text-xs text-zinc-300">{c.role}</p>
                    <div className="text-[10px] text-zinc-400 pt-1">
                      Module: {c.technology}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layer 3: Algorithm */}
          {activeLayer === "algorithm" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e3857] pb-3">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">LAYER 3 OF 6</span>
                <h2 className="font-pixel text-base sm:text-lg text-white mt-1">
                  {record.layers.algorithm.algorithmName}
                </h2>
                <div className="font-mono text-xs text-zinc-400 mt-1">
                  Complexity: <strong className="text-emerald-400 font-mono">Time {record.layers.algorithm.complexity.time}</strong> | <strong className="text-emerald-400 font-mono">Space {record.layers.algorithm.complexity.space}</strong>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-pixel text-xs text-cyan-400 uppercase">FORMULATIONS</h3>
                <div className="grid grid-cols-1 gap-3 font-mono">
                  {record.layers.algorithm.mathematicalFormulas.map((f, i) => (
                    <div key={i} className="mc-slot-box p-4 space-y-1.5">
                      <div className="text-xs font-bold text-cyan-400">{f.name}</div>
                      <div className="font-mono text-xs text-white bg-black/60 p-2.5 border border-[#2b3340] select-all">
                        {f.latexOrNotation}
                      </div>
                      <p className="text-[11px] text-zinc-400">{f.explanation}</p>
                    </div>
                  ))}
                </div>

                <h3 className="font-pixel text-xs text-amber-400 uppercase pt-2">CORE CODE ALGORITHM</h3>
                <div className="voxel-data-screen p-4 overflow-x-auto space-y-4">
                  {record.layers.algorithm.codeExcerpts.map((excerpt, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-[10px] font-pixel text-cyan-400">{excerpt.fileName} ({excerpt.startLine}-{excerpt.endLine})</div>
                      <pre className="text-emerald-400 text-xs font-mono leading-relaxed">
                        <code>{excerpt.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layer 4: Evidence & Benchmarks */}
          {activeLayer === "evidence" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e3857] pb-3">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">LAYER 4 OF 6</span>
                <h2 className="font-pixel text-base sm:text-lg text-white mt-1">
                  Verified Test Proofs & Benchmarks
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                {record.layers.evidence.benchmarks.map((b, idx) => (
                  <div key={idx} className="mc-slot-box p-4 space-y-1">
                    <div className="text-[10px] text-zinc-400 uppercase">{b.metric}</div>
                    <div className="font-pixel text-sm text-emerald-400">{b.observedValue}</div>
                    <div className="text-xs text-zinc-300">Target Budget: {b.targetBudget}</div>
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1">
                      <span className="font-pixel text-[8px] text-emerald-400">{b.status}</span>
                      <span>{b.provenance}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 font-mono">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-xs text-cyan-400 uppercase">PASSING AUTOMATED TESTS</h3>
                  <code className="text-[10px] text-amber-300 bg-black/60 px-2 py-0.5 border border-zinc-800">
                    {record.layers.evidence.reproducibleTestCommand}
                  </code>
                </div>
                <div className="space-y-2">
                  {record.layers.evidence.passingTests.map((pt, idx) => (
                    <div key={idx} className="mc-slot-box p-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-xs">{pt.testName}</div>
                        <div className="text-[10px] text-zinc-400">Duration: {pt.durationMs} ms</div>
                      </div>
                      <div className="font-pixel text-[9px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800">
                        PASS
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layer 5: Trade-offs */}
          {activeLayer === "tradeoffs" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e3857] pb-3">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">LAYER 5 OF 6</span>
                <h2 className="font-pixel text-base sm:text-lg text-white mt-1">
                  Architectural Trade-offs & Alternatives
                </h2>
              </div>

              <div className="space-y-4 font-mono">
                <div className="mc-slot-box p-4 space-y-2 border-l-4 border-l-amber-400">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{record.layers.tradeoffs.chosenApproach.name}</span>
                    <VoxelBadge tone="gold">CHOSEN APPROACH</VoxelBadge>
                  </div>
                  <p className="text-xs text-zinc-300">{record.layers.tradeoffs.chosenApproach.justification}</p>
                </div>

                <h3 className="font-pixel text-xs text-amber-400 uppercase pt-2">ALTERNATIVES EVALUATED</h3>
                <div className="space-y-3">
                  {record.layers.tradeoffs.alternativesEvaluated.map((alt, idx) => (
                    <div key={idx} className="mc-slot-box p-4 space-y-2">
                      <div className="font-bold text-white text-xs">{alt.name}</div>
                      <div className="p-2.5 bg-black/50 border border-[#2b3340] text-[11px] text-zinc-400">
                        <strong className="text-red-400">Rejection Reason:</strong> {alt.rejectionReason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layer 6: Source Files */}
          {activeLayer === "source" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e3857] pb-3">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">LAYER 6 OF 6</span>
                <h2 className="font-pixel text-base sm:text-lg text-white mt-1">
                  Audited Git Source Files
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {record.layers.source.verifiedFiles.map((file, idx) => (
                  <div key={idx} className="mc-slot-box p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[10px] text-white">{file.fileName}</span>
                      <a
                        href={file.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {file.relativePath} ({file.lines})
                    </div>
                    <p className="text-xs text-zinc-300 pt-1">{file.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </VoxelBlueprintPanel>
      </main>

      <PortfolioFooter />
    </div>
  );
}
