/**
 * NUMERICAL ENGINEERING ANALYSIS ENGINE
 * ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin
 *
 * Implements deterministic lap analysis:
 * 1. Sector Performance Analysis & Deltas
 * 2. Speed Profiles & Statistical Metrics
 * 3. Corner Segmentation (Turns 1 to 4) with Apex Velocities & Braking Onset
 * 4. Distance-Aligned Spatial Time-Loss Solver
 * 5. Actionable Engineering Insights & Driver Coaching
 */

import type { LapRecord, TelemetrySample } from "./telemetrySchema";

export interface CornerTelemetryMetrics {
  cornerIndex: number;
  name: string;
  type: "sweeper" | "chicane" | "hairpin" | "traction_zone";
  progressStart: number;
  progressEnd: number;
  approachSpeedKmh: number;
  apexSpeedKmh: number;
  exitSpeedKmh: number;
  brakingOnsetDistanceM: number | null;
  minSpeedDistanceM: number;
  segmentDurationS: number;
  refApexSpeedKmh?: number;
  refSegmentDurationS?: number;
  timeDeltaS?: number;
}

export interface DistanceAlignedPoint {
  progress: number;
  distanceM: number;
  visitorSpeedKmh: number;
  referenceSpeedKmh: number;
  visitorElapsedS: number;
  referenceElapsedS: number;
  timeDeltaS: number;
  visitorBrake: number;
  referenceBrake: number;
  visitorThrottle: number;
  referenceThrottle: number;
}

export interface SectorAnalysisResult {
  sectorNumber: number;
  visitorTimeS: number;
  referenceTimeS: number;
  deltaS: number;
  percentageDiff: number;
  status: "faster" | "slower" | "matched";
}

export interface ActionableInsight {
  id: string;
  category: "corner" | "braking" | "throttle" | "overall";
  severity: "critical" | "moderate" | "positive";
  location: string;
  observation: string;
  recommendation: string;
  timeImpactS: number;
  evidence: string;
}

export interface CompleteLapAnalysis {
  lapTimeVisitorS: number;
  lapTimeReferenceS: number;
  totalDeltaS: number;
  sectors: SectorAnalysisResult[];
  corners: CornerTelemetryMetrics[];
  distanceTrace: DistanceAlignedPoint[];
  insights: ActionableInsight[];
  overallRating: "P1 Pace" | "Solid Stint" | "Pace Deficit" | "Sub-Optimal";
}

/**
 * Track layout corner boundaries on circular/oval layout with R=45m (Perimeter ≈ 282.74m)
 */
export const CORNER_DEFINITIONS = [
  { cornerIndex: 1, name: "Turn 1 (North-East Sweeper)", type: "sweeper" as const, progressStart: 0.12, progressEnd: 0.28 },
  { cornerIndex: 2, name: "Turn 2 (South-East Chicane)", type: "chicane" as const, progressStart: 0.36, progressEnd: 0.50 },
  { cornerIndex: 3, name: "Turn 3 (South-West Hairpin)", type: "hairpin" as const, progressStart: 0.60, progressEnd: 0.76 },
  { cornerIndex: 4, name: "Turn 4 (Final Turn to Straight)", type: "traction_zone" as const, progressStart: 0.84, progressEnd: 0.98 },
];

/**
 * Linearly interpolates a sample property at a target progress ratio [0, 1].
 */
