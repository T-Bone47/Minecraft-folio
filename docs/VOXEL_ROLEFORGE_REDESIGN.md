# FRONTIER VOXEL DESIGN SYSTEM: ROLEFORGE TRANSFORMATION
**Standard:** The Engineering Skill Forge & Defense Arena  
**Routes:** `/roleforge`, `/roleforge/defense`, `/roleforge/review`, `/roleforge/passport`  
**State Machine:** Zustand `useRoleForgeStore`, `useDefenseStore`  

---

## 1. Design Vision & Transformation Objectives

Frontier RoleForge compiles tailored engineering missions and evidence briefs from job requirements or curated engineering role presets. RoleForge 2.0 adds the **Engineering Defense Arena**, enabling visitors to challenge and stress-test engineering claims.

### Prior State vs Voxel Transformation
- **Prior State**: Resembled a generic dark-mode SaaS dashboard with rounded cards (`rounded-xl`), rounded pill buttons, and flat grey tab switchers.
- **Transformed Voxel State**:
  - The main route (`/roleforge`) is transformed into **The Engineering Skill Forge**: an authentic industrial workstation where visitors forge and inspect verified evidence.
  - Background is enveloped in `technical-grid-bg` with deepslate sub-surface.
  - Console subheader features illuminated status lamps (`VoxelStatusLamp state="cyan"`), mechanical tabs (`VoxelTabs`), and beveled time-budget selectors.
  - Role preset cards are crafted as tactile `VoxelCard material="dark-iron"` containers with physical hover depth.
  - The Defense Arena (`/roleforge/defense`) is transformed into an industrial test bench with redstone indicators, parameter injection sliders, and invariant counters.

---

## 2. Interactive Systems

1. **Job-to-World Compiler**:
   - Parses pasted job descriptions against 103 canonical engineering skills and 10 engineering domains.
   - Computes deterministic time budgets (1m, 3m, 5m, 10m) using an Exact Branch-and-Bound greedy marginal solver.
2. **Engineering Defense Arena**:
   - 3 canonical stress-test tracks:
     - Track 1: Systems Reliability (UDP packet drop, stream desync, CRC errors).
     - Track 2: Motorsport Lap Delta (spatial discretization sensitivity, apex clipping).
     - Track 3: AI/ML Leakage (temporal lookahead, synthetic baseline overfitting).
3. **Engineering Evidence Passport**:
   - Hard-edged pixel-bordered document displaying cryptographic Git commit SHAs, reproducible test verification commands, and formal rubric scores.
