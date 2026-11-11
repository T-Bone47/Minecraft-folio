/**
 * TRIAL THREE — SYSTEMS RELIABILITY ENGINEERING
 * "THE BROKEN TELEMETRY PIPELINE"
 *
 * Location: Telemetry Control Tower (canonical coords: [14, 0, -18])
 * Lead NPC: Viktor Cole (Systems Reliability Lead)
 */

import type { TrialScenario } from "../types";

export const pipelineIncidentTrial: TrialScenario = {
  id: "systems_reliability_03",
  division: "systems_reliability",
  title: "The Broken Telemetry Pipeline",
  subtitle: "Out-of-Order Packets, Replay Duplicates & Stream Stabilization",
  facilityId: "telemetry",
  locationName: "Telemetry Control Tower & Server Rack Ingestion",
  estimatedMinutes: 3,
  provenanceLabel: "FAULT-INJECTED TEST DATA",

  npc: {
    id: "npc_viktor_cole",
    name: "Viktor Cole",
    role: "Systems Reliability Lead",
    division: "systems_reliability",
    facility: "telemetry",
    avatarVariant: "systems",
    coordinates: [12, 0, -14],
    dialogue: {
      greeting: "Viktor Cole here, Systems Reliability Lead. Glad you came up to the Telemetry Tower.",
      briefing:
        "We have a critical outage on the live trackside stream. Pit wall telemetry dashboards are displaying NaN values and crashing mid-lap. Our ingestion broker is receiving 60 Hz UDP packets, but somewhere between the raw ingest and spatial calibration, our event ordering is completely corrupted. I need you to inspect the broker trace and repair the ingestion topology.",
      hint: "Check the packet sequence numbers and timestamps at Stage 3. Look at what happens when cellular retransmission sends duplicate packets out of order to the delta calculation engine.",
      duringInvestigation:
        "Look closely at the event log around sequence ID 1042 to 1056. Notice the timestamp inversions and duplicated payloads.",
      onWrongHypothesis:
        "The broker network bandwidth is fine — we are only consuming 42 KB/s over a gigabit connection. Look at the sequence IDs and timestamps inside the payloads.",
      onCorrectDiagnosis:
        "Exact diagnosis. Cellular retry logic resends unacknowledged UDP bursts, delivering duplicate sequence IDs and timestamp reversals. Downstream binary search solvers expect monotonic distance and crash when distance steps backward.",
      onOptimalAction:
        "Pipeline restored to green. Deploying a 250ms sliding window reordering buffer paired with an LRU sequence deduplication filter stabilized the stream with 0% data loss and zero latency penalty.",
      onSuboptimalAction:
        "Simply dropping late packets causes gaping holes in the telemetry trace, leaving the race engineers blind through entire corner complexes.",
      completion:
        "Trial resolved. You diagnosed distributed stream race conditions, preserved strict monotonically increasing event ordering, and stabilized pit-wall telemetry. Outstanding engineering.",
    },
  },

  briefing:
    "Trackside telemetry calculations are failing with NaN deltas. Trace the ingestion pipeline, identify the packet sequencing faults corrupting downstream spatial solvers, and deploy an automated stream stabilization filter.",

  initialInvestigationPrompt:
    "Review the Stage 3 ingestion buffer traces and pipeline error metrics below to identify why downstream spatial solvers are crashing.",

  investigationData: {
    ingestionRateHz: 60,
    brokerBandwidthUsageKbps: 42.4,
    packetLossPct: 0.0,
    downstreamNaNExceptions: 48,
    sampleTraces: [
      { seqId: 1041, timestampMs: 14200, distanceM: 242.1, status: "OK" },
      { seqId: 1042, timestampMs: 14216, distanceM: 242.8, status: "OK" },
      {
        seqId: 1044,
        timestampMs: 14249,
        distanceM: 244.2,
        status: "OUT_OF_ORDER",
        note: "Arrived before seq 1043",
      },
      {
        seqId: 1043,
        timestampMs: 14233,
        distanceM: 243.5,
        status: "OUT_OF_ORDER",
        note: "Inverted timestamp (t < previous packet)",
      },
      {
        seqId: 1042,
        timestampMs: 14216,
        distanceM: 242.8,
        status: "DUPLICATE",
        note: "Cellular retry re-delivered identical sequence ID",
      },
      { seqId: 1045, timestampMs: 14266, distanceM: 244.9, status: "OK" },
      {
        seqId: 1045,
        timestampMs: 14266,
        distanceM: 244.9,
        status: "DUPLICATE",
        note: "Redundant delivery causes delta solver division by zero",
      },
    ],
    rootCauseSummary:
      "Downstream piecewise linear spatial interpolation requires monotonically strictly increasing distance (s_k > s_{k-1}). Non-monotonic packets and duplicate sequence timestamps trigger zero division and search index failures.",
  },

  hypotheses: [
    {
      id: "hypo_ooo_and_duplicates",
      label: "Out-of-Order Packet Delivery & Cellular Replay Duplicates",
      description:
        "Aggressive UDP retransmissions across cellular track antennas cause duplicate packets and out-of-order sequence arrival, breaking monotonic distance assumptions in spatial delta solvers.",
      isCorrect: true,
      feedback:
        "Correct diagnosis. The telemetry transport delivers bursts out of sequence; when distance decreases or duplicates occur, downstream solvers throw NaN errors.",
      technicalReasoning:
        "Piecewise interpolation and lap distance binning algorithms require strictly increasing monotonic coordinates. An unordered sequence or duplicated timestamp causes delta division by zero and invalid search index states.",
    },
    {
      id: "hypo_broker_buffer_overflow",
      label: "Message Broker Buffer Overflow / Network Saturation",
      description:
        "The telemetry message broker is running out of memory buffer space and dropping 50% of incoming payloads.",
      isCorrect: false,
      feedback:
        "Incorrect. Broker memory utilization is under 12%, throughput is only 42 KB/s, and packet loss is 0.0%. The issue is payload ordering, not broker capacity.",
      technicalReasoning:
        "Buffer overflows cause dropped packets, whereas our traces show 100% packet arrival with duplicate and inverted sequence delivery.",
    },
    {
      id: "hypo_corrupted_crc_checksum",
      label: "Hardware Sensor Failure / Corrupted CRC32 Checksums",
      description:
        "The vehicle CAN bus or telemetry ECU is outputting electrically corrupted bitfields failing CRC validation.",
      isCorrect: false,
      feedback:
        "Incorrect. Stage 2 CRC validation passes 100% of payloads. The telemetry values themselves are mathematically valid; only their arrival order is jumbled.",
      technicalReasoning:
        "CRC checks confirm payload bit integrity. The fault occurs in the network transport layer routing, not the physical automotive CAN bus.",
    },
  ],

  actions: [
    {
      id: "act_deploy_reorder_dedup_buffer",
      label: "Deploy Sliding Window Reorder Buffer & LRU Sequence Deduplication Filter",
      description:
        "Insert a 200ms bounded sliding window buffer at Stage 3 that deduplicates sequence IDs and re-sequences packets monotonically before emitting to the spatial solver.",
      isOptimal: true,
      consequences:
        "100% of duplicate packets filtered. Monotonic sequence order restored with 0 exceptions and 0 dropped events. Downstream dashboard recovers instantly with <15ms processing latency.",
      simulatedDeltaS: 0,
      tradeOffs: [
        "Introduces a minor 20-50ms deterministic buffer latency on live track broadcast.",
        "Requires 4 MB bounded ring buffer allocation in memory.",
      ],
    },
    {
      id: "act_drop_late_packets",
      label: "Drop All Late & Inverted Packets Immediately (No Buffering)",
      description:
        "If a packet arrives with timestamp earlier than the latest seen timestamp, drop it immediately without reordering.",
      isOptimal: false,
      consequences:
        "Prevents NaN crashes, but discards 18% of valid telemetry samples across sector 2, leaving pit engineers with blind spots during critical braking zones.",
      simulatedDeltaS: 0,
      tradeOffs: [
        "Zero added buffer latency.",
        "Loss of high-resolution telemetry data during critical cornering events.",
      ],
    },
    {
      id: "act_switch_tcp_strict",
      label: "Force All Trackside Telemetry Over Strict Synchronous TCP",
      description:
        "Disable UDP streaming and mandate synchronous TCP connections with blocking handshake ACKs for every sample.",
      isOptimal: false,
      consequences:
        "Eliminates reordering at the cost of Head-of-Line blocking over spotty wireless links, causing latency to balloon from 20ms to 2,400ms and freezing live pit telemetry.",
      simulatedDeltaS: 0,
      tradeOffs: [
        "Guarantees in-order delivery.",
        "Head-of-Line blocking induces unacceptable multi-second lag unsuitable for live race engineering.",
      ],
    },
  ],

  skillsDemonstrated: [
    "Distributed Stream Ingestion & Monotonic Event Ordering",
    "Sliding Window Reordering Buffers & Deduplication Architecture",
    "Cellular Telemetry Transport Fault Diagnosis (UDP vs TCP Trade-Offs)",
    "Defensive Real-Time Data Pipeline Hardening",
  ],

  codeReferences: [
    {
      title: "Frontier Telemetry Stream Fault Ingestion Harness",
      file: "lib/frontier/pipeline.ts",
      description: "Real-time fault injection and stream stabilization filters.",
      url: "/projects/telemetry-pipeline",
    },
    {
      title: "Authoritative Telemetry Event Schema",
      file: "lib/digitalTwin/telemetrySchema.ts",
      description: "Sequence ID, monotonic timestamp, and spatial validation contracts.",
      url: "/projects/telemetry-pipeline",
    },
  ],
};

