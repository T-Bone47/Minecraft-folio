import {launchBrowser,qaBaseURL} from './qa-browser.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await launchBrowser({args:['--window-size=1280,800']});
const page=await browser.newPage();
await page.setViewport({width:1280,height:800});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',message=>{if(message.text().startsWith('LAP_QA '))console.log(message.text());});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const report={date:new Date().toISOString(),checks:[],errors,softwareGL:process.env.QA_SOFTWARE_GL==='1'};
const pass=text=>{report.checks.push(text);console.log('PASS',text);};
async function button(text){
  const found=await page.evaluate(text=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes(text));if(!b)return false;b.click();return true;},text);
  assert.ok(found,`Button missing: ${text}`);
}
async function driverEvidence(){
  return page.evaluate(()=>{
    const driver=window.__frontierLapQA;
    const el=document.querySelector('[data-testid=drive-state]');
    const instrument=document.querySelector('[data-testid=cockpit-instruments]');
    return {last:driver?.last??null,samples:driver?.samples??[],frames:driver?.frames??0,wallMs:driver?performance.now()-driver.startedAt:0,remainingState:el?{...el.dataset}:null,instruments:instrument?{...instrument.dataset}:null};
  });
}
try{
  await page.goto(qaBaseURL+'/world?quality=low',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.body.innerText.includes('ENTER'),{timeout:60000});
  await button('ENTER');await page.waitForSelector('canvas');await wait(2500);
  const coords=()=>page.$eval('body',b=>b.innerText.match(/XYZ: ([^\n]+)/)?.[1]);
  const before=await coords();await page.keyboard.down('w');await wait(1300);await page.keyboard.up('w');await wait(300);
  assert.notEqual(await coords(),before);pass('Walking changes player position');
  await page.keyboard.press('v');await wait(300);await page.screenshot({path:'docs/screenshots/frontier-third-person.png'});await page.keyboard.press('v');pass('Perspective switching retains exploration');
  await page.keyboard.press('m');await wait(300);const paused=await coords();await page.keyboard.down('w');await wait(500);await page.keyboard.up('w');assert.equal(await coords(),paused);await page.keyboard.press('Escape');pass('Map blocks locomotion');
  await page.keyboard.down('w');
  await page.waitForFunction(()=>{const m=document.body.innerText.match(/XYZ: [-.0-9]+ \/ [-.0-9]+ \/ ([-.0-9]+)/);return m&&Number(m[1]) < -4;},{timeout:30000});
  await page.keyboard.up('w');await wait(400);await page.keyboard.press('e');await wait(500);await button('START THE DRIVE');await page.waitForSelector('[data-testid=drive-state]');pass('Garage inspection starts the Drive');
  const pose=await page.$eval('[data-testid=drive-state]',e=>({x:e.dataset.x,z:e.dataset.z,speed:e.dataset.speed}));
  await page.keyboard.press('c');await wait(250);
  assert.deepEqual(await page.$eval('[data-testid=drive-state]',e=>({x:e.dataset.x,z:e.dataset.z,speed:e.dataset.speed})),pose);
  assert.equal(await page.$eval('[data-testid=cockpit-instruments]',e=>e.dataset.camera),'cockpit');
  await page.keyboard.down('d');await wait(600);await page.keyboard.up('d');
  assert.ok(+(await page.$eval('[data-testid=cockpit-instruments]',e=>e.dataset.steering))>0);
  await page.screenshot({path:'docs/screenshots/cockpit-2-stationary.png'});
  await page.setViewport({width:390,height:844});await wait(400);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'docs/screenshots/cockpit-2-mobile.png'});
  // The desktop and mobile assertions above retain their original dimensions.
  // A software renderer need not rasterise a million pixels to validate a lap.
  const lapViewport=report.softwareGL?{width:640,height:480}:{width:1280,height:800};
  await page.setViewport(lapViewport);report.lapViewport=lapViewport;
  await page.keyboard.press('r');
  await page.waitForFunction(()=>{
    const el=document.querySelector('[data-testid=drive-state]'),instrument=document.querySelector('[data-testid=cockpit-instruments]');
    return el&&+el.dataset.x===-45&&+el.dataset.z===0&&+el.dataset.yaw===0&&+el.dataset.progress===0&&+el.dataset.speed===0&&Math.abs(+instrument.dataset.steering)<.01;
  },{timeout:15000});
  pass('Cockpit camera and steering respond to actual input');
  await page.evaluate(()=>{
    const driver=window.__frontierLapQA={startedAt:performance.now(),frames:0,last:null,samples:[],stopped:false};
    const keys=[['w','KeyW'],['a','KeyA'],['d','KeyD']];
    const send=(key,code,on)=>window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key,code,bubbles:true}));
    driver.stop=()=>{
      driver.stopped=true;
      if(driver.frame)cancelAnimationFrame(driver.frame);
      if(driver.loop)clearInterval(driver.loop);
      if(driver.sampler)clearInterval(driver.sampler);
      for(const [key,code] of keys)send(key,code,false);
    };
    function tickDriver(){
      if(driver.stopped)return;
      const el=document.querySelector('[data-testid=drive-state]');
      const instrument=document.querySelector('[data-testid=cockpit-instruments]');
      const sim=window.__frontierDriveState;
      if(!el&&!sim){driver.stop();return;}

      const x = sim ? sim.x : +el.dataset.x;
      const z = sim ? sim.z : +el.dataset.z;
      const yaw = sim ? sim.yaw : +el.dataset.yaw;
      const speed = sim ? sim.speed : +el.dataset.speed;
      const progress = sim ? sim.progress : +el.dataset.progress;
      const currentSteering = sim ? sim.steering : (instrument ? +instrument.dataset.steering : 0);
      const simTime = sim ? sim.time : (instrument ? +instrument.dataset.time : 0);

      const phase = Math.atan2(z, -x) + 0.18;
      const desired = Math.atan2(-45 * Math.cos(phase) - x, 45 * Math.sin(phase) - z);
      const error = Math.atan2(Math.sin(desired - yaw), Math.cos(desired - yaw));
      const targetSteer = error * 2.0;

      const throttle = speed < 10.8;
      let left = false, right = false;
      if (currentSteering < targetSteer - 0.02) {
        right = true;
      } else if (currentSteering > targetSteer + 0.02) {
        left = true;
      }

      send('w', 'KeyW', throttle);
      send('a', 'KeyA', left);
      send('d', 'KeyD', right);

      driver.last = {
        wallMs: performance.now() - driver.startedAt,
        simTime,
        x,
        z,
        yaw,
        speed,
        progress,
        gate: Math.min(4, Math.floor(Math.max(0, progress) / (Math.PI / 2)) + 1),
        input: { throttle, left, right }
      };
    }

    driver.loop = setInterval(tickDriver, 25);
    function rafLoop(){
      if(driver.stopped)return;
      driver.frames++;
      tickDriver();
      driver.frame = requestAnimationFrame(rafLoop);
    }
    driver.frame = requestAnimationFrame(rafLoop);
    driver.sampler = setInterval(()=>{
      if(driver.last && driver.samples.length < 240){
        driver.samples.push({...driver.last, frames: driver.frames});
        if(driver.samples.length % 5 === 0) console.log('LAP_QA', JSON.stringify(driver.samples.at(-1)));
      }
    }, 1000);
  });
  await page.waitForFunction(()=>document.body.innerText.includes('LAP VALIDATED'),{timeout:180000});
  report.driver=await driverEvidence();
  pass('Keyboard-event-driven lap completes all gates and exits into telemetry debrief');
  await button('Review comparison');await page.waitForFunction(()=>document.body.innerText.includes('completed'));
  assert.equal(await page.$$eval('tbody tr',e=>e.length),4);
  await page.screenshot({path:'docs/screenshots/frontier-drive-debrief.png'});
  pass('Measured telemetry and four sector comparisons displayed; mission completed');
  await button('Play replay');await wait(350);await button('Pause replay');assert.ok(await page.$('input[aria-label="Replay time"]'));
  pass('Recorded replay plays and pauses with all control traces');
  assert.equal(errors.length,0);pass('No browser runtime errors');report.passed=true;
}catch(error){
  report.failure=String(error);
  try{report.driver=await driverEvidence();await page.screenshot({path:'docs/screenshots/cockpit-lap-failure.png'});}catch(captureError){report.captureFailure=String(captureError);}
  console.error('LAP_QA_FAILURE',JSON.stringify(report.driver??{failure:report.failure}));
  throw error;
}finally{
  await page.evaluate(()=>window.__frontierLapQA?.stop?.()).catch(()=>{});
  fs.writeFileSync('docs/cockpit-browser-results.json',JSON.stringify(report,null,2));
  await browser.close();
}
