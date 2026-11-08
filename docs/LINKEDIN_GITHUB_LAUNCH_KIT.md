# GitHub and LinkedIn launch kit

Status: draft, not posted. The local candidate is not advertised as live. Replace a live-URL placeholder only after an approved deployment has passed hosted smoke checks.

## LinkedIn draft for the current candidate

I've been building ASISH: The Engineering Frontier — a playable voxel engineering campus.

Visitors can drive an original Formula-style car and inspect its simulated lap telemetry, fit small models and compare held-out results, or diagnose and repair event-pipeline faults. Optional routes help recruiters, developers, AI/ML engineers and motorsport engineers find the details relevant to them. Projects and contact information also have direct pages without gameplay.

The work I wanted to make visible is the engineering underneath: a fixed-step vehicle model, shared cockpit state, proper dataset splits and baselines, recoverable event faults, explicit evidence labels and reproducible tests.

The release candidate is going through final hosted and device verification. I'm an Integrated M.Tech CSE student at VIT-AP, interested in AI/ML, backend systems, simulation and motorsport software. I'd welcome technical feedback and conversations about internship, graduate engineering and collaboration opportunities.

Source: https://github.com/T-Bone47/Minecraft-folio

Do not imply the public repository contains the local candidate until a reviewed update has actually been pushed.

## Post-launch edit (only after approval)

Change the opening to: “ASISH: The Engineering Frontier is now available at [APPROVED LIVE URL].” Remove the release-candidate sentence and include the tested browser/device scope. Do not add a universal FPS guarantee, external project accuracy score or professional racing claim.

## Short technical explanation

A Next.js/React application uses a client-only React Three Fiber world with shared facility geometry, context-aware movement and accessible HTML field stations. Pure TypeScript modules implement fixed-step driving, seeded ML evaluation and fault-repair simulation. Separate Zustand stores keep missions, visitors and cameras from mutating each other. Professional pages render independently of WebGL.

## 40-second showcase storyboard

| Time | Capture | Caption / narration |
| --- | --- | --- |
| 0–5 s | Branded entry and campus | “Explore. Experiment. Engineer.” |
| 5–10 s | Walk, switch to animated avatar, enter garage | “One explorable voxel campus.” |
| 10–20 s | Cockpit, actual steering and display; quick cut to debrief | “Drive a simplified simulated lap. Inspect the recorded evidence.” |
| 20–27 s | Dataset split, fit, held-out metrics and baseline | “Evaluate a model, not a prewritten score.” |
| 27–33 s | Duplicate-event incident, correct repair and validation | “Diagnose a fault and validate recovery.” |
| 33–40 s | Source exhibit, recruiter route, resume and contact | “Inspect the methods. Explore the code. Get in touch.” |

Use actual screen recordings. Label simulated/synthetic channels. Do not speed footage in a way that suggests a measured FPS claim. Include captions and avoid rapid flashes. This is a storyboard, not a completed video file.

## Capture assets

- `public/og-image.png`: 1200×630 original geometric social card; render source `scripts/render-social-preview.mjs`.
- `docs/screenshots/cockpit-2-stationary.png`, `cockpit-touch.png`: actual cockpit.
- `frontier-drive-debrief.png`, `frontier-experiment.png`, `frontier-system.png`: actual stations.
- Record the final candidate after feature freeze so copy and visuals match shipped behavior.

## GitHub preparation recommendations (not applied remotely)

Suggested description: “Playable voxel engineering portfolio — driving telemetry, local ML evaluation and event-pipeline recovery.”

Suggested topics: `portfolio`, `nextjs`, `react-three-fiber`, `threejs`, `typescript`, `simulation`, `machine-learning`, `data-engineering`, `voxel`.

Suggested pinned repositories: Minecraft-folio, Live F1 Intelligence and RaceMind-AI, with statuses and provenance reviewed. Use the new social card as repository social preview. Add a website URL only after deployment. Select a code/asset license explicitly; no reuse license is assumed. Review the dirty checkout and create a release commit before pushing. No topics, pinning, visibility, social settings or posts were changed.
