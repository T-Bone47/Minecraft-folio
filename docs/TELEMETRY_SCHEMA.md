# Telemetry schema v2

JSON export: `schemaVersion`, `units`, `source`, `state`, `samples`.

Each sample contains `timestamp` (simulation s), `x`, `z` (m), `yaw` (rad), signed `speed` (m/s), `acceleration` (finite difference m/s²), commanded `throttle` (-1 reverse to +1 forward), `brake` (0–1), applied `steering` (rad), `lapProgress` (0–1), `sector` (1–4), and `lapTime` (s). Sample cadence: every sixth 60 Hz simulation tick plus the final tick.

Pipeline: input → fixed-step vehicle integration → boundary/gate validation → bounded sample buffer → lap record → SVG / sector table / JSON. There are no fabricated gear, tyre temperature, DRS or fuel channels. Gear/RPM/shift-light readings are omitted because the vehicle has no transmission or engine-dynamics model. The same recorded steering and yaw drive the top-down replay.