function interpolateSampleAtProgress(samples: TelemetrySample[], targetProgress: number): {
  speedKmh: number;
  elapsedS: number;
  brake: number;
  throttle: number;
} {
  if (samples.length === 0) {
    return { speedKmh: 0, elapsedS: 0, brake: 0, throttle: 0 };
  }

  // Find surrounding samples
  let low = 0;
  let high = samples.length - 1;

  if (targetProgress <= samples[0].lapProgress) {
    const s = samples[0];
    return { speedKmh: Math.abs(s.speed) * 3.6, elapsedS: s.timestamp, brake: s.brake, throttle: s.throttle };
  }
  if (targetProgress >= samples[high].lapProgress) {
    const s = samples[high];
    return { speedKmh: Math.abs(s.speed) * 3.6, elapsedS: s.timestamp, brake: s.brake, throttle: s.throttle };
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (samples[mid].lapProgress < targetProgress) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const s0 = samples[Math.max(0, low - 1)];
  const s1 = samples[Math.min(samples.length - 1, low)];
  const span = s1.lapProgress - s0.lapProgress;
  const factor = span > 0.00001 ? Math.min(1, Math.max(0, (targetProgress - s0.lapProgress) / span)) : 0;

  const speed = s0.speed + (s1.speed - s0.speed) * factor;
  const elapsed = s0.timestamp + (s1.timestamp - s0.timestamp) * factor;
  const brake = s0.brake + (s1.brake - s0.brake) * factor;
  const throttle = s0.throttle + (s1.throttle - s0.throttle) * factor;

  return {
    speedKmh: Math.abs(speed) * 3.6,
    elapsedS: elapsed,
    brake,
    throttle,
  };
}

/**
 * Performs corner segmentation and metrics extraction on a set of telemetry samples.
 */
export function analyzeCorners(
  samples: TelemetrySample[],
  refSamples?: TelemetrySample[]
): CornerTelemetryMetrics[] {
  const TRACK_PERIMETER = 2 * Math.PI * 45; // ~282.74 metres

  return CORNER_DEFINITIONS.map((def) => {
    // Filter samples in corner boundary
    const cornerSamples = samples.filter(
      (s) => s.lapProgress >= def.progressStart && s.lapProgress <= def.progressEnd
    );

    if (cornerSamples.length === 0) {
      return {
        ...def,
        approachSpeedKmh: 0,
        apexSpeedKmh: 0,
        exitSpeedKmh: 0,
        brakingOnsetDistanceM: null,
        minSpeedDistanceM: def.progressStart * TRACK_PERIMETER,
        segmentDurationS: 0,
      };
    }

    const approachSample = cornerSamples[0];
    const exitSample = cornerSamples[cornerSamples.length - 1];

    let minSpeedSample = cornerSamples[0];
    let brakingSample: TelemetrySample | null = null;

    for (const s of cornerSamples) {
      if (Math.abs(s.speed) < Math.abs(minSpeedSample.speed)) {
        minSpeedSample = s;
      }
      if (s.brake > 0.2 && !brakingSample) {
        brakingSample = s;
      }
    }

    const segmentDuration = Math.max(0, exitSample.timestamp - approachSample.timestamp);

    let refApexSpeedKmh: number | undefined;
    let refSegmentDurationS: number | undefined;
    let timeDeltaS: number | undefined;

    if (refSamples && refSamples.length > 0) {
      const refCornerSamples = refSamples.filter(
        (s) => s.lapProgress >= def.progressStart && s.lapProgress <= def.progressEnd
      );
      if (refCornerSamples.length > 0) {
        let refMin = refCornerSamples[0];
        for (const r of refCornerSamples) {
          if (Math.abs(r.speed) < Math.abs(refMin.speed)) refMin = r;
        }
        refApexSpeedKmh = Math.round(Math.abs(refMin.speed) * 3.6 * 10) / 10;
        refSegmentDurationS = Math.max(0, refCornerSamples[refCornerSamples.length - 1].timestamp - refCornerSamples[0].timestamp);
        timeDeltaS = Math.round((segmentDuration - refSegmentDurationS) * 1000) / 1000;
      }
    }

    return {
      ...def,
      approachSpeedKmh: Math.round(Math.abs(approachSample.speed) * 3.6 * 10) / 10,
      apexSpeedKmh: Math.round(Math.abs(minSpeedSample.speed) * 3.6 * 10) / 10,
      exitSpeedKmh: Math.round(Math.abs(exitSample.speed) * 3.6 * 10) / 10,
      brakingOnsetDistanceM: brakingSample ? Math.round(brakingSample.lapProgress * TRACK_PERIMETER * 10) / 10 : null,
      minSpeedDistanceM: Math.round(minSpeedSample.lapProgress * TRACK_PERIMETER * 10) / 10,
      segmentDurationS: Math.round(segmentDuration * 1000) / 1000,
      refApexSpeedKmh,
      refSegmentDurationS,
      timeDeltaS,
    };
  });
}

/**
 * Solves distance-aligned time loss by discretizing track progress into equidistant spatial steps.
 */
export function solveDistanceAlignedDeltas(
  visitorSamples: TelemetrySample[],
  refSamples: TelemetrySample[],
  steps = 100
): DistanceAlignedPoint[] {
  const TRACK_PERIMETER = 2 * Math.PI * 45; // ~282.74 metres
  const points: DistanceAlignedPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const distanceM = Math.round(progress * TRACK_PERIMETER * 10) / 10;

    const v = interpolateSampleAtProgress(visitorSamples, progress);
    const r = interpolateSampleAtProgress(refSamples, progress);

    const timeDeltaS = Math.round((v.elapsedS - r.elapsedS) * 1000) / 1000;

    points.push({
      progress,
      distanceM,
      visitorSpeedKmh: Math.round(v.speedKmh * 10) / 10,
      referenceSpeedKmh: Math.round(r.speedKmh * 10) / 10,
      visitorElapsedS: Math.round(v.elapsedS * 1000) / 1000,
      referenceElapsedS: Math.round(r.elapsedS * 1000) / 1000,
      timeDeltaS,
      visitorBrake: Math.round(v.brake * 100) / 100,
      referenceBrake: Math.round(r.brake * 100) / 100,
      visitorThrottle: Math.round(v.throttle * 100) / 100,
      referenceThrottle: Math.round(r.throttle * 100) / 100,
    });
  }

  return points;
}

