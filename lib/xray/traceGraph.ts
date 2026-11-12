/**
 * FRONTIER X-RAY: THE ENGINEERING REALITY ENGINE
 * Causal Execution Graph Builder
 */

import { facilities } from "@/data/facilities";
import { ExecutionGraph, ExecutionGraphNode, ExecutionGraphEdge, TraceRecord, TraceSpan } from "./types";

export function buildExecutionGraph(trace: TraceRecord): ExecutionGraph {
  const nodeMap = new Map<string, ExecutionGraphNode>();
  const parentChildMap = new Map<string, string[]>();
  const childParentMap = new Map<string, string[]>();
  const rootNodeIds: string[] = [];

  // Group by spans
  for (const span of trace.spans) {
    if (span.parentSpanId) {
      const children = parentChildMap.get(span.parentSpanId) || [];
      children.push(span.spanId);
      parentChildMap.set(span.parentSpanId, children);

      const parents = childParentMap.get(span.spanId) || [];
      parents.push(span.parentSpanId);
      childParentMap.set(span.spanId, parents);
    } else {
      rootNodeIds.push(span.spanId);
    }
  }

  // Compute depth via BFS
  const depthMap = new Map<string, number>();
  const queue: Array<{ id: string; depth: number }> = rootNodeIds.map(id => ({ id, depth: 0 }));

  while (queue.length > 0) {
    const current = queue.shift()!;
    depthMap.set(current.id, current.depth);

    const children = parentChildMap.get(current.id) || [];
    for (const childId of children) {
      if (!depthMap.has(childId)) {
        queue.push({ id: childId, depth: current.depth + 1 });
      }
    }
  }

  // Build nodes with 3D facility coordinates
  const nodes: ExecutionGraphNode[] = trace.spans.map((span: TraceSpan) => {
    const fac = facilities.find(f => f.id === span.facilityId);
    const coords: [number, number, number] = fac
      ? [fac.approachPosition[0], fac.approachPosition[1] + 1.2, fac.approachPosition[2]]
      : [0, 1.2, 0];

    const node: ExecutionGraphNode = {
      id: span.spanId,
      name: span.name,
      subsystem: span.subsystem,
      facilityId: span.facilityId,
      position3D: coords,
      span,
      parentIds: childParentMap.get(span.spanId) || [],
      childIds: parentChildMap.get(span.spanId) || [],
      depth: depthMap.get(span.spanId) || 0,
    };
    nodeMap.set(span.spanId, node);
    return node;
  });

  // Build edges
  const edges: ExecutionGraphEdge[] = [];
  for (const span of trace.spans) {
    if (span.parentSpanId && nodeMap.has(span.parentSpanId)) {
      edges.push({
        id: `edge_${span.parentSpanId}_${span.spanId}`,
        fromNodeId: span.parentSpanId,
        toNodeId: span.spanId,
        kind: "causal",
        dataPayloadSummary: Object.keys(span.inputSummary).slice(0, 3).join(", "),
      });
    }
  }

  return {
    nodes,
    edges,
    rootNodeIds,
    subsystem: trace.subsystem,
    traceId: trace.traceId,
  };
}

