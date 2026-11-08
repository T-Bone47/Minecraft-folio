# Mission framework

Definitions include ID, title, physical facility, description, ordered objectives/events, prerequisite list, related projects, reset policy, failure explanation and optional discoveries. `transitionMission` is pure and unit tested. States: available, active, paused, completed, failed, reset. Only the next expected event advances an active mission. Paused, completed or out-of-order events cannot advance it. Reset clears progress; start begins a new attempt.

Drive: inspect → validated lap → review. Experiment: inspect → evaluate → compare. System: inspect → successful repair → validate. Optional discoveries are explanatory metadata, not fabricated rewards. Progress currently lasts for the browser session; no personal data or telemetry is sent to a backend. Persistent progress is optional and not enabled.
