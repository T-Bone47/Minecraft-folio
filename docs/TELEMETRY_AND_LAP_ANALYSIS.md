# Telemetry and lap analysis

[TELEMETRY_SCHEMA.md](TELEMETRY_SCHEMA.md) is the schema-v2 contract; [VEHICLE_STATE_AND_TELEMETRY.md](VEHICLE_STATE_AND_TELEMETRY.md) defines authoritative state and consumers.

Four ordered quarter-circle gates validate one lap. At 10 Hz, stored samples feed speed/reference comparison, four measured sectors, brake/throttle/steering traces, JSON export and a scrub-capable replay. There are no external racing measurements in the playable lap. Timing resolution is the 1/60-second simulation step, regardless of displayed decimal precision.
