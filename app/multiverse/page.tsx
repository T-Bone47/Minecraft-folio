import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { PortfolioFooter } from "@/components/navigation/PortfolioFooter";
import { multiverseProjects } from "@/lib/multiverse/projectRegistry";
import {
  Globe,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  BarChart3,
  GitBranch,
  Play,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Frontier Multiverse — Four Connected Production Systems | Asish",
  description:
    "Explore four real engineering software systems spanning motorsport race strategy, 1M+ event telemetry normalisation, continuous AI governance (GRC), and offline-first voice accounting.",
};

export default function MultiverseHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <PortfolioNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 1. Hero Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>FRONTIER MULTIVERSE • PRODUCTION SYSTEMS BRIDGE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            The Connected Engineering Universe
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Direct gateways into four distinct, production-grade software repositories.
            Experience live client-side simulation slices, inspect 6-layer mathematical and architectural evidence,
            and audit genuine source code with zero exaggerated claims.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Link
              href="/?facility=multiverse"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-950"
            >
              <Play className="w-4 h-4" />
              <span>EXPLORE IN 3D LAUNCH BAY</span>
            </Link>
            <a
              href="https://github.com/T-Bone47"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 border border-slate-800 transition-colors"
            >
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span>GITHUB PROFILE (@T-BONE47)</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* 2. Four Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {multiverseProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: project.themeColor }}
              />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: project.themeColor }}
                    />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                      {project.domain.split(",")[0]}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                    {project.provenance}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {project.tagline}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  {project.keyMetrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">{m.label}</div>
                      <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[10px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <Link
                  href={`/multiverse/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>LAUNCH PORTAL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/multiverse/${project.slug}/engineering`}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 underline"
                >
                  6-Layer Proof
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Architectural Comparison Table */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 mb-16">
          <h2 className="text-lg font-mono font-bold uppercase text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Cross-Project Architectural Comparison Matrix</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Project</th>
                  <th className="pb-3">Core Problem</th>
                  <th className="pb-3">Verified Benchmark</th>
                  <th className="pb-3">Primary Tech</th>
                  <th className="pb-3">Commit SHA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {multiverseProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-bold text-white">
                      <Link href={`/multiverse/${p.slug}`} className="hover:text-sky-400">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-300 max-w-xs truncate">{p.tagline}</td>
                    <td className="py-3 text-emerald-400 font-bold">
                      {p.keyMetrics[0].label}: {p.keyMetrics[0].value}
                    </td>
                    <td className="py-3 text-slate-400">{p.technologies.slice(0, 3).join(", ")}</td>
                    <td className="py-3 text-amber-400">
                      <a href={p.repositoryUrl} target="_blank" rel="noreferrer" className="hover:underline">
                        {p.commitSha}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}

