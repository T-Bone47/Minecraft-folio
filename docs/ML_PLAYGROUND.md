# The Experiment

`lib/frontier/ml.ts` generates 180 deterministic synthetic examples with seed 47. Tasks: binary sensor-alert classification, lap-time regression, and daily-demand forecasting. These examples demonstrate methods, not actual project performance or confidential data.

Classification offers fitted logistic regression and a trained depth-one decision tree. Regression and forecasting use L2-regularised linear regression fitted by batch gradient descent, with bounded iterations (10–2,000). Features and continuous targets are standardised using training rows only. Classification/regression use a seeded shuffled 144/36 split. Forecasting trains on days 0–143 and evaluates days 144–179; day index and weekly sine/cosine terms are available at forecast origin.

Metrics: accuracy, precision, recall, F1 and confusion counts; MAE, RMSE and R² for continuous tasks. Majority/mean baselines fit only on training targets. Forecast baseline repeats the last training week at a fixed origin, without reading future test targets. Stump splitting uses training misclassification error and does not inspect test labels. Hyperparameter changes clear results and require renewed inspection. Reopening a station preserves the session experiment; reload starts a fresh session.

Computation occurs only on Run. Measured fit time is explicitly one local run, not a benchmark. Small fixed holdouts, synthetic targets and no cross-validation limit interpretation. No XGBoost, random forest or expensive backend training is claimed. Actual project links are separate from these teaching datasets.
