"use client";

import React, { useState, useMemo } from "react";
import { FORGE_BLOCKS } from "@/lib/forge/blockRegistry";
import {
  PRESET_BLUEPRINTS,
  serializeBlueprint,
  parseBlueprint,
} from "@/lib/forge/blueprintSerializer";
import { executeForgePipeline } from "@/lib/forge/executionEngine";
import { validateForgeBlueprint } from "@/lib/forge/graphValidator";
import type {
  ExecutionTrace,
  ForgeBlueprint,
  ForgeEdge,
  ForgeNode,
} from "@/lib/forge/types";
import { ForgeDebriefModal } from "./ForgeDebriefModal";
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export function SystemsForgeEditor() {
  const [activePresetKey, setActivePresetKey] = useState<string>("gold_standard_telemetry");
  const [blueprint, setBlueprint] = useState<ForgeBlueprint>(
    PRESET_BLUEPRINTS.gold_standard_telemetry
  );
  const [executionTrace, setExecutionTrace] = useState<ExecutionTrace | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Validate current blueprint
  const validation = useMemo(() => validateForgeBlueprint(blueprint), [blueprint]);

  // Handle preset change
  const handleSelectPreset = (key: string) => {
    if (PRESET_BLUEPRINTS[key]) {
      setActivePresetKey(key);
      setBlueprint(JSON.parse(JSON.stringify(PRESET_BLUEPRINTS[key])));
      setExecutionTrace(null);
    }
  };

  // Add block
  const handleAddBlock = (blockType: string) => {
    const blockDef = FORGE_BLOCKS[blockType];
    if (!blockDef) return;

    const newId = `node-${Date.now()}`;
    const newNode: ForgeNode = {
      id: newId,
      blockType,
      x: 100 + blueprint.nodes.length * 40,
      y: 120,
      config: {},
    };

    setBlueprint((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
  };

  // Remove block
  const handleRemoveNode = (nodeId: string) => {
    setBlueprint((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
      edges: prev.edges.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId),
    }));
  };

  // Connect adjacent nodes automatically
  const handleAutoConnect = () => {
    const newEdges: ForgeEdge[] = [];
    for (let i = 0; i < blueprint.nodes.length - 1; i++) {
      const src = blueprint.nodes[i];
      const tgt = blueprint.nodes[i + 1];
      const srcBlock = FORGE_BLOCKS[src.blockType];
      const tgtBlock = FORGE_BLOCKS[tgt.blockType];

      if (srcBlock?.outputPorts[0] && tgtBlock?.inputPorts[0]) {
        newEdges.push({
          id: `edge-${src.id}-${tgt.id}`,
          sourceNodeId: src.id,
          sourcePortId: srcBlock.outputPorts[0].id,
          targetNodeId: tgt.id,
          targetPortId: tgtBlock.inputPorts[0].id,
        });
      }
    }
    setBlueprint((prev) => ({ ...prev, edges: newEdges }));
  };

  // Run simulation
  const handleRunSimulation = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const trace = executeForgePipeline(blueprint);
      setExecutionTrace(trace);
      setIsExecuting(false);
      setShowDebrief(true);
    }, 400);
  };

  // Export
  const handleExportJson = () => {
    const jsonStr = serializeBlueprint(blueprint);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blueprint-${blueprint.id || "custom"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import
  const handleImportJson = () => {
    const { blueprint: imported, error } = parseBlueprint(importJsonText);
    if (error) {
      setImportError(error);
      return;
    }
    if (imported) {
      setBlueprint(imported);
      setShowImportModal(false);
      setImportJsonText("");
      setImportError(null);
      setExecutionTrace(null);
    }
  };

  return (
    <div className="w-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-100">
      {/* Top Header & Presets */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-zinc-300">
            FRONTIER SYSTEMS FORGE
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Executable Architecture Builder
          </span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-zinc-500 hidden md:inline">Presets:</span>
          {Object.entries(PRESET_BLUEPRINTS).map(([k, p]) => (
            <button
              key={k}
              onClick={() => handleSelectPreset(k)}
              className={`px-3 py-1 rounded transition-colors ${
                activePresetKey === k
                  ? "bg-red-600 text-white font-bold border border-red-500 shadow-sm"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              {p.name.split(" ")[0]} ({p.recommendedRole || "demo"})
            </button>
          ))}
        </div>
      </div>

      {/* Editor Main Canvas & Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-zinc-800 min-h-[480px]">
        {/* Left: Building Block Palette (3 cols) */}
        <div className="lg:col-span-3 p-5 bg-zinc-950/80 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Available Blocks</span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {Object.values(FORGE_BLOCKS).map((b) => (
                <button
                  key={b.type}
                  onClick={() => handleAddBlock(b.type)}
                  className="w-full text-left p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all group flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: b.color }}
                      />
                      <span className="text-xs font-mono font-bold text-zinc-300 group-hover:text-white">
                        {b.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 line-clamp-1 mt-0.5">
                      {b.description}
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 flex-shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Helper */}
          <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
            Click any block above to append it to your pipeline. Connect blocks to compile a directed graph.
          </div>
        </div>

        {/* Center / Right: Graph Canvas & Pipeline Visualizer (9 cols) */}
        <div className="lg:col-span-9 p-6 bg-zinc-950 flex flex-col justify-between space-y-6">
          {/* Blueprint Title & Description */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-retro text-white">
                {blueprint.name}
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">{blueprint.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoConnect}
                title="Connect blocks in order"
                className="px-2.5 py-1 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded"
              >
                Auto-Connect Sequence
              </button>
            </div>
          </div>

          {/* Block Pipeline Pipeline Flow Visualizer */}
          <div className="flex-1 flex flex-col justify-center py-6">
            <div className="flex items-center gap-2 overflow-x-auto p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 min-h-[160px]">
              {blueprint.nodes.map((node, idx) => {
                const blockDef = FORGE_BLOCKS[node.blockType];
                if (!blockDef) return null;

                return (
                  <React.Fragment key={node.id}>
                    <div className="flex-shrink-0 w-44 p-3 rounded-lg border border-zinc-700 bg-zinc-900 relative shadow-lg group">
                      {/* Color Strip */}
                      <div
                        className="h-1 w-full rounded-t -mt-3 -mx-3 mb-2"
                        style={{ backgroundColor: blockDef.color }}
                      />

                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-mono font-bold text-white truncate">
                          {blockDef.name}
                        </span>
                        <button
                          onClick={() => handleRemoveNode(node.id)}
                          aria-label={`Remove block ${blockDef.name}`}
                          className="text-zinc-500 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-zinc-400 mt-1 line-clamp-2">
                        {blockDef.description}
                      </div>

                      <div className="mt-2.5 pt-1.5 border-t border-zinc-800 flex justify-between text-[9px] font-mono text-zinc-500">
                        <span>{blockDef.inputPorts[0]?.type || "none"}</span>
                        <span>{blockDef.outputPorts[0]?.type || "none"}</span>
                      </div>
                    </div>

                    {idx < blueprint.nodes.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}

              {blueprint.nodes.length === 0 && (
                <div className="w-full text-center py-8 text-xs font-mono text-zinc-500">
                  Canvas is empty. Add blocks from the left palette or select a preset above.
                </div>
              )}
            </div>
          </div>

          {/* Graph Validation Status Strip */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              {validation.valid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">
                    Graph Topology Valid (DAG, {validation.topologicalOrder.length} stages)
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 font-bold">
                    Validation Issues ({validation.issues.length})
                  </span>
                </>
              )}
            </div>

            {validation.issues.length > 0 && (
              <div className="text-zinc-400 text-[11px] truncate max-w-md">
                {validation.issues[0].message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-zinc-950 border-t border-zinc-800 gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSimulation}
            disabled={isExecuting}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold uppercase transition-colors shadow-lg shadow-red-950/50 disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Pipeline Simulation</span>
              </>
            )}
          </button>

          {executionTrace && (
            <button
              onClick={() => setShowDebrief(true)}
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 transition-colors"
            >
              View Last Debrief
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>
        </div>
      </div>

      {/* Debrief Modal */}
      {showDebrief && executionTrace && (
        <ForgeDebriefModal
          trace={executionTrace}
          onClose={() => setShowDebrief(false)}
          onExportJson={handleExportJson}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4 text-zinc-200 font-mono text-xs">
            <h3 className="text-sm font-bold uppercase text-white font-retro">Import Blueprint JSON</h3>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste blueprint JSON here..."
              className="w-full p-3 bg-black border border-zinc-800 rounded font-mono text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
            {importError && <div className="text-red-400">{importError}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Load Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

