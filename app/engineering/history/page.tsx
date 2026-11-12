'use client';

import React from 'react';
import Link from 'next/link';
import { EngineeringTimeMachineView } from '@/components/xray/EngineeringTimeMachineView';
import { ArrowLeft, History, ShieldAlert } from 'lucide-react';

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/world"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
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
            <span className="text-xs text-cyan-400 font-bold">Engineering Time Machine</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/engineering/xray"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              ← Frontier X-Ray (Causal Graph)
            </Link>
            <Link
              href="/engineering/lab"
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              Push-to-Prove Lab →
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-cyan-400">
              Engineering Time Machine // Verified Historical Incidents
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real Repository Defects • Exact Git Commit Pairs • Before/After Diff Inspector • Invariant Test Replays
          </p>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/40 min-h-[600px]">
          <EngineeringTimeMachineView />
        </div>
      </div>
    </main>
  );
}
