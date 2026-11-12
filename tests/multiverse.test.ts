import { test } from "node:test";
import assert from "node:assert/strict";
import {
  multiverseProjects,
  getAllMultiverseProjects,
  getMultiverseProjectById,
  getMultiverseProjectBySlug,
} from "../lib/multiverse/projectRegistry";
import { multiverseEvidenceRecords } from "../lib/multiverse/evidenceManifest";
import {
  INITIAL_RACEMIND_DEMO_STATE,
  evaluateRaceMindStrategy,
  INITIAL_LIVE_F1_DEMO_STATE,
  stepLiveF1Replay,
  INITIAL_SENTINEL_DEMO_STATE,
  executeSentinelRemediation,
  INITIAL_VYAPARPULSE_DEMO_STATE,
  parseNaturalLanguageTransaction,
  commitVyaparTransaction,
  reconcileOfflineQueue,
} from "../lib/multiverse/demoRegistry";
import { useMultiverseStore } from "../state/multiverseStore";

/* -------------------------------------------------------------------------- */
/*                     1. PROJECT REGISTRY INTEGRITY                          */
/* -------------------------------------------------------------------------- */

test("Project Registry contains exactly 4 canonical production projects", () => {
  const all = getAllMultiverseProjects();
  assert.equal(all.length, 4);

  const ids = all.map((p) => p.id);
  assert.ok(ids.includes("racemind"));
  assert.ok(ids.includes("live-f1"));
  assert.ok(ids.includes("sentinel"));
  assert.ok(ids.includes("vyaparpulse"));
});

test("Each project has valid repository metadata and verifiable commit SHAs", () => {
  for (const p of multiverseProjects) {
    assert.ok(p.repositoryUrl.startsWith("https://github.com/T-Bone47/"));
    assert.match(p.commitSha, /^[0-9a-f]{7,}$/i);
    assert.ok(p.themeColor.startsWith("#"));
    assert.equal(p.portalOffset.length, 3);
    assert.ok(p.keyMetrics.length >= 4);
    for (const m of p.keyMetrics) {
      assert.ok(m.label.length > 0);
      assert.ok(m.value.length > 0);
      assert.equal(m.verified, true);
    }
  }
});

test("Each project provides tailored recruiter takeaways across all 4 pathways", () => {
  const pathways = ["software-engineering", "ai-ml", "motorsport", "full-stack"] as const;
  for (const p of multiverseProjects) {
    for (const pw of pathways) {
      const data = p.roleRelevance[pw];
      assert.ok(data, `Missing role relevance for ${pw} in ${p.id}`);
      assert.ok(data.headline.length > 10);
      assert.ok(data.takeaways.length >= 3);
      assert.ok(data.interviewQuestions.length >= 2);
    }
  }
});

test("Project lookup by ID and Slug resolves canonical references", () => {
  const rm = getMultiverseProjectById("racemind");
  assert.equal(rm?.slug, "racemind");

  const f1 = getMultiverseProjectBySlug("live-f1");
  assert.equal(f1?.id, "live-f1");

  const nonExistent = getMultiverseProjectById("unknown" as any);
  assert.equal(nonExistent, undefined);
});

/* -------------------------------------------------------------------------- */
/*                     2. 6-LAYER EVIDENCE MANIFESTS                         */
/* -------------------------------------------------------------------------- */

test("Evidence manifests contain authoritative 6-layer audits with formulas and ASCII diagrams", () => {
  const ids = ["racemind", "live-f1", "sentinel", "vyaparpulse"] as const;
  for (const id of ids) {
    const layers = multiverseEvidenceRecords[id];
    assert.ok(layers, `Missing layers for ${id}`);

    // Layer 1
    assert.ok(layers.problem.engineeringConstraints.length >= 3);
    assert.ok(layers.problem.invariants.length >= 2);
    assert.ok(layers.problem.failureModes.length >= 2);

    // Layer 2
    assert.ok(layers.architecture.asciiDiagram.includes("+--"));
    assert.ok(layers.architecture.components.length >= 3);
    assert.ok(layers.architecture.dataFlow.length >= 4);

    // Layer 3
    assert.ok(layers.algorithms.mathFormulaLatex.length > 5);
    assert.ok(layers.algorithms.codeSnippet.code.length > 20);

    // Layer 4
    assert.ok(layers.benchmarks.metrics.length >= 4);
    assert.ok(layers.benchmarks.reproductionCommand.length > 5);

    // Layer 5
    assert.ok(layers.tradeoffs.decisions.length >= 2);

    // Layer 6
    assert.ok(layers.sources.files.length >= 3);
  }
});

