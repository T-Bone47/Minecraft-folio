/**
 * FRONTIER SYSTEMS FORGE — BLOCK REGISTRY
 * Defines available building blocks with typed input/output ports.
 */

import type { ForgeBlockDefinition } from "./types";

export const FORGE_BLOCKS: Record<string, ForgeBlockDefinition> = {
  source_f1_udp: {
    type: "source_f1_udp",
    name: "F1 UDP Ingestion",
    category: "source",
    description: "High-frequency 60-240 Hz binary telemetry packet stream from simulation or track sensors.",
    inputPorts: [],
    outputPorts: [
      { id: "out_raw", name: "Raw Packet Stream", type: "raw_packet_stream", direction: "out" },
    ],
    color: "#3B82F6", // Blue
  },

  source_openf1: {
    type: "source_openf1",
    name: "OpenF1 Live Feed",
    category: "source",
    description: "JSON/WebSocket multi-provider timing feed with unpredictable network jitter.",
    inputPorts: [],
    outputPorts: [
      { id: "out_raw", name: "Raw Packet Stream", type: "raw_packet_stream", direction: "out" },
    ],
    color: "#60A5FA", // Light Blue
  },

  validator_schema: {
    type: "validator_schema",
    name: "Schema & Boundary Guard",
    category: "processor",
    description: "Validates field ranges (speed 0-380 kph, gear 0-8) and drops or quarantines malformed frames.",
    requiredForValidPipeline: true,
    inputPorts: [
      { id: "in_raw", name: "Incoming Stream", type: "raw_packet_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_validated", name: "Validated Stream", type: "validated_stream", direction: "out" },
    ],
    color: "#10B981", // Emerald
  },

  deduplicator_lru: {
    type: "deduplicator_lru",
    name: "LRU Deduplicator",
    category: "processor",
    description: "Tracks recent packet sequence numbers in an LRU buffer to drop retransmitted duplicate frames.",
    inputPorts: [
      { id: "in_stream", name: "Input Stream", type: "validated_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_deduped", name: "Unique Stream", type: "validated_stream", direction: "out" },
    ],
    color: "#059669", // Dark Green
  },

  ordering_buffer: {
    type: "ordering_buffer",
    name: "Timestamp Sequencer",
    category: "processor",
    description: "Re-orders jittered or out-of-order network packets by microsecond timestamp before consumption.",
    inputPorts: [
      { id: "in_stream", name: "Input Stream", type: "validated_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_ordered", name: "Ordered Stream", type: "validated_stream", direction: "out" },
    ],
    color: "#0D9488", // Teal
  },

  transformer_canonical: {
    type: "transformer_canonical",
    name: "Canonical Normalizer",
    category: "processor",
    description: "Transforms vendor-specific structures into canonical typed telemetry events.",
    requiredForValidPipeline: true,
    inputPorts: [
      { id: "in_validated", name: "Validated Stream", type: "validated_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_canonical", name: "Canonical Stream", type: "canonical_event_stream", direction: "out" },
    ],
    color: "#8B5CF6", // Purple
  },

  analytics_wear: {
    type: "analytics_wear",
    name: "Tyre Wear & Pace Core",
    category: "processor",
    description: "Computes polynomial compound degradation curves and stint lap deltas in real time.",
    inputPorts: [
      { id: "in_canonical", name: "Canonical Stream", type: "canonical_event_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_enriched", name: "Enriched Stream", type: "canonical_event_stream", direction: "out" },
    ],
    color: "#F59E0B", // Amber
  },

  storage_timescaledb: {
    type: "storage_timescaledb",
    name: "TimescaleDB Hypertable",
    category: "storage",
    description: "Compressed append-only timeseries store with 1-hour hypertable partitions and Zstandard chunking.",
    inputPorts: [
      { id: "in_events", name: "Event Stream", type: "canonical_event_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_record", name: "Storage Record", type: "storage_record", direction: "out" },
    ],
    color: "#EF4444", // Red
  },

  monitor_invariant: {
    type: "monitor_invariant",
    name: "Sentry Invariant Monitor",
    category: "monitor",
    description: "Continuously asserts P99 latency bounds (< 2.0 ms) and alerts on zero-sample gaps.",
    inputPorts: [
      { id: "in_stream", name: "Stream Input", type: "canonical_event_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_alert", name: "Alert Output", type: "alert_event", direction: "out" },
    ],
    color: "#EC4899", // Pink
  },

  fault_injector_packet: {
    type: "fault_injector_packet",
    name: "Chaos Packet Injector",
    category: "fault_injector",
    description: "Injects synthetic out-of-order frames, malformed speed values (>500 kph), and burst duplicates.",
    inputPorts: [
      { id: "in_raw", name: "Raw Stream", type: "raw_packet_stream", direction: "in" },
    ],
    outputPorts: [
      { id: "out_faulty", name: "Perturbed Stream", type: "raw_packet_stream", direction: "out" },
    ],
    color: "#DC2626", // Blood Red
  },
};

