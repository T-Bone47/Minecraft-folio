/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
 * Defense Track 3: AI/ML Model Evaluation & Counterfactual Leakage Lab
 *
 * Exposes one of the most pervasive traps in telemetry & tabular machine learning:
 * random cross-validation leakage across time-series sequences. Demonstrates how
 * lookahead features and random k-fold produce deceptively inflated 98%+ accuracy,
 * while strict temporal splits reveal true out-of-sample generalization.
 */

import type {
  DefenseExecutionResult,
  DefenseHypothesis,
  DefenseInvariantCheck,
  DefenseParameter,
  TechnicalReviewSection,
} from "../types";

export const MODEL_LEAKAGE_PARAMETERS: DefenseParameter[] = [
  {
    id: "splitStrategy",
    name: "Dataset Validation Split Strategy",
    description: "Method of dividing time-series race telemetry into train and validation sets.",
    type: "select",
    defaultValue: "temporal-session-split",
    options: [
      {
        value: "temporal-session-split",
        label: "Strict Temporal Session Split (Recommended)",
        description: "Laps 1-40 train, Laps 41-58 test. Zero temporal overlap between folds.",
      },
      {
        value: "random-kfold",
        label: "Random 5-Fold Cross Validation (Hazardous Trap)",
        description: "Shuffles laps randomly into folds; causes autocorrelation leakage between consecutive laps.",
      },
      {
        value: "driver-holdout",
        label: "Out-of-Distribution Driver Holdout",
        description: "Trains on 18 drivers, tests on 2 held-out drivers; tests generalization across driving styles.",
      },
    ],
  },
  {
    id: "includeLookaheadPitFlag",
    name: "Include Look-Ahead Pit Window Feature",
    description: "Whether the feature pipeline incorporates future pit lane entry flags.",
    type: "select",
    defaultValue: "no-clean",
    options: [
      {
        value: "no-clean",
        label: "No: Clean Causal Features Only (Safe)",
        description: "Uses only past tyre age, lap times, degradation rate, and track temperature.",
      },
      {
        value: "yes-leaked",
        label: "Yes: Inadvertent Target Leakage (Corrupt)",
        description: "Includes telemetry signal from pit lane transponder before pit stop completes.",
      },
    ],
  },
  {
    id: "l2Regularization",
    name: "L2 Regularization Penalty (λ)",
    description: "Weight decay penalizing complex model coefficients.",
    type: "number",
    unit: "λ",
    defaultValue: 0.01,
    min: 0.001,
    max: 1.0,
    step: 0.01,
  },
  {
    id: "decisionThreshold",
    name: "Classification Decision Threshold (θ)",
    description: "Probability threshold for predicting an optimal pit stop box window.",
    type: "number",
    unit: "θ",
    defaultValue: 0.5,
    min: 0.3,
    max: 0.7,
    step: 0.05,
  },
];

export const MODEL_LEAKAGE_HYPOTHESES: DefenseHypothesis[] = [
  {
    id: "hyp-clean-temporal-generalization",
    trackId: "aiml-model-leakage",
    title: "Strict Temporal Split reflects genuine ~84% out-of-sample accuracy without leakage",
    description: "Training only on historical laps and testing strictly on future laps prevents future information leaking into weights. Generalization gap remains < 0.06.",
    expectedOutcome: "All invariants pass. Train score 87.2%, test score 84.1%, zero temporal leakage.",
    invariantToTest: "INV_ZERO_TEMPORAL_LEAKAGE & INV_GENERALIZATION_GAP",
  },
  {
    id: "hyp-random-kfold-deception",
    trackId: "aiml-model-leakage",
    title: "Random K-Fold produces deceptive 98.4% accuracy due to autocorrelation leakage",
    description: "When Lap N is in the test set but Lap N-1 and Lap N+1 are in the train set, tyre wear and track temperature values leak through temporal autocorrelation.",
    expectedOutcome: "INV_ZERO_TEMPORAL_LEAKAGE fails. Train/test overlap produces falsely high test score.",
    invariantToTest: "INV_ZERO_TEMPORAL_LEAKAGE",
  },
  {
    id: "hyp-lookahead-feature-catastrophe",
    trackId: "aiml-model-leakage",
    title: "Look-ahead transponder flag creates 99.8% training score that collapses in production",
    description: "Including a pit entry transponder feature directly correlates with the target variable, making the model learn a trivial identity mapping that fails on live feeds.",
    expectedOutcome: "INV_GENERALIZATION_GAP fails. Brier score deteriorates when evaluated on causal test stream.",
    invariantToTest: "INV_GENERALIZATION_GAP",
  },
];

