# Engineering demonstration QA

The Drive is driven with real keyboard input through four ordered checkpoints. Steering and display read authoritative fixed-step state; telemetry/replay use recorded samples. Unsupported gear/RPM channels are omitted. Synthesized audio pitch is speed-based and not a real drivetrain measurement. See cockpit-browser-results.json and TELEMETRY_AND_LAP_ANALYSIS.md.

The Experiment fits classification, regression and chronological forecasting models to seeded synthetic fixtures. Held-out evaluation, explicit baselines and the decision-stump path are tested; no claim of production ML performance is made. See frontier-stations-results.json and ML_EXPERIMENT_VALIDATION.md.

The System applies actual transformations for seven faults and validates output invariants; a plausible incorrect repair must fail recovery. Throughput/timing describe the local simulation. See frontier-stations-results.json and PIPELINE_SIMULATION.md.

Shared mission ordering/pause/reset, lap direction, collision-step safety, data splits, metrics and repair invariants have behavioral unit coverage. Canonical project exhibits distinguish repository-reported evidence, owner narratives, synthetic data and simulated gameplay. Unavailable sources remain labelled. [Registry](PROJECT_EVIDENCE_REGISTRY.md).
