/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER MULTIVERSE
 * Interactive Project Demonstration Engine & Canonical Fixtures
 *
 * Provides pure, deterministic execution algorithms and fixtures for:
 * 1. RaceMind Strategy Tree & Tyre Degradation Solver
 * 2. Live F1 Canonical Telemetry Replay & 20-Car Timing Engine
 * 3. Sentinel AI GRC Incident Audit & Cryptographic Remediation
 * 4. VyaparPulse Voice/Text Ledger, Sync Queue & Demand Forecaster
 */

import type {
  RaceMindDemoState,
  LiveF1DemoState,
  LiveF1DriverLap,
  SentinelDemoState,
  SentinelIncident,
  VyaparPulseDemoState,
  VyaparLedgerEntry,
  VyaparDemandForecastPoint,
} from "./projectTypes";

/* -------------------------------------------------------------------------- */
/*                        1. RACEMIND STRATEGY SOLVER                         */
/* -------------------------------------------------------------------------- */

export const INITIAL_RACEMIND_DEMO_STATE: RaceMindDemoState = {
  currentLap: 28,
  totalLaps: 52,
  trackCondition: "DRY",
  safetyCarStatus: "FULL_SAFETY_CAR",
  currentPosition: 1,
  gapToP2: 8.4,
  currentTyreCompound: "HARD",
  currentTyreAge: 24,
  candidateStrategy: "BOX_FOR_SOFTS",
  pitLossDeltaSec: 12.5,
  reentryPosition: 2,
  reentryGapSec: -4.1,
  tyreGripAdvantagePercent: 22.5,
  netRaceTimeDeltaSec: 6.8,
  recommendedAction: "BOX NOW — High Probability Win via Soft Compound Pace Advantage",
  overtakeProbabilityPercent: 88,
  isEvaluating: false,
};