export const MODEL_LEAKAGE_REVIEW: TechnicalReviewSection = {
  problemContext:
    "Predicting the optimal pit stop window for RaceMind AI requires machine learning models operating on live telemetry. Time-series telemetry possesses heavy autocorrelation; applying standard Scikit-learn random train/test splits inadvertently leaks future state into training, leading to models that appear flawless in testing but fail catastrophically in race conditions.",
  architecturalDecisions: [
    "Temporal block cross-validation with expanding window (TimeSeriesSplit) enforcing t_train_max < t_test_min.",
    "Automated feature lineage DAG auditing timestamps to guarantee zero look-ahead delta (t_feature <= t_decision).",
    "Probability calibration via isotonic regression on held-out temporal validation folds.",
  ],
  coreAssumptions: [
    "Race strategies exhibit non-stationary drift due to changing track grip and ambient temperature.",
    "Tyre degradation polynomial curves change coefficients across pit stints.",
    "Target variable is binary pit decision indicator within a 3-lap window.",
  ],
  testCoverageCommands: [
    "pytest backend/tests/test_leakage_audit.py -v",
    "npm test -- tests/push-to-prove-leakage.test.ts",
  ],
  tradeoffsAndCompromises: [
    {
      decision: "Strict Temporal Holdout over Random CV",
      upside: "Yields honest, battle-tested generalization metrics that match trackside performance.",
      compromise: "Reported test accuracy appears lower (84% vs 98%), requiring stakeholder education on ML methodology.",
    },
    {
      decision: "Feature Lineage Timestamp Assertion",
      upside: "CI pipeline immediately fails if any feature transformation uses forward look-ahead windows.",
      compromise: "Requires maintaining explicit timestamp metadata on every column in feature store.",
    },
  ],
  honestBoundaries: [
    "Does not predict sudden physical failures (e.g. punctures, mechanical engine blowout) which are stochastic.",
    "Safety Car deployments introduce non-deterministic game-theoretic actions requiring Monte Carlo overrides.",
  ],
  sourceCodePermalink:
    "https://github.com/T-Bone47/RaceMind-AI/blob/850d3c97e4fdf4aa37112efdde2e1eb7bfbd992d/backend/strategy/pit_window.py",
};

/**
 * Runs deterministic AI/ML model evaluation simulation.
 */
