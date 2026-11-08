# Cockpit and vehicle simulation

The authoritative design is split by responsibility: [COCKPIT_IMPLEMENTATION.md](COCKPIT_IMPLEMENTATION.md) describes original geometry, driver-eye transforms, FOV/seat controls and wheel display; [VEHICLE_SIMULATION.md](VEHICLE_SIMULATION.md) documents the fixed-step teaching model and boundaries.

Actual simulated steering drives the wheel; speed/timing/controls drive the texture. Gear/RPM/shift lights are omitted. Recorded replay is top-down. See [COCKPIT_QA.md](COCKPIT_QA.md) for executed browser checks and limits.
