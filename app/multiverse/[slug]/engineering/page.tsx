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
import { EvidenceInspectorView } from "@/components/multiverse/EvidenceInspectorView";
import { RecruiterPathwaysView } from "@/components/multiverse/RecruiterPathwaysView";
import {
  VoxelPanel,
  VoxelButton,
  VoxelStatusLamp,
  VoxelBadge,
  VoxelShieldIcon,
} from "@/components/ui/voxel";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Layers,
  ShieldCheck,
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
  if (!project) return { title: "Evidence Not Found" };

  return {
    title: `6-Layer Proof: ${project.name} — Frontier Multiverse | Asish`,
    description: `Inspect 6-layer technical evidence, mathematical formulas, and verified benchmarks for ${project.name}.`,
  };
}

export default async function MultiverseEngineeringProofPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getMultiverseProjectBySlug(slug);

  if (!project) {
    notFound();
  }

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
          <Link href={`/multiverse/${project.slug}`} className="hover:text-amber-400 uppercase">
            {project.shortName}
          </Link>
          <span>/</span>
          <span className="text-amber-400 font-bold uppercase">6-LAYER ENGINEERING PROOF</span>
        </div>

        {/* Header Voxel Panel */}
        <VoxelPanel
          variant="iron"
          title={`EVIDENCE DOSSIER // ${project.name.toUpperCase()}`}
          icon={<VoxelShieldIcon size={16} />}
          headerActions={
            <VoxelStatusLamp tone="emerald" label="VERIFIED AUDIT" pulse />
          }
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] text-amber-400 uppercase">
                  AUTHORITATIVE TECHNICAL EVIDENCE
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-xs text-zinc-400">
                  {project.provenance}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-retro text-white tracking-wide uppercase">
                {project.name}: 6-Layer Engineering Audit
              </h1>
              <p className="text-xs font-mono text-zinc-300">
                Verified Commit SHA: <code className="text-amber-400 font-bold">{project.commitSha}</code>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <VoxelButton
                variant="stone"
                href={`/multiverse/${project.slug}`}
              >
                EXPERIENCE DEMO
              </VoxelButton>

              <VoxelButton
                variant="gold"
                href={project.repositoryUrl}
                external
                icon={<GitBranch className="w-3.5 h-3.5 text-black" />}
              >
                SOURCE TREE
              </VoxelButton>
            </div>
          </div>
        </VoxelPanel>

        {/* 6-Layer Evidence Inspector */}
        <VoxelPanel
          variant="deepslate"
          title="6-LAYER MATHEMATICAL & ARCHITECTURAL MANIFEST"
          icon={<Layers className="w-4 h-4 text-amber-400" />}
        >
          <EvidenceInspectorView />
        </VoxelPanel>

        {/* Recruiter Pathways & Technical Reviewer Guide */}
        <VoxelPanel
          variant="iron"
          title="RECRUITER PATHWAYS & TECHNICAL REVIEW GUIDE"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
        >
          <RecruiterPathwaysView />
        </VoxelPanel>
      </main>

      <PortfolioFooter />
    </div>
  );
}