/* -------------------------------------------------------------------------- */
/*                     3. INTERACTIVE DEMONSTRATION RUNNERS                   */
/* -------------------------------------------------------------------------- */

test("RaceMind strategy solver computes pit loss delta under safety car correctly", () => {
  const state = {
    ...INITIAL_RACEMIND_DEMO_STATE,
    safetyCarStatus: "FULL_SAFETY_CAR" as const,
    candidateStrategy: "BOX_FOR_SOFTS" as const,
  };

  const evaluated = evaluateRaceMindStrategy(state);
  assert.equal(evaluated.pitLossDeltaSec, 12.5);
  assert.ok(evaluated.netRaceTimeDeltaSec > 0);
  assert.ok(evaluated.tyreGripAdvantagePercent > 10);
  assert.match(evaluated.recommendedAction, /BOX NOW/i);

  // When Green flag and hard tyres, pit loss is 22.0s
  const greenState = {
    ...INITIAL_RACEMIND_DEMO_STATE,
    safetyCarStatus: "NONE" as const,
    candidateStrategy: "BOX_FOR_HARDS" as const,
  };
  const evaluatedGreen = evaluateRaceMindStrategy(greenState);
  assert.equal(evaluatedGreen.pitLossDeltaSec, 22.0);
});

test("Live F1 telemetry replay steps timeline without dropped events or NaNs", () => {
  const initial = INITIAL_LIVE_F1_DEMO_STATE;
  const stepped = stepLiveF1Replay(initial, 0.1);

  assert.ok(stepped.currentEventIndex > initial.currentEventIndex);
  assert.equal(stepped.drivers.length, 8);
  for (const driver of stepped.drivers) {
    assert.equal(Number.isNaN(driver.gapToLeader), false);
    assert.equal(Number.isNaN(driver.speedTrapKmH), false);
    assert.ok(driver.speedTrapKmH > 250);
  }
});

test("Sentinel AI GRC remediation updates incident status, score, and logs", () => {
  const initial = INITIAL_SENTINEL_DEMO_STATE;
  const targetId = "INC-02";

  const remediated = executeSentinelRemediation(initial, targetId);
  const inc = remediated.activeIncidents.find((i) => i.id === targetId);
  assert.equal(inc?.status, "REMEDIATED");
  assert.ok(remediated.governanceScore > initial.governanceScore);
  assert.ok(remediated.remediationAuditLog[0].includes("Remediated INC-02"));
});

test("VyaparPulse voice parser extracts commodities and enforces double-entry", () => {
  const utterance = "Sold 10 kg Basmati Rice at 85 rupees cash to Ramesh";
  const parsed = parseNaturalLanguageTransaction(utterance);

  assert.equal(parsed.entity, "Ramesh");
  assert.equal(parsed.item, "Basmati Rice");
  assert.equal(parsed.qty, 10);
  assert.equal(parsed.rate, 85);
  assert.equal(parsed.totalAmount, 850);
  assert.equal(parsed.type, "SALE");

  // Commit transaction when offline
  const offlineState = {
    ...INITIAL_VYAPARPULSE_DEMO_STATE,
    isNetworkOnline: false,
  };

  const committed = commitVyaparTransaction(offlineState, parsed);
  assert.equal(committed.offlineQueueCount, 1);
  assert.equal(committed.ledgerEntries[0].syncStatus, "QUEUED_OFFLINE");

  // Reconcile offline queue
  const reconciled = reconcileOfflineQueue(committed);
  assert.equal(reconciled.offlineQueueCount, 0);
  assert.equal(reconciled.isNetworkOnline, true);
  assert.equal(reconciled.ledgerEntries[0].syncStatus, "SYNCED_TO_CORE");
});

/* -------------------------------------------------------------------------- */
/*                     4. MULTIVERSE STORE TRANSITIONS                        */
/* -------------------------------------------------------------------------- */

test("Multiverse store opens and closes portals with clean state transitions", () => {
  const store = useMultiverseStore.getState();

  store.openPortal("live-f1", "engineering");
  let s = useMultiverseStore.getState();
  assert.equal(s.activePortalId, "live-f1");
  assert.equal(s.activeViewMode, "engineering");

  store.setActiveLayerIndex(3);
  s = useMultiverseStore.getState();
  assert.equal(s.activeLayerIndex, 3);

  // Clamped bounds checking
  store.setActiveLayerIndex(10);
  s = useMultiverseStore.getState();
  assert.equal(s.activeLayerIndex, 5);

  store.closePortal();
  s = useMultiverseStore.getState();
  assert.equal(s.activePortalId, null);
});
