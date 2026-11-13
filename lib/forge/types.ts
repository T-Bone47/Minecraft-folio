/**
 * FRONTIER SYSTEMS FORGE — TYPES & DATA MODEL
 * Pillar 2 of Frontier Evolution
 *
 * Defines typed blocks, directed graph blueprints, port schemas,
 * and deterministic execution traces.
 */

export type PortType =
  | "raw_packet_stream"
  | "validated_stream"
  | "canonical_event_stream"
  | "storage_record"
  | "alert_event";

export type BlockCategory = "source" | "processor" | "storage" | "monitor" | "fault_injector";

export interface ForgePort {
  id: string;
  name: string;
  type: PortType;
  direction: "in" | "out";
}

export interface ForgeBlockDefinition {
  type: string;
  name: string;
  category: BlockCategory;
  description: string;
  inputPorts: ForgePort[];
  outputPorts: ForgePort[];
  color: string;
  requiredForValidPipeline?: boolean;
}

export interface ForgeNode {
  id: string;
  blockType: string;
  x: number;
  y: number;
  config: Record<string, any>;
}

export interface ForgeEdge {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

export interface ForgeBlueprint {
  id: string;
  name: string;
  description: string;
  recommendedRole?: string;
  nodes: ForgeNode[];
  edges: ForgeEdge[];
}

export interface InvariantResult {
  name: string;
  passed: boolean;
  message: string;
}

export interface ExecutionLogEntry {
  step: number;
  nodeId: string;
  nodeName: string;
  eventType: string;
  status: "OK" | "WARN" | "ERROR";
  message: string;
  timestampMs: number;
}

export interface ExecutionTrace {
  success: boolean;
  totalEventsProcessed: number;
  droppedEvents: number;
  corruptedEventsHandled: number;
  duplicateEventsDetected: number;
  invariantsPassed: boolean;
  invariants: InvariantResult[];
  p50LatencyMs: number;
  p99LatencyMs: number;
  stepLogs: ExecutionLogEntry[];
  debriefSummary: string;
  executedAt: string;
}

export interface TelemetryPacketFixture {
  id: string;
  driverId: string;
  sessionTimeMs: number;
  speedKph: number;
  throttlePct: number;
  gear: number;
  lapNumber: number;
  isDuplicate?: boolean;
  isCorrupt?: boolean;
  corruptReason?: string;
}

