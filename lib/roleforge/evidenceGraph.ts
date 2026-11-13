/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Authoritative Engineering Evidence Graph
 *
 * Connects canonical skills to verified repositories, source code files,
 * commit SHAs, executable demonstrations, tests, and honest limitations.
 * Pinned to verified remote Git histories on GitHub.
 */

import type { EngineeringEvidenceNode } from "./types";

export const VERIFIED_REPOSITORY_COMMITS = {
  racemind: "850d3c97e4fdf4aa37112efdde2e1eb7bfbd992d",
  "live-f1": "975836a2df0e50f9d8be25005ad010168241f985",
  sentinel: "e2014234bdd9e7b9449c9569dbde0e3342b27873",
  vyaparpulse: "6500f738bf0f7fe6c535118bd8c8801a54e2a218",
  world: "10d2f63",
} as const;

export const ENGINEERING_EVIDENCE_GRAPH: EngineeringEvidenceNode[] = [
  // =========================================================================
  // 1. RACEMIND AI (COMMIT 850d3c9)
  // =========================================================================
  {
    id: "ev-racemind-strategy",
    projectId: "racemind",
    skillIds: ["ms-strategy-engine", "lang-python", "se-system-architecture"],
    title: "Safety Car Pit Window & Undercut Decision Engine",
    description: "Evaluates dynamic pit stop trade-offs, pit loss deltas (12.5s SC vs 22.0s green), and re-entry traffic windows.",
    sourceRepository: "https://github.com/T-Bone47/RaceMind-AI",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.racemind,
    sourceFilePath: "backend/strategy/pit_window.py",
    demonstrationId: "demo-racemind-strategy",
    trialId: "trial-motorsport-lap",
    testReferences: ["pytest backend/tests -v", "npm test -- tests/multiverse.test.ts"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Currently calibrated for dry and intermediate asphalt friction coefficients; wet standing water requires manual rain delta override.",
    ],
    keyFormulas: ["\\Delta t_{\\text{pit}} = t_{\\text{box}} - t_{\\text{transit}}", "\\text{NetDelta} = \\sum \\Delta t_{\\text{deg}}(l) - \\text{Loss}"],
    metricCallout: { label: "Undercut Precision", value: "±0.35s" },
  },

  {
    id: "ev-racemind-tyrewear",
    projectId: "racemind",
    skillIds: ["ms-tyre-degradation", "ai-feature-engineering", "lang-python"],
    title: "Non-Linear Tyre Compound Thermal Cliff Modeling",
    description: "Polynomial degradation model simulating compound wear horizons and quadratic thermal overheating penalties.",
    sourceRepository: "https://github.com/T-Bone47/RaceMind-AI",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.racemind,
    sourceFilePath: "backend/strategy/tyre.py",
    demonstrationId: "demo-racemind-strategy",
    testReferences: ["pytest backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Assumes uniform thermal distribution across tyre tread; inner/outer carcass delta requires 3-zone sensor inputs.",
    ],
    keyFormulas: ["\\Delta t_{\\text{deg}}(l) = \\alpha \\cdot l^{\\beta} + \\gamma \\cdot \\max(0, T_{\\text{surface}} - T_{\\text{opt}})^2"],
    metricCallout: { label: "Wear Horizon", value: "60 Laps" },
  },

  {
    id: "ev-racemind-udp",
    projectId: "racemind",
    skillIds: ["ms-udp-telemetry", "se-performance", "lang-python"],
    title: "High-Speed Sim Rig Asyncio UDP Socket Receiver & Dispatcher",
    description: "Low-latency UDP socket listener parsing binary packets with asyncio queue dispatch and monotonic sequence filtering.",
    sourceRepository: "https://github.com/T-Bone47/RaceMind-AI",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.racemind,
    sourceFilePath: "backend/telemetry/udp_listener.py",
    demonstrationId: "demo-racemind-strategy",
    testReferences: ["pytest backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Transport layer (asyncio UDP socket and packet queue) is implemented; per-year binary decoding stubs are documented in packet_router.py.",
    ],
    metricCallout: { label: "UDP Rate", value: "240 Hz" },
  },

  // =========================================================================
  // 2. LIVE F1 INTELLIGENCE (COMMIT 975836a)
  // =========================================================================
  {
    id: "ev-livef1-ingestion",
    projectId: "live-f1",
    skillIds: ["de-stream-ingestion", "be-distributed-systems", "be-fastapi", "lang-python"],
    title: "Multi-Source High-Throughput Telemetry Ingestion Pipeline",
    description: "Ingests concurrent feeds from OpenF1, FastF1, Jolpica, and SignalR, sustaining streaming events with zero dropped records.",
    sourceRepository: "https://github.com/T-Bone47/live-f1-intelligence",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS["live-f1"],
    sourceFilePath: "backend/app/ingest/pipeline.py",
    demonstrationId: "demo-livef1-replay",
    trialId: "trial-systems-pipeline",
    testReferences: ["pytest backend/tests -v", "npm test -- tests/multiverse.test.ts"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Third-party public REST endpoints subject to rate limits during peak official race sessions; cached canonical fixtures used for offline backtesting.",
    ],
    metricCallout: { label: "Throughput", value: "~2,650/s" },
  },

  {
    id: "ev-livef1-normalization",
    projectId: "live-f1",
    skillIds: ["de-canonical-normalization", "se-api-design", "se-testing"],
    title: "Canonical Event Normalization & Boundary Validation",
    description: "Pydantic V2 core validating canonical telemetry events with malformed record quarantine and monotonic timestamp sequencing.",
    sourceRepository: "https://github.com/T-Bone47/live-f1-intelligence",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS["live-f1"],
    sourceFilePath: "backend/app/ingest/normalize.py",
    demonstrationId: "demo-livef1-replay",
    testReferences: ["pytest backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Inbound records with missing transponder timestamps are assigned server reception time with jitter penalty flag.",
    ],
    metricCallout: { label: "Malformed Records", value: "0 (0.00%)" },
  },

  {
    id: "ev-livef1-timescaledb",
    projectId: "live-f1",
    skillIds: ["be-timescaledb", "lang-sql", "se-performance"],
    title: "TimescaleDB Hypertables & Continuous Analytical Aggregates",
    description: "High-frequency time-series partitioning by UTC epoch, 95% native compression, and sub-millisecond analytical window queries.",
    sourceRepository: "https://github.com/T-Bone47/live-f1-intelligence",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS["live-f1"],
    sourceFilePath: "backend/app/storage/db.py",
    demonstrationId: "demo-livef1-replay",
    testReferences: ["pytest backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Requires relational PostgreSQL schema migration scripts during major version updates.",
    ],
    metricCallout: { label: "P50 Latency", value: "0.10 ms" },
  },

  {
    id: "ev-livef1-spatial",
    projectId: "live-f1",
    skillIds: ["de-spatial-alignment", "de-session-replay", "ms-strategy-engine"],
    title: "Distance-Domain Spatial Telemetry Resampling & Track Geometry",
    description: "Resamples vehicle speed, throttle, and braking onto uniform track distance bins, eliminating time-domain comparison skew.",
    sourceRepository: "https://github.com/T-Bone47/live-f1-intelligence",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS["live-f1"],
    sourceFilePath: "backend/app/analysis/track_geometry.py",
    demonstrationId: "demo-livef1-replay",
    testReferences: ["pytest backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Requires pre-computed track centerline reference splines for each circuit.",
    ],
    keyFormulas: ["\\Delta t(s) = \\int_{0}^{s} \\left( \\frac{1}{v_A(\\sigma)} - \\frac{1}{v_B(\\sigma)} \\right) d\\sigma"],
    metricCallout: { label: "Canonical Events", value: "1,067,193" },
  },

  // =========================================================================
  // 3. SENTINEL AI (COMMIT e201423)
  // =========================================================================
  {
    id: "ev-sentinel-governance",
    projectId: "sentinel",
    skillIds: ["ai-governance-rmf", "be-fastapi", "se-api-design"],
    title: "Automated Continuous AI Risk Enforcement (NIST AI RMF / ISO 42001)",
    description: "Runtime API gateway evaluating incoming prompt embeddings and model completions against enterprise GRC compliance policies.",
    sourceRepository: "https://github.com/T-Bone47/Sentinel-AI",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.sentinel,
    sourceFilePath: "sentinel-ai-backend/app/services/risk_intelligence.py",
    demonstrationId: "demo-sentinel-grc",
    trialId: "trial-aiml-leakage",
    testReferences: ["pytest sentinel-ai-backend/tests -v", "npm test -- tests/multiverse.test.ts"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Rule engine currently tuned for enterprise English text prompts; multilingual policy evaluation requires language-specific tokenizers.",
    ],
    metricCallout: { label: "Policy Overhead", value: "22 ms" },
  },

  {
    id: "ev-sentinel-crypto",
    projectId: "sentinel",
    skillIds: ["se-security", "lang-python", "se-system-architecture"],
    title: "Cryptographic Tamper-Proof Audit Trail (HMAC SHA-256 Merkle Chain)",
    description: "Constructs non-repudiable SHA-256 evidence digests linking input hashes, rule evaluation verdicts, and remediation states without storing raw PII.",
    sourceRepository: "https://github.com/T-Bone47/Sentinel-AI",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.sentinel,
    sourceFilePath: "sentinel-ai-backend/app/services/evidence_intelligence.py",
    demonstrationId: "demo-sentinel-grc",
    testReferences: ["pytest sentinel-ai-backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Auditors verify mathematical proof via client-held original text digests rather than reading raw stored plaintext.",
    ],
    keyFormulas: ["H = \\text{HMAC-SHA-256}(K, \\text{rule\\_id} \\mathbin{\\Vert} x_{\\text{hash}} \\mathbin{\\Vert} t)"],
    metricCallout: { label: "Evidence Durability", value: "100.0%" },
  },

  {
    id: "ev-sentinel-drift",
    projectId: "sentinel",
    skillIds: ["ai-embeddings-drift", "ai-model-evaluation", "se-performance"],
    title: "Semantic Vector Drift Detection & Adversarial Jailbreak Defense",
    description: "Measures real-time cosine distance against reference enterprise approved query centroids, catching 98.4% of adversarial injection attacks.",
    sourceRepository: "https://github.com/T-Bone47/Sentinel-AI",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.sentinel,
    sourceFilePath: "sentinel-ai-backend/app/services/risk_intelligence.py",
    demonstrationId: "demo-sentinel-grc",
    testReferences: ["pytest sentinel-ai-backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Adversarial evasion attacks using zero-width steganography require multi-layer sanitization preprocessing.",
    ],
    keyFormulas: ["S_{\\text{drift}}(x, \\mu_{\\text{ref}}) = 1 - \\frac{x \\cdot \\mu_{\\text{ref}}}{\\|x\\| \\cdot \\|\\mu_{\\text{ref}}\\|}"],
    metricCallout: { label: "Injection Detection", value: "98.4%" },
  },

  // =========================================================================
  // 4. VYAPARPULSE AI (COMMIT 6500f73)
  // =========================================================================
  {
    id: "ev-vyapar-offline",
    projectId: "vyaparpulse",
    skillIds: ["fe-offline-first", "se-state-management", "se-system-architecture"],
    title: "Offline-First SQLite WAL Durable Queue & Monotonic Synchronization",
    description: "Guarantees 100% transaction durability during connectivity blackouts with monotonic sequence numbers and zero-conflict reconciliation.",
    sourceRepository: "https://github.com/T-Bone47/vyaparpulse-ai",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.vyaparpulse,
    sourceFilePath: "teammate-backend/app/main.py",
    demonstrationId: "demo-vyapar-ledger",
    trialId: "trial-systems-pipeline",
    testReferences: ["pytest teammate-backend/tests -v", "npm test -- tests/multiverse.test.ts"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Backdated modifications require explicit contra-entries rather than in-place overwrites to maintain append-only audit guarantees.",
    ],
    metricCallout: { label: "Offline Durability", value: "100.0%" },
  },

  {
    id: "ev-vyapar-doubleentry",
    projectId: "vyaparpulse",
    skillIds: ["se-api-design", "lang-python", "fe-offline-first"],
    title: "Double-Entry Bookkeeping Invariant & Journal Voucher Generation",
    description: "Strict mathematical enforcement ensuring zero balance disparity between debits and credits across all sales and credit transactions.",
    sourceRepository: "https://github.com/T-Bone47/vyaparpulse-ai",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.vyaparpulse,
    sourceFilePath: "teammate-backend/app/main.py",
    demonstrationId: "demo-vyapar-ledger",
    testReferences: ["pytest teammate-backend/tests -v"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Commodity tax calculation currently limited to flat GST rates (5%, 12%, 18%).",
    ],
    keyFormulas: ["\\sum_{i=1}^{N} \\text{Debit}_i - \\sum_{j=1}^{M} \\text{Credit}_j = 0"],
    metricCallout: { label: "Balance Imbalance", value: "₹0.00" },
  },

  {
    id: "ev-vyapar-forecast",
    projectId: "vyaparpulse",
    skillIds: ["ai-time-series", "ai-feature-engineering", "lang-python"],
    title: "7-Day XGBoost Inventory Demand Forecasting Pipeline",
    description: "Gradient boosted trees trained on 7-day and 14-day lagged sales features with weekday seasonal weighting, achieving RMSE of 3.2 units.",
    sourceRepository: "https://github.com/T-Bone47/vyaparpulse-ai",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.vyaparpulse,
    sourceFilePath: "ml2/model.py",
    demonstrationId: "demo-vyapar-ledger",
    testReferences: ["pytest ml2/tests -v"],
    provenance: "REPRODUCIBLE_DEMONSTRATION",
    limitations: [
      "Requires minimum of 14 days of transaction history; cold-start commodities fall back to 7-day moving averages.",
    ],
    keyFormulas: ["\\hat{D}_{t+k} = \\sum_{m=1}^{M} w_{q(x_t)}"],
    metricCallout: { label: "Forecast RMSE", value: "3.2 Units" },
  },

  {
    id: "ev-vyapar-asr",
    projectId: "vyaparpulse",
    skillIds: ["ai-ondevice-asr", "fe-offline-first", "lang-python"],
    title: "On-Device Quantized Vosk Speech Recognition (ASR)",
    description: "Lightweight 50MB Vosk acoustic model running locally on CPU in < 185ms without external cloud API dependencies or network latency.",
    sourceRepository: "https://github.com/T-Bone47/vyaparpulse-ai",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.vyaparpulse,
    sourceFilePath: "voice-agent/agent.py",
    demonstrationId: "demo-vyapar-ledger",
    testReferences: ["pytest voice-agent/tests -v"],
    provenance: "REPRODUCIBLE_DEMONSTRATION",
    limitations: [
      "Acoustic vocabulary tuned specifically to retail commodities, units, and currency names.",
    ],
    metricCallout: { label: "Parsing Latency", value: "185 ms" },
  },

  // =========================================================================
  // 5. ASISH ENGINEERING WORLD & DIGITAL TWIN
  // =========================================================================
  {
    id: "ev-world-frontend",
    projectId: "world",
    skillIds: ["fe-react-nextjs", "lang-typescript", "fe-accessibility"],
    title: "React 19 & Next.js 15 App Router Architecture",
    description: "Sub-frame rendering architecture, static parameter generation (SSG) for 66 routes, and universal WCAG accessibility compliance.",
    sourceRepository: "https://github.com/T-Bone47/Minecraft-folio",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.world,
    sourceFilePath: "app/roleforge/page.tsx",
    demonstrationId: "demo-livef1-replay",
    testReferences: ["npm test", "npm run typecheck", "npm run build"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Requires modern browser supporting ECMAScript 2022+.",
    ],
    metricCallout: { label: "Build Routes", value: "66 Pre-rendered" },
  },

  {
    id: "ev-world-threejs",
    projectId: "world",
    skillIds: ["fe-threejs-webgl", "se-performance", "lang-typescript"],
    title: "Three.js & React Three Fiber 3D Simulation Rig",
    description: "60 FPS voxel rendering, custom procedural shaders, distance-domain telemetry conduits, and camera spline interpolation.",
    sourceRepository: "https://github.com/T-Bone47/Minecraft-folio",
    sourceCommit: VERIFIED_REPOSITORY_COMMITS.world,
    sourceFilePath: "components/world/WorldScene.tsx",
    demonstrationId: "demo-livef1-replay",
    testReferences: ["npm test -- tests/engineering-world.test.ts"],
    provenance: "VERIFIED_IMPLEMENTATION",
    limitations: [
      "Gracefully falls back to 2D accessible interface on mobile or environments without WebGL hardware acceleration.",
    ],
    metricCallout: { label: "Frame Budget", value: "16.6 ms (60 FPS)" },
  },
];

export const getEvidenceById = (id: string): EngineeringEvidenceNode | undefined =>
  ENGINEERING_EVIDENCE_GRAPH.find((e) => e.id === id);

export const getEvidenceBySkillId = (skillId: string): EngineeringEvidenceNode[] =>
  ENGINEERING_EVIDENCE_GRAPH.filter((e) => e.skillIds.includes(skillId));

export const getEvidenceByProjectId = (projectId: string): EngineeringEvidenceNode[] =>
  ENGINEERING_EVIDENCE_GRAPH.filter((e) => e.projectId === projectId);
