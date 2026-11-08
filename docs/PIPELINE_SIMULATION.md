# The System

`lib/frontier/pipeline.ts` generates a finite 60-event source fixture, with one of seven faults: malformed JSON, duplicates, out-of-order timestamps, delayed delivery, queue pressure, provider schema change or missing field. The ten visible stages are source, adapter, parser, normalisation, validation, processing, storage, API, WebSocket delivery and visualisation. The last four are in-memory projections, not real network or durable storage services.

Responses are functional transformations: quarantine invalid records, deduplicate stable IDs, reorder a finite batch, extend the arrival deadline, raise processing capacity or map provider v2 velocity to canonical speed. Repairs replay the same fixture. An inappropriate repair leaves output invariants failing; recovery is not assigned merely because a response name matches a scenario.

Recovery requires exactly 60 unique valid events, ordered timestamps, zero queue backlog and zero undelivered events. Rejections and observed validation failures remain visible after successful quarantine. Counters derive from the processed fixture. Service time, arrival deadline, latency and events/second use a simulated clock and are labelled simulated. No distributed exactly-once, durable persistence or production throughput guarantee is made.

The UI exposes payloads, stage counts and execution evidence before repair. Applying a successful repair advances the mission; the visitor must explicitly validate output to complete it. Reset replays the original incident. Closing and reopening preserves session state.
