# Visitor engine architecture and evidence

Journey definitions: `lib/visitor/journeys.ts`. Session-only tour state: `state/visitorStore.ts`. Neither imports mission state. Switching resets the tour, not gameplay. Short routes have three stops; long routes have five or six. Pause freezes progression and hides the waypoint; cancel removes it. Arrival confirmation requires being within six world units of the canonical safe approach. Quick travel reuses the existing camera transition and refuses while driving. No forced camera animation was added.

`ProjectExhibit` derives from canonical `projectEvidence` and `projects`, with Understand, Experience and Deep dive. Experience is an interactive reading of each project's documented pipeline, not a purported live deployment. The actual local Drive/Experiment/System missions remain available. `VisitorCenter` shares the same components between `/visit` and the world field station. Fallback and global navigation link directly to `/visit`.

Voxel guides and displays use existing avatar/sign assets with basic meshes; no lights or animation loops were added. HTML guide equivalents support keyboard users. Waypoints use one static ring and sign. Existing focus-trapped StationDialog blocks gameplay while open.

Architecture evidence inspected 2026-11-07:
- https://github.com/T-Bone47/live-f1-intelligence — README for provider and analysis scope.
- https://github.com/T-Bone47/live-f1-intelligence/blob/main/backend/app/ingest/pipeline.py — actual raw source inspected; normalize, malformed isolation, 200k-entry dedupe LRU, sequence assignment and publishing.
- https://github.com/T-Bone47/live-f1-intelligence/blob/main/backend/app/core/events.py — actual raw source inspected; Envelope fields, sequential awaited subscribers and bounded error retention.
- https://github.com/T-Bone47/IGNICT — public repository is empty. Its exhibit explicitly withholds unverifiable architecture.

Source links follow main and can change. External backend tests were not rerun. No hackathon awards or professional credentials were invented; existing professional history remains owner-supplied. Evidence gallery distinguishes repository-reported metrics from independently reproduced results.

Limits: museum summarizes selected boundaries rather than every API; architecture components are selected in the accessible station reached from physical displays. IGNICT requires source before it can become a real architecture exhibit. Tours are session-local, not persisted. Real devices, screen readers and longer performance sessions require further verification.
