# ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
## DEFENSE TRACK 1: SYSTEMS RELIABILITY & INVARIANT RECOVERY

**Associated Project:** Live F1 Intelligence & UDP Telemetry Bridge  
**Source Commit:** `975836a2df0e50f9d8be25005ad010168241f985`  
**Primary Source File:** `backend/app/ingest/pipeline.py`  
**Campus Facility:** Telemetry Systems Operations Center (`telemetry`)

---

### 1. Challenge Context
In 20-car live Formula 1 broadcasts, over 2,650 packets/sec stream across distributed ingestion channels. Transient network partitions, UDP packet loss, and multithreaded aggregator races inject:
1. Duplicate frames (same timestamp and car ID arriving via both REST fallback and WebSocket).
2. Out-of-order sequencing (jitter in CDN routing causing packet $N+2$ to arrive before $N+1$).
3. Corrupted packet payloads failing cyclic redundancy checks (CRC).

---

### 2. Architectural Recovery Mechanisms
- **Sliding Bitmask Deduplication**: Retains recent sequence hashes in circular memory ($O(1)$ lookup, $<10$KB RAM).
- **Min-Heap Reordering Queue**: Bounded priority queue buffering up to $N$ packets to re-sequence jumps without head-of-line blocking.
- **Watermark Barrier Timeout**: Discards stalled sequences after $\Delta t_{\text{barrier}}$ to guarantee strict downstream latency SLAs ($P_{99} \le 25$ms).

---

### 3. Empirical Verification Summary
- **Baseline (Sliding Window, 10% faults)**: Sustains 2,450 events/sec, $P_{99} = 12.8$ms, 0 duplicates, 0 sequence reversals.
- **Strict Barrier (25% faults)**: $P_{99}$ spikes to $34.2$ms due to head-of-line blocking, triggering `INV_BOUNDED_LATENCY` failure.
- **Drop Late**: Minimizes latency ($P_{99} = 4.8$ms), but introduces sequence data loss under packet jitter.

