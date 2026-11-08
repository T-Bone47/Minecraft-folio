export type DatasetId = "classification" | "regression" | "forecast";
export type ModelId = "linear" | "stump";
export interface Row {
    id: number;
    features: number[];
    target: number;
}
export interface Dataset {
    id: DatasetId;
    name: string;
    features: string[];
    target: string;
    description: string;
    rows: Row[];
}
export function makeDataset(id: DatasetId): Dataset {
    let seed = 47;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const rows: Row[] = Array.from({ length: 180 }, (_, i) => { const x = random(), z = random(), noise = (random() - .5) * .3; if (id === "classification")
        return { id: i, features: [x, z], target: x * .8 + z * .6 + noise > .72 ? 1 : 0 }; if (id === "regression")
        return { id: i, features: [x * 100, z * 30], target: 70 + x * 12 + z * 3 + noise * 5 }; return { id: i, features: [i, Math.sin(i * Math.PI * 2 / 7), Math.cos(i * Math.PI * 2 / 7)], target: 100 + i * .7 + 15 * Math.sin(i * Math.PI * 2 / 7) + noise * 20 }; });
    return { id, name: id === "classification" ? "Sensor alert classification" : id === "regression" ? "Synthetic lap-time regression" : "Daily demand forecasting", features: id === "forecast" ? ["day index", "weekly sine", "weekly cosine"] : id === "classification" ? ["vibration (normalised)", "temperature (normalised)"] : ["fuel load (kg)", "tyre age (laps)"], target: id === "classification" ? "alert (0/1)" : id === "regression" ? "lap time (seconds)" : "demand (units)", description: "180 deterministic synthetic rows, seed 47. Educational data; no production or personal records.", rows };
}
export function splitDataset(d: Dataset): {
    train: Row[];
    test: Row[];
} {
    if (d.id === "forecast")
        return { train: d.rows.slice(0, 144), test: d.rows.slice(144) };
    // Deterministic permutation independent of target labels.
    const shuffled = [...d.rows];
    let seed = 81;
    for (let i = shuffled.length - 1; i > 0; i--) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const j = seed % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { train: shuffled.slice(0, 144), test: shuffled.slice(144) };
}
export function classificationMetrics(actual: number[], pred: number[]) {
    let tp = 0, tn = 0, fp = 0, fn = 0;
    actual.forEach((y, i) => { if (y === 1) {
        if (pred[i] === 1)
            tp++;
        else
            fn++;
    }
    else {
        if (pred[i] === 1)
            fp++;
        else
            tn++;
    } });
    const precision = tp / (tp + fp || 1), recall = tp / (tp + fn || 1);
    return { accuracy: (tp + tn) / (actual.length || 1), precision, recall, f1: 2 * precision * recall / (precision + recall || 1), tp, tn, fp, fn };
}
export function regressionMetrics(actual: number[], pred: number[]) {
    const mean = actual.reduce((a, b) => a + b, 0) / actual.length, sse = actual.reduce((sum, y, i) => sum + (y - pred[i]) ** 2, 0), total = actual.reduce((sum, y) => sum + (y - mean) ** 2, 0);
    return { mae: actual.reduce((sum, y, i) => sum + Math.abs(y - pred[i]), 0) / actual.length, rmse: Math.sqrt(sse / actual.length), r2: total === 0 ? (sse === 0 ? 1 : 0) : 1 - sse / total };
}
export interface ExperimentResult {
    dataset: Dataset;
    model: ModelId;
    trainIds: number[];
    testIds: number[];
    actual: number[];
    predicted: number[];
    baseline: number[];
    metrics: Record<string, number>;
    baselineMetrics: Record<string, number>;
    weights: number[];
    fitMs: number;
    baselineName: string;
}
export function runExperiment(id: DatasetId, model: ModelId, iterations = 400, regularisation = .01): ExperimentResult {
    const started = performance.now(), dataset = makeDataset(id), { train, test } = splitDataset(dataset), classification = id === "classification", n = train.length, k = train[0].features.length;
    if (id !== "classification" && model === "stump")
        throw new Error("Decision stump is available only for classification");
    const means = Array.from({ length: k }, (_, j) => train.reduce((sum, r) => sum + r.features[j], 0) / n), scales = means.map((m, j) => Math.sqrt(train.reduce((sum, r) => sum + (r.features[j] - m) ** 2, 0) / n) || 1);
    const transform = (r: Row) => [1, ...r.features.map((v, j) => (v - means[j]) / scales[j])];
    const trainY = train.map(r => r.target), meanY = trainY.reduce((a, b) => a + b, 0) / n, scaleY = classification ? 1 : Math.sqrt(trainY.reduce((sum, v) => sum + (v - meanY) ** 2, 0) / n) || 1;
    const weights = Array(k + 1).fill(0);
    let predict: (r: Row) => number;
    if (model === "stump") {
        let best = { loss: Infinity, j: 0, threshold: 0, left: 0, right: 1 };
        for (let j = 0; j < k; j++)
            for (const row of train) {
                const threshold = row.features[j], left = train.filter(r => r.features[j] <= threshold), right = train.filter(r => r.features[j] > threshold);
                if (!left.length || !right.length)
                    continue;
                const majority = (rs: Row[]) => rs.reduce((a, r) => a + r.target, 0) >= rs.length / 2 ? 1 : 0, l = majority(left), r = majority(right), loss = left.filter(v => v.target !== l).length + right.filter(v => v.target !== r).length;
                if (loss < best.loss)
                    best = { loss, j, threshold, left: l, right: r };
            }
        weights[best.j + 1] = 1;
        predict = r => r.features[best.j] <= best.threshold ? best.left : best.right;
    }
    else {
        const x = train.map(transform), y = train.map(r => classification ? r.target : (r.target - meanY) / scaleY);
        for (let epoch = 0; epoch < Math.max(10, Math.min(2000, iterations)); epoch++) {
            const grad = Array(k + 1).fill(0);
            x.forEach((row, i) => { const score = row.reduce((sum, v, j) => sum + v * weights[j], 0), estimate = classification ? 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, score)))) : score; row.forEach((v, j) => grad[j] += (estimate - y[i]) * v / n); });
            weights.forEach((_, j) => weights[j] -= .15 * (grad[j] + (j ? Math.max(0, regularisation) * weights[j] : 0)));
        }
        predict = r => { const score = transform(r).reduce((sum, v, j) => sum + v * weights[j], 0); return classification ? (score >= 0 ? 1 : 0) : score * scaleY + meanY; };
    }
    const actual = test.map(r => r.target), predicted = test.map(predict), baseline = test.map(r => id === "forecast" ? train[137 + (r.id - 144) % 7].target : classification ? (meanY >= .5 ? 1 : 0) : meanY), metric = classification ? classificationMetrics : regressionMetrics;
    return { dataset, model, trainIds: train.map(r => r.id), testIds: test.map(r => r.id), actual, predicted, baseline, metrics: metric(actual, predicted), baselineMetrics: metric(actual, baseline), weights, fitMs: performance.now() - started, baselineName: id === "forecast" ? "Last training week repeated (fixed-origin seasonal naive)" : classification ? "Training-set majority class" : "Training-set mean" };
}
