# LIVING NPC WORKFORCE — REAL-TIME WORLD REACTIVITY
## ASISH: THE ENGINEERING FRONTIER

---

## 1. Event Integration Architecture

The workforce subscribes directly to authoritative simulation state in `useDigitalTwinStore` and `useNPCWorkforceStore`:

### 1.1 Digital Twin Lap Completion (`ingestCompletedLap`)
- **Trigger**: When a visitor completes a flying lap in the single-seater Frontier-01 or loads a reference stint.
- **Worker Reaction**:
  - Marcus Vance (Race Performance Lead) immediately interrupts ambient locomotion, transitions to `TYPING` at `ws_garage_telemetry`, faces the strategy monitors, and updates dialogue: *"Outstanding lap! Telemetry pipeline ingested your data. Check the monitor for sector splits."*
  - Dialogue contextual option unlocks: `[REVIEW FLYING LAP DELTA]`.
  - Mechanic Elena Cruz briefly pauses inspection to acknowledge track telemetry update.

### 1.2 Vehicle Entry & Live Track Testing (`isDriving`)
- **Trigger**: Visitor enters the cockpit or approaches within $4.2\text{m}$ of the car.
- **Worker Reaction**:
  - Elena Cruz (Vehicle Technician) immediately yields the active inspection zone and moves to the safe curb (`ws_garage_safety_curb`).
  - Enters `SAFETY_CLEAR` posture with track-cleared arm signal.
  - Guarantees zero obstruction, collision traps, or camera clipping during vehicle boarding.

### 1.3 Telemetry Pipeline Incidents
- **Trigger**: Simulated wire fault or Stage 3 buffer disruption.
- **Worker Reaction**:
  - Viktor Cole in the Telemetry Tower enters `INCIDENT_RESPONSE`, stepping to the Stage 3 server rack (`ws_telemetry_server_rack`) to inspect ring buffers.

