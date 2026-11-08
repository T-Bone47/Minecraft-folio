# ML experiment validation

[ML_PLAYGROUND.md](ML_PLAYGROUND.md) contains dataset/model/evaluation details. Implementation: lib/frontier/ml.ts. Unit evidence: tests/frontier.test.ts; browser evidence: frontier-stations-results.json.

Classification uses a fitted logistic model or actual decision stump; regression and forecasting use trained regularized linear models. Synthetic fixtures are seeded. Forecasting uses a chronological holdout, and normalization is fitted on training rows only. Results are calculated locally on request and compared with explicit baselines. The UI disables gradient-only parameters for the stump.

This demonstrates evaluation methods; it does not validate IGNICT, SAKSHAM or another external project's production accuracy. No unsupported XGBoost result is presented.
