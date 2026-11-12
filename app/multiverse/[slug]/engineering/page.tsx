import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import {
  multiverseProjects,
  getMultiverseProjectBySlug,
} from "@/lib/multiverse/projectRegistry";
import { EvidenceInspectorView } from "@/components/multiverse/EvidenceInspectorView";
import { RecruiterPathwaysView } from "@/components/multiverse/RecruiterPathwaysView";
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <PortfolioNav />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
          <Link href="/multiverse" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>MULTIVERSE HUB</span>
          </Link>
          <span>/</span>
          <Link href={`/multiverse/${project.slug}`} className="hover:text-white uppercase">
            {project.shortName}
          </Link>
          <span>/</span>
          <span className="text-sky-400 font-bold">6-LAYER ENGINEERING PROOF</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.themeColor }}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                AUTHORITATIVE TECHNICAL EVIDENCE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              {project.name}: 6-Layer Engineering Audit
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Verified Commit SHA: <code className="text-amber-400">{project.commitSha}</code> • Provenance: {project.provenance}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/multiverse/${project.slug}`}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-colors"
            >
              EXPERIENCE DEMO
            </Link>

            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-sky-950"
            >
              <GitBranch className="w-4 h-4 text-amber-300" />
              <span>SOURCE TREE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 6-Layer Evidence Inspector */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 mb-12">
          <EvidenceInspectorView />
        </div>

        {/* Recruiter Pathways & Technical Reviewer Guide */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <RecruiterPathwaysView />
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
