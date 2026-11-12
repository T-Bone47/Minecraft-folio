import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBundledMotorsportTrace, globalTraceRecorder, sanitizePayload } from '../lib/xray/traceRecorder';
import { buildExecutionGraph } from '../lib/xray/traceGraph';
import { HISTORICAL_INCIDENTS, getIncidentById } from '../lib/xray/historyRegistry';
import { PUSH_TO_PROVE_EXPERIMENTS, getExperimentById } from '../lib/xray/experimentRegistry';
import { useXRayStore } from '../state/xrayStore';

test('traceRecorder sanitizes complex payloads into clean JSON-serializable structures', () => {
  const dirty = {
    primitive: 42,
    fn: () => 'hello',
    sym: Symbol('test'),
    nested: {
      active: true,
      subFn: () => {},
    },
  };
  const clean = sanitizePayload(dirty) as Record<string, unknown>;
  assert.equal(clean.primitive, 42);
  assert.equal((clean.nested as Record<string, unknown>).active, true);
  assert.equal(clean.fn, undefined);
  assert.equal(clean.sym, undefined);
});

test('traceRecorder captures spans with high-resolution monotonic timestamps', () => {
  globalTraceRecorder.clear();
  globalTraceRecorder.setDetailLevel('DETAILED');
  globalTraceRecorder.startTrace('motorsport', 'Test Active Trace');

  globalTraceRecorder.startSpan({
    spanId: 'span_test_op',
    name: 'Test Operation',
    facilityId: 'telemetry',
    subsystem: 'motorsport',
    sourceRef: { repo: 'T-Bone47/Minecraft-folio', file: 'test.ts', lineRange: [1, 10], symbol: 'testFn' },
    inputSummary: { testId: 101 },
  });

  globalTraceRecorder.recordEvent({
    spanId: 'span_test_op',
    name: 'checkpoint_reached',
    payload: { cornerIndex: 1 },
  });

  const ended = globalTraceRecorder.endSpan({
    spanId: 'span_test_op',
    status: 'success',
    outputSummary: { result: 'passed' },
  });
  assert.ok(ended);
  assert.equal(ended?.status, 'success');
  assert.ok(ended?.durationMs !== undefined && ended.durationMs >= 0);

  const completed = globalTraceRecorder.getTraceRecord('test_trace');
  assert.equal(completed.title, 'test_trace');
  assert.equal(completed.spans.length, 1);
  assert.equal(completed.events.length, 1);
  assert.equal(completed.events[0].name, 'checkpoint_reached');
});

test('buildExecutionGraph constructs valid causal DAG and handles subsystem filtering', () => {
  const bundled = createBundledMotorsportTrace();
  assert.equal(bundled.spans.length, 9);
  assert.ok(bundled.totalDurationMs >= 0);

  // Full graph
  const fullGraph = buildExecutionGraph(bundled);
  assert.equal(fullGraph.nodes.length, 9);
  assert.equal(fullGraph.edges.length, 8);

  // Root node depth
  const root = fullGraph.nodes.find((n) => n.id === 'span_veh_sim');
  assert.ok(root);
  assert.equal(root?.depth, 0);

  // Child node depth
  const telemetryNode = fullGraph.nodes.find((n) => n.id === 'span_telem_acquire');
  assert.ok(telemetryNode);
  assert.equal(telemetryNode?.depth, 1);
});

test('historical incident registry preserves verified commit pairs and diagnoses', () => {
  assert.equal(HISTORICAL_INCIDENTS.length, 3);

  const incident1 = getIncidentById('INCIDENT-2026-11-08-01');
  assert.ok(incident1);
  assert.ok(incident1?.afterCommit.includes('c197da8'));
  assert.ok(incident1?.rootCause.includes('screenshot'));
  assert.ok(incident1?.verificationTest.includes('qa-avatar.mjs'));
  assert.ok(incident1?.beforeSnippet.length > 0);
  assert.ok(incident1?.afterSnippet.length > 0);

  const incident2 = getIncidentById('INCIDENT-2026-11-08-02');
  assert.ok(incident2);
  assert.ok(incident2?.afterCommit.includes('a475ae8'));
  assert.ok(incident2?.rootCause.includes('clamping') || incident2?.rootCause.includes('DriveableF1Car'));

  const incident3 = getIncidentById('INCIDENT-2026-11-08-03');
  assert.ok(incident3);
  assert.ok(incident3?.beforeCommit.includes('6e07fd8'));
  assert.ok(incident3?.rootCause.includes('monotonic'));
});

