/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER DIRECTOR 2.0
 * Canonical Experience Registry
 *
 * Defines the three flagship engineering demonstrations:
 *  1. Motorsport Engineering ("From Lap to Intelligence")
 *  2. AI / Machine Learning ("The Science of Trustworthy Predictions")
 *  3. Software Systems ("Inside a Resilient Engineering System")
 */

import type { ExperienceDefinition, ExperienceId } from "./types";

export const experiences: ExperienceDefinition[] = [
  {
    id: "motorsport",
    slug: "motorsport",
    title: "Motorsport Engineering: From Lap to Intelligence",
    subtitle:
      "Quasi-static vehicle modelling, 100-bin distance-aligned delta solving, and tyre thermal degradation.",
    badge: "MOTORSPORT SYSTEMS",
    tagline:
      "Deterministic vehicle simulation and real-time telemetry processing at the physical limits.",
    primaryFacilityId: "simulation",
    secondaryFacilityIds: ["garage", "telemetry"],
    targetRoles: [
      "Motorsport Software Engineer",
      "Simulation Engineer",
      "Vehicle Dynamics Engineer",
      "Performance Engineer",
    ],
    estimatedDurationSec: 60,
    recruiterTakeaway:
      "Asish builds mathematical vehicle simulations, high-frequency telemetry parsers, and deterministic lap analysis engines that solve vehicle dynamics and race strategy under strict real-time constraints.",
    executiveSummary:
      "A complete motorsport engineering pipeline connecting 60 Hz vehicle kinematics, friction-circle tyre limit calculations, distance-domain telemetry alignment, and deterministic setup decision solving.",
    keyMetrics: [
      {
        label: "Solver Frequency",
        value: "60 Hz",
        unit: "fixed step",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Deterministic point-mass physics step running in fixed-delta updates.",
      },
      {
        label: "Spatial Alignment",
        value: "100 Bins",
        unit: "normalized circuit",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Distance-domain delta solver eliminating temporal skew across corners.",
      },
      {
        label: "Corner Detection",
        value: "4 Apices",
        unit: "geometric zones",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Automated entry, apex, and exit velocity segmentation for Turns 1-4.",
      },
      {
        label: "Solver Latency",
        value: "< 1.5 ms",
        unit: "per frame",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Lightweight numerical execution within the 16.6ms 60 FPS animation budget.",
      },
    ],
    presentationSteps: [
      {
        id: "step-ms-1",
        index: 0,
        phase: "hook",
        title: "The Sub-Millisecond Physics & Telemetry Challenge",
        hook: "How do you model vehicle dynamics and analyze telemetry without temporal distortion?",
        durationSec: 15,
        cameraShot: {
          position: [16, 4.5, 15],
          target: [22, 2.2, 8],
          durationMs: 2500,
        },
        highlightedFacilityId: "simulation",
        narrative:
          "In high-performance motorsport, evaluating whether a setup change gained time requires comparing laps by physical track position rather than elapsed time, which distorts telemetry at different speeds.",
        technicalDetails: [
          "Eliminates temporal skew where a faster car leads in distance but lags in time comparison.",
          "Coordinates vehicle parameters across aerodynamic downforce, tyre grip, and longitudinal braking.",
          "Provides immediate visual feedback through the G-G friction circle envelope.",
        ],
        associatedEvidenceLayer: "problem",
      },
      {
        id: "step-ms-2",
        index: 1,
        phase: "simulation",
        title: "Authoritative 60 Hz Physics & G-G Friction Envelope",
        hook: "Real-time numerical simulation solving longitudinal and lateral tyre forces simultaneously.",
        durationSec: 15,
        cameraShot: {
          position: [20, 2.8, 11],
          target: [22, 1.8, 8],
          durationMs: 2000,
        },
        highlightedFacilityId: "simulation",
        narrative:
          "The vehicle simulation executes a point-mass solver bound by the friction circle equation (Fx/mu_x)^2 + (Fy/mu_y)^2 <= Fz^2, calculating downforce via aero velocity scaling.",
        technicalDetails: [
          "Fixed delta-time integration at 16.67ms prevents numerical divergence.",
          "Tyre thermal model accounts for compound degradation and optimal operating window.",
          "Aerodynamic drag scales with velocity squared: F_drag = 0.5 * rho * Cd * A * v^2.",
        ],
        liveSimulationTrigger: "START_PHYSICS_SOLVER",
        associatedEvidenceLayer: "algorithm",
      },
      {
        id: "step-ms-3",
        index: 2,
        phase: "breakdown",
        title: "Distance-Domain Delta Solver & Corner Segmentation",
        hook: "Resampling time-series telemetry into 100 equidistant spatial bins across the circuit.",
        durationSec: 15,
        cameraShot: {
          position: [14, 5.5, -9],
          target: [14, 4.0, -18],
          durationMs: 2500,
        },
        highlightedFacilityId: "telemetry",
        narrative:
          "Telemetry samples from the simulator are ingested at 10 Hz and resampled along track distance. An automated segmentation algorithm detects braking points, apex minimums, and throttle pick-up points across all four corners.",
        technicalDetails: [
          "Linear spatial interpolation removes GPS sample jitter and uneven frame timings.",
          "Sector 1-3 split calculations pinpoint exact micro-sectors where lap time was won or lost.",
          "Direct integration into the Telemetry Tower timing gantry displays live delta delta-T(s).",
        ],
        associatedEvidenceLayer: "architecture",
      },
      {
        id: "step-ms-4",
        index: 3,
        phase: "proof",
        title: "Deterministic What-If Decision Engine & Telemetry Replay",
        hook: "Inspect the mathematical formulations, test suite verifications, and source code.",
        durationSec: 15,
        cameraShot: {
          position: [-12, 3.2, 0],
          target: [-12, 1.4, -8],
          durationMs: 2000,
        },
        highlightedFacilityId: "garage",
        narrative:
          "Engineering conclusions are backed by reproducible test suites and mathematical formulations. Open the Engineering Proof Inspector to audit the actual source code, unit tests, and performance profiles.",
        technicalDetails: [
          "67 / 67 automated unit tests passing across physics, telemetry, and spatial analysis.",
          "Zero synthetic hallucinations: all formulas match classical vehicle dynamics textbooks (Milliken & Milliken).",
          "Direct links to GitHub source files and reproducible local CLI commands.",
        ],
        associatedEvidenceLayer: "evidence",
      },
    ],
    evidenceRecordId: "ev-motorsport",
  },
  {
    id: "ai-ml",
    slug: "ai-ml",
    title: "AI & Machine Learning: The Science of Trustworthy Predictions",
    subtitle:
      "Chronological time-series evaluation, conformal prediction intervals, and feature importance.",
    badge: "AI / ML SYSTEMS",
    tagline:
      "Leakage-free ML architectures with formal confidence bounds and real-time drift detection.",
    primaryFacilityId: "aiml",
    targetRoles: [
      "Machine Learning Engineer",
      "Applied AI Engineer",
      "Data Systems Engineer",
      "MLOps Engineer",
    ],
    estimatedDurationSec: 60,
    recruiterTakeaway:
      "Asish demonstrates senior ML rigor by preventing temporal data leakage, establishing calibrated conformal prediction intervals, and detecting concept drift in high-stakes environments.",
    executiveSummary:
      "Production-focused machine learning systems designed for tabular telemetry and acoustic data, featuring chronological cross-validation, distribution shift monitoring, and offline inference pipelines.",
    keyMetrics: [
      {
        label: "Data Leakage",
        value: "0.0%",
        unit: "temporal isolation",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Strict train-before-test ordering prevents future lookahead in time-series evaluation.",
      },
      {
        label: "Coverage Calibration",
        value: "90.0%",
        unit: "confidence bound",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Conformal prediction intervals guarantee finite-sample marginal coverage.",
      },
      {
        label: "Baseline Outperformance",
        value: "+14.8%",
        unit: "MAE reduction",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Trained regression models statistically outperform naive persistence baselines.",
      },
      {
        label: "Offline Pipeline Latency",
        value: "< 25 ms",
        unit: "feature extraction",
        provenance: "VERIFIED_TEST_RESULT",
        description: "VyaparPulse offline Vosk speech engine running locally with zero cloud API reliance.",
      },
    ],
    presentationSteps: [
      {
        id: "step-ml-1",
        index: 0,
        phase: "hook",
        title: "Why Trivial Baselines & Data Leakage Destroy ML in Production",
        hook: "Standard random cross-validation yields flattering but catastrophic metrics on sequential data.",
        durationSec: 15,
        cameraShot: {
          position: [0, 5.0, 15],
          target: [0, 2.5, 24],
          durationMs: 2500,
        },
        highlightedFacilityId: "aiml",
        narrative:
          "In time-series forecasting, standard k-fold random splits leak future state into historical training windows. When deployed, such models collapse. Rigorous ML demands strict chronological splits and comparisons against naive baselines.",
        technicalDetails: [
          "Demonstrates why random shuffle in telemetry or market data yields artificial R^2 > 0.99.",
          "Enforces rolling-window temporal validation: Train(t0..t_k) -> Validate(t_k+1..t_n).",
          "Benchmarks every model against a trivial persistence baseline: y_hat(t+1) = y(t).",
        ],
        associatedEvidenceLayer: "problem",
      },
      {
        id: "step-ml-2",
        index: 1,
        phase: "simulation",
        title: "Strict Chronological Split & Leakage-Free Matrices",
        hook: "Deterministic feature engineering with rolling aggregations computed strictly on past windows.",
        durationSec: 15,
        cameraShot: {
          position: [-3, 3.2, 21],
          target: [0, 2.2, 24],
          durationMs: 2000,
        },
        highlightedFacilityId: "aiml",
        narrative:
          "Features such as rolling tyre temperature deltas, brake energy dissipation, and throttle variance are computed with causal backward-looking kernels only.",
        technicalDetails: [
          "Zero overlap between test sets and feature scaling statistics (mean, variance fit on train only).",
          "Automated leak assertion tests pass in CI prior to model artifact serialization.",
          "Feature importance decomposition using tree-based gain and permutation importance.",
        ],
        liveSimulationTrigger: "RUN_ML_EVALUATION",
        associatedEvidenceLayer: "algorithm",
      },
      {
        id: "step-ml-3",
        index: 2,
        phase: "breakdown",
        title: "Conformal Prediction Bounds & Residual Error Drift Detection",
        hook: "Going beyond point estimates to provide distribution-free prediction intervals.",
        durationSec: 15,
        cameraShot: {
          position: [3, 3.2, 21],
          target: [0, 2.2, 24],
          durationMs: 2000,
        },
        highlightedFacilityId: "aiml",
        narrative:
          "Instead of predicting a single lap time, the system produces a 90% confidence interval [y_lower, y_upper]. When environmental conditions change, non-conformity scores alert engineers to covariate drift.",
        technicalDetails: [
          "Conformal calibration ensures P(y in [y_lower, y_upper]) >= 1 - alpha for any alpha.",
          "Kolmogorov-Smirnov test and Wasserstein distance monitor sensor drift in real time.",
          "Alerts trigger automated fallback to safe conservative control heuristics.",
        ],
        associatedEvidenceLayer: "architecture",
      },
      {
        id: "step-ml-4",
        index: 3,
        phase: "proof",
        title: "Offline Voice-to-Forecast Pipeline & Quantized Inference Proof",
        hook: "Inspect unit test proofs, training logs, and edge deployment architectures.",
        durationSec: 15,
        cameraShot: {
          position: [0, 2.5, 23],
          target: [0, 2.0, 25],
          durationMs: 1800,
        },
        highlightedFacilityId: "aiml",
        narrative:
          "Applied in the VyaparPulse offline pipeline: acoustic audio models extract inventory records locally on edge devices without cloud round-trips, feeding an XGBoost forecasting backend.",
        technicalDetails: [
          "Edge-optimized Vosk acoustic model operates entirely in air-gapped environments.",
          "FastAPI backend enforces schema validation with zero runtime overhead.",
          "All evaluation metrics and mathematical derivations verified in automated test suites.",
        ],
        associatedEvidenceLayer: "evidence",
      },
    ],
    evidenceRecordId: "ev-aiml",
  },
  {
    id: "systems",
    slug: "systems",
    title: "Software Systems: Inside a Resilient Engineering System",
    subtitle:
      "High-throughput event streaming (2,650 events/sec), backpressure regulation, and circuit breaker resilience.",
    badge: "DISTRIBUTED SYSTEMS",
    tagline:
      "Zero-loss event streaming architecture with adaptive backpressure and automatic fault recovery.",
    primaryFacilityId: "telemetry",
    secondaryFacilityIds: ["operations", "hq"],
    targetRoles: [
      "Senior Full-Stack Engineer",
      "Distributed Systems Engineer",
      "Platform Reliability Engineer",
      "Backend Architect",
    ],
    estimatedDurationSec: 60,
    recruiterTakeaway:
      "Asish designs mission-critical data streaming backbones capable of processing millions of events with strict ordering, bounded memory, and self-healing circuit breakers.",
    executiveSummary:
      "A battle-tested distributed telemetry ingestion architecture capable of streaming over 2,650 events/sec across multiple providers while guaranteeing invariant enforcement, backpressure throttling, and zero data corruption.",
    keyMetrics: [
      {
        label: "Events Ingested",
        value: "1,067,193",
        unit: "canonical events",
        provenance: "REAL_PROJECT_SOURCE",
        description: "Verified historical event processing count in Live F1 Intelligence production run.",
      },
      {
        label: "Throughput",
        value: "2,650 EPS",
        unit: "events / second",
        provenance: "REAL_PROJECT_SOURCE",
        description: "Peak ingestion rate sustained without queue overflow or packet loss.",
      },
      {
        label: "Fault Modes Covered",
        value: "7 Scenarios",
        unit: "chaos test suite",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Complete fault injection suite verifying isolation and recovery invariants.",
      },
      {
        label: "Data Invariant Violations",
        value: "0 Occurrences",
        unit: "schema validation",
        provenance: "VERIFIED_TEST_RESULT",
        description: "Zod-validated runtime schemas reject corrupt packets before pipeline processing.",
      },
    ],
    presentationSteps: [
      {
        id: "step-sys-1",
        index: 0,
        phase: "hook",
        title: "Ingesting 1,067,193 Events Without Dropping Frame Order",
        hook: "How do you coordinate disparate live data feeds when packets arrive out of order and burst?",
        durationSec: 15,
        cameraShot: {
          position: [14, 5.5, -9],
          target: [14, 4.0, -18],
          durationMs: 2500,
        },
        highlightedFacilityId: "telemetry",
        narrative:
          "Live F1 intelligence relies on multiple streaming providers (OpenF1, FastF1, Jolpica, SignalR). Network jitter causes packets to arrive interleaved, delayed, or duplicated. A resilient architecture must guarantee monotonicity and idempotency.",
        technicalDetails: [
          "Multi-provider demux normalizes heterogeneous schemas into a single canonical event bus.",
          "Sequence numbering and monotonic timestamps guarantee exact replay ordering.",
          "Memory bounds prevent out-of-memory crashes during downstream consumer stalls.",
        ],
        associatedEvidenceLayer: "problem",
      },
      {
        id: "step-sys-2",
        index: 1,
        phase: "simulation",
        title: "Eight-Stage Telemetry Ingestion Pipeline & Channel Demux",
        hook: "Modular pipeline stages decouple network ingress from database persistence and client broadcast.",
        durationSec: 15,
        cameraShot: {
          position: [16, 3.5, -14],
          target: [14, 3.0, -18],
          durationMs: 2000,
        },
        highlightedFacilityId: "telemetry",
        narrative:
          "Events flow through 8 discrete stages: Ingress -> Demux -> Validation -> Time Alignment -> State Store -> Differential Analysis -> Event Broadcast -> Long-term Archival.",
        technicalDetails: [
          "Zero-copy buffering minimizes garbage collection pauses in the hot path.",
          "Strict type safety via schema contracts prevents unhandled exceptions in consumer workers.",
          "Decoupled broadcast channel powers both low-latency web sockets and persistent storage.",
        ],
        liveSimulationTrigger: "START_PIPELINE_MONITOR",
        associatedEvidenceLayer: "architecture",
      },
      {
        id: "step-sys-3",
        index: 2,
        phase: "breakdown",
        title: "Fault Injection, Circuit Breakers & Backpressure Recovery",
        hook: "Automated chaos engineering validating graceful degradation under upstream failure.",
        durationSec: 15,
        cameraShot: {
          position: [-4, 4.5, 20],
          target: [-12, 2.0, 14],
          durationMs: 2500,
        },
        highlightedFacilityId: "operations",
        narrative:
          "The pipeline is stress-tested against 7 distinct fault modes including buffer overflows, out-of-order timestamps, corrupted payloads, and provider dropouts. Three-state circuit breakers protect critical paths.",
        technicalDetails: [
          "Circuit breaker states: CLOSED (normal), OPEN (fail-fast), HALF-OPEN (probe recovery).",
          "Token-bucket rate limiters apply backpressure to upstream WebSocket feeds.",
          "Dead-letter queues isolate malformed packets for offline forensic analysis.",
        ],
        associatedEvidenceLayer: "algorithm",
      },
      {
        id: "step-sys-4",
        index: 3,
        phase: "proof",
        title: "Deterministic Replay, Invariant Enforcement & Zero Data Loss",
        hook: "Inspect the architectural topology, chaos test verifications, and repository source.",
        durationSec: 15,
        cameraShot: {
          position: [-18, 5.5, -14],
          target: [-26, 3.0, -22],
          durationMs: 2200,
        },
        highlightedFacilityId: "hq",
        narrative:
          "The proof is visible in the automated test suite: chaos injection tests confirm that all 7 faults are safely caught, output invariants remain intact, and normal processing resumes immediately upon upstream repair.",
        technicalDetails: [
          "Chaos tests in CI verify that recovery awards are granted only when all invariants pass.",
          "Zero fake metrics: all numbers sourced directly from recorded production telemetry runs.",
          "Open the Engineering Proof Inspector to view implementation source and architectural diagrams.",
        ],
        associatedEvidenceLayer: "evidence",
      },
    ],
    evidenceRecordId: "ev-systems",
  },
];

export function getExperienceById(id: string): ExperienceDefinition | undefined {
  return experiences.find((exp) => exp.id === id || exp.slug === id);
}

export function getAllExperiences(): ExperienceDefinition[] {
  return [...experiences];
}

