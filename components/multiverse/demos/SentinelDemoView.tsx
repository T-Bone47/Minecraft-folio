"use client";

import React from "react";
import { useMultiverseStore } from "@/state/multiverseStore";
import { ShieldAlert, ShieldCheck, Lock, Terminal, FileText, CheckCircle2, AlertOctagon, RefreshCw } from "lucide-react";

export const SentinelDemoView: React.FC = () => {
  const sentinelState = useMultiverseStore((s) => s.sentinelState);
  const selectSentinelIncident = useMultiverseStore((s) => s.selectSentinelIncident);
  const remediateSentinelIncident = useMultiverseStore((s) => s.remediateSentinelIncident);

  const {
    activeIncidents,
    selectedIncidentId,
    governanceScore,
    complianceFrameworks,
    remediationAuditLog,
  } = sentinelState;

  const selectedIncident = activeIncidents.find((i) => i.id === selectedIncidentId) || activeIncidents[0];

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans" data-testid="sentinel-demo-container">
      {/* 1. Header Banner & Provenance */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400 animate-pulse" />
            <h3 className="text-lg font-bold uppercase tracking-wider text-purple-300 font-mono">
              THE TRUST AND RISK OPERATIONS CENTRE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous enterprise AI governance, NIST AI RMF compliance enforcement, and cryptographic audit proofs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            PROVENANCE: REPRODUCIBLE_LOCAL_DEMO
          </span>
        </div>
      </div>

      {/* 2. Enterprise Governance Score & Compliance Coverage */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Governance Health Score */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold">
            Continuous GRC Score
          </div>
          <div className="text-3xl font-mono font-bold text-purple-400 my-2">
            {governanceScore.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Sub-40ms runtime interceptor active across all LLM inference clusters
          </div>
        </div>

        {/* Framework Coverage Cards */}
        {complianceFrameworks.slice(0, 3).map((fw) => (
          <div key={fw.name} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="text-[11px] font-mono font-bold text-slate-300 truncate" title={fw.name}>
              {fw.name.split("(")[0].trim()}
            </div>
            <div className="flex items-center justify-between my-2">
              <span className="text-lg font-mono font-bold text-slate-100">{fw.coverage}%</span>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  fw.status === "COMPLIANT"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : fw.status === "ACTION_REQUIRED"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {fw.status}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${fw.coverage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Live Incident Triage & Cryptographic Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Incident Queue */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">
              Active Control Incidents
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold">
              {activeIncidents.filter((i) => i.status !== "REMEDIATED").length} Open
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {activeIncidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => selectSentinelIncident(inc.id)}
                className={`p-3 rounded-lg text-left transition-all flex flex-col gap-1 ${
                  selectedIncidentId === inc.id
                    ? "bg-purple-950/60 border border-purple-500/50 shadow-md shadow-purple-950/50"
                    : "bg-slate-950/40 border border-slate-800/80 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {inc.id} • {inc.controlCode}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      inc.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : inc.severity === "HIGH"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <div className="text-xs text-slate-300 line-clamp-1">{inc.title}</div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>{inc.targetModel.split("-")[0]}</span>
                  <span className={inc.status === "REMEDIATED" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {inc.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Incident Deep Inspection & Remediation */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono uppercase font-bold text-purple-300">
                  {selectedIncident.id}: {selectedIncident.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Control: {selectedIncident.controlCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Target Model Cluster</div>
                <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                  {selectedIncident.targetModel}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Anomaly Metric Trigger</div>
                <div className="text-xs font-mono font-bold text-red-400 mt-0.5">
                  {selectedIncident.metricAnomaly}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
              <div className="text-[10px] font-mono uppercase text-slate-400">Blast Radius Assessment</div>
              <div className="text-xs text-slate-300">{selectedIncident.blastRadius}</div>

              <div className="text-[10px] font-mono uppercase text-slate-400 mt-2">
                Cryptographic Evidence Digest (SHA-256 HMAC)
              </div>
              <div className="font-mono text-[10px] text-purple-300 break-all bg-purple-950/20 p-2 rounded border border-purple-500/30">
                {selectedIncident.evidenceHash}
              </div>

              <div className="text-[10px] font-mono uppercase text-slate-400 mt-2">
                Recommended Automated Remediation
              </div>
              <div className="text-xs text-slate-300">{selectedIncident.recommendedRemediation}</div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400">
              Audit Status:{" "}
              <span className={selectedIncident.status === "REMEDIATED" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {selectedIncident.status}
              </span>
            </span>

            {selectedIncident.status !== "REMEDIATED" ? (
              <button
                onClick={() => remediateSentinelIncident(selectedIncident.id)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-950 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                EXECUTE REMEDIATION POLICY
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                REMEDIATION EXECUTED & AUDITED
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Immutable Audit Log */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono uppercase font-bold text-slate-300">
            Tamper-Evident GRC Audit Ledger (SHA-256 Merkle Log)
          </span>
        </div>
        <div className="flex flex-col gap-1 font-mono text-[11px] max-h-28 overflow-y-auto pr-1">
          {remediationAuditLog.map((log, idx) => (
            <div key={idx} className="text-slate-400">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