export function evaluateRaceMindStrategy(state: RaceMindDemoState): RaceMindDemoState {
  const lapsRemaining = Math.max(1, state.totalLaps - state.currentLap);
  
  // Pit loss delta in seconds
  let pitLoss = 22.0; // Standard green flag pit loss
  if (state.safetyCarStatus === "FULL_SAFETY_CAR") {
    pitLoss = 12.5;
  } else if (state.safetyCarStatus === "VSC") {
    pitLoss = 16.0;
  }

  // Compound characteristics
  const compoundPaceBase: Record<string, number> = {
    SOFT: 0.0, // Fastest baseline
    MEDIUM: 0.40, // +0.40s / lap baseline
    HARD: 0.95, // +0.95s / lap baseline
  };

  const compoundWearExp: Record<string, number> = {
    SOFT: 1.50, // Fast degradation
    MEDIUM: 1.30,
    HARD: 1.15, // Durable
  };

  const compoundWearAlpha: Record<string, number> = {
    SOFT: 0.030,
    MEDIUM: 0.020,
    HARD: 0.014,
  };

  // 1. Calculate Stay Out Projected Time Loss
  let stayOutDegradation = 0;
  const currentAlpha = compoundWearAlpha[state.currentTyreCompound] || 0.015;
  const currentWearRate = compoundWearExp[state.currentTyreCompound] || 1.20;
  for (let k = 1; k <= lapsRemaining; k++) {
    const age = state.currentTyreAge + k;
    stayOutDegradation += currentAlpha * Math.pow(age, currentWearRate) + 0.5;
  }

  // 2. Candidate Strategy Evaluation
  let candidateCompound = "MEDIUM";
  let boxLoss = 0;
  let tyreAdvantage = 0;
  let gripAdvantagePerLap = 0;

  if (state.candidateStrategy === "STAY_OUT") {
    boxLoss = 0;
    tyreAdvantage = 0;
    gripAdvantagePerLap = 0;
  } else if (state.candidateStrategy === "BOX_FOR_SOFTS") {
    candidateCompound = "SOFT";
    boxLoss = pitLoss;
    tyreAdvantage = 25.0 - (state.currentTyreAge * 0.3);
    gripAdvantagePerLap = 1.15;
  } else if (state.candidateStrategy === "BOX_FOR_MEDIUMS") {
    candidateCompound = "MEDIUM";
    boxLoss = pitLoss;
    tyreAdvantage = 18.0 - (state.currentTyreAge * 0.25);
    gripAdvantagePerLap = 0.80;
  } else if (state.candidateStrategy === "BOX_FOR_HARDS") {
    candidateCompound = "HARD";
    boxLoss = pitLoss;
    tyreAdvantage = 10.0 - (state.currentTyreAge * 0.15);
    gripAdvantagePerLap = 0.40;
  }

  // Calculate new tyre degradation
  let newTyreDegradation = 0;
  if (state.candidateStrategy !== "STAY_OUT") {
    const targetAlpha = compoundWearAlpha[candidateCompound] || 0.018;
    const targetWearRate = compoundWearExp[candidateCompound] || 1.30;
    for (let k = 1; k <= lapsRemaining; k++) {
      const paceBase = compoundPaceBase[candidateCompound] || 0;
      newTyreDegradation += paceBase + targetAlpha * Math.pow(k, targetWearRate);
    }
  } else {
    newTyreDegradation = stayOutDegradation;
  }

  // Net race delta: positive means pitting saves time overall
  const cumulativeGripGain = gripAdvantagePerLap * lapsRemaining;
  const netDelta = (stayOutDegradation - newTyreDegradation) + cumulativeGripGain - boxLoss;
  const reentryGap = state.gapToP2 - boxLoss;
  const reentryPos = reentryGap > 0 ? state.currentPosition : state.currentPosition + 1;

  let overtakeProb = 0;
  if (reentryPos > 1) {
    // Need to overtake
    const paceDiffPerLap = (stayOutDegradation / lapsRemaining) - (newTyreDegradation / lapsRemaining);
    overtakeProb = Math.min(96, Math.max(12, Math.round((paceDiffPerLap * 28) + (lapsRemaining * 1.5))));
  } else {
    overtakeProb = 95; // Leading cleanly
  }

  let recAction = "STAY OUT — Maintain Track Position";
  if (netDelta > 2.0 && state.candidateStrategy !== "STAY_OUT") {
    recAction = `BOX NOW — Pitting for ${candidateCompound} saves ~${netDelta.toFixed(1)}s by race finish`;
  } else if (netDelta <= 0 && state.candidateStrategy !== "STAY_OUT") {
    recAction = "STAY OUT — Pitting surrenders vital track position with insufficient tyre delta";
  }

  return {
    ...state,
    pitLossDeltaSec: Number(pitLoss.toFixed(1)),
    reentryPosition: reentryPos,
    reentryGapSec: Number(reentryGap.toFixed(1)),
    tyreGripAdvantagePercent: Math.max(0, Math.min(40, Number(tyreAdvantage.toFixed(1)))),
    netRaceTimeDeltaSec: Number(netDelta.toFixed(1)),
    recommendedAction: recAction,
    overtakeProbabilityPercent: overtakeProb,
    isEvaluating: false,
  };
}

/* -------------------------------------------------------------------------- */
/*                   2. LIVE F1 CANONICAL REPLAY FIXTURES                     */
/* -------------------------------------------------------------------------- */

