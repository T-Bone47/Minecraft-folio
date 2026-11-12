/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER MULTIVERSE
 * Canonical Project Registry
 *
 * Exposes authoritative metadata, exact repository URLs, verified commit SHAs,
 * role-specific recruiter pathways, and 6-layer evidence manifests.
 */

import { multiverseEvidenceRecords } from "./evidenceManifest";
import type { MultiverseProject, MultiverseProjectId } from "./projectTypes";

export const multiverseProjects: MultiverseProject[] = [
  {
    id: "racemind",
    slug: "racemind",
    name: "RaceMind AI",
    shortName: "RaceMind",
    tagline: "Deterministic Race Strategy, Tyre Degradation & Telemetry Tree Search",
    roleHeadline: "Real-time motorsport strategy engine & tactical decision tree under Safety Car conditions",
    domain: "Motorsport Simulation, Telemetry Abstraction & Real-Time Decision Systems",
    category: "motorsport",
    themeColor: "#EF4444", // Racing Red
    accentRgb: [0.937, 0.267, 0.267],
    portalBearingDeg: 0, // North
    portalOffset: [0, 0, -6.5],
    repositoryUrl: "https://github.com/T-Bone47/RaceMind-AI",
    commitSha: "b8e4f1a",
    status: "ACTIVE_VERIFIED",
    provenance: "REPRODUCIBLE_LOCAL_DEMO",
    provenanceExplanation:
      "Deterministic client-side simulation evaluating exact Python strategy engine formulas, tyre degradation curves, and undercut windows in real time.",
    technologies: [
      "Python",
      "FastAPI",
      "NumPy",
      "Pandas",
      "TypeScript",
      "UDP Sockets",
      "Polynomial Regression",
      "Tree Search",
    ],
    architectureSummary:
      "Sim UDP Telemetry (60 Hz) -> Ingestion Bridge -> Polynomial Tyre Wear Core -> Undercut/Overcut Solver -> Pit Window Decision Tree.",
    keyMetrics: [
      { label: "Undercut Delta Accuracy", value: "±0.35s", detail: "Validated against F1 sim pace", verified: true },
      { label: "Decision Latency", value: "118 ms", detail: "P95 evaluation budget < 200ms", verified: true },
      { label: "UDP Throughput", value: "240 Hz", detail: "Zero packet drop buffer", verified: true },
      { label: "Compound Wear Horizon", value: "60 Laps", detail: "Non-linear thermal cliff", verified: true },
    ],
    roleRelevance: {
      "software-engineering": {
        headline: "High-Throughput Binary Telemetry Ingestion & Zero-Allocation Ring Buffers",
        takeaways: [
          "Implemented UDP binary deserializer with struct unpack handling 60 Hz vehicle state packets.",
          "Designed non-blocking async circular queues to buffer telemetry without memory allocations.",
          "Enforced strict type boundaries with Pydantic and TypeScript mirrors.",
        ],
        highlightedFiles: [
          {
            path: "racemind/telemetry/udp_receiver.py",
            description: "High-speed UDP socket receiver and packet deserializer.",
          },
          {
            path: "racemind/strategy/pit_optimizer.py",
            description: "Safety car and undercut pit window evaluator algorithm.",
          },
        ],
        interviewQuestions: [
          "How do you handle UDP packet reordering and clock drift between simulator and strategy engine?",
          "Why did you choose a deterministic tree search rather than end-to-end Deep RL for live race calls?",
        ],
      },
      "ai-ml": {
        headline: "Empirical Polynomial Pace Degradation & Non-Linear Thermal Cliff Curves",
        takeaways: [
          "Trained compound degradation regression models mapping stint age and surface temperature.",
          "Incorporated quadratic penalty curves when tyre surface exceeds optimal operating window.",
          "Formulated Monte Carlo trajectory evaluation for multi-car pit window forecasting.",
        ],
        highlightedFiles: [
          {
            path: "racemind/models/tyre_thermal.py",
            description: "Compound temperature and pace decay mathematical curves.",
          },
        ],
        interviewQuestions: [
          "How did you calibrate tyre degradation curves across different track asphalt roughness levels?",
          "How do you prevent overfitting when fitting compound pace curves from noisy practice telemetry?",
        ],
      },
      motorsport: {
        headline: "Formula 1 Undercut Windows, Pit Loss Deltas & Track Re-entry Matrices",
        takeaways: [
          "Modeled pit lane transit loss under Green Flag (22.0s) vs Safety Car (12.5s) conditions.",
          "Calculated dynamic overtake probability based on fresh compound delta vs dirty air penalty.",
          "Integrated DRS train detection to prevent pitting into heavy midfield traffic.",
        ],
        highlightedFiles: [
          {
            path: "racemind/strategy/pit_optimizer.py",
            description: "Safety car and undercut pit window evaluator algorithm.",
          },
        ],
        interviewQuestions: [
          "What is the mathematical threshold where an undercut becomes less advantageous than track position?",
          "How does your algorithm model tyre warm-up lag (out-lap delta) for hard compounds?",
        ],
      },
      "full-stack": {
        headline: "Real-Time Strategy Visualization & High-Frequency Web Client Dashboards",
        takeaways: [
          "Built responsive pit-wall interface streaming telemetry at 60 Hz with sub-frame render times.",
          "Engineered interactive strategy playground with instant slider parameter exploration.",
          "Ensured 100% offline functionality using WebAssembly and pure mathematical TypeScript solvers.",
        ],
        highlightedFiles: [
          {
            path: "racemind/strategy/pit_optimizer.py",
            description: "Safety car and undercut pit window evaluator algorithm.",
          },
        ],
        interviewQuestions: [
          "How do you prevent UI layout thrashing when rendering 60 Hz high-frequency telemetry gauges?",
          "What state architecture ensures consistent client-side simulation state without network lag?",
        ],
      },
    },
    evidenceLayers: multiverseEvidenceRecords.racemind,
  },

  {
    id: "live-f1",
    slug: "live-f1",
    name: "Live F1 Intelligence",
    shortName: "Live F1",
    tagline: "High-Throughput Multi-Provider Telemetry Pipeline & Canonical Replay",
    roleHeadline: "Provider-agnostic real-time F1 telemetry ingestion processing over 1,000,000 canonical events",
    domain: "Distributed Stream Processing, Event Normalization & Telemetry Analytics",
    category: "systems",
    themeColor: "#3B82F6", // Telemetry Blue
    accentRgb: [0.231, 0.510, 0.965],
    portalBearingDeg: 90, // East
    portalOffset: [6.5, 0, 0],
    repositoryUrl: "https://github.com/T-Bone47/live-f1-intelligence",
    commitSha: "4c7189d",
    status: "ACTIVE_VERIFIED",
    provenance: "RECORDED_REPLAY",
    provenanceExplanation:
      "Recorded replay of full Grand Prix sessions using 1,067,193 canonical events ingested, validated, and normalized across four live providers.",
    technologies: [
      "Python",
      "FastAPI",
      "TimescaleDB",
      "PostgreSQL",
      "WebSockets",
      "Docker",
      "Pydantic V2",
      "NumPy",
    ],
    architectureSummary:
      "4 Feeds (OpenF1, FastF1, Jolpica, SignalR) -> Schema Validation -> Canonical Event Model -> TimescaleDB Hypertables -> WebSocket Broadcast.",
    keyMetrics: [
      { label: "Canonical Events", value: "1,067,193", detail: "Full 2025 Grand Prix session", verified: true },
      { label: "Malformed Records", value: "0 (0.00%)", detail: "Strict boundary schema checks", verified: true },
      { label: "Event Throughput", value: "~2,650/s", detail: "Sustained stream processing", verified: true },
      { label: "P50 Latency", value: "0.10 ms", detail: "Sub-millisecond event transit", verified: true },
      { label: "Peak Memory", value: "99 MB", detail: "Zero memory leak verified", verified: true },
    ],
    roleRelevance: {
      "software-engineering": {
        headline: "High-Throughput Distributed Stream Normalization & Zero Data Corruption",
        takeaways: [
          "Architected boundary sanitization pipeline utilizing Pydantic V2 Rust core.",
          "Processed 1,067,193 events without a single dropped packet or malformed struct.",
          "Maintained p50 processing latency of 0.10 ms under sustained 2,650 events/sec bursts.",
        ],
        highlightedFiles: [
          {
            path: "pipeline/canonical_event.py",
            description: "Canonical data models and immutable provenance schemas.",
          },
          {
            path: "pipeline/ingestion_manager.py",
            description: "Concurrent provider orchestrator with backoff reconnection.",
          },
        ],
        interviewQuestions: [
          "How did you achieve ~0.10 ms p50 event latency in Python while enforcing strict type validation?",
          "How does the pipeline handle backpressure when slow WebSocket clients fall behind?",
        ],
      },
      "ai-ml": {
        headline: "Feature Extraction, Rolling Pace Outlier Rejection & Degradation Regressors",
        takeaways: [
          "Constructed continuous rolling pace filters rejecting yellow flag, out-lap, and traffic outliers.",
          "Resampled discrete GPS coordinates onto uniform 10-meter spatial track splines.",
          "Generated real-time tyre degradation regression coefficients per driver stint.",
        ],
        highlightedFiles: [
          {
            path: "analytics/spatial_alignment.py",
            description: "Spatial distance-domain resampling and micro-sector deltas.",
          },
        ],
        interviewQuestions: [
          "How do you mathematically distinguish a driver managing tyres from a driver caught behind a slower car?",
          "What spatial interpolation technique prevents aliasing during high-frequency telemetry resampling?",
        ],
      },
      motorsport: {
        headline: "Distance-Aligned Telemetry Comparison, Micro-Sectors & DRS Gap Analytics",
        takeaways: [
          "Implemented distance-domain comparison eliminating time-domain spatial distortion.",
          "Calculated micro-sector speed traps and corner apex delta times for 20 drivers simultaneously.",
          "Built automatic battle detection monitoring 1.0-second DRS detection zones.",
        ],
        highlightedFiles: [
          {
            path: "analytics/spatial_alignment.py",
            description: "Spatial distance-domain resampling and micro-sector deltas.",
          },
        ],
        interviewQuestions: [
          "Why is distance-domain alignment mathematically required when comparing laps of differing lap times?",
          "How does your battle detection engine track DRS activation states through zone transponders?",
        ],
      },
      "full-stack": {
        headline: "Full-Scale Race Control Timing Tower, Delta Scrubbers & Live WebSockets",
        takeaways: [
          "Engineered interactive 20-car live timing tower with sector color coding (purple, green, yellow).",
          "Implemented high-performance canvas telemetry trace rendering with synchronized timeline scrubber.",
          "Containerized complete ingestion and TimescaleDB stack using multi-stage Docker builds.",
        ],
        highlightedFiles: [
          {
            path: "pipeline/canonical_event.py",
            description: "Canonical data models and immutable provenance schemas.",
          },
        ],
        interviewQuestions: [
          "How do you design a frontend state store to handle continuous 100 Hz WebSocket updates without freezing React renders?",
          "How are TimescaleDB hypertable continuous aggregates exposed via REST and WebSocket endpoints?",
        ],
      },
    },
    evidenceLayers: multiverseEvidenceRecords["live-f1"],
  },

  {
    id: "sentinel",
    slug: "sentinel",
    name: "Sentinel AI",
    shortName: "Sentinel",
    tagline: "Enterprise AI Governance, Risk & Continuous Control Enforcement",
    roleHeadline: "Automated runtime AI risk mitigation, NIST AI RMF compliance & cryptographic evidence audits",
    domain: "AI Governance, Risk & Compliance (GRC), Security & Observability",
    category: "ai-ml",
    themeColor: "#8B5CF6", // Neural Violet
    accentRgb: [0.545, 0.361, 0.965],
    portalBearingDeg: 180, // South
    portalOffset: [0, 0, 6.5],
    repositoryUrl: "https://github.com/T-Bone47/Sentinel-AI",
    commitSha: "a192c73",
    status: "ACTIVE_VERIFIED",
    provenance: "REPRODUCIBLE_LOCAL_DEMO",
    provenanceExplanation:
      "Reproducible GRC control evaluation engine executing cryptographic SHA-256 evidence logging, drift detection, and automated remediation on local test fixtures.",
    technologies: [
      "Python",
      "FastAPI",
      "Pydantic",
      "Cryptography",
      "NIST AI RMF",
      "ISO 42001",
      "Vector Embeddings",
      "Docker",
    ],
    architectureSummary:
      "Enterprise AI Client -> Sentinel Gateway Interceptor -> Policy Evaluation Core -> Cryptographic Evidence Ledger -> Automated Remediation.",
    keyMetrics: [
      { label: "Policy Evaluation Overhead", value: "22 ms", detail: "P95 latency budget < 40ms", verified: true },
      { label: "Injection Detection", value: "98.4%", detail: "Adversarial benchmark score", verified: true },
      { label: "Evidence Durability", value: "100.0%", detail: "Non-repudiable SHA-256 chain", verified: true },
      { label: "False Positive Rate", value: "0.8%", detail: "Zero workflow disruption", verified: true },
    ],
    roleRelevance: {
      "software-engineering": {
        headline: "Low-Latency Reverse Proxy Interceptor & Cryptographic Audit Trails",
        takeaways: [
          "Constructed non-blocking reverse proxy intercepting LLM payloads with < 22 ms overhead.",
          "Implemented tamper-evident HMAC SHA-256 signature chain across all policy events.",
          "Enforced zero-PII data storage guarantees adhering to privacy compliance standards.",
        ],
        highlightedFiles: [
          {
            path: "sentinel/governance/evidence_ledger.py",
            description: "Cryptographic evidence recording and tamper-evident signatures.",
          },
          {
            path: "sentinel/interceptor/gateway.py",
            description: "Runtime API reverse proxy and policy gatekeeper.",
          },
        ],
        interviewQuestions: [
          "How does the gateway intercept streaming SSE (Server-Sent Events) tokens without breaking chunk delivery?",
          "How is non-repudiation guaranteed in the audit log if a database administrator alters a row?",
        ],
      },
      "ai-ml": {
        headline: "Semantic Drift Detection, Adversarial Prompt Defense & Embedding Centroids",
        takeaways: [
          "Calculated real-time cosine distance against enterprise approved reference embedding centroids.",
          "Implemented automated jailbreak and prompt injection classifiers with 98.4% detection rate.",
          "Developed automated circuit breaking halting rogue multi-agent execution loops.",
        ],
        highlightedFiles: [
          {
            path: "sentinel/controls/nist_ai_rmf.py",
            description: "NIST AI Risk Management Framework executable control implementations.",
          },
        ],
        interviewQuestions: [
          "How do you tune cosine distance thresholds to minimize false positive blocks on legitimate novel queries?",
          "How do you evaluate multi-modal prompt injection where malicious instructions are hidden in images?",
        ],
      },
      motorsport: {
        headline: "High-Integrity Telemetry Safety Gates & Autonomous System Failure Isolation",
        takeaways: [
          "Applied motorsport fail-safe design principles to enterprise autonomous agent systems.",
          "Engineered deterministic circuit breakers analogous to automotive ECU limp-home modes.",
          "Maintained strict invariant checking preventing out-of-bounds parameter execution.",
        ],
        highlightedFiles: [
          {
            path: "sentinel/controls/nist_ai_rmf.py",
            description: "NIST AI Risk Management Framework executable control implementations.",
          },
        ],
        interviewQuestions: [
          "How do real-time watchdog timers in safety-critical vehicle ECUs inform software circuit breaker design?",
          "What criteria determine whether an autonomous agent should fail-safe (halt) vs fail-operational (degrade)?",
        ],
      },
      "full-stack": {
        headline: "Auditor Console, Blast Radius Visualizer & Automated Remediation Workflows",
        takeaways: [
          "Built executive GRC compliance console displaying NIST and ISO 42001 coverage matrices.",
          "Created interactive incident triage dashboard with one-click quarantine and policy remediation.",
          "Designed verifiable exportable compliance certificate packages for external regulatory audits.",
        ],
        highlightedFiles: [
          {
            path: "sentinel/governance/evidence_ledger.py",
            description: "Cryptographic evidence recording and tamper-evident signatures.",
          },
        ],
        interviewQuestions: [
          "How do you present complex cryptographic audit proofs to non-technical compliance auditors?",
          "What UX design patterns prevent accidental manual overrides of critical security policies?",
        ],
      },
    },
    evidenceLayers: multiverseEvidenceRecords.sentinel,
  },

  {
    id: "vyaparpulse",
    slug: "vyaparpulse",
    name: "VyaparPulse AI",
    shortName: "VyaparPulse",
    tagline: "Offline-First Voice-to-Ledger & Inventory Demand Forecasting",
    roleHeadline: "Local-first accounting and predictive demand intelligence for 60M+ micro-retailers",
    domain: "Offline-First Distributed Systems, On-Device Audio & Time-Series Forecasting",
    category: "full-stack",
    themeColor: "#10B981", // Merchant Emerald
    accentRgb: [0.063, 0.725, 0.506],
    portalBearingDeg: 270, // West
    portalOffset: [-6.5, 0, 0],
    repositoryUrl: "https://github.com/T-Bone47/vyaparpulse-ai",
    commitSha: "f589b21",
    status: "ACTIVE_VERIFIED",
    provenance: "REPRODUCIBLE_LOCAL_DEMO",
    provenanceExplanation:
      "Interactive local-first simulation demonstrating offline speech parsing, durable monotonic sync queue replay, and 7-day XGBoost inventory demand curves.",
    technologies: [
      "Python",
      "FastAPI",
      "SQLite",
      "Vosk STT",
      "XGBoost",
      "TypeScript",
      "IndexedDB",
      "Docker",
    ],
    architectureSummary:
      "Voice Audio -> On-Device Vosk STT -> Entity/Voucher Parser -> SQLite WAL Offline Queue -> Monotonic Server Sync -> XGBoost Demand Forecast.",
    keyMetrics: [
      { label: "Offline Durability", value: "100.0%", detail: "Zero transaction loss in SQLite WAL", verified: true },
      { label: "Double-Entry Balance", value: "100.0%", detail: "Sum(Debits) - Sum(Credits) == 0", verified: true },
      { label: "STT Parsing Latency", value: "185 ms", detail: "On-device CPU inference", verified: true },
      { label: "Sync Throughput", value: "1,200 tx/s", detail: "Monotonic conflict-free replay", verified: true },
      { label: "Forecast RMSE", value: "3.2 units", detail: "Lagged seasonal feature model", verified: true },
    ],
    roleRelevance: {
      "software-engineering": {
        headline: "Offline-First Monotonic Sync Queues & Zero-Data-Loss Durability",
        takeaways: [
          "Implemented local SQLite Write-Ahead Logging (WAL) queue resilient to abrupt power loss.",
          "Engineered monotonic client sequence counters and idempotent server reconciliation.",
          "Enforced mathematical double-entry bookkeeping invariants across all transactions.",
        ],
        highlightedFiles: [
          {
            path: "vyaparpulse/sync/offline_queue.py",
            description: "Monotonic SQLite write-ahead queue and network reconciliation.",
          },
          {
            path: "vyaparpulse/ledger/double_entry.py",
            description: "Double-entry accounting invariant and journal voucher models.",
          },
        ],
        interviewQuestions: [
          "How do you resolve clock skew between disconnected mobile devices and the central server?",
          "Why did you choose append-only monotonic sequences over multi-version concurrency control?",
        ],
      },
      "ai-ml": {
        headline: "On-Device Lightweight Speech Recognition & XGBoost Demand Forecasting",
        takeaways: [
          "Deployed quantized Vosk acoustic model executing on low-end 2GB RAM client hardware.",
          "Trained XGBoost regression trees with 7-day and 14-day lagged sales features.",
          "Generated confidence intervals for inventory replenishment advice on sparse sales records.",
        ],
        highlightedFiles: [
          {
            path: "vyaparpulse/forecasting/demand_model.py",
            description: "XGBoost 7-day inventory replenishment forecasting pipeline.",
          },
        ],
        interviewQuestions: [
          "How do you handle cold-start forecasting for newly introduced retail commodities?",
          "What feature engineering approaches best capture weekly festival and payday purchasing spikes?",
        ],
      },
      motorsport: {
        headline: "Telemetry-Grade Logging Guarantees & Low-Resource Deterministic Execution",
        takeaways: [
          "Applied motorsport ECU crash-durability principles to retail financial records.",
          "Designed resource-constrained data pipelines operating within strict memory caps.",
          "Utilized deterministic state machines for transaction lifecycle transitions.",
        ],
        highlightedFiles: [
          {
            path: "vyaparpulse/sync/offline_queue.py",
            description: "Monotonic SQLite write-ahead queue and network reconciliation.",
          },
        ],
        interviewQuestions: [
          "How do financial write-ahead logs parallel black-box crash recorders in motorsport vehicles?",
          "How do you test network partition scenarios deterministically in automated CI pipelines?",
        ],
      },
      "full-stack": {
        headline: "Offline-First Voice Accounting UX, Sync Status Indicators & Micro-Merchant UI",
        takeaways: [
          "Engineered voice-to-transaction UX with instant acoustic waveform visualizer.",
          "Built seamless offline/online toggle showcasing queued transactions and automatic sync.",
          "Rendered interactive 7-day demand forecast charts with confidence intervals.",
        ],
        highlightedFiles: [
          {
            path: "vyaparpulse/ledger/double_entry.py",
            description: "Double-entry accounting invariant and journal voucher models.",
          },
        ],
        interviewQuestions: [
          "How do you design UX that builds trust with non-technical users when network connectivity drops?",
          "How do you prevent IndexedDB quota eviction on low-storage Android mobile browsers?",
        ],
      },
    },
    evidenceLayers: multiverseEvidenceRecords.vyaparpulse,
  },
];

export const getAllMultiverseProjects = (): MultiverseProject[] => multiverseProjects;

export const getMultiverseProjectById = (id: MultiverseProjectId): MultiverseProject | undefined =>
  multiverseProjects.find((p) => p.id === id);

export const getMultiverseProjectBySlug = (slug: string): MultiverseProject | undefined =>
  multiverseProjects.find((p) => p.slug === slug);
