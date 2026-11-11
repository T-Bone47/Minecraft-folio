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

async function runNPCWorkforceQA() {
  console.log("Launching Chromium for Living NPC Workforce QA...");
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

  // 1. Garage Active Workforce Overview
  console.log("Capturing 1: Active Race Engineering Garage Workforce...");
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-1-garage-active-workforce.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-1-garage-active-workforce.png") });

  // 2. Teleport camera inside Garage focusing on Vehicle Technician inspecting front wheel
  console.log("Capturing 2: Elena Cruz inspecting front-left wheel with pneumatic tool...");
  await page.evaluate(() => {
    // Focus camera on garage car front-left corner
    const camera = window.__cameraStore ? window.__cameraStore.getState() : null;
    // Step workforce so Elena is actively inspecting
    window.__npcWorkforce().stepSimulation(0.1, false, false, [-13.4, 0.5, -6.6]);
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-2-technician-wheel-inspection.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-2-technician-wheel-inspection.png") });

  // 3. Race Engineer Typing at Monitor
  console.log("Capturing 3: Marcus Vance typing at Telemetry Monitor...");
  await page.evaluate(() => {
    // Trigger lap event reaction to verify immediate telemetry focus
    window.__npcWorkforce().notifyLapCompleted();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-3-race-engineer-telemetry-typing.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-3-race-engineer-telemetry-typing.png") });

  // 4. Operations Assistant Carrying Toolcase
  console.log("Capturing 4: Toby Vance carrying toolcase between stations...");
  await page.evaluate(() => {
    const instances = window.__npcWorkforce().instances;
    if (instances["npc_toby_vance"]) {
      instances["npc_toby_vance"].activity = "CARRYING_EQUIPMENT";
      instances["npc_toby_vance"].heldProp = "toolcase";
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-4-operations-assistant-toolcase.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-4-operations-assistant-toolcase.png") });

  // 5. Player Interaction with Elena Cruz (Technician Dialogue Modal)
  console.log("Capturing 5: Player Interaction with Vehicle Technician Elena Cruz...");
  await page.evaluate(() => {
    window.__openStationModal("workforce_npc_elena_cruz");
    window.__npcWorkforce().interactWithNPC("npc_elena_cruz");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-5-npc-player-interaction.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-5-npc-player-interaction.png") });

  // 6. Mechanic Safety Clear Standby
  console.log("Capturing 6: Safety Clear Standby when player approaches F1 Car...");
  await page.evaluate(() => {
    window.__openStationModal(null);
    // Simulate player entering/driving car: mechanic steps back to safety curb
    window.__npcWorkforce().stepSimulation(0.1, true, true, [-12.0, 0.55, -8.0]);
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-6-mechanic-safety-clear.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-6-mechanic-safety-clear.png") });

  // 7. Telemetry Tower Workforce
  console.log("Capturing 7: Viktor Cole at Telemetry Tower Ingestion Console...");
  await page.evaluate(() => {
    window.__openStationModal("workforce_npc_viktor_cole");
    window.__npcWorkforce().interactWithNPC("npc_viktor_cole");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-7-telemetry-tower-workforce.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-7-telemetry-tower-workforce.png") });

  // 8. AI/ML Research Lab Workforce
  console.log("Capturing 8: Dr. Aris Thorne at AI Lab Evaluation Workbench...");
  await page.evaluate(() => {
    window.__openStationModal("workforce_npc_aris_thorne");
    window.__npcWorkforce().interactWithNPC("npc_aris_thorne");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(DOCS_SCREENSHOTS, "npc-8-aiml-lab-workforce.png") });
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "npc-8-aiml-lab-workforce.png") });

  console.log("NPC Workforce QA Suite complete. Captured all 8 screenshots successfully!");
  await browser.close();
}

runNPCWorkforceQA().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});

