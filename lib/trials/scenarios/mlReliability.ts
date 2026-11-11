/**
 * TRIAL TWO — AI / MACHINE LEARNING ENGINEERING
 * "THE MODEL THAT LOOKED PERFECT"
 *
 * Location: AI / ML Research Lab (canonical coords: [0, 0, 24])
 * Lead NPC: Dr. Aris Thorne (AI Research Engineer)
 */

import type { TrialScenario } from "../types";

export const mlReliabilityTrial: TrialScenario = {
  id: "ml_reliability_02",
  division: "ml_reliability",
  title: "The Model That Looked Perfect",
  subtitle: "Data Leakage Detection & Chronological Split Verification",
  facilityId: "aiml",
  locationName: "AI / ML Research & Tyre Modelling Lab",
  estimatedMinutes: 4,
  provenanceLabel: "DETERMINISTIC EVALUATION FIXTURE",

  npc: {
    id: "npc_aris_thorne",
    name: "Dr. Aris Thorne",
    role: "AI Research Lead",
    division: "ml_reliability",
    facility: "aiml",
    avatarVariant: "aiml",
    coordinates: [2, 0, 21],
    dialogue: {
      greeting: "Welcome to the AI Research Lab. I'm Dr. Aris Thorne, Lead Machine Learning Engineer.",
      briefing:
        "Our telemetry-driven tyre degradation model was logged with an astonishing R² of 0.998 and RMSE of 0.0042 in offline validation. But the second we streamed live laps into it, prediction error spiked to 0.318. The telemetry and physics engineers are questioning our model credibility. I need you to uncover what fooled our offline benchmark.",
      hint: "Examine the feature correlation matrix and how the cross-validation splits were partitioned. If a model looks too perfect, look for information leaking from the future.",
      duringInvestigation:
        "Inspect the relationship between `post_event_temp_delta` and our target variable. Notice how the training and test splits were prepared.",
      onWrongHypothesis:
        "Adding more parameters or layers won't solve this. In fact, that would just memorize the invalid signal even faster. Look at the feature correlation matrix.",
      onCorrectDiagnosis:
        "Exactly. `post_event_temp_delta` was calculated using telemetry points recorded after the tyre wear event, and random train/test shuffling cross-pollinated time slices. Classic target leakage.",
      onOptimalAction:
        "Brilliant engineering. Pruning the leaking feature and enforcing strict temporal block cross-validation brought honest offline metrics to R² = 0.892, matching online production performance within 1.4%.",
      onSuboptimalAction:
        "Applying random k-fold cross-validation will only conceal the temporal leakage further. We must separate time series by independent chronological stints.",
      completion:
        "Trial resolved. You prevented a contaminated ML model from corrupting race strategy and instituted disciplined temporal validation protocols. Superb analysis.",
    },
  },

  briefing:
    "An offline tyre grip regression model reported an implausible R² = 0.998 on test data, yet failed instantly in live streaming evaluation (RMSE = 0.318). Investigate the feature set, correlation matrix, and data partitioning methodology to eliminate leakage.",

  initialInvestigationPrompt:
    "Review the feature correlation table, feature importance ranking, and validation split methodology to locate target leakage.",

  investigationData: {
    offlineR2: 0.998,
    offlineRMSE: 0.0042,
    onlineStreamingRMSE: 0.318,
    targetVariable: "grip_loss_coefficient",
    datasetSamples: 1440,
    features: [
      {
        name: "speed_kmh",
        correlationWithTarget: -0.42,
        importanceWeight: 0.14,
        description: "Instantaneous vehicle speed at telemetry sample.",
      },
      {
        name: "lateral_accel_g",
        correlationWithTarget: 0.61,
        importanceWeight: 0.22,
        description: "Lateral cornering acceleration.",
      },
      {
        name: "tyre_temp_c",
        correlationWithTarget: 0.58,
        importanceWeight: 0.19,
        description: "Surface temperature at start of corner entry.",
      },
      {
        name: "post_event_temp_delta",
        correlationWithTarget: 0.994,
        importanceWeight: 0.41,
        description: "Temperature change measured 1.2s AFTER corner exit (Target Proxy Leak).",
      },
      {
        name: "ambient_track_temp_c",
        correlationWithTarget: 0.28,
        importanceWeight: 0.04,
        description: "Ambient tarmac temperature.",
      },
    ],
    splittingMethod: "Random Uniform Shuffle (80/20 train/test)",
    flawIdentified:
      "Random shuffling distributed contiguous time-series telemetry samples from the same cornering event into both training and validation sets, allowing the network to interpolate rather than predict.",
  },

  hypotheses: [
    {
      id: "hypo_target_leakage_and_shuffle",
      label: "Target Proxy Leakage & Non-Temporal Shuffle Contamination",
      description:
        "Feature `post_event_temp_delta` uses future sensor observations recorded after the target occurs (r=0.994), and random shuffling allows time-series samples to leak between folds.",
      isCorrect: true,
      feedback:
        "Spot on. `post_event_temp_delta` contains future information impossible to know at inference time, and random shuffle violated temporal isolation.",
      technicalReasoning:
        "Time-series sensor data exhibits high autocorrelation. Random shuffling splits identical events across train and test sets, while the future delta feature acts as an almost 1:1 cheat proxy for target grip loss.",
    },
    {
      id: "hypo_insufficient_network_depth",
      label: "Under-Parameterized Model / Insufficient Network Depth",
      description:
        "The neural network has too few hidden units to represent non-linear tyre thermodynamics, causing it to generalize poorly in production.",
      isCorrect: false,
      feedback:
        "Incorrect. The model achieved 0.998 R² on offline data; it was not under-fitting. The issue is validation distortion, not capacity deficit.",
      technicalReasoning:
        "If a model has high training and test accuracy but collapses on novel real-world data, increasing model capacity will amplify overfitting, not solve it.",
    },
    {
      id: "hypo_outlier_noise",
      label: "Sensor Outlier Noise in Live Streaming Pipeline",
      description:
        "The real-world telemetry stream contains noisy accelerometer spikes that were filtered out of the clean offline dataset.",
      isCorrect: false,
      feedback:
        "Incorrect. Filtering noise does not explain a near-perfect 0.994 correlation between a feature and the prediction target.",
      technicalReasoning:
        "Even with sensor noise, a properly validated model does not jump from 0.0042 to 0.318 RMSE unless the offline evaluation was fundamentally invalid.",
    },
  ],

  actions: [
    {
      id: "act_prune_leak_and_temporal_split",
      label: "Prune Leaking Feature & Implement Chronological Stint-Based Cross-Validation",
      description:
        "Drop `post_event_temp_delta`, enforce strict chronological split (Stints 1-3 for training, Stint 4 for holdout validation), and recalculate honest performance.",
      isOptimal: true,
      consequences:
        "Honest offline holdout achieves R² = 0.892 and RMSE = 0.038. Live streaming deployment confirms matching RMSE = 0.041 with zero production degradation.",
      simulatedDeltaS: 0,
      tradeOffs: [
        "Nominal offline score drops from 0.998 to 0.892, but reflects true generalization capability.",
        "Requires data pipeline restructuring to strictly preserve temporal sequence bounds.",
      ],
    },
    {
      id: "act_increase_regularization_l2",
      label: "Increase L2 Regularization & Double Dropout Rate",
      description:
        "Keep all existing features and random shuffle, but apply aggressive Ridge regularization to suppress large weights.",
      isOptimal: false,
      consequences:
        "Regularization slightly reduces offline R² to 0.972, but because `post_event_temp_delta` remains present, online streaming RMSE remains catastrophic at 0.285.",
      simulatedDeltaS: 0,
      tradeOffs: [
        "Masks the architectural problem without fixing data leakage.",
        "Fails to deliver reliable predictions in race control.",
      ],
    },
    {
      id: "act_normalize_batch_inputs",
      label: "Apply Online Z-Score Batch Normalization to Input Stream",
      description:
        "Standardize incoming live stream batches to match training distribution statistics.",
      isOptimal: false,
      consequences:
        "Input distribution normalization cannot supply future sensor readings that do not exist yet. Live RMSE stays elevated at 0.304.",
      simulatedDeltaS: 0,
      tradeOffs: [
        "Adds online latency overhead.",
        "Leaves target proxy dependency unresolved.",
      ],
    },
  ],

  skillsDemonstrated: [
    "Machine Learning Data Leakage Detection & Target Proxy Identification",
    "Time-Series Cross-Validation & Chronological Stint Partitioning",
    "Correlation vs Causation in Sensor Feature Engineering",
    "Offline vs Online Model Drift & Real-World Generalization Verification",
  ],

  codeReferences: [
    {
      title: "Frontier ML Feature Engineering & Dataset Splitter",
      file: "lib/frontier/ml.ts",
      description: "Chronological train/validation splitting with temporal block bounds.",
      url: "/projects/racemind-ai",
    },
    {
      title: "Race Strategy AI Tyre Degradation Pipeline",
      file: "lib/frontier/physics.ts",
      description: "Thermodynamic tyre grip coefficient calculation models.",
      url: "/projects/racemind-ai",
    },
  ],
};

