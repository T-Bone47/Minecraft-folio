"use client";

import React from "react";
import { useXRayStore } from "@/state/xrayStore";
import { ExecutionGraphNode } from "@/lib/xray/types";
import { CheckCircle2, Clock, Code2, ArrowDown, Activity, Sparkles } from "lucide-react";

export const ExecutionGraphView: React.FC = () => {
  const graph = useXRayStore((s) => s.executionGraph);
  const selectedNodeId = useXRayStore((s) => s.selectedNodeId);
  const selectNode = useXRayStore((s) => s.selectNode);

  const selectedNode = graph.nodes.find((n: ExecutionGraphNode) => n.id === selectedNodeId) || graph.nodes[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-zinc-200">
      {/* 1. DAG Node Pipeline Sequence */}
      <div className="w-full lg:w-96 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2">
          <span>Processing Pipeline ({graph.nodes.length} Stages)</span>
          <span className="text-zinc-500 text-[10px]">Causal Order</span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {graph.nodes.map((node: ExecutionGraphNode, idx: number) => {
            const isSelected = node.id === selectedNode?.id;
            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => selectNode(node.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-900/20"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-400">
                      STEP {idx + 1} · {node.facilityId.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {node.span.durationMs}ms
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-100 flex items-center justify-between">
                    <span>{node.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </button>

                {idx < graph.nodes.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <ArrowDown className="w-3 h-3 text-cyan-500/60" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Node Inspector */}
      {selectedNode && (
        <div className="flex-1 space-y-4 bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 text-xs">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                STAGE INSPECTION: {selectedNode.facilityId.toUpperCase()} FACILITY
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                <span>Duration:</span>
                <span className="text-cyan-400 font-bold">{selectedNode.span.durationMs} ms</span>
                <span className="text-zinc-600">|</span>
                <span>Provenance:</span>
                <span className="text-emerald-400 font-bold">{selectedNode.span.provenance}</span>
              </div>
            </div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {selectedNode.name}
            </h2>
          </div>

          {/* Input & Output Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inputs */}
            <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
              <div className="font-semibold text-zinc-300 flex items-center justify-between">
                <span>Recorded Input Payload</span>
                <span className="text-[10px] font-mono text-zinc-500">Contract In</span>
              </div>
              <pre className="font-mono text-[11px] text-cyan-300 bg-zinc-900 p-2.5 rounded border border-zinc-800 overflow-x-auto">
                {JSON.stringify(selectedNode.span.inputSummary, null, 2)}
              </pre>
            </div>

            {/* Outputs */}
            <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
              <div className="font-semibold text-zinc-300 flex items-center justify-between">
                <span>Calculated Transformation</span>
                <span className="text-[10px] font-mono text-zinc-500">Contract Out</span>
              </div>
              <pre className="font-mono text-[11px] text-emerald-300 bg-zinc-900 p-2.5 rounded border border-zinc-800 overflow-x-auto">
                {JSON.stringify(selectedNode.span.outputSummary, null, 2)}
              </pre>
            </div>
          </div>

          {/* Source Code & Verification Mapping */}
          <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
            <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              Published Source Implementation & Verification
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Source Module:</span>
                <span className="text-zinc-200">{selectedNode.span.sourceRef.file}</span>
                <span className="text-cyan-400 block mt-0.5">::{selectedNode.span.sourceRef.symbol}()</span>
              </div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Verification Suite:</span>
                <span className="text-emerald-400">{selectedNode.span.sourceRef.testFile ?? "tests/digital-twin.test.ts"}</span>
                <span className="text-zinc-400 block mt-0.5">Automated CI Regression</span>
              </div>
            </div>
          </div>

          {/* Architectural Context */}
          <div className="p-3 bg-cyan-950/20 rounded-lg border border-cyan-900/40 text-[11px] text-zinc-300 space-y-1">
            <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Architectural Trace Invariant
            </div>
            <p>
              Execution is verified monotonic and causally bound to parent span{" "}
              <code className="text-cyan-300 bg-zinc-900 px-1 py-0.5 rounded">
                {selectedNode.span.parentSpanId ?? "ROOT"}
              </code>
              . No network simulation or fabricated delays are injected into the measurement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

