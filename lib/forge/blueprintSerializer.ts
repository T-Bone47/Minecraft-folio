/**
 * FRONTIER SYSTEMS FORGE — BLUEPRINT SERIALIZER & PRESETS
 * Safe JSON serialization, deserialization, and production baseline presets.
 */

import type { ForgeBlueprint } from "./types";

export const PRESET_BLUEPRINTS: Record<string, ForgeBlueprint> = {
  gold_standard_telemetry: {
    id: "gold_standard_telemetry",
    name: "Production Telemetry Pipeline (Gold Standard)",
    description:
      "Fully protected high-throughput telemetry pipeline with schema validation, LRU deduplication, and TimescaleDB storage.",
    recommendedRole: "motorsport",
    nodes: [
      { id: "node-1", blockType: "source_f1_udp", x: 60, y: 120, config: {} },
      { id: "node-2", blockType: "validator_schema", x: 280, y: 120, config: {} },
      { id: "node-3", blockType: "deduplicator_lru", x: 500, y: 120, config: {} },
      { id: "node-4", blockType: "transformer_canonical", x: 720, y: 120, config: {} },
      { id: "node-5", blockType: "storage_timescaledb", x: 940, y: 120, config: {} },
    ],
    edges: [
      {
        id: "edge-1",
        sourceNodeId: "node-1",
        sourcePortId: "out_raw",
        targetNodeId: "node-2",
        targetPortId: "in_raw",
      },
      {
        id: "edge-2",
        sourceNodeId: "node-2",
        sourcePortId: "out_validated",
        targetNodeId: "node-3",
        targetPortId: "in_stream",
      },
      {
        id: "edge-3",
        sourceNodeId: "node-3",
        sourcePortId: "out_deduped",
        targetNodeId: "node-4",
        targetPortId: "in_validated",
      },
      {
        id: "edge-4",
        sourceNodeId: "node-4",
        sourcePortId: "out_canonical",
        targetNodeId: "node-5",
        targetPortId: "in_events",
      },
    ],
  },

  strategy_analytics_pipeline: {
    id: "strategy_analytics_pipeline",
    name: "Tactical Race Strategy & Wear Pipeline",
    description:
      "Online compound degradation calculation and stint pace delta derivation feeding storage and monitoring.",
    recommendedRole: "aiml",
    nodes: [
      { id: "node-1", blockType: "source_openf1", x: 60, y: 140, config: {} },
      { id: "node-2", blockType: "validator_schema", x: 280, y: 140, config: {} },
      { id: "node-3", blockType: "transformer_canonical", x: 500, y: 140, config: {} },
      { id: "node-4", blockType: "analytics_wear", x: 720, y: 140, config: {} },
      { id: "node-5", blockType: "storage_timescaledb", x: 940, y: 140, config: {} },
    ],
    edges: [
      {
        id: "edge-1",
        sourceNodeId: "node-1",
        sourcePortId: "out_raw",
        targetNodeId: "node-2",
        targetPortId: "in_raw",
      },
      {
        id: "edge-2",
        sourceNodeId: "node-2",
        sourcePortId: "out_validated",
        targetNodeId: "node-3",
        targetPortId: "in_validated",
      },
      {
        id: "edge-3",
        sourceNodeId: "node-3",
        sourcePortId: "out_canonical",
        targetNodeId: "node-4",
        targetPortId: "in_canonical",
      },
      {
        id: "edge-4",
        sourceNodeId: "node-4",
        sourcePortId: "out_enriched",
        targetNodeId: "node-5",
        targetPortId: "in_events",
      },
    ],
  },

  vulnerable_unchecked_pipeline: {
    id: "vulnerable_unchecked_pipeline",
    name: "Unchecked Pipeline (Fault Demonstration)",
    description:
      "Intentionally omitted schema validator and deduplicator to demonstrate corrupt packet leakage and downstream failures.",
    recommendedRole: "backend",
    nodes: [
      { id: "node-1", blockType: "source_f1_udp", x: 60, y: 120, config: {} },
      { id: "node-2", blockType: "transformer_canonical", x: 380, y: 120, config: {} },
      { id: "node-3", blockType: "storage_timescaledb", x: 700, y: 120, config: {} },
    ],
    edges: [
      {
        id: "edge-1",
        sourceNodeId: "node-1",
        sourcePortId: "out_raw",
        targetNodeId: "node-2",
        // Note: Intentional type mismatch in vulnerable preset
        targetPortId: "in_validated",
      },
      {
        id: "edge-2",
        sourceNodeId: "node-2",
        sourcePortId: "out_canonical",
        targetNodeId: "node-3",
        targetPortId: "in_events",
      },
    ],
  },
};

export function serializeBlueprint(blueprint: ForgeBlueprint): string {
  return JSON.stringify(blueprint, null, 2);
}

export function parseBlueprint(jsonStr: string): { blueprint?: ForgeBlueprint; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return { error: "Blueprint JSON must contain nodes and edges arrays." };
    }
    return { blueprint: parsed as ForgeBlueprint };
  } catch (err: any) {
    return { error: err?.message || "Invalid JSON syntax" };
  }
}