test('push-to-prove lab runs analytical distance solver deterministically', () => {
  const expA = getExperimentById('exp_motorsport_telemetry');
  assert.ok(expA);

  const output = expA.run(expA.sampleInput, {
    interpolationStepM: 2.0,
    cornerApexThresholdKmh: 50.0,
    visitorSpeedMultiplier: 0.95,
  });
  assert.ok(output.totalDeltaSeconds !== undefined);
  assert.ok(output.alignedSampleCount > 50);
  assert.equal(output.verdict, 'SLOWER');

  const validation = expA.validate(output);
  assert.equal(validation.passed, true);
  assert.ok(validation.metrics.totalDeltaS !== undefined);
});

test('push-to-prove lab detects ML target feature leakage and verifies fix', () => {
  const expB = getExperimentById('exp_aiml_evaluation');
  assert.ok(expB);

  // Run with leakage
  const outputLeaked = expB.run(expB.sampleInput, {
    includeLeakageFeature: true,
    trainSplitRatio: 0.8,
    regularizationStrength: 0.01,
  });
  assert.equal(outputLeaked.leakageDetected, true);
  assert.equal(outputLeaked.trainR2, 0.999);
  assert.equal(outputLeaked.verdict, 'UNTRUSTWORTHY_LEAKAGE');
  const valLeaked = expB.validate(outputLeaked);
  assert.equal(valLeaked.passed, false);

  // Run without leakage (legitimate physics model)
  const outputClean = expB.run(expB.sampleInput, {
    includeLeakageFeature: false,
    trainSplitRatio: 0.8,
    regularizationStrength: 0.01,
  });
  assert.equal(outputClean.leakageDetected, false);
  assert.ok(outputClean.testR2 >= 0.70 && outputClean.testR2 <= 0.95);
  assert.equal(outputClean.verdict, 'RELIABLE_GENERALIZATION');
  const valClean = expB.validate(outputClean);
  assert.equal(valClean.passed, true);
});

test('push-to-prove lab verifies and recovers 8-stage pipeline invariants', () => {
  const expC = getExperimentById('exp_systems_reliability');
  assert.ok(expC);

  // Corrupted run with autoRepairEnabled = true
  const outputRepaired = expC.run(expC.sampleInput, {
    faultToInject: 'OUT_OF_ORDER_TIMESTAMP',
    autoRepairEnabled: true,
  });
  assert.equal(outputRepaired.invariantsSatisfied, true);
  assert.equal(outputRepaired.verdict, 'VERIFIED_RECOVERY');
  assert.ok(outputRepaired.repairedFaults.length > 0);

  // Corrupted run without autoRepairEnabled
  const outputBroken = expC.run(expC.sampleInput, {
    faultToInject: 'OUT_OF_ORDER_TIMESTAMP',
    autoRepairEnabled: false,
  });
  assert.equal(outputBroken.invariantsSatisfied, false);
  assert.equal(outputBroken.verdict, 'INVARIANT_BREACH');
});

test('xrayStore updates states, transport controls, and tab transitions', () => {
  const store = useXRayStore.getState();

  // Initial state checks
  assert.equal(store.isXRayActive, false);
  assert.equal(store.isModalOpen, false);

  // Toggle X-Ray
  store.toggleXRay();
  assert.equal(useXRayStore.getState().isXRayActive, true);

  // Open modal with specific tab
  store.openModal('timemachine');
  assert.equal(useXRayStore.getState().isModalOpen, true);
  assert.equal(useXRayStore.getState().activeTab, 'timemachine');

  // Transport controls
  store.playTimeline();
  assert.equal(useXRayStore.getState().isPlaying, true);
  store.pauseTimeline();
  assert.equal(useXRayStore.getState().isPlaying, false);

  store.stepTimeline(1);
  assert.equal(useXRayStore.getState().timelineIndex, 1);

  // Subsystem filter
  store.setSubsystem('motorsport');
  assert.equal(useXRayStore.getState().selectedSubsystem, 'motorsport');

  // Close modal
  store.setModalOpen(false);
  assert.equal(useXRayStore.getState().isModalOpen, false);
});