const CANONICAL_DRIVERS_GRID: LiveF1DriverLap[] = [
  {
    driverId: "VER",
    driverCode: "VER",
    team: "Red Bull Racing",
    teamColor: "#1E41FF",
    position: 1,
    lapTime: 71.342,
    gapToLeader: 0.0,
    interval: 0.0,
    compound: "MEDIUM",
    tyreAge: 18,
    speedTrapKmH: 326.4,
    drsActive: false,
    sector1: 24.120,
    sector2: 26.840,
    sector3: 20.382,
    lastEventLatencyMs: 0.08,
  },
  {
    driverId: "NOR",
    driverCode: "NOR",
    team: "McLaren",
    teamColor: "#FF8000",
    position: 2,
    lapTime: 71.589,
    gapToLeader: 1.42,
    interval: 1.42,
    compound: "MEDIUM",
    tyreAge: 18,
    speedTrapKmH: 328.1,
    drsActive: true,
    sector1: 24.180,
    sector2: 26.910,
    sector3: 20.499,
    lastEventLatencyMs: 0.11,
  },
  {
    driverId: "LEC",
    driverCode: "LEC",
    team: "Ferrari",
    teamColor: "#E80020",
    position: 3,
    lapTime: 71.810,
    gapToLeader: 4.85,
    interval: 3.43,
    compound: "HARD",
    tyreAge: 22,
    speedTrapKmH: 325.0,
    drsActive: false,
    sector1: 24.290,
    sector2: 27.020,
    sector3: 20.500,
    lastEventLatencyMs: 0.09,
  },
  {
    driverId: "PIA",
    driverCode: "PIA",
    team: "McLaren",
    teamColor: "#FF8000",
    position: 4,
    lapTime: 71.745,
    gapToLeader: 6.12,
    interval: 1.27,
    compound: "MEDIUM",
    tyreAge: 18,
    speedTrapKmH: 327.8,
    drsActive: true,
    sector1: 24.250,
    sector2: 27.010,
    sector3: 20.485,
    lastEventLatencyMs: 0.10,
  },
  {
    driverId: "RUS",
    driverCode: "RUS",
    team: "Mercedes-AMG",
    teamColor: "#27F4D2",
    position: 5,
    lapTime: 72.104,
    gapToLeader: 12.80,
    interval: 6.68,
    compound: "HARD",
    tyreAge: 20,
    speedTrapKmH: 323.5,
    drsActive: false,
    sector1: 24.410,
    sector2: 27.150,
    sector3: 20.544,
    lastEventLatencyMs: 0.12,
  },
  {
    driverId: "HAM",
    driverCode: "HAM",
    team: "Ferrari",
    teamColor: "#E80020",
    position: 6,
    lapTime: 72.015,
    gapToLeader: 13.92,
    interval: 1.12,
    compound: "HARD",
    tyreAge: 20,
    speedTrapKmH: 324.2,
    drsActive: true,
    sector1: 24.380,
    sector2: 27.100,
    sector3: 20.535,
    lastEventLatencyMs: 0.09,
  },
  {
    driverId: "SAI",
    driverCode: "SAI",
    team: "Williams",
    teamColor: "#00A0DE",
    position: 7,
    lapTime: 72.450,
    gapToLeader: 24.15,
    interval: 10.23,
    compound: "MEDIUM",
    tyreAge: 12,
    speedTrapKmH: 329.0,
    drsActive: false,
    sector1: 24.520,
    sector2: 27.280,
    sector3: 20.650,
    lastEventLatencyMs: 0.10,
  },
  {
    driverId: "ALO",
    driverCode: "ALO",
    team: "Aston Martin",
    teamColor: "#229971",
    position: 8,
    lapTime: 72.610,
    gapToLeader: 26.80,
    interval: 2.65,
    compound: "HARD",
    tyreAge: 26,
    speedTrapKmH: 322.8,
    drsActive: false,
    sector1: 24.600,
    sector2: 27.320,
    sector3: 20.690,
    lastEventLatencyMs: 0.13,
  },
];

const CANONICAL_TELEMETRY_TRACE = [
  { distance: 0, speed: 295, throttle: 100, brake: 0, gear: 7, rpm: 11400 },
  { distance: 200, speed: 322, throttle: 100, brake: 0, gear: 8, rpm: 11950 },
  { distance: 400, speed: 328, throttle: 100, brake: 0, gear: 8, rpm: 12100 },
  { distance: 600, speed: 125, throttle: 0, brake: 95, gear: 3, rpm: 8900 },
  { distance: 800, speed: 105, throttle: 35, brake: 0, gear: 3, rpm: 7800 },
  { distance: 1000, speed: 185, throttle: 85, brake: 0, gear: 4, rpm: 9800 },
  { distance: 1400, speed: 265, throttle: 100, brake: 0, gear: 6, rpm: 11200 },
  { distance: 1800, speed: 285, throttle: 100, brake: 0, gear: 7, rpm: 11500 },
  { distance: 2200, speed: 140, throttle: 15, brake: 80, gear: 3, rpm: 8400 },
  { distance: 2600, speed: 215, throttle: 90, brake: 0, gear: 5, rpm: 10400 },
  { distance: 3000, speed: 275, throttle: 100, brake: 0, gear: 7, rpm: 11400 },
  { distance: 3500, speed: 310, throttle: 100, brake: 0, gear: 8, rpm: 11800 },
  { distance: 4000, speed: 165, throttle: 20, brake: 70, gear: 4, rpm: 9100 },
  { distance: 4307, speed: 290, throttle: 100, brake: 0, gear: 7, rpm: 11350 },
];

