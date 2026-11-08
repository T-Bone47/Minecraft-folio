# Engineering Frontier architecture

The existing Next.js app and R3F canvas remain. Physical facilities and proximity interactions are the primary navigation. Existing static project routes remain accessible without WebGL or mission completion.

Pure modules in lib/frontier own deterministic simulation and mission transitions. Zustand stores own session state; React stations present results; R3F renders the vehicle and campus. A shared input boundary prevents blocked UI from advancing gameplay. Telemetry is sampled from simulation state, not inferred from animations. Synthetic demonstrations are identified separately from project evidence.