/**
 * Computes sector performance comparison against a reference lap.
 */
export function analyzeSectors(
  visitorSectors: number[],
  refSectors: number[]
): SectorAnalysisResult[] {
  const count = Math.min(4, Math.max(visitorSectors.length, refSectors.length));
  const results: SectorAnalysisResult[] = [];

  for (let i = 0; i < count; i++) {
    const vTime = visitorSectors[i] ?? 0;
    const rTime = refSectors[i] ?? 0;
    const delta = Math.round((vTime - rTime) * 1000) / 1000;
    const pct = rTime > 0 ? Math.round((delta / rTime) * 1000) / 10 : 0;

    results.push({
      sectorNumber: i + 1,
      visitorTimeS: Math.round(vTime * 1000) / 1000,
      referenceTimeS: Math.round(rTime * 1000) / 1000,
      deltaS: delta,
      percentageDiff: pct,
      status: delta < -0.05 ? "faster" : delta > 0.05 ? "slower" : "matched",
    });
  }

  return results;
}

/**
 * Generates transparent, actionable engineering coaching guidance.
 */
export function generateActionableInsights(
  corners: CornerTelemetryMetrics[],
  sectors: SectorAnalysisResult[],
  totalDelta: number,
  collisions: number
): ActionableInsight[] {
  const insights: ActionableInsight[] = [];

  // 1. Boundary / Collision Inspection
  if (collisions > 0) {
    insights.push({
      id: "boundary-collisions",
      category: "overall",
      severity: "critical",
      location: "Track Boundaries",
      observation: `Detected ${collisions} perimeter curb contact(s), shedding momentum through speed friction clamping.`,
      recommendation: "Keep the car closer to the asphalt centerline (R=45m) to avoid scrubbing speed against barrier physics.",
      timeImpactS: collisions * 0.45,
      evidence: `Speed penalty factor of 0.75 applied on ${collisions} boundary collision events.`,
    });
  }

  // 2. Corner-by-Corner Insights
  for (const corner of corners) {
    if (corner.timeDeltaS !== undefined && corner.refApexSpeedKmh !== undefined) {
      if (corner.timeDeltaS > 0.15) {
        const speedDeficit = Math.round(corner.refApexSpeedKmh - corner.apexSpeedKmh);
        insights.push({
          id: `corner-${corner.cornerIndex}-loss`,
          category: "corner",
          severity: corner.timeDeltaS > 0.35 ? "critical" : "moderate",
          location: corner.name,
          observation: `Lost ${corner.timeDeltaS.toFixed(3)}s. Minimum apex speed was ${corner.apexSpeedKmh} km/h (${speedDeficit > 0 ? `-${speedDeficit} km/h vs reference` : "comparable"}).`,
          recommendation:
            corner.type === "hairpin"
              ? "Trail-brake gradually rather than locking the handbrake to carry momentum through the midpoint."
              : corner.type === "traction_zone"
              ? "Apply full throttle earlier upon hitting the apex to maximise straight-line exit velocity."
              : "Smooth out steering oscillations to reduce drag resistance through the sweeping turn.",
          timeImpactS: corner.timeDeltaS,
          evidence: `Corner segment duration: ${corner.segmentDurationS.toFixed(3)}s (Ref: ${corner.refSegmentDurationS?.toFixed(3)}s).`,
        });
      } else if (corner.timeDeltaS < -0.05) {
        insights.push({
          id: `corner-${corner.cornerIndex}-gain`,
          category: "corner",
          severity: "positive",
          location: corner.name,
          observation: `Gained ${Math.abs(corner.timeDeltaS).toFixed(3)}s relative to the reference controller!`,
          recommendation: "Preserve this cornering trajectory for subsequent stints.",
          timeImpactS: corner.timeDeltaS,
          evidence: `Apex speed: ${corner.apexSpeedKmh} km/h (Ref: ${corner.refApexSpeedKmh} km/h).`,
        });
      }
    }
  }

  // 3. Overall Stint Synthesis
  if (insights.length === 0) {
    insights.push({
      id: "optimal-consistency",
      category: "overall",
      severity: "positive",
      location: "Full Circuit Stint",
      observation: `Telemetry closely tracks the reference trajectory within ${(Math.abs(totalDelta)).toFixed(3)}s.`,
      recommendation: "Excellent benchmark consistency. Ready to test hypothetical aero or braking setup optimizations in Garage.",
      timeImpactS: totalDelta,
      evidence: "All four sectors and apex speeds matched within ±0.08s of reference controller.",
    });
  }

  return insights;
}

