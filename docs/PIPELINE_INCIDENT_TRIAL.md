# TRIAL 3 — SYSTEMS RELIABILITY ENGINEERING
## "THE BROKEN TELEMETRY PIPELINE"
### Out-of-Order Packets, Replay Duplicates & Stream Stabilization

---

## 1. Operational Overview

- **Division**: Systems Reliability Engineering (`systems_reliability`)
- **Facility**: Telemetry Control Tower & Ingestion Rack (`[12, 0, -14]`)
- **Lead NPC**: Viktor Cole (Systems Reliability Lead)
- **Data Provenance**: `FAULT-INJECTED TEST DATA`
- **Anomaly**: Ingestion throughput is normal (60 Hz, 42.4 Kbps), but downstream spatial solvers and pit wall monitors throw 48 NaN exceptions and stall mid-lap.

---

## 2. Ingestion Buffer Trace Audit (Stage 3)

| Sequence ID | Timestamp ($t$) | Distance ($s$) | Status | Operational Trace Diagnosis |
|---|---|---|---|---|
| `seq: 1041` | 14,200 ms | 242.1 m | OK | Baseline monotonic delivery. |
| `seq: 1042` | 14,216 ms | 242.8 m | OK | Monotonic sequence increment. |
| **`seq: 1044`** | 14,249 ms | 244.2 m | **OUT_OF_ORDER** | Arrived prematurely before seq 1043. |
| **`seq: 1043`** | 14,233 ms | 243.5 m | **OUT_OF_ORDER** | Timestamp inversion ($t_{k} < t_{k-1}$); distance steps backward. |
| **`seq: 1042`** | 14,216 ms | 242.8 m | **DUPLICATE** | Cellular UDP retry re-delivered identical sequence ID. |
| `seq: 1045` | 14,266 ms | 244.9 m | OK | Resumed sequence. |
| **`seq: 1045`** | 14,266 ms | 244.9 m | **DUPLICATE** | Redundant delivery causes division by zero ($\Delta s = 0$) in solver. |

### Mathematical Root Cause
Downstream piecewise linear spatial interpolation (`lib/digitalTwin/analysis.ts`) requires strictly increasing monotonic distance coordinates ($s_k > s_{k-1}$). Timestamp inversions and duplicate distance samples break binary search indices and cause zero division.

---

## 3. Engineering Resolution & Verification

- **Optimal Action**: Deploy a **200ms Bounded Sliding Window Reorder Buffer** paired with an **LRU Sequence Deduplication Filter**.
- **Resulting Metric**: 100% of duplicates filtered; monotonic sequence completely restored with 0 exceptions and $<15\text{ms}$ deterministic latency.
- **Trade-Off**: Incurs a minor 20–50ms buffer latency on live broadcast and 4 MB ring buffer memory allocation.

---

## 4. Code References

- Telemetry pipeline fault injection & repair harness: `lib/frontier/pipeline.ts`
- Authoritative telemetry event schema: `lib/digitalTwin/telemetrySchema.ts`