export function runModelLeakageSimulation(
  params: Record<string, any>,
  hypothesisId?: string
): DefenseExecutionResult {
  const strategy = String(params.splitStrategy ?? "temporal-session-split");
  const lookahead = String(params.includeLookaheadPitFlag ?? "no-clean");
  const lambda = Number(params.l2Regularization ?? 0.01);
  const threshold = Number(params.decisionThreshold ?? 0.5);

  const logs: string[] = [];
  logs.push(`Evaluating AI/ML Model Pipeline: Split Strategy="${strategy}", Lookahead="${lookahead}".`);
  logs.push(`Hyperparameters: L2 weight decay λ=${lambda}, Classification threshold θ=${threshold}.`);

  const hasTemporalLeakage = strategy === "random-kfold";
  const hasFeatureLeakage = lookahead === "yes-leaked";

  let trainAccuracy = 0;
  let testAccuracy = 0;
  let brierScore = 0;
  let f1Score = 0;

  if (hasFeatureLeakage) {
    // Catastrophic leakage: trivial target copy
    trainAccuracy = 0.998;
    testAccuracy = hasTemporalLeakage ? 0.995 : 0.624; // If temporal test, model fails completely!
    brierScore = hasTemporalLeakage ? 0.012 : 0.285;
    f1Score = hasTemporalLeakage ? 0.994 : 0.58;
    logs.push("[Leakage Alert] Look-ahead feature detected: Feature correlation with target r = 0.985!");
    if (!hasTemporalLeakage) {
      logs.push("[Generalization Collapse] Model memorized transponder flag; performance collapsed on unseen future laps.");
    }
  } else if (hasTemporalLeakage) {
    // Autocorrelation leakage between adjacent laps
    trainAccuracy = 0.984;
    testAccuracy = 0.978;
    brierScore = 0.038;
    f1Score = 0.975;
    logs.push("[Leakage Alert] Random K-Fold shuffled consecutive laps into opposite folds.");
    logs.push("[Warning] Laps (N-1) and (N+1) in train leaked track grip and tyre thermal state for Lap N in test.");
  } else if (strategy === "driver-holdout") {
    // Generalizing to unseen driver styles
    trainAccuracy = 0.865 - lambda * 0.02;
    testAccuracy = 0.812 - (threshold !== 0.5 ? Math.abs(threshold - 0.5) * 0.15 : 0);
    brierScore = 0.118;
    f1Score = 0.805;
    logs.push("[Clean Holdout] Evaluated across 2 held-out drivers with distinct throttle-application styles.");
  } else {
    // Strict temporal session split (Laps 1-40 train, 41-58 test)
    trainAccuracy = 0.874 - lambda * 0.02;
    testAccuracy = 0.842 - (threshold !== 0.5 ? Math.abs(threshold - 0.5) * 0.12 : 0);
    brierScore = 0.095;
    f1Score = 0.838;
    logs.push("[Strict Temporal Split] Laps 1-40 used for training. Zero future information leaked.");
    logs.push(`[Out-of-Sample Test] Laps 41-58 evaluated chronologically with expanding test window.`);
  }

  // Format values
  trainAccuracy = Math.round(trainAccuracy * 1000) / 1000;
  testAccuracy = Math.round(testAccuracy * 1000) / 1000;
  brierScore = Math.round(brierScore * 1000) / 1000;
  f1Score = Math.round(f1Score * 1000) / 1000;

  const generalizationGap = Math.abs(trainAccuracy - testAccuracy);

  // Invariant 1: Zero Temporal Leakage
  const invariantTemporal: DefenseInvariantCheck = {
    id: "INV_ZERO_TEMPORAL_LEAKAGE",
    name: "Zero Temporal Feature/Fold Overlap",
    conditionDescription: "Train fold maximum timestamp must be strictly less than test fold minimum timestamp (t_train_max < t_test_min).",
    passed: !hasTemporalLeakage && !hasFeatureLeakage,
    actualValue: hasTemporalLeakage ? "Temporal overlap detected" : hasFeatureLeakage ? "Look-ahead transponder flag leaked" : "0 overlap (t_train < t_test)",
    thresholdValue: "Strictly disjoint time horizon",
    severity: "CRITICAL",
    explanation: !hasTemporalLeakage && !hasFeatureLeakage
      ? "Temporal isolation verified: training sets precede testing horizons strictly chronologically."
      : hasTemporalLeakage
      ? "Random K-Fold violated time-series ordering: test fold contains laps between training laps."
      : "Feature pipeline contained forward-looking transponder signal prior to pit event.",
  };

  // Invariant 2: Calibration Bound
  const maxBrier = 0.15;
  const calibrationPassed = brierScore <= maxBrier;
  const invariantCalibration: DefenseInvariantCheck = {
    id: "INV_CALIBRATION_BOUND",
    name: "Probability Calibration Bound (Brier Score)",
    conditionDescription: `Brier score must remain <= ${maxBrier.toFixed(2)} to ensure predicted probabilities are reliable for race engineers.`,
    passed: calibrationPassed,
    actualValue: `${brierScore.toFixed(3)}`,
    thresholdValue: `<= ${maxBrier.toFixed(2)}`,
    severity: "WARNING",
    explanation: calibrationPassed
      ? `Model probabilities are well-calibrated (Brier score: ${brierScore.toFixed(3)}).`
      : `Model exhibits severe overconfidence / miscalibration (Brier score: ${brierScore.toFixed(3)}).`,
  };

  // Invariant 3: Generalization Gap
  const maxGap = 0.10;
  const gapPassed = generalizationGap <= maxGap;
  const invariantGap: DefenseInvariantCheck = {
    id: "INV_GENERALIZATION_GAP",
    name: "Bounded Generalization Overfit Gap",
    conditionDescription: `Difference between train accuracy and test accuracy must remain <= ${(maxGap * 100).toFixed(0)}%.`,
    passed: gapPassed,
    actualValue: `${(generalizationGap * 100).toFixed(1)}%`,
    thresholdValue: `<= ${(maxGap * 100).toFixed(0)}%`,
    severity: "CRITICAL",
    explanation: gapPassed
      ? `Generalization gap is healthy (${(generalizationGap * 100).toFixed(1)}%).`
      : `Severe overfitting detected: training accuracy exceeds test by ${(generalizationGap * 100).toFixed(1)}%.`,
  };

  const invariants = [invariantTemporal, invariantCalibration, invariantGap];
  const overallPassed = invariants.every((inv) => inv.passed);

  const runId = `run-ml-${Date.now().toString(36)}`;

  // Reliability curve (predicted probability vs observed empirical frequency)
  const chartSeries = [
    { x: "0.1", y: hasFeatureLeakage ? 0.05 : 0.09, baselineY: 0.1 },
    { x: "0.3", y: hasFeatureLeakage ? 0.12 : 0.28, baselineY: 0.3 },
    { x: "0.5", y: hasFeatureLeakage ? 0.22 : 0.49, baselineY: 0.5 },
    { x: "0.7", y: hasFeatureLeakage ? 0.45 : 0.68, baselineY: 0.7 },
    { x: "0.9", y: hasFeatureLeakage ? 0.88 : 0.91, baselineY: 0.9 },
  ];

  return {
    runId,
    trackId: "aiml-model-leakage",
    parameters: params,
    hypothesisId,
    timestamp: new Date().toISOString(),
    durationMs: 45.2,
    passed: overallPassed,
    metrics: [
      { key: "testAccuracy", label: "Out-of-Sample Test Accuracy", value: Math.round(testAccuracy * 1000) / 10, unit: "%", format: "0.0%" },
      { key: "trainAccuracy", label: "Training Set Accuracy", value: Math.round(trainAccuracy * 1000) / 10, unit: "%", format: "0.0%" },
      { key: "brierScore", label: "Brier Calibration Error", value: brierScore, unit: "loss", format: "0.000" },
      { key: "f1Score", label: "Pit Window F1 Score", value: f1Score, unit: "score", format: "0.00" },
      { key: "generalizationGap", label: "Train/Test Overfit Gap", value: Math.round(generalizationGap * 1000) / 10, unit: "%", format: "0.0%" },
    ],
    invariants,
    traceSpanCount: 7,
    logs,
    technicalSummary: `Train Accuracy: ${(trainAccuracy * 100).toFixed(1)}% | Out-of-Sample Test: ${(testAccuracy * 100).toFixed(1)}%. Overfit Gap: ${(generalizationGap * 100).toFixed(1)}%. Brier score: ${brierScore.toFixed(3)}.`,
    artifactCharts: [
      {
        id: "calibration-reliability-curve",
        label: "Calibration Reliability Curve (Predicted vs Observed)",
        series: chartSeries,
      },
    ],
  };
}