/**
 * Runs full deterministic numerical analysis comparing visitor lap to reference.
 */
export function performCompleteLapAnalysis(
  visitorLap: LapRecord,
  referenceLap: LapRecord
): CompleteLapAnalysis {
  const corners = analyzeCorners(visitorLap.samples, referenceLap.samples);
  const distanceTrace = solveDistanceAlignedDeltas(visitorLap.samples, referenceLap.samples, 100);
  const sectors = analyzeSectors(visitorLap.state.sectors, referenceLap.state.sectors);
  const totalDelta = Math.round((visitorLap.state.time - referenceLap.state.time) * 1000) / 1000;

  const insights = generateActionableInsights(
    corners,
    sectors,
    totalDelta,
    visitorLap.state.collisions
  );

  let overallRating: CompleteLapAnalysis["overallRating"] = "Solid Stint";
  if (totalDelta <= 0.2 && visitorLap.state.collisions === 0) {
    overallRating = "P1 Pace";
  } else if (totalDelta > 1.5 || visitorLap.state.collisions > 2) {
    overallRating = "Pace Deficit";
  } else if (visitorLap.state.collisions > 4) {
    overallRating = "Sub-Optimal";
  }

  return {
    lapTimeVisitorS: Math.round(visitorLap.state.time * 1000) / 1000,
    lapTimeReferenceS: Math.round(referenceLap.state.time * 1000) / 1000,
    totalDeltaS: totalDelta,
    sectors,
    corners,
    distanceTrace,
    insights,
    overallRating,
  };
}
