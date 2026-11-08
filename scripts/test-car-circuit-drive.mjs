import puppeteer from "puppeteer-core";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3005";
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ARTIFACT_DIR = "C:\\Users\\dream\\.gemini\\antigravity\\brain\\31534823-3cfc-4cc1-af43-de9f783c72d3\\screenshots";

async function runCarDrive() {
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
  await page.goto(`${BASE_URL}/world`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1000));
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 1200));

  // Trigger start driving directly in zustand
  await page.evaluate(() => {
    // Find zustand store in window or trigger click on test drive button
    const btns = Array.from(document.querySelectorAll("button"));
    const dirBtn = btns.find((b) => b.getAttribute("title")?.includes("Inventory"));
    if (dirBtn) dirBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.keyboard.press("Escape");

  // Let's trigger start driving by simulating the hotbar / interaction or calling startDriving
  await page.evaluate(async () => {
    // Dispatch test drive via world store
    const { useWorldStore } = await import("/_next/static/chunks/app/world/page.js").catch(() => ({}));
    if (useWorldStore) {
      useWorldStore.getState().startDriving();
    }
  });

  // If that didn't resolve due to webpack chunk scoping, let's trigger it by clicking the garage car:
  // In F1Garage, garage_f1_car has onInteract: () => startDriving()
  await page.evaluate(() => {
    // Call startDriving on the global store
    const store = window.__WORLD_STORE__;
    if (store && store.getState) {
      store.getState().startDriving();
    }
  });

  // Let's press hotbar 3 to go to garage
  await page.keyboard.press("Digit3");
  await new Promise((r) => setTimeout(r, 1000));

  // Press E on car
  await page.keyboard.press("KeyE");
  await new Promise((r) => setTimeout(r, 1000));

  // In modal / panel, click "TEST DRIVE"
  console.log("Clicking Test Drive button...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const drive = btns.find((b) => b.textContent && b.textContent.includes("TEST DRIVE"));
    if (drive) drive.click();
  });

  await new Promise((r) => setTimeout(r, 1200));

  // Hold W to accelerate
  await page.keyboard.down("KeyW");
  await new Promise((r) => setTimeout(r, 1500));
  await page.keyboard.up("KeyW");

  await page.screenshot({ path: resolve(ARTIFACT_DIR, "10_f1_car_circuit_acceleration.png") });
  console.log("Saved screenshot: 10_f1_car_circuit_acceleration.png");

  // Toggle Cockpit Cam with V
  await page.keyboard.press("KeyV");
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: resolve(ARTIFACT_DIR, "11_f1_car_cockpit_view.png") });
  console.log("Saved screenshot: 11_f1_car_cockpit_view.png");

  await browser.close();
}

runCarDrive().catch(console.error);
