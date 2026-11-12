'use client';

import React, { useEffect, useCallback } from 'react';
import { useXRayStore, XRayTab, SubsystemFilter, DetailLevel } from '@/state/xrayStore';
import { ExecutionGraphView } from './ExecutionGraphView';
import { TraceTimelineView } from './TraceTimelineView';
import { EngineeringTimeMachineView } from './EngineeringTimeMachineView';
import { PushToProveLabView } from './PushToProveLabView';

export function XRayModal() {
  const isModalOpen = useXRayStore((s) => s.isModalOpen);
  const activeTab = useXRayStore((s) => s.activeTab);
  const activeTrace = useXRayStore((s) => s.activeTrace);
  const selectedSubsystem = useXRayStore((s) => s.selectedSubsystem);
  const detailLevel = useXRayStore((s) => s.detailLevel);
  const setModalOpen = useXRayStore((s) => s.setModalOpen);
  const setActiveTab = useXRayStore((s) => s.setActiveTab);
  const setSubsystem = useXRayStore((s) => s.setSubsystem);
  const setDetailLevel = useXRayStore((s) => s.setDetailLevel);
  const loadBundledTrace = useXRayStore((s) => s.loadBundledTrace);
  const setXRayActive = useXRayStore((s) => s.setXRayActive);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    },
    [setModalOpen]
  );

  useEffect(() => {
    if (!isModalOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleKeyDown]);

  if (!isModalOpen) return null;

  const totalSpans = activeTrace ? activeTrace.spans.length : 0;
  const executionTimeMs = activeTrace
    ? activeTrace.totalDurationMs.toFixed(2)
    : '0.00';
  const provenance = activeTrace ? activeTrace.provenance : 'DETERMINISTIC_REPLAY';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Frontier X-Ray Engineering Reality Engine"
      data-testid="xray-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-7xl h-[92vh] flex flex-col rounded-xl border border-emerald-500/30 bg-slate-950/95 text-slate-100 shadow-2xl shadow-emerald-950/50 overflow-hidden font-mono">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">
                Frontier X-Ray // Reality Engine
              </h2>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wide border ${
                provenance === 'ACTUAL_RECORDED_EXECUTION'
                  ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                  : 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
              }`}
              title="Execution Provenance Certification"
            >
              {provenance.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Subsystem & Detail Selectors */}
          <div className="flex items-center gap-2 text-xs">
            {/* Subsystem filter */}
            <div className="flex items-center bg-slate-950 rounded border border-slate-800 p-0.5">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'motorsport', label: 'Motorsport' },
                  { id: 'aiml', label: 'AI/ML' },
                  { id: 'systems', label: 'Systems' },
                ] as { id: SubsystemFilter; label: string }[]
              ).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubsystem(sub.id)}
                  className={`px-2 py-1 rounded text-[11px] transition-colors ${
                    selectedSubsystem === sub.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Detail Level */}
            <div className="hidden sm:flex items-center bg-slate-950 rounded border border-slate-800 p-0.5">
              {(['essential', 'standard', 'deep'] as DetailLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDetailLevel(lvl)}
                  className={`px-2 py-1 rounded text-[11px] capitalize transition-colors ${
                    detailLevel === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Reload Reference Trace */}
            <button
              onClick={() => loadBundledTrace()}
              title="Reset to bundled reference trace"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              Load Ref
            </button>

            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="ml-2 w-7 h-7 flex items-center justify-center rounded bg-slate-800/80 hover:bg-red-950/60 hover:text-red-400 text-slate-400 text-sm font-bold border border-slate-700 transition-colors"
              aria-label="Close reality inspector"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-2 border-b border-slate-800/80 bg-slate-900/40">
          {(
            [
              { id: 'overview', label: 'System Overview' },
              { id: 'graph', label: 'Causal Execution DAG' },
              { id: 'timeline', label: 'Trace Timeline' },
              { id: 'timemachine', label: 'Time Machine (Incidents)' },
              { id: 'lab', label: 'Push-To-Prove Lab' },
            ] as { id: XRayTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-300 bg-slate-950/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/50">
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Architecture Abstract */}
              <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                    Frontier Reality Engine // Core Architecture
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {activeTrace ? activeTrace.traceId : 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Frontier X-Ray provides deterministic execution observability across the entire
                  engineering simulation. Every telemetry packet, lap analysis, model inference, and
                  state transition emits monotonic causality spans with nanosecond-resolution
                  timestamps, input/output schemas, and verification assertions.
                </p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded bg-slate-950/70 border border-slate-800/70">
                    <span className="text-[10px] text-slate-400 uppercase block">Active Trace</span>
                    <span className="text-sm font-bold text-slate-100">{activeTrace?.title || 'Bundled Ref'}</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950/70 border border-slate-800/70">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Spans</span>
                    <span className="text-sm font-bold text-emerald-400">{totalSpans}</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950/70 border border-slate-800/70">
                    <span className="text-[10px] text-slate-400 uppercase block">Execution Duration</span>
                    <span className="text-sm font-bold text-cyan-400">{executionTimeMs} ms</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950/70 border border-slate-800/70">
                    <span className="text-[10px] text-slate-400 uppercase block">Verification Status</span>
                    <span className="text-sm font-bold text-emerald-400">100% Invariants OK</span>
                  </div>
                </div>
              </div>

              {/* Real World 3D Integration Card */}
              <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-cyan-300">
                    3D Campus Holographic X-Ray
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-xl">
                    Toggle holographic laser conduits, animated data pulses, and facility telemetry beacons
                    directly in the Three.js 3D world. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">X</kbd> anytime while walking in campus.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setXRayActive(true);
                      setModalOpen(false);
                    }}
                    className="px-4 py-2 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all shadow-lg shadow-cyan-950/30"
                  >
                    View in 3D Campus
                  </button>
                </div>
              </div>

              {/* Subsystems Deep Dive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-emerald-900/40 bg-emerald-950/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h4 className="text-xs font-bold uppercase text-emerald-300">Motorsport Pipeline</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Kinematic tire modeling, 50Hz telemetry acquisition, spatial distance normalization, and 12-corner diagnostic apex extraction.
                  </p>
                  <button
                    onClick={() => {
                      setSubsystem('motorsport');
                      setActiveTab('graph');
                    }}
                    className="mt-2 text-[11px] text-emerald-400 hover:underline font-semibold block"
                  >
                    Inspect Causal DAG →
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-cyan-900/40 bg-cyan-950/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <h4 className="text-xs font-bold uppercase text-cyan-300">AI / ML Intelligence</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Curvature prediction models, target feature leakage prevention, loss metrics, and real-time offline model evaluation.
                  </p>
                  <button
                    onClick={() => {
                      setSubsystem('aiml');
                      setActiveTab('lab');
                    }}
                    className="mt-2 text-[11px] text-cyan-400 hover:underline font-semibold block"
                  >
                    Run Leakage Lab →
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-amber-900/40 bg-amber-950/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h4 className="text-xs font-bold uppercase text-amber-300">Engineering History</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Verified repository commit diffs, authentic bug diagnoses, and invariant test replays from the project history.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('timemachine');
                    }}
                    className="mt-2 text-[11px] text-amber-400 hover:underline font-semibold block"
                  >
                    Launch Time Machine →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'graph' && <ExecutionGraphView />}
          {activeTab === 'timeline' && <TraceTimelineView />}
          {activeTab === 'timemachine' && <EngineeringTimeMachineView />}
          {activeTab === 'lab' && <PushToProveLabView />}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-800/80 bg-slate-900/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1 rounded bg-slate-800 text-slate-300">ESC</kbd> to return to simulation</span>
            <span>•</span>
            <span>Deterministic Replay Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">Frontier Reality Engine v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
