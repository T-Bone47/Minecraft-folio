"use client";

import React, { useState } from "react";
import { useTrialsStore } from "@/state/trialsStore";
import { getTrialById } from "@/lib/trials/scenarioRegistry";
import { worldSound } from "@/lib/audio";
import {
  HelpCircle,
  CheckCircle,
  AlertOctagon,
  ChevronRight,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldAlert,
  Zap,
} from "lucide-react";

export function TrialInvestigationModal({ onClose }: { onClose: () => void }) {
  const {
    activeTrialId,
    trialState,
    guidanceMode,
    selectedHypothesisId,
    selectedActionId,
    evidenceExamined,
    npcDialogueText,
    advanceToInvestigation,
    examineEvidence,
    selectHypothesis,
    selectAction,
    submitEvaluation,
    resetTrial,
  } = useTrialsStore();

  const [activeTab, setActiveTab] = useState<"briefing" | "evidence" | "action">(
    trialState === "BRIEFING" ? "briefing" : "evidence"
  );

  const scenario = activeTrialId ? getTrialById(activeTrialId) : null;
  if (!scenario) return null;

  const isRace = scenario.division === "race_performance";
  const isAiml = scenario.division === "ml_reliability";
  const isSystems = scenario.division === "systems_reliability";

  const handleInspect = (key: string) => {
    worldSound.playInspect();
    examineEvidence(key);
  };

  const selectedHypo = scenario.hypotheses.find((h) => h.id === selectedHypothesisId);
  const selectedAct = scenario.actions.find((a) => a.id === selectedActionId);

  return (
    <div className="text-zinc-100 font-sans max-h-[84vh] overflow-y-auto pr-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 inline-block ${
                isRace ? "bg-red-500" : isAiml ? "bg-cyan-400" : "bg-emerald-400"
              }`}
            />
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
              {scenario.provenanceLabel}
            </span>
          </div>
          <h2 className="font-silkscreen text-base sm:text-lg text-zinc-100 font-bold mt-0.5">
            {scenario.title}
          </h2>
          <p className="text-xs text-zinc-400 font-mono">{scenario.subtitle}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 text-[11px] font-mono">
          <button
            onClick={() => {
              worldSound.playClick();
              setActiveTab("briefing");
            }}
            className={`px-3 py-1 transition-all ${
              activeTab === "briefing"
                ? "bg-zinc-800 text-white font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            1. BRIEFING
          </button>
          <button
            onClick={() => {
              worldSound.playClick();
              if (trialState === "BRIEFING") advanceToInvestigation();
              setActiveTab("evidence");
            }}
            className={`px-3 py-1 transition-all ${
              activeTab === "evidence"
                ? "bg-zinc-800 text-white font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            2. EVIDENCE
          </button>
          <button
            onClick={() => {
              worldSound.playClick();
              setActiveTab("action");
            }}
            className={`px-3 py-1 transition-all ${
              activeTab === "action"
                ? "bg-zinc-800 text-white font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            3. INTERVENTION
          </button>
        </div>
      </div>

      {/* NPC Dialogue Box */}
      <div className="bg-zinc-900/90 border border-zinc-700/80 p-3 mb-4 flex items-start gap-3">
        <div
          className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border font-silkscreen font-bold text-xs ${
            isRace
              ? "bg-red-950 border-red-700 text-red-200"
              : isAiml
              ? "bg-cyan-950 border-cyan-700 text-cyan-200"
              : "bg-emerald-950 border-emerald-700 text-emerald-200"
          }`}
        >
          {scenario.npc.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-300 font-bold">
              {scenario.npc.name} {"//"} {scenario.npc.role}
            </span>
            {guidanceMode === "guided" && (
              <button
                onClick={() => {
                  worldSound.playInspect();
                  useTrialsStore.setState({
                    npcDialogueText: scenario.npc.dialogue.hint,
                  });
                }}
                className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2"
              >
                <HelpCircle className="w-3 h-3" /> REQUEST HINT
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-300 font-mono mt-1 leading-relaxed">
            &ldquo;{npcDialogueText || scenario.npc.dialogue.duringInvestigation}&rdquo;
          </p>
        </div>
      </div>

      {/* Tab 1: Briefing */}
      {activeTab === "briefing" && (
        <div className="space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 p-4">
            <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider mb-2">
              INCIDENT CONTEXT & OPERATIONAL OBJECTIVE
            </h3>
            <p className="text-sm text-zinc-300 font-mono leading-relaxed">
              {scenario.briefing}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900/40 border border-zinc-800 p-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Facility & Operational Location
              </span>
              <div className="text-sm font-silkscreen text-zinc-200 mt-1">
                {scenario.locationName}
              </div>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 p-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Investigation Mode
              </span>
              <div className="text-sm font-silkscreen text-zinc-200 mt-1 uppercase">
                {guidanceMode} EVALUATION
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              worldSound.playClick();
              advanceToInvestigation();
              setActiveTab("evidence");
            }}
            className="w-full py-2.5 font-silkscreen text-xs font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <span>PROCEED TO EVIDENCE WORKBENCH</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab 2: Evidence Workbench */}
      {activeTab === "evidence" && (
        <div className="space-y-4">
          {/* Race Performance Evidence */}
          {isRace && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500">STINT LAP TIME</div>
                  <div className="text-lg font-silkscreen text-red-400 mt-0.5">
                    {String(scenario.investigationData.stintLapTimeS)}s
                  </div>
                </div>
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500">BENCHMARK LAP</div>
                  <div className="text-lg font-silkscreen text-zinc-300 mt-0.5">
                    {String(scenario.investigationData.referenceLapTimeS)}s
                  </div>
                </div>
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500">ACCUMULATED DEFICIT</div>
                  <div className="text-lg font-silkscreen text-amber-400 mt-0.5">
                    +{String(scenario.investigationData.lapDeltaS)}s
                  </div>
                </div>
              </div>

              {/* Corner Segment Table */}
              <div className="bg-zinc-900/80 border border-zinc-800 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-zinc-200">
                    FOUR-CORNER SPATIAL TELEMETRY BREAKDOWN
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Click corner to inspect telemetry trace
                  </span>
                </div>
                <div className="space-y-2">
                  {(
                    scenario.investigationData.corners as Array<{
                      name: string;
                      approachSpeedKmh: number;
                      apexSpeedKmh: number;
                      refApexSpeedKmh: number;
                      timeDeltaS: number;
                      brakingOnsetM?: number;
                      refBrakingOnsetM?: number;
                      observation: string;
                    }>
                  ).map((c, i) => {
                    const isDeficit = c.timeDeltaS > 0.1;
                    return (
                      <div
                        key={i}
                        onClick={() => handleInspect(`corner_${i + 1}`)}
                        className={`p-2.5 border cursor-pointer transition-colors ${
                          isDeficit
                            ? "bg-red-950/20 border-red-700/60 hover:border-red-500"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-silkscreen text-xs font-bold text-zinc-200">
                            {c.name}
                          </span>
                          <span
                            className={`font-mono text-xs font-bold ${
                              c.timeDeltaS > 0 ? "text-red-400" : "text-emerald-400"
                            }`}
                          >
                            {c.timeDeltaS > 0 ? `+${c.timeDeltaS}s` : `${c.timeDeltaS}s`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[11px] font-mono text-zinc-400">
                          <div>
                            Approach: <span className="text-zinc-200">{c.approachSpeedKmh} km/h</span>
                          </div>
                          <div>
                            Stint Apex:{" "}
                            <span className={isDeficit ? "text-red-400 font-bold" : "text-zinc-200"}>
                              {c.apexSpeedKmh} km/h
                            </span>
                          </div>
                          <div>
                            Ref Apex: <span className="text-zinc-200">{c.refApexSpeedKmh} km/h</span>
                          </div>
                          {c.brakingOnsetM && (
                            <div>
                              Brake Onset:{" "}
                              <span className="text-amber-400 font-bold">
                                {c.brakingOnsetM}m (Ref: {c.refBrakingOnsetM}m)
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1 italic">
                          &gt; {c.observation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* AI/ML Reliability Evidence */}
          {isAiml && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500">OFFLINE HOLDOUT R²</div>
                  <div className="text-lg font-silkscreen text-emerald-400 mt-0.5">
                    {String(scenario.investigationData.offlineR2)} (99.8%)
                  </div>
                </div>
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500">OFFLINE RMSE</div>
                  <div className="text-lg font-silkscreen text-zinc-300 mt-0.5">
                    {String(scenario.investigationData.offlineRMSE)}
                  </div>
                </div>
                <div className="bg-zinc-900 p-3 border border-red-900/60 bg-red-950/20">
                  <div className="text-[10px] font-mono text-red-400">LIVE STREAMING RMSE</div>
                  <div className="text-lg font-silkscreen text-red-400 mt-0.5">
                    {String(scenario.investigationData.onlineStreamingRMSE)} (COLLAPSE)
                  </div>
                </div>
              </div>

              {/* Feature Correlation & Importance */}
              <div className="bg-zinc-900/80 border border-zinc-800 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-zinc-200">
                    FEATURE CORRELATION & ATTRIBUTION WEIGHTS
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Target: {String(scenario.investigationData.targetVariable)}
                  </span>
                </div>
                <div className="space-y-2">
                  {(
                    scenario.investigationData.features as Array<{
                      name: string;
                      correlationWithTarget: number;
                      importanceWeight: number;
                      description: string;
                    }>
                  ).map((f, i) => {
                    const isLeaking = Math.abs(f.correlationWithTarget) > 0.95;
                    return (
                      <div
                        key={i}
                        onClick={() => handleInspect(`feature_${f.name}`)}
                        className={`p-2.5 border cursor-pointer transition-colors ${
                          isLeaking
                            ? "bg-red-950/30 border-red-600 hover:border-red-400"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-zinc-200 flex items-center gap-2">
                            {f.name}
                            {isLeaking && (
                              <span className="text-[9px] bg-red-900 text-red-200 px-1.5 py-0.2 border border-red-600">
                                LEAK DETECTED
                              </span>
                            )}
                          </span>
                          <span
                            className={`font-mono text-xs font-bold ${
                              isLeaking ? "text-red-400" : "text-cyan-400"
                            }`}
                          >
                            r = {f.correlationWithTarget} | Weight: {f.importanceWeight}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1">
                          {f.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Systems Reliability Evidence */}
          {isSystems && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500">INGESTION RATE</div>
                  <div className="text-lg font-silkscreen text-zinc-300 mt-0.5">
                    {String(scenario.investigationData.ingestionRateHz)} Hz
                  </div>
                </div>
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500">BANDWIDTH LOAD</div>
                  <div className="text-lg font-silkscreen text-emerald-400 mt-0.5">
                    {String(scenario.investigationData.brokerBandwidthUsageKbps)} Kbps
                  </div>
                </div>
                <div className="bg-zinc-900 p-3 border border-red-900/60 bg-red-950/20">
                  <div className="text-[10px] font-mono text-red-400">DOWNSTREAM EXCEPTIONS</div>
                  <div className="text-lg font-silkscreen text-red-400 mt-0.5">
                    {String(scenario.investigationData.downstreamNaNExceptions)} NaN ERRORS
                  </div>
                </div>
              </div>

              {/* Packet Ingestion Trace Log */}
              <div className="bg-zinc-900/80 border border-zinc-800 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-zinc-200">
                    STAGE 3 INGESTION BUFFER TRACE DUMP
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Click entry to flag in audit
                  </span>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {(
                    scenario.investigationData.sampleTraces as Array<{
                      seqId: number;
                      timestampMs: number;
                      distanceM: number;
                      status: string;
                      note?: string;
                    }>
                  ).map((p, idx) => {
                    const isFault = p.status !== "OK";
                    return (
                      <div
                        key={idx}
                        onClick={() => handleInspect(`trace_${p.seqId}`)}
                        className={`p-2 border flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-1 ${
                          isFault
                            ? "bg-red-950/30 border-red-700/80 text-red-200"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">SEQ #{p.seqId}</span>
                          <span className="text-zinc-500">|</span>
                          <span>{p.timestampMs}ms</span>
                          <span className="text-zinc-500">|</span>
                          <span>d: {p.distanceM}m</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 border ${
                              isFault
                                ? "bg-red-900 text-red-200 border-red-600"
                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                            }`}
                          >
                            {p.status}
                          </span>
                          {p.note && <span className="text-zinc-400">{p.note}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Formulate Diagnostic Hypothesis */}
          <div className="bg-zinc-900/90 border border-zinc-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-silkscreen font-bold text-zinc-100 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                SELECT DIAGNOSTIC HYPOTHESIS
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                (Click to commit diagnosis)
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {scenario.hypotheses.map((hypo) => {
                const isSelected = selectedHypothesisId === hypo.id;
                return (
                  <button
                    key={hypo.id}
                    onClick={() => {
                      worldSound.playClick();
                      selectHypothesis(hypo.id);
                    }}
                    className={`w-full p-3 text-left border transition-all ${
                      isSelected
                        ? "bg-red-950/60 border-red-500 text-white shadow-sm shadow-red-950/50"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-silkscreen text-xs font-bold">
                        {hypo.label}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-red-400 font-bold">
                          SELECTED
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {hypo.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation to Action */}
          {selectedHypo && (
            <button
              onClick={() => {
                worldSound.playClick();
                setActiveTab("action");
              }}
              className="w-full py-2.5 font-silkscreen text-xs font-bold bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <span>PROCEED TO ENGINEERING INTERVENTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Tab 3: Engineering Intervention */}
      {activeTab === "action" && (
        <div className="space-y-4">
          <div className="bg-zinc-900/80 border border-zinc-800 p-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Confirmed Working Diagnosis
            </span>
            <div className="font-silkscreen text-xs text-zinc-200 mt-1">
              {selectedHypo ? selectedHypo.label : "None selected yet"}
            </div>
            {selectedHypo && (
              <p className="text-xs font-mono text-zinc-400 mt-1">
                {selectedHypo.feedback}
              </p>
            )}
          </div>

          <div className="bg-zinc-900/90 border border-zinc-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-silkscreen font-bold text-zinc-100 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                SELECT ENGINEERING INTERVENTION
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                (Simulates physical / architectural consequences)
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {scenario.actions.map((action) => {
                const isSelected = selectedActionId === action.id;
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      worldSound.playClick();
                      selectAction(action.id);
                    }}
                    className={`w-full p-3 text-left border transition-all ${
                      isSelected
                        ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm shadow-emerald-950/50"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-silkscreen text-xs font-bold">
                        {action.label}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          STAGED FOR DEPLOYMENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {action.description}
                    </p>

                    <div className="mt-2 text-[10px] font-mono text-zinc-500">
                      <strong>Trade-offs:</strong> {action.tradeOffs.join(" • ")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              disabled={!selectedHypothesisId || !selectedActionId}
              onClick={() => {
                worldSound.playInspect();
                submitEvaluation();
              }}
              className={`flex-1 py-3 font-silkscreen text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                selectedHypothesisId && selectedActionId
                  ? "bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-md shadow-red-950/50"
                  : "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>SUBMIT EVALUATION & GENERATE DEBRIEF</span>
            </button>

            <button
              onClick={() => {
                worldSound.playClick();
                resetTrial();
              }}
              className="px-3 py-3 font-mono text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800"
            >
              RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
