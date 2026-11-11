import puppeteer from "puppeteer-core";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3005";
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_SCREENSHOTS = resolve(ROOT_DIR, "docs", "screenshots");
const ARTIFACT_DIR = "C:\\Users\\dream\\.gemini\\antigravity\\brain\\31534823-3cfc-4cc1-af43-de9f783c72d3\\screenshots";

mkdirSync(DOCS_SCREENSHOTS, { recursive: true });
mkdirSync(ARTIFACT_DIR, { recursive: true });

async function runDigitalTwinQA() {
  console.log("Launching Chromium for Living Digital Twin QA...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--window-size=1280,800",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to http://localhost:3005/world...");
  await page.goto(`${BASE_URL}/world`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));

  // Dismiss spawn splash if present
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 1000));

  // 1. Campus Spawn with Mission HUD and DEMO / CODE buttons
  console.log("Capturing 1: Digital Twin Campus & Top Navigation");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-1-campus-overview.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-1-campus-overview.png") });

  // 2. Click DEMO button (Recruiter Fast Track)
  console.log("Triggering Recruiter Fast Track DEMO...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const demoBtn = btns.find((b) => b.innerText.includes("DEMO"));
    if (demoBtn) demoBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  console.log("Capturing 2: Recruiter Walkthrough Modal");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-2-recruiter-walkthrough.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-2-recruiter-walkthrough.png") });

  // Advance step in recruiter walkthrough
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const nextBtn = btns.find((b) => b.innerText.trim() === "NEXT");
    if (nextBtn) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  console.log("Capturing 3: Recruiter Step 2 Telemetry Stream");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-3-recruiter-telemetry-step.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-3-recruiter-telemetry-step.png") });

  // Close walkthrough via close button
  await page.evaluate(() => {
    const closeBtn = document.querySelector("button[title='Exit Walkthrough']");
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 3. Open CODE (Senior Developer Technical Deep Dive)
  console.log("Triggering CODE (Senior Developer Deep Dive)...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const codeBtn = btns.find((b) => b.innerText.includes("CODE"));
    if (codeBtn) codeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  console.log("Capturing 4: Senior Developer Deep Dive Modal");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-4-developer-deep-dive.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-4-developer-deep-dive.png") });

  // Close developer deep dive
  await page.evaluate(() => {
    const closeBtn = document.querySelector("button[title='Close Dialog']");
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 4. Open Telemetry Tower Pipeline Observatory
  console.log("Opening Telemetry Tower Pipeline Observatory...");
  await page.evaluate(() => {
    if (window.__openStationModal) {
      window.__openStationModal("pipeline_observatory");
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  console.log("Capturing 5: Telemetry Pipeline Observatory");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-5-telemetry-pipeline.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-5-telemetry-pipeline.png") });

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 600));

  // 5. Open AI / ML Intelligence Lab
  console.log("Opening AI/ML Intelligence Lab...");
  await page.evaluate(() => {
    if (window.__openStationModal) {
      window.__openStationModal("ml_playground");
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  console.log("Capturing 6: AI/ML Intelligence Lab");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-6-aiml-lab.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-6-aiml-lab.png") });

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 600));

  // 6. Open Drive Debrief & Replay / Decision Centre
  console.log("Opening Drive Debrief & Multi-Channel Replay...");
  await page.evaluate(() => {
    if (window.__digitalTwin) {
      window.__digitalTwin().loadBundledReferenceLap();
    }
    if (window.__openStationModal) {
      window.__openStationModal("drive_debrief");
    }
  });
  await new Promise((r) => setTimeout(r, 1200));

  console.log("Capturing 7: Living Digital Twin Debrief & Multi-Channel Replay");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-7-drive-debrief-replay.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-7-drive-debrief-replay.png") });

  // Scroll down to What-If Decision Centre
  await page.evaluate(() => {
    const dialog = document.querySelector(".frontier-station") || document.querySelector("[role='dialog']");
    if (dialog) dialog.scrollTop = 900;
  });
  await new Promise((r) => setTimeout(r, 800));

  console.log("Capturing 8: Race Engineering What-If Decision Centre");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "dt-8-whatif-decision-centre.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "dt-8-whatif-decision-centre.png") });

  await browser.close();
  console.log("Living Digital Twin QA finished successfully! 8 screenshots captured.");
}

runDigitalTwinQA().catch((err) => {
  console.error("QA script failed:", err);
  process.exit(1);
});
