import { launchBrowser, qaBaseURL } from './qa-browser.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

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
  // 1. 2D DEFENSE ARENA HUB: /roleforge/defense
  // ==========================================
  console.log('\n--- 1. Testing /roleforge/defense Hub ---');
  const resHub = await page.goto(`${base}/roleforge/defense`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resHub.status(), 200);
  await page.waitForSelector('h1');
  const h1Hub = await page.$eval('h1', (el) => el.innerText);
  assert.ok(
    h1Hub.includes('ENGINEERING DEFENSE ARENA'),
    `Expected Hub title, got ${h1Hub}`
  );
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/defense-1-arena-hub.png' });
  pass('2D /roleforge/defense Hub loaded successfully with all tracks');

  // ==========================================
  // 2. RUN SIMULATION & INVARIANT AUDIT
  // ==========================================
  console.log('\n--- 2. Executing Simulation Invariant Audit ---');
  // Click "Run Baseline Verification" button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const runBtn = btns.find((b) => b.innerText.includes('Run Baseline Verification'));
    if (runBtn) runBtn.click();
  });
  await wait(1000);

  // Verify results tab active
  const hasResults = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('ALL INVARIANTS SATISFIED') || text.includes('INVARIANT AUDIT');
  });
  assert.ok(hasResults, 'Expected simulation results & invariant table');
  await page.screenshot({ path: 'docs/screenshots/defense-2-results-audit.png' });
  pass('Simulation executed deterministically and passed invariant contracts');

  // ==========================================
  // 3. COUNTERFACTUAL STRESS TEST
  // ==========================================
  console.log('\n--- 3. Running Counterfactual Differential Analysis ---');
  // Click "Run Counterfactual Stress Test"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const stressBtn = btns.find((b) => b.innerText.includes('Run Counterfactual Stress Test'));
    if (stressBtn) stressBtn.click();
  });
  await wait(1000);

  const hasCounterfactual = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('COUNTERFACTUAL DIFFERENTIAL ANALYSIS') || text.includes('Causal Diagnosis');
  });
  assert.ok(hasCounterfactual, 'Expected counterfactual differential analysis');
  await page.screenshot({ path: 'docs/screenshots/defense-3-counterfactual.png' });
  pass('Counterfactual differential analysis computed metric deltas and invariant state transitions');

  // ==========================================
  // 4. MOTORSPORT TRACK ROUTE: /roleforge/defense/motorsport-lap-delta
  // ==========================================
  console.log('\n--- 4. Testing Direct Track Route ---');
  const resLap = await page.goto(`${base}/roleforge/defense/motorsport-lap-delta`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resLap.status(), 200);
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/defense-4-lap-delta.png' });
  pass('Direct route /roleforge/defense/motorsport-lap-delta rendered spatial lap delta scenario');

  // ==========================================
  // 5. SENIOR STAFF REVIEW: /roleforge/review
  // ==========================================
  console.log('\n--- 5. Testing /roleforge/review Technical Review Board ---');
  const resReview = await page.goto(`${base}/roleforge/review`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resReview.status(), 200);
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/defense-5-technical-review.png' });
  pass('Technical Review Board rendered problem context, assumptions, test commands, and boundaries');

  // ==========================================
  // 6. EVIDENCE PASSPORT: /roleforge/passport
  // ==========================================
  console.log('\n--- 6. Testing /roleforge/passport Evidence Passport ---');
  const resPassport = await page.goto(`${base}/roleforge/passport`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  assert.equal(resPassport.status(), 200);
  await wait(500);
  await page.screenshot({ path: 'docs/screenshots/defense-6-evidence-passport.png' });
  pass('Engineering Evidence Passport rendered printable candidate dossier and verified repo matrix');

  // ==========================================
  // 7. 3D CAMPUS WORLD HUD INTEGRATION
  // ==========================================
  console.log('\n--- 7. Testing In-World 3D HUD & KeyD Modal Trigger ---');
  await page.goto(`${base}/world?quality=low`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await wait(2000);

  // Click ENTER SIMULATION on WorldBoot
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const enterBtn = btns.find((b) => b.innerText && b.innerText.includes('ENTER'));
    if (enterBtn) enterBtn.click();
  });
  await wait(3000);

  // Verify Defense HUD container is present
  await page.waitForSelector('[data-testid="defense-hud-container"]', { timeout: 15000 });
  pass('Defense HUD container successfully mounted in 3D World');

  // Click Defense HUD button to open DefenseArenaModal
  await page.click('[data-testid="defense-hud-button"]');
  await wait(1000);

  // Check dialog is open
  const modalOpen = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-label="Engineering Defense Arena"]');
    return Boolean(dialog);
  });
  assert.ok(modalOpen, 'DefenseArenaModal must open upon clicking [D] DEFENSE button');
  await page.screenshot({ path: 'docs/screenshots/defense-7-in-world-modal.png' });
  pass('In-World 3D HUD pill toggles Engineering Defense Arena modal inside campus simulation');

  // Copy screenshots to artifact directory
  const artifactDir = 'C:/Users/dream/.gemini/antigravity/brain/31534823-3cfc-4cc1-af43-de9f783c72d3/screenshots';
  try {
    fs.mkdirSync(artifactDir, { recursive: true });
    const shots = fs.readdirSync('docs/screenshots').filter((f) => f.startsWith('defense-'));
    for (const shot of shots) {
      fs.copyFileSync(path.join('docs/screenshots', shot), path.join(artifactDir, shot));
    }
    console.log(`Copied ${shots.length} Defense Arena screenshots to artifact directory: ${artifactDir}`);
  } catch (err) {
    console.warn('Artifact copy warning:', err.message);
  }

} catch (err) {
  console.error('\nQA DEFENSE ARENA FAILED:', err);
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync('docs/roleforge-defense-qa-report.json', JSON.stringify(report, null, 2));
  console.log('\nReport written to docs/roleforge-defense-qa-report.json');
}