export const INITIAL_LIVE_F1_DEMO_STATE: LiveF1DemoState = {
  isPlaying: true,
  playbackSpeed: 1,
  currentEventIndex: 482190,
  totalCanonicalEvents: 1067193,
  timestamp: "14:38:22.481 UTC",
  activeSession: "2025 Dutch Grand Prix — Circuit Zandvoort (Lap 32 / 72)",
  telemetryStreamRate: 2648,
  p50LatencyMs: 0.10,
  drivers: CANONICAL_DRIVERS_GRID,
  selectedDriver: "VER",
  telemetryTrace: CANONICAL_TELEMETRY_TRACE,
};

export function stepLiveF1Replay(state: LiveF1DemoState, deltaSec: number): LiveF1DemoState {
  if (!state.isPlaying) return state;

  const eventIncrement = Math.round(state.telemetryStreamRate * deltaSec * state.playbackSpeed);
  const nextEventIndex = (state.currentEventIndex + eventIncrement) % state.totalCanonicalEvents;

  // Tiny realistic micro-jitter on gaps and speeds
  const updatedDrivers = state.drivers.map((d) => {
    const jitter = (Math.random() - 0.5) * 0.05 * state.playbackSpeed;
    const newGap = Math.max(0, d.position === 1 ? 0 : d.gapToLeader + jitter);
    return {
      ...d,
      gapToLeader: Number(newGap.toFixed(2)),
      speedTrapKmH: Number((d.speedTrapKmH + (Math.random() - 0.5) * 0.6).toFixed(1)),
      lastEventLatencyMs: Number((0.08 + Math.random() * 0.04).toFixed(2)),
    };
  });

  return {
    ...state,
    currentEventIndex: nextEventIndex,
    drivers: updatedDrivers,
  };
}

/* -------------------------------------------------------------------------- */
/*                       3. SENTINEL AI GRC INCIDENTS                         */
/* -------------------------------------------------------------------------- */

export const CANONICAL_SENTINEL_INCIDENTS: SentinelIncident[] = [
  {
    id: "INC-01",
    severity: "HIGH",
    controlCode: "NIST-AI-MEASURE-2.3",
    title: "Semantic Vector Drift Exceeding Approved Enterprise Centroid",
    targetModel: "gpt-4o-customer-service-cluster",
    evidenceHash: "e7c2a419f860d92b3a41e974e64f1c99f12ab732d847932bc3e62f01a5281e4b",
    timestamp: "2026-11-13T03:14:22Z",
    status: "INVESTIGATING",
    metricAnomaly: "Cosine distance: 0.384 (Threshold <= 0.250)",
    blastRadius: "12 active user conversational sessions routed through agent worker 04",
    recommendedRemediation: "Apply rate-limiting throttle and route queries to hardened fallback model",
  },
  {
    id: "INC-02",
    severity: "CRITICAL",
    controlCode: "ISO-42001-A.9.2",
    title: "Adversarial Recursive Prompt Injection Pattern Detected",
    targetModel: "claude-3-5-sonnet-copilot-runtime",
    evidenceHash: "3f98c17b89d412e0941af9942a1b90c91823908fbb230912cb841920ac341902",
    timestamp: "2026-11-13T03:19:05Z",
    status: "DETECTED",
    metricAnomaly: "Confidence score: 98.4% malicious token structure",
    blastRadius: "Autonomous code evaluation agent execution container",
    recommendedRemediation: "Immediate sandbox containment and circuit breaker disconnect",
  },
  {
    id: "INC-03",
    severity: "MEDIUM",
    controlCode: "SOC2-CC6.1",
    title: "Unmasked Synthetic PII Token Pattern in Model Output Stream",
    targetModel: "llama-3-3-70b-internal-analytics",
    evidenceHash: "a98412c9820f17b3d4091928014a9b238712390bc0912401f8923091ba89201f",
    timestamp: "2026-11-13T03:22:11Z",
    status: "DETECTED",
    metricAnomaly: "Regex entropy match: credit card Luhn checksum hit",
    blastRadius: "Single analytical batch query report buffer",
    recommendedRemediation: "Automated stream redaction filter and cryptographic audit logging",
  },
];

