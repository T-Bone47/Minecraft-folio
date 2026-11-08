# Cockpit 2.0 implementation

Audit root cause: the previous camera toggle existed (C/V), but its height was hard-coded in world space at 1.8 m and no steering wheel or cockpit display mesh existed. The solid tub, helmet and solid halo slab did not provide an open driver-eye view. The HUD synthesized gear and RPM from speed, independent of a transmission model.

Replaced only interior geometry with an original voxel seat, sidewalls, column, wheel, display, simple mirror surfaces, hands/forearms and open protective frame. This is an artistic halo-inspired frame, not a safety-certified design. Exterior mesh is retained. Hands are children of the wheel so they follow steering without separate animation.

The sole driving camera controller transforms local eye/look points through the vehicle Object3D transform, at driver height behind the wheel. C defaults to toggle; B can be selected and V remains a compatibility alias. FOV 55–85 and seat offset -0.08–0.12 m are configurable. No vibration is added. Chase smoothing respects reduced motion. Camera near plane and FOV restore on exit; no physics initialization depends on camera settings.

A 512×256 CanvasTexture on a real wheel plane refreshes at 10 Hz and is disposed on unmount. Wheel angle is actual smoothed road-wheel steering multiplied by a documented visual ratio of 2.5. Speed, time, sector, throttle and brake read the same simulation ref used by physics. Gear/RPM/shift lights are omitted because no transmission or engine dynamics are modeled. Audio remains procedural sound design.

References consulted:
- https://threejs.org/docs/pages/Object3D.html (local-to-world transforms)
- https://threejs.org/manual/pages/cameras.html (perspective FOV and clipping)
- https://r3f.docs.pmnd.rs/api/hooks (frame lifecycle)
- https://www.formula1.com/en/latest/article/halo-protection-system-to-be-introduced-for-2018.2jhITmhSiwkKwOAWOG0UM6
- https://www.formula1.com/en/latest/article/f1-glossary-f-j.2g6grJVxT6dFCDpSmgoCQX

No team logos or proprietary steering-wheel graphics are used.
