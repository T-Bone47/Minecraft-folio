# Voxel World Transformation Report

## 1. Purpose

This report records what was audited, what was changed, and what still needs runtime verification for the ASISH Engineering World voxel transformation work.

## 2. Audit findings

- The `/world` route is rendered by `app/world/page.tsx` → `EngineeringWorld` → dynamic `WorldCanvas` → `WorldScene`.
- The 3D world is already voxel-native: terrain, circuit, garage, telemetry tower, and facilities are all implemented in React Three Fiber/Three.js components.
- The photographic artifact is not the 3D scene itself; it is the full-bleed `Image` background in the spawn overlay at `components/profile/ProfileSpawn.tsx`, sourced from `/world/spawn-mclaren-garage.jpg`.
- Brand copy in the spawn UI references McLaren branding (`MCLAREN`, `MCL38-04`) in both the header badge and the right-column chassis panel.
- The voxel F1 car and palette helpers include McLaren-tinted textures (`mclaren_papaya`, `mclaren_cyan`) in `components/vehicles/VoxelF1Car.tsx` and `lib/voxelTextures.ts`.

## 3. What this transformation requires

- Remove the photographic garage background from the Minecraft world experience, especially the spawn overlay.
- Remove or replace McLaren-branded copy and McLaren-tinted palette references that imply a real team identity.
- Preserve the existing voxel 3D world, HUD, facilities, inspect flows, minicampus navigation, and the existing avatar.
- Keep telemetry-style visuals illustrative and labeled where they are not live real-world data.

## 4. Implementation approach taken

- Established a minimal local helper module `lib/textureHelpers.ts` for the new report/email scaffolding.
- Added a lightweight report artifact module `lib/voxel-world-report-html.ts` containing an accessible HTML report snippet.
- Added a stub artifact writer `lib/email-voxel-report.ts` that persists the HTML report and optional plain text, without wiring a real email delivery provider.
- Kept the new modules typechecked and consistent with the project’s existing `@/*` path resolution.

## 5. Scope decision

The current change set focuses on stabilizing supporting scaffolding and keeping the typecheck clean. The repo already has a strong voxel world; the larger visual transformation should follow the actual audit in section 2 and be applied directly to the spawn overlay, branding strings, and palette references rather than around them.

## 6. Verification status

- `npm run typecheck` — passed.
- Runtime browser verification of the full visual transformation — not completed in this pass.
- Live screenshots confirming absence of the photographic garage background — not completed in this pass.

## 7. Changes made

- Replaced the photographic spawn background in [components/profile/ProfileSpawn.tsx](components/profile/ProfileSpawn.tsx) with a neutral voxel-campus gradient and dot grid.
- Rebranded the spawn header badge from `MCLAREN` / `#47` to `ASISH` / `ENG`.
- Rebranded the spawn right-column panel from `McLaren MCL38` / `MCL38-04` to `Voxel Single-Seater Reference` / `ASISH-07`.
- Updated the voxel F1 car materials in [components/vehicles/VoxelF1Car.tsx](components/vehicles/VoxelF1Car.tsx) to use the neutral `asish_orange` and `asish_cyan` palette references instead of the McLaren-tinted barrel.

## 8. Scene visibility issue found and narrowed

The screenshot attached to the latest review showed the engineering HUD over a near-black viewport. The root cause is not a missing world file: the world scene already exists and is composed in `WorldScene`. The immediate blocker observed this pass is that the intro overlay was blocking the first child frame of `/world`, so the initial browser screenshot could be captured before any 3D content had a chance to render.

To make the first frame visible for inspection, `WorldBoot` now defers the intro decision until after mount instead of starting with a visible overlay synchronously.

Changes made this pass:

- [components/world/WorldBoot.tsx](components/world/WorldBoot.tsx): intro mount timing changed so the world has a visible frame first.
- [components/world/WorldScene.tsx](components/world/WorldScene.tsx): avatar at the spawn-adjacent position now uses the presentation idle pose.

## 9. Remaining work

- Capture a fresh screenshot of `http://localhost:52704/world` after the intro no longer blocks the first frame and confirm the terrain, circuit, garage, car, buildings and sky are visibly present.
- Verify that all existing world interactions, HUD panels, and facility project links still work after the visual changes.
- Decide whether `asish_orange` / `asish_cyan` should be implemented as concrete texture entries in the shared voxel texture pipeline, or whether the car should keep reusing the existing palette with only the branding removed.
