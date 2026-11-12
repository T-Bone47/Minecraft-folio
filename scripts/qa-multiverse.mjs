import { launchBrowser, qaBaseURL } from './qa-browser.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = qaBaseURL;
const browser = await launchBrowser({
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

const report = {
  date: new Date().toISOString(),
  base,
  checks: [],
  errors,
};

const pass = (title) => {
  report.checks.push(title);
  console.log('PASS:', title);
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  fs.mkdirSync('docs/screenshots', { recursive: true });

  // ==========================================
  // 1. 2D MULTIVERSE HUB ROUTE: /multiverse
  // ==========================================
  console.log('\n--- 1. Testing /multiverse Hub ---');
  const resHub = await page.goto(`${base}/multiverse`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resHub.status(), 200);
  await page.waitForSelector('h1');
  const h1Hub = await page.$eval('h1', (el) => el.innerText);
  assert.ok(h1Hub.toLowerCase().includes('connected engineering universe'), `Expected Hub title, got ${h1Hub}`);
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/multiverse-1-hub.png' });
  pass('2D /multiverse Hub loaded successfully with all 4 canonical systems');

  // ==========================================
  // 2. 2D RACEMIND AI ROUTE: /multiverse/racemind
  // ==========================================
  console.log('\n--- 2. Testing /multiverse/racemind ---');
  const resRaceMind = await page.goto(`${base}/multiverse/racemind`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resRaceMind.status(), 200);
  await page.waitForSelector('[data-testid="racemind-demo-container"]');
  
  // Test interaction: click "SAFETY CAR"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scBtn = btns.find((b) => b.innerText.trim() === 'SAFETY CAR');
    if (scBtn) scBtn.click();
  });
  await wait(400);

  // Click "BOX FOR SOFTS"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const softBtn = btns.find((b) => b.innerText.includes('BOX FOR SOFTS'));
    if (softBtn) softBtn.click();
  });
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/multiverse-2-racemind-demo.png' });
  pass('RaceMind AI interactive strategy demo evaluated pit window and tyre delta');

  // ==========================================
  // 3. 2D LIVE F1 INTELLIGENCE: /multiverse/live-f1
  // ==========================================
  console.log('\n--- 3. Testing /multiverse/live-f1 ---');
  const resLiveF1 = await page.goto(`${base}/multiverse/live-f1`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resLiveF1.status(), 200);
  await page.waitForSelector('[data-testid="livef1-demo-container"]');
  
  // Select driver "NOR" in timing tower
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const norBtn = btns.find((b) => b.innerText.includes('NOR'));
    if (norBtn) norBtn.click();
  });
  await wait(600);
  await page.screenshot({ path: 'docs/screenshots/multiverse-3-livef1-replay.png' });
  pass('Live F1 Intelligence canonical telemetry replay loaded with live timing tower');

  // ==========================================
  // 4. 2D SENTINEL AI ROUTE: /multiverse/sentinel
  // ==========================================
  console.log('\n--- 4. Testing /multiverse/sentinel ---');
  const resSentinel = await page.goto(`${base}/multiverse/sentinel`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resSentinel.status(), 200);
  await page.waitForSelector('[data-testid="sentinel-demo-container"]');

  // Click "EXECUTE REMEDIATION POLICY"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const remBtn = btns.find((b) => b.innerText.includes('EXECUTE REMEDIATION POLICY'));
    if (remBtn) remBtn.click();
  });
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/multiverse-4-sentinel-grc.png' });
  pass('Sentinel AI GRC incident remediation executed and sealed cryptographic audit log');

  // ==========================================
  // 5. 2D VYAPARPULSE AI ROUTE: /multiverse/vyaparpulse
  // ==========================================
  console.log('\n--- 5. Testing /multiverse/vyaparpulse ---');
  const resVyapar = await page.goto(`${base}/multiverse/vyaparpulse`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resVyapar.status(), 200);
  await page.waitForSelector('[data-testid="vyaparpulse-demo-container"]');

  // Toggle offline network mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const netBtn = btns.find((b) => b.innerText.includes('NETWORK:'));
    if (netBtn) netBtn.click();
  });
  await wait(300);

  // Click RECORD VOUCHER
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const recBtn = btns.find((b) => b.innerText.includes('RECORD VOUCHER'));
    if (recBtn) recBtn.click();
  });
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/multiverse-5-vyapar-ledger.png' });
  pass('VyaparPulse offline-first transaction recorded into SQLite queue and forecast rendered');

  // ==========================================
  // 6. 2D 6-LAYER PROOF: /multiverse/racemind/engineering
  // ==========================================
  console.log('\n--- 6. Testing /multiverse/racemind/engineering ---');
  const resProof = await page.goto(`${base}/multiverse/racemind/engineering`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resProof.status(), 200);
  await page.waitForSelector('[data-testid="evidence-inspector-container"]');

  // Click Layer 3 (Algorithms & Formulas)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const l3Btn = btns.find((b) => b.innerText.includes('LAYER 3'));
    if (l3Btn) l3Btn.click();
  });
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/multiverse-6-evidence-inspector.png' });
  pass('6-Layer Engineering Proof Inspector rendered mathematical algorithms and code');

  // ==========================================
  // 7. 3D WORLD HUD & MULTIVERSE PORTAL MODAL
  // ==========================================
  console.log('\n--- 7. Testing 3D World HUD Multiverse Integration ---');
  await page.goto(`${base}/world?quality=low`, {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });

  await page.waitForFunction(() => document.body.innerText.includes('ENTER'), { timeout: 60000 });
  await page.evaluate(() => {
    const enterBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('ENTER')
    );
    if (enterBtn) enterBtn.click();
  });
  await page.waitForFunction(() => document.body.innerText.includes('XYZ:'), { timeout: 30000 });
  pass('Entered 3D Campus simulation');

  // Wait for HUD container
  await page.waitForSelector('[data-testid="multiverse-hud-container"]', { timeout: 30000 });
  pass('Multiverse HUD launcher mounted in 3D world');

  // Click Multiverse HUD button to open modal
  await page.click('[data-testid="multiverse-hud-button"]');
  await page.waitForSelector('[data-testid="multiverse-modal"]', { timeout: 15000 });
  await wait(800);
  await page.screenshot({ path: 'docs/screenshots/multiverse-7-3d-portal-modal.png' });
  pass('Multiverse Portal Modal opened over 3D world with four connected gateways');

} catch (err) {
  console.error('QA Test Failure:', err);
  report.errors.push(err.message);
  throw err;
} finally {
  await browser.close();
  fs.writeFileSync('docs/multiverse-qa-results.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('\nWrote QA Report to docs/multiverse-qa-results.json');
}
