'use client';

import React from 'react';
import Link from 'next/link';
import { PushToProveLabView } from '@/components/xray/PushToProveLabView';
import { ArrowLeft, FlaskConical } from 'lucide-react';

export default function LabPage() {
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
            <span className="text-xs text-emerald-400 font-bold">Push-To-Prove Lab</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/engineering/xray"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              ← Frontier X-Ray
            </Link>
            <Link
              href="/engineering/history"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Time Machine (Incidents) →
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-emerald-400">
              Push-To-Prove // Live Algorithm Verification Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Executable Mathematical Algorithms • Live Client-Side Computation • Reproducible Benchmark Metrics • Zero Mock Data
          </p>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/40 min-h-[600px]">
          <PushToProveLabView />
        </div>
      </div>
    </main>
  );
}
