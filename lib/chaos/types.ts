export type ChaosAttackVector =
  | "burst-flood"
  | "network-jitter"
  | "cpu-throttle"
  | "memory-pressure";

export interface ChaosMetrics {
  eventsPerSecond: number;
  p99LatencyMs: number;
  p50LatencyMs: number;
  dropRatePct: number;
  ringBufferUsagePct: number;
  heapAllocatedMb: number;
  droppedFramesCount: number;
  processedFramesCount: number;
  recoveryStatus: "NORMAL" | "ADAPTIVE_DEGRADED" | "CRITICAL_BURST" | "RECOVERED";
  invariants: {
    monotonicTime: boolean;
    boundedMemory: boolean;
    zeroNanKinematics: boolean;
    deadReckoningContinuity: boolean;
  };
}

export interface ChaosScenario {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  params: {
    eventRate: number; // 100 to 10000
    latencyMs: number; // 0 to 800
    packetDropPct: number; // 0 to 30
    cpuDelayMs: number; // 0 to 25
  };
  expectedDefense: string;
  invariantValidated: string;
}