export const INITIAL_SENTINEL_DEMO_STATE: SentinelDemoState = {
  activeIncidents: CANONICAL_SENTINEL_INCIDENTS,
  selectedIncidentId: "INC-02",
  governanceScore: 94.2,
  complianceFrameworks: [
    { name: "NIST AI RMF 1.0 (GOVERN / MAP / MEASURE / MANAGE)", status: "COMPLIANT", coverage: 96.5 },
    { name: "ISO/IEC 42001 (Artificial Intelligence Management)", status: "ACTION_REQUIRED", coverage: 91.2 },
    { name: "SOC 2 Type II (Security, Availability & Confidentiality)", status: "COMPLIANT", coverage: 98.0 },
    { name: "EU AI Act High-Risk System Mandates", status: "EVALUATING", coverage: 93.8 },
  ],
  isRemediating: false,
  remediationAuditLog: [
    "[03:10:00] Sentinel Gateway initialized with HMAC SHA-256 evidence chain verification.",
    "[03:14:22] NIST-AI-MEASURE-2.3 triggered: Incident INC-01 logged with hash e7c2a419f860...",
    "[03:19:05] ISO-42001-A.9.2 triggered: Incident INC-02 logged with hash 3f98c17b89d4...",
  ],
};

export function executeSentinelRemediation(
  state: SentinelDemoState,
  incidentId: string
): SentinelDemoState {
  const updatedIncidents = state.activeIncidents.map((inc) => {
    if (inc.id === incidentId) {
      return { ...inc, status: "REMEDIATED" as const };
    }
    return inc;
  });

  const incident = state.activeIncidents.find((i) => i.id === incidentId);
  const logMessage = `[${new Date().toISOString().substring(11, 19)}] Remediated ${incidentId} (${incident?.controlCode}): ${incident?.recommendedRemediation}. Cryptographic evidence sealed.`;

  return {
    ...state,
    activeIncidents: updatedIncidents,
    governanceScore: Math.min(99.4, state.governanceScore + 1.8),
    remediationAuditLog: [logMessage, ...state.remediationAuditLog].slice(0, 8),
    isRemediating: false,
  };
}

/* -------------------------------------------------------------------------- */
/*                 4. VYAPARPULSE OFFLINE LEDGER & FORECAST                   */
/* -------------------------------------------------------------------------- */

export const CANONICAL_VYAPAR_LEDGER: VyaparLedgerEntry[] = [
  {
    id: "TX-901",
    timestamp: "11:20 AM",
    type: "SALE",
    entity: "Ramesh Sharma",
    item: "Basmati Rice (Grade A)",
    qty: 10,
    rate: 85,
    totalAmount: 850,
    syncStatus: "SYNCED_TO_CORE",
    hash: "a4f10928bc",
  },
  {
    id: "TX-902",
    timestamp: "11:45 AM",
    type: "SALE",
    entity: "Sunita Verma",
    item: "Refined Sunflower Oil (1L)",
    qty: 4,
    rate: 135,
    totalAmount: 540,
    syncStatus: "SYNCED_TO_CORE",
    hash: "c98201fa21",
  },
  {
    id: "TX-903",
    timestamp: "12:15 PM",
    type: "CREDIT",
    entity: "Rajesh Kirana (Khata)",
    item: "Chana Dal (1kg)",
    qty: 15,
    rate: 92,
    totalAmount: 1380,
    syncStatus: "SYNCED_TO_CORE",
    hash: "d410928ef3",
  },
];

export const CANONICAL_DEMAND_FORECAST: VyaparDemandForecastPoint[] = [
  { day: "Mon", historicalSales: 42, projectedDemand: 45, confidenceLower: 40, confidenceUpper: 50 },
  { day: "Tue", historicalSales: 38, projectedDemand: 41, confidenceLower: 36, confidenceUpper: 46 },
  { day: "Wed", historicalSales: 51, projectedDemand: 54, confidenceLower: 48, confidenceUpper: 60 },
  { day: "Thu", historicalSales: 47, projectedDemand: 49, confidenceLower: 44, confidenceUpper: 54 },
  { day: "Fri", historicalSales: 68, projectedDemand: 72, confidenceLower: 65, confidenceUpper: 79 },
  { day: "Sat", historicalSales: 94, projectedDemand: 98, confidenceLower: 89, confidenceUpper: 107 },
  { day: "Sun", historicalSales: 88, projectedDemand: 92, confidenceLower: 82, confidenceUpper: 102 },
];

