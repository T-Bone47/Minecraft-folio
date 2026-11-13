import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { RedstoneStatusBar } from "@/components/navigation/RedstoneStatusBar";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import {
  multiverseProjects,
  getMultiverseProjectBySlug,
} from "@/lib/multiverse/projectRegistry";
import { RaceMindDemoView } from "@/components/multiverse/demos/RaceMindDemoView";
import { LiveF1DemoView } from "@/components/multiverse/demos/LiveF1DemoView";
import { SentinelDemoView } from "@/components/multiverse/demos/SentinelDemoView";
import { VyaparPulseDemoView } from "@/components/multiverse/demos/VyaparPulseDemoView";
import {
  VoxelPanel,
  VoxelButton,
  VoxelStatusLamp,
  VoxelBadge,
  VoxelPortalIcon,
  VoxelRaceCarIcon,
  VoxelTelemetryTowerIcon,
  VoxelShieldIcon,
  VoxelAiChipIcon,
} from "@/components/ui/voxel";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Layers,
  Cpu,
  FileCode2,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return multiverseProjects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getMultiverseProjectBySlug(slug);
  if (!project) return { title: "Portal Not Found" };

  return {
    title: `${project.name} — Frontier Multiverse | Asish`,
    description: project.tagline,
  };
}

const PROJECT_EMBLEMS: Record<string, React.ReactNode> = {
  racemind: <VoxelRaceCarIcon size={24} />,
  "live-f1": <VoxelTelemetryTowerIcon size={24} />,
  sentinel: <VoxelShieldIcon size={24} />,
  vyaparpulse: <VoxelAiChipIcon size={24} />,
};

export default async function MultiverseProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getMultiverseProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const Emblem = PROJECT_EMBLEMS[project.id] || <VoxelPortalIcon size={24} />;

  return (
    <div className="min-h-screen technical-grid-bg text-zinc-100 flex flex-col font-sans selection:bg-[#ff8000] selection:text-white">
      <PortfolioNav />
      <RedstoneStatusBar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/multiverse" className="hover:text-amber-400 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>MULTIVERSE HUB</span>
          </Link>
          <span>/</span>
          <span className="text-amber-400 font-bold uppercase">{project.shortName}</span>
        </div>

        {/* Project Header Voxel Terminal Banner */}
        <VoxelPanel
          variant="iron"
          title={`PORTAL TERMINAL // ${project.name.toUpperCase()}`}
          icon={Emblem}
          headerActions={
            <VoxelStatusLamp tone="emerald" label="SIMULATION ACTIVE" pulse />
          }
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">
                  {project.category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-xs text-zinc-300">
                  {project.domain}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-retro text-white tracking-wide uppercase">
                {project.name}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <VoxelButton
                variant="cyan"
                href={`/multiverse/${project.slug}/engineering`}
                icon={<Layers className="w-3.5 h-3.5" />}
              >
                6-LAYER PROOF
              </VoxelButton>

              <VoxelButton
                variant="stone"
                href={project.repositoryUrl}
                external
                icon={<GitBranch className="w-3.5 h-3.5 text-amber-400" />}
              >
                GITHUB REPO
              </VoxelButton>
            </div>
          </div>
        </VoxelPanel>

        {/* Interactive Vertical Slice Demonstration */}
        <section aria-label="Interactive Simulation Slice">
          {project.id === "racemind" && <RaceMindDemoView />}
          {project.id === "live-f1" && <LiveF1DemoView />}
          {project.id === "sentinel" && <SentinelDemoView />}
          {project.id === "vyaparpulse" && <VyaparPulseDemoView />}
        </section>

        {/* Technical Overview & Technologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VoxelPanel
            variant="deepslate"
            title="ARCHITECTURAL SPECIFICATION"
            icon={<Cpu className="w-4 h-4 text-amber-400" />}
          >
            <div className="space-y-4">
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                {project.architectureSummary}
              </p>
              <div className="pt-3 border-t border-[#262c36] text-xs font-mono text-zinc-400 space-y-1">
                <div>
                  PROVENANCE: <span className="text-amber-400 font-bold">{project.provenance}</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">{project.provenanceExplanation}</p>
              </div>
            </div>
          </VoxelPanel>

          <VoxelPanel
            variant="deepslate"
            title="PRODUCTION TECHNOLOGIES"
            icon={<FileCode2 className="w-4 h-4 text-sky-400" />}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="mc-item-chip px-2.5 py-1 text-xs font-mono text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="pt-3 border-t border-[#262c36] text-xs font-mono text-zinc-400">
                VERIFIED COMMIT: <code className="text-amber-400 font-bold">{project.commitSha}</code>
              </div>
            </div>
          </VoxelPanel>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
