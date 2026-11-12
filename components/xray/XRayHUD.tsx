'use client';

import React, { useEffect, useCallback } from 'react';
import { useXRayStore } from '@/state/xrayStore';
import { gameplayBlocked, typingTarget } from '@/lib/frontier/input';
import { Layers, Activity, Maximize2 } from 'lucide-react';

export function XRayHUD() {
  const isXRayActive = useXRayStore((s) => s.isXRayActive);
  const isModalOpen = useXRayStore((s) => s.isModalOpen);
  const toggleXRay = useXRayStore((s) => s.toggleXRay);
  const setModalOpen = useXRayStore((s) => s.setModalOpen);
  const activeTrace = useXRayStore((s) => s.activeTrace);

  // Global KeyX listener to toggle 3D overlay or open inspector
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'KeyX' || e.key === 'x' || e.key === 'X') {
        if (typingTarget(e.target)) return;
        // If modal is open, don't toggle 3D in background
        if (isModalOpen) return;
        // Don't intercept if gameplay is actively blocked by another modal
        if (gameplayBlocked()) return;

        e.preventDefault();
        toggleXRay();
      }
    },
    [isModalOpen, toggleXRay]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      data-testid="xray-hud-container"
      className="fixed top-20 right-4 z-40 flex flex-col items-end gap-2 font-mono select-none pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-emerald-500/30 bg-slate-950/80 backdrop-blur-md shadow-lg shadow-emerald-950/40">
        {/* Toggle 3D Overlay button */}
        <button
          onClick={() => toggleXRay()}
          data-testid="xray-hud-button"
          aria-label={isXRayActive ? 'Disable 3D System X-Ray' : 'Enable 3D System X-Ray'}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
            isXRayActive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 ${isXRayActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span>X-RAY</span>
          <kbd className="text-[10px] px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">
            X
          </kbd>
        </button>

        {/* Open Full Reality Inspector Modal button */}
        <button
          onClick={() => setModalOpen(true)}
          data-testid="xray-open-modal-button"
          aria-label="Open Frontier Reality Engine Inspector"
          title="Open Full Reality Inspector (Causal DAG, Timeline, Push-To-Prove Lab, Incident Time Machine)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/40 border border-cyan-800/50 transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline text-[11px] font-medium">REALITY LAB</span>
          <Maximize2 className="w-3 h-3 text-cyan-400 opacity-70" />
        </button>
      </div>

      {/* Mini Active Status Pill when in 3D X-Ray mode */}
      {isXRayActive && (
        <div
          data-testid="xray-status-pill"
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950/90 border border-emerald-500/40 text-[10px] text-emerald-300 shadow-md animate-in fade-in"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>3D TELEMETRY CONDUITS ACTIVE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{activeTrace?.spans.length || 7} NODES</span>
        </div>
      )}
    </div>
  );
}
