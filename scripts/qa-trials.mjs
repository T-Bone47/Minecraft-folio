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

async function runTrialsQA() {
  console.log("Launching Chromium for Frontier Engineering Trials QA...");
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
  await new Promise((r) => setTimeout(r, 2000));

  // Dismiss spawn splash
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 1000));

  // 1. Open Operations Terminal in Engineering HQ
  console.log("Opening 1: Operations Terminal Dashboard...");
  await page.evaluate(() => {
    window.__openStationModal("trials_terminal");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-1-terminal-dashboard.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-1-terminal-dashboard.png") });

  // 2. Open Race Performance Trial Investigation
  console.log("Opening 2: Race Performance Trial Workbench ('The Missing Four Tenths')...");
  await page.evaluate(() => {
    window.__trials().startTrial("race_performance_01", "guided");
    window.__trials().advanceToInvestigation();
    window.__trials().examineEvidence("corner_3");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-2-race-investigation-workbench.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-2-race-investigation-workbench.png") });

  // 3. Select Hypothesis, Action, and Submit Evaluation to view Debrief Report
  console.log("Opening 3: Race Performance Engineering Debrief Report...");
  await page.evaluate(() => {
    window.__trials().selectHypothesis("hypo_early_braking_t3");
    window.__trials().selectAction("act_trail_brake_t3");
    window.__trials().submitEvaluation();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-3-race-debrief-report.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-3-race-debrief-report.png") });

  // 4. Open AI/ML Reliability Trial Investigation
  console.log("Opening 4: AI/ML Reliability Workbench ('The Model That Looked Perfect')...");
  await page.evaluate(() => {
    window.__trials().startTrial("ml_reliability_02", "independent");
    window.__trials().advanceToInvestigation();
    window.__trials().examineEvidence("feature_post_event_temp_delta");
    window.__openStationModal("trials_investigation");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-4-aiml-investigation-workbench.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-4-aiml-investigation-workbench.png") });

  // 5. Open Systems Reliability Trial Investigation
  console.log("Opening 5: Systems Reliability Workbench ('The Broken Telemetry Pipeline')...");
  await page.evaluate(() => {
    window.__trials().startTrial("systems_reliability_03", "guided");
    window.__trials().advanceToInvestigation();
    window.__trials().examineEvidence("trace_1044");
    window.__openStationModal("trials_investigation");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-5-systems-investigation-workbench.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-5-systems-investigation-workbench.png") });

  // 6. Converse with Marcus Vance (Race Lead NPC)
  console.log("Opening 6: Marcus Vance NPC Dialogue...");
  await page.evaluate(() => {
    window.__openStationModal("npc_npc_marcus_vance");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-6-npc-marcus-vance.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-6-npc-marcus-vance.png") });

  // 7. Converse with Dr. Aris Thorne (AI Lead NPC)
  console.log("Opening 7: Dr. Aris Thorne NPC Dialogue...");
  await page.evaluate(() => {
    window.__openStationModal("npc_npc_aris_thorne");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-7-npc-aris-thorne.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-7-npc-aris-thorne.png") });

  // 8. Open Recruiter Showcase Step 7 (Watch an Engineering Problem Get Solved)
  console.log("Opening 8: Recruiter Walkthrough Step 7 (Trials Showcase)...");
  await page.evaluate(() => {
    window.__digitalTwin().startRecruiterWalkthrough();
    // Advance to step 6 (index 6 = 7th step)
    for (let i = 0; i < 6; i++) {
      window.__digitalTwin().nextRecruiterStep();
    }
    window.__openStationModal(null);
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "trial-8-recruiter-trials-showcase.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "trial-8-recruiter-trials-showcase.png") });

  console.log("QA Suite complete. Captured all 8 screenshots successfully!");
  await browser.close();
}

runTrialsQA().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});

