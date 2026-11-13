/**
 * FRONTIER SYSTEMS FORGE — GRAPH VALIDATOR
 * Verifies directed acyclic pipeline graphs, checks port type signatures,
 * and detects cycles.
 */

import { FORGE_BLOCKS } from "./blockRegistry";
import type { ForgeBlueprint, ForgeEdge, ForgeNode } from "./types";

export interface ValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface GraphValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  topologicalOrder: string[];
}

export function validateForgeBlueprint(blueprint: ForgeBlueprint): GraphValidationResult {
  const issues: ValidationIssue[] = [];
  const nodeMap = new Map<string, ForgeNode>();
  blueprint.nodes.forEach((n) => nodeMap.set(n.id, n));

  // 1. Edge validity & Port type matching
  for (const edge of blueprint.edges) {
    const srcNode = nodeMap.get(edge.sourceNodeId);
    const tgtNode = nodeMap.get(edge.targetNodeId);

    if (!srcNode) {
      issues.push({
        severity: "error",
        code: "INVALID_SOURCE_NODE",
        message: `Edge ${edge.id} references non-existent source node ${edge.sourceNodeId}`,
        edgeId: edge.id,
      });
      continue;
    }

    if (!tgtNode) {
      issues.push({
        severity: "error",
        code: "INVALID_TARGET_NODE",
        message: `Edge ${edge.id} references non-existent target node ${edge.targetNodeId}`,
        edgeId: edge.id,
      });
      continue;
    }

    const srcBlock = FORGE_BLOCKS[srcNode.blockType];
    const tgtBlock = FORGE_BLOCKS[tgtNode.blockType];

    const srcPort = srcBlock?.outputPorts.find((p) => p.id === edge.sourcePortId);
    const tgtPort = tgtBlock?.inputPorts.find((p) => p.id === edge.targetPortId);

    if (!srcPort) {
      issues.push({
        severity: "error",
        code: "INVALID_SOURCE_PORT",
        message: `Block ${srcBlock?.name || srcNode.blockType} has no output port ${edge.sourcePortId}`,
        nodeId: srcNode.id,
        edgeId: edge.id,
      });
      continue;
    }

    if (!tgtPort) {
      issues.push({
        severity: "error",
        code: "INVALID_TARGET_PORT",
        message: `Block ${tgtBlock?.name || tgtNode.blockType} has no input port ${edge.targetPortId}`,
        nodeId: tgtNode.id,
        edgeId: edge.id,
      });
      continue;
    }

    // Type signature check:
    // raw_packet_stream -> raw_packet_stream
    // validated_stream -> validated_stream
    // canonical_event_stream -> canonical_event_stream
    if (srcPort.type !== tgtPort.type) {
      issues.push({
        severity: "error",
        code: "PORT_TYPE_MISMATCH",
        message: `Type mismatch: ${srcPort.type} cannot connect to ${tgtPort.type} (Between ${srcBlock.name} and ${tgtBlock.name})`,
        edgeId: edge.id,
      });
    }
  }

  // 2. Cycle Detection (Topological Sort / DFS)
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  blueprint.nodes.forEach((n) => {
    adjacency.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  blueprint.edges.forEach((e) => {
    if (adjacency.has(e.sourceNodeId) && inDegree.has(e.targetNodeId)) {
      adjacency.get(e.sourceNodeId)!.push(e.targetNodeId);
      inDegree.set(e.targetNodeId, inDegree.get(e.targetNodeId)! + 1);
    }
  });

  // Kahn's algorithm for topological order & cycle detection
  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const topologicalOrder: string[] = [];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    topologicalOrder.push(curr);

    const neighbors = adjacency.get(curr) || [];
    for (const nbr of neighbors) {
      const newDeg = inDegree.get(nbr)! - 1;
      inDegree.set(nbr, newDeg);
      if (newDeg === 0) {
        queue.push(nbr);
      }
    }
  }

  if (topologicalOrder.length < blueprint.nodes.length) {
    issues.push({
      severity: "error",
      code: "CYCLE_DETECTED",
      message: "Pipeline contains a feedback loop or cycle. Streams must be strictly directed acyclic graphs.",
    });
  }

  // 3. Completeness checks: Has at least one source and one sink
  const hasSource = blueprint.nodes.some((n) => FORGE_BLOCKS[n.blockType]?.category === "source");
  const hasStorageOrMonitor = blueprint.nodes.some(
    (n) =>
      FORGE_BLOCKS[n.blockType]?.category === "storage" ||
      FORGE_BLOCKS[n.blockType]?.category === "monitor"
  );

  if (!hasSource) {
    issues.push({
      severity: "warning",
      code: "MISSING_SOURCE",
      message: "Pipeline lacks an input source node (e.g. F1 UDP Ingestion).",
    });
  }

  if (!hasStorageOrMonitor) {
    issues.push({
      severity: "warning",
      code: "MISSING_SINK",
      message: "Pipeline lacks a persistence or monitor sink (e.g. TimescaleDB).",
    });
  }

  const hasValidator = blueprint.nodes.some((n) => n.blockType === "validator_schema");
  if (!hasValidator) {
    issues.push({
      severity: "warning",
      code: "MISSING_VALIDATOR",
      message: "No schema validator present. Corrupt raw frames will not be sanitized.",
    });
  }

  const valid = issues.filter((i) => i.severity === "error").length === 0;

  return {
    valid,
    issues,
    topologicalOrder,
  };
}

