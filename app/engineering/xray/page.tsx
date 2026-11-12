'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useXRayStore } from '@/state/xrayStore';
import { ExecutionGraphView } from '@/components/xray/ExecutionGraphView';
import { TraceTimelineView } from '@/components/xray/TraceTimelineView';
import { ArrowLeft, GitFork, Activity, Clock, ShieldCheck } from 'lucide-react';

export default function XRayPage() {
  const [view, setView] = useState<'graph' | 'timeline'>('graph');
  const activeTrace = useXRayStore((s) => s.activeTrace);
  const loadBundledTrace = useXRayStore((s) => s.loadBundledTrace);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/world"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to 3D Campus</span>
            </Link>
            <span className="text-slate-600">/</span>
            <Link
              href="/engineering"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Engineering Manual
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-bold">Frontier X-Ray</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/engineering/history"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Time Machine (Incidents) →
            </Link>
            <Link
              href="/engineering/lab"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Push-to-Prove Lab →
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-emerald-400">
                  Frontier X-Ray // Causal Execution Trace
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                2D Accessible View • Nanosecond Causal DAG • Monotonic Telemetry Spans • Side-Effect Free
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {activeTrace?.provenance.replace(/_/g, ' ') || 'DETERMINISTIC REPLAY'}
              </span>
              <button
                onClick={() => loadBundledTrace()}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded border border-slate-700 transition-colors"
              >
                Reload Ref Trace
              </button>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800">
          <button
            onClick={() => setView('graph')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              view === 'graph'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Causal Execution Graph</span>
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              view === 'timeline'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Trace Timeline & Spans</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/40 min-h-[550px]">
          {view === 'graph' ? <ExecutionGraphView /> : <TraceTimelineView />}
        </div>
      </div>
    </main>
  );
}
