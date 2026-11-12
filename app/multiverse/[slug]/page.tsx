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
import { RaceMindDemoView } from "@/components/multiverse/demos/RaceMindDemoView";
import { LiveF1DemoView } from "@/components/multiverse/demos/LiveF1DemoView";
import { SentinelDemoView } from "@/components/multiverse/demos/SentinelDemoView";
import { VyaparPulseDemoView } from "@/components/multiverse/demos/VyaparPulseDemoView";
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
  if (!project) return { title: "Portal Not Found" };

  return {
    title: `${project.name} — Frontier Multiverse | Asish`,
    description: project.tagline,
  };
}

export default async function MultiverseProjectPage({ params }: PageProps) {
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
          <span className="text-sky-400 font-bold uppercase">{project.shortName}</span>
        </div>

        {/* Project Header Banner */}
        <div className="flex flex-wrap items-start justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.themeColor }}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {project.domain}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              {project.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href={`/multiverse/${project.slug}/engineering`}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>6-LAYER PROOF INSPECTOR</span>
            </Link>

            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-sky-950"
            >
              <GitBranch className="w-4 h-4 text-amber-300" />
              <span>GITHUB REPOSITORY</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Interactive Vertical Slice Demonstration */}
        <div className="mb-12">
          {project.id === "racemind" && <RaceMindDemoView />}
          {project.id === "live-f1" && <LiveF1DemoView />}
          {project.id === "sentinel" && <SentinelDemoView />}
          {project.id === "vyaparpulse" && <VyaparPulseDemoView />}
        </div>

        {/* Technical Overview & Technologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-sm font-mono font-bold uppercase text-slate-200 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Architectural Summary</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {project.architectureSummary}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
              Provenance: <span className="text-amber-400 font-bold">{project.provenance}</span>
              <p className="text-[11px] text-slate-500 mt-1 font-sans">{project.provenanceExplanation}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-sm font-mono font-bold uppercase text-slate-200 mb-3 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-sky-400" />
              <span>Production Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
              Verified Commit: <code className="text-amber-400">{project.commitSha}</code>
            </div>
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
