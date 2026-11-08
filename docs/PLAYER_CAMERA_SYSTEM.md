# Player and camera system

Maintained implementation detail: [PLAYER_AND_CAMERA_SYSTEM.md](PLAYER_AND_CAMERA_SYSTEM.md). The existing first/third-person controller retains one on-foot camera owner; the vehicle owns the camera while driving. Driving key handling now preserves Tab and native control activation.

Verification: trusted pointer lock, walking, jump, map pause, safe exit, all six facility entrances and long Explorer route. See [COCKPIT_QA.md](COCKPIT_QA.md) and release-final-results.json. Avatar visuals were inspected; no full human ergonomics study is claimed.
