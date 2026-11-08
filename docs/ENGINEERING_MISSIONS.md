# Engineering missions

The maintained framework contract is [MISSION_FRAMEWORK.md](MISSION_FRAMEWORK.md); definitions live in lib/frontier/missions.ts and state/missionStore.ts. Drive requires inspection, a validated lap and debrief review. Experiment requires split inspection, a fitted evaluation and baseline comparison. System requires incident evidence, a meaningful repair and recovered-output validation.

Mission state is separate from rendering, visitors and player state. Progress is session-local; closing stations pauses/resumes work and results remain in the same session. Resume, projects and professional links never require completion. Failure and reset behavior are covered by reducer and simulation tests.