export const INITIAL_VYAPARPULSE_DEMO_STATE: VyaparPulseDemoState = {
  isNetworkOnline: true,
  naturalLanguageInput: "Sold 5 kg sugar at 44 rupees cash to Mohan Lal",
  isProcessingSpeech: false,
  parsedPreview: {
    entity: "Mohan Lal",
    item: "Sugar",
    qty: 5,
    rate: 44,
    totalAmount: 220,
    type: "SALE",
  },
  ledgerEntries: CANONICAL_VYAPAR_LEDGER,
  offlineQueueCount: 0,
  reconciledCount: 3,
  inventoryForecast: CANONICAL_DEMAND_FORECAST,
};

export function parseNaturalLanguageTransaction(text: string): Partial<VyaparLedgerEntry> {
  const normalized = text.toLowerCase();
  
  // Extract quantity
  const qtyMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos|liters|l|units|cans|packets|bags)?/);
  const qty = qtyMatch ? parseFloat(qtyMatch[1]) : 1;

  // Extract rate / amount
  const rateMatch = normalized.match(/(?:at|@|for|rs|rupees|inr)\s*(\d+(?:\.\d+)?)/);
  const rate = rateMatch ? parseFloat(rateMatch[1]) : 50;

  // Extract entity / customer
  let entity = "Walk-in Customer";
  const entityMatch = text.match(/(?:to|from|for|by)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
  if (entityMatch) {
    entity = entityMatch[1].trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Extract item
  let item = "Commodity Item";
  if (normalized.includes("sugar")) item = "Refined Sugar";
  else if (normalized.includes("rice")) item = "Basmati Rice";
  else if (normalized.includes("oil")) item = "Cooking Oil";
  else if (normalized.includes("dal") || normalized.includes("lentils")) item = "Chana Dal";
  else if (normalized.includes("flour") || normalized.includes("atta")) item = "Wheat Flour";

  const isPurchase = normalized.includes("bought") || normalized.includes("purchased");
  const isCredit = normalized.includes("credit") || normalized.includes("khata") || normalized.includes("udhar");

  let type: "SALE" | "PURCHASE" | "CREDIT" = "SALE";
  if (isPurchase) type = "PURCHASE";
  else if (isCredit) type = "CREDIT";

  return {
    entity,
    item,
    qty,
    rate,
    totalAmount: Math.round(qty * rate * 100) / 100,
    type,
  };
}

export function commitVyaparTransaction(
  state: VyaparPulseDemoState,
  entry: Partial<VyaparLedgerEntry>
): VyaparPulseDemoState {
  const syncStatus = state.isNetworkOnline ? ("SYNCED_TO_CORE" as const) : ("QUEUED_OFFLINE" as const);
  const newEntry: VyaparLedgerEntry = {
    id: `TX-${900 + state.ledgerEntries.length + 1}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type: entry.type || "SALE",
    entity: entry.entity || "Customer",
    item: entry.item || "Commodity",
    qty: entry.qty || 1,
    rate: entry.rate || 10,
    totalAmount: entry.totalAmount || (entry.qty || 1) * (entry.rate || 10),
    syncStatus,
    hash: Math.random().toString(36).substring(2, 10),
  };

  const newOfflineCount = syncStatus === "QUEUED_OFFLINE" ? state.offlineQueueCount + 1 : state.offlineQueueCount;
  const newReconciledCount = syncStatus === "SYNCED_TO_CORE" ? state.reconciledCount + 1 : state.reconciledCount;

  return {
    ...state,
    ledgerEntries: [newEntry, ...state.ledgerEntries],
    offlineQueueCount: newOfflineCount,
    reconciledCount: newReconciledCount,
  };
}

export function reconcileOfflineQueue(state: VyaparPulseDemoState): VyaparPulseDemoState {
  if (state.offlineQueueCount === 0) return state;

  const reconciledEntries = state.ledgerEntries.map((e) => ({
    ...e,
    syncStatus: "SYNCED_TO_CORE" as const,
  }));

  return {
    ...state,
    isNetworkOnline: true,
    ledgerEntries: reconciledEntries,
    reconciledCount: state.reconciledCount + state.offlineQueueCount,
    offlineQueueCount: 0,
  };
}
