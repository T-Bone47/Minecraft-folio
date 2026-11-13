import { launchBrowser, qaBaseURL } from "./qa-browser.mjs";
import fs from "node:fs";
import assert from "node:assert/strict";

const targetUrl = process.env.QA_URL || qaBaseURL;
console.log(`\n============================================================`);
console.log(`  STARTING E2E AUDIT & FRONTEND VERIFICATION`);
console.log(`  Target Origin: ${targetUrl}`);
console.log(`============================================================\n`);

fs.mkdirSync("docs/screenshots/e2e", { recursive: true });

const ROUTES_TO_AUDIT = [
  { path: "/", name: "home" },
  { path: "/garage", name: "garage" },
  { path: "/cli", name: "cli" },
  { path: "/strategy", name: "strategy" },
  { path: "/telemetry", name: "telemetry" },
  { path: "/chaos", name: "chaos" },
  { path: "/dossier", name: "dossier" },
  { path: "/silicon", name: "silicon" },
  { path: "/forge", name: "forge" },
  { path: "/proofcast", name: "proofcast" },
  { path: "/observatory", name: "observatory" },
  { path: "/roleforge", name: "roleforge" },
  { path: "/work", name: "work" },
  { path: "/multiverse", name: "multiverse" },
  { path: "/experience", name: "experience" },
  { path: "/recruiter", name: "recruiter" },
  { path: "/contact", name: "contact" },
  { path: "/about", name: "about" },
];

const VIEWPORTS = [
  { width: 1440, height: 900, device: "desktop" },
  { width: 390, height: 844, device: "mobile" },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const auditReport = {
  timestamp: new Date().toISOString(),
  targetUrl,
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  routesAudited: [],
  globalIssues: [],
};

const browser = await launchBrowser({ args: ["--no-sandbox"] });

try {
  for (const route of ROUTES_TO_AUDIT) {
    for (const vp of VIEWPORTS) {
      auditReport.totalChecks++;
      const checkId = `${route.path} [${vp.device} ${vp.width}x${vp.height}]`;
      const routeResult = {
        checkId,
        route: route.path,
        viewport: vp.device,
        status: "PASS",
        httpStatus: 0,
        consoleErrors: [],
        pageErrors: [],
        hasOverflow: false,
        cls: 0,
      };

      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.setCacheEnabled(false);

      page.on("pageerror", (err) => {
        routeResult.pageErrors.push(err.message);
      });

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          // Filter known benign non-fatal browser logs if any
          if (!text.includes("favicon") && !text.includes("Download the React DevTools")) {
            routeResult.consoleErrors.push(text);
          }
        }
      });

      try {
        const fullUrl = `${targetUrl}${route.path}`;
        const response = await page.goto(fullUrl, { waitUntil: "networkidle2", timeout: 30000 });
        routeResult.httpStatus = response ? response.status() : 0;

        await wait(600);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientW = window.innerWidth;
          return scrollW > clientW + 2; // Allow 2px tolerance for subpixel scrollbars
        });
        routeResult.hasOverflow = overflow;

        // Route-specific interactive tests on Desktop
        if (vp.device === "desktop") {
          if (route.name === "garage") {
            // Click Monza Vmax Trim preset
            await page.evaluate(() => {
              const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Monza') || b.title?.includes('Monza'));
              if (btn) btn.click();
            });
            await wait(300);
          } else if (route.name === "strategy") {
            // Click second strategy pill
            await page.evaluate(() => {
              const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('2-Stop') || b.textContent?.includes('Soft'));
              if (btn) btn.click();
            });
            await wait(300);
          } else if (route.name === "chaos") {
            // Click a scenario button
            await page.evaluate(() => {
              const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Silverstone') || b.textContent?.includes('Surge'));
              if (btn) btn.click();
            });
            await wait(300);
          } else if (route.name === "dossier") {
            // Click Systems track tab
            await page.evaluate(() => {
              const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.toLowerCase().includes('systems'));
              if (btn) btn.click();
            });
            await wait(300);
          } else if (route.name === "silicon") {
            // Flip a redstone lever
            await page.evaluate(() => {
              const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('ON') || b.textContent?.includes('OFF'));
              if (btn) btn.click();
            });
            await wait(300);
          }

          // Test Quake CLI hotkey toggle (~ / `)
          if (route.name === "home") {
            await page.keyboard.press("`");
            await wait(400);
            const shellOpen = await page.evaluate(() => {
              return !!document.querySelector("input[placeholder*='Type command']");
            });
            if (shellOpen) {
              await page.keyboard.press("Escape");
              await wait(300);
            }
          }
        }

        // Take screenshot
        const screenshotPath = `docs/screenshots/e2e/${route.name}-${vp.device}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: false });

        // Evaluate PASS / FAIL
        if (
          routeResult.httpStatus !== 200 ||
          routeResult.pageErrors.length > 0 ||
          routeResult.hasOverflow
        ) {
          routeResult.status = "FAIL";
          auditReport.failedChecks++;
          console.error(`❌ FAIL: ${checkId} (HTTP ${routeResult.httpStatus}, overflow: ${routeResult.hasOverflow}, errors: ${routeResult.pageErrors.length})`);
        } else {
          auditReport.passedChecks++;
          console.log(`✅ PASS: ${checkId} (HTTP 200, 0 overflow, 0 page errors)`);
        }
      } catch (err) {
        routeResult.status = "FAIL";
        routeResult.pageErrors.push(String(err));
        auditReport.failedChecks++;
        console.error(`❌ EXCEPTION on ${checkId}:`, err.message);
      } finally {
        await page.close();
        auditReport.routesAudited.push(routeResult);
      }
    }
  }
} finally {
  await browser.close();
  fs.writeFileSync("docs/e2e-audit-results.json", JSON.stringify(auditReport, null, 2));

  console.log(`\n============================================================`);
  console.log(`  E2E AUDIT SUMMARY:`);
  console.log(`  Total Checks : ${auditReport.totalChecks}`);
  console.log(`  Passed       : ${auditReport.passedChecks}`);
  console.log(`  Failed       : ${auditReport.failedChecks}`);
  console.log(`============================================================\n`);
}
