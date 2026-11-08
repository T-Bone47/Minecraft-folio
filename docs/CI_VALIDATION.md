# CI and portable browser validation — 8 November 2026

## Workflow

`.github/workflows/release-validation.yml` runs on pushes, pull requests and manual dispatch. It uses Ubuntu 24.04, Node 24, `npm ci`, TypeScript, lint, behavioral tests, a high-severity dependency audit and the production build. Actions are pinned to commit SHAs verified from the official v7 tag refs. Checkout credentials are not persisted; job permissions are contents:read. It performs no push, merge or deployment.

After building, the workflow locates the runner's installed Google Chrome, starts the built Next server on loopback port 3005, and runs cockpit/lap/replay, ML/pipeline, controls/context-loss/touch, five visitor routes, avatar, full campus/keyboard/reduced-motion, audio and professional-route smoke suites. The browser scripts run sequentially and stop on failure. The job stops its owned direct Node server process and uploads current JSON/screenshots/server logs even after a failure. Old generated results and screenshots are cleared only inside the disposable CI checkout before browser QA, so a failed run cannot upload an earlier local pass as current evidence. Logs/artifacts retain for 14 days.

Workflow presence is not proof of a passing hosted run. Record the actual GitHub Actions run URL and result after the release branch is pushed. CI software WebGL verifies functionality, not target-device graphics performance or hosted Vercel behavior.

## Shared browser configuration

All existing `scripts/qa-*.mjs` browser journeys use `scripts/qa-browser.mjs`; behavioral steps and assertions are retained.

| Variable | Purpose | Default |
| --- | --- | --- |
| QA_URL | HTTP(S) site base URL without embedded credentials | http://localhost:3005 |
| QA_BROWSER_PATH | Explicit installed Chrome/Chromium executable | Detect known Windows/macOS/Linux locations |
| PUPPETEER_EXECUTABLE_PATH / CHROME_PATH | Executable-path aliases if QA_BROWSER_PATH is unset | Unset |
| QA_SOFTWARE_GL | Set to 1 for isolated CI software WebGL | Unset on desktop |
| QA_EXPECT_INDEXABLE | Set to 1 only for a configured production-origin build | Default expects noindex and no canonical |
| SITE_ORIGIN | Verified production origin; also expected canonical origin when QA_EXPECT_INDEXABLE=1 | Unset until confirmed |

The helper passes executablePath explicitly because puppeteer-core does not download a browser or consume Puppeteer's regular configuration files. Missing configured binaries fail clearly. CI alone enables SwiftShader flags; desktop performance samples retain the actual selected hardware renderer.

To validate an indexable build, SITE_ORIGIN must be set for the build as well as the smoke process. Setting an expected origin in the test cannot change already-built metadata. Preview/unconfigured builds retain noindex and omit canonical claims.

Example in PowerShell, after starting the production server:

```powershell
$env:QA_URL = 'http://localhost:3005'
$env:QA_BROWSER_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
node scripts/qa-production.mjs
node scripts/qa-controls-release.mjs
```

The same scripts can target an approved hosted preview by changing QA_URL. Deployment protection/authentication and hosted acceptance still need separate verification; no credential bypass is implemented.

## Evidence and limits

Executed locally after npm ci: all QA script syntax checks pass; js-yaml parses the workflow and its trigger/job/permission structure; Node 24.22.2 imports the helper and launches Chrome 158.0.8127.18 successfully. Isolated WebGL2 probes pass using both the Intel UHD / ANGLE D3D11 hardware renderer and the opt-in SwiftShader Vulkan renderer. URL normalization, rejection of non-HTTP URLs, and missing explicit-browser handling also pass. No production server or application build was started by these helper tests. Final application browser outcomes belong to the root release audit. Linux GitHub Actions execution remains NOT TESTED until the branch is pushed and the workflow completes. These checks do not verify real devices, assistive technology or Vercel Preview.

Sources: [Puppeteer configuration](https://pptr.dev/guides/configuration), [Chromium SwiftShader flags](https://github.com/chromium/chromium/blob/main/docs/gpu/swiftshader.md), [Ubuntu 24.04 runner software](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md), [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), [upload-artifact](https://github.com/actions/upload-artifact).

