import {launchBrowser,qaBaseURL} from "./qa-browser.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
const browser=await launchBrowser({args:["--no-sandbox","--window-size=1280,800"]});
const page=await browser.newPage();await page.setViewport({width:1280,height:800});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function button(text){const found=await page.evaluate(t=>{const b=[...document.querySelectorAll("button")].find(b=>b.textContent.includes(t));if(!b)return false;b.click();return true;},text);assert.ok(found,`Button missing: ${text}`);}
const report={date:new Date().toISOString(),checks:[],errors};
const pass=t=>{report.checks.push(t);console.log("PASS",t);};
try{
 await page.goto(qaBaseURL+"/world?quality=low",{waitUntil:"domcontentloaded",timeout:120000});
 await page.waitForFunction(()=>document.body.innerText.includes("ENTER"),{timeout:60000});
 console.log((await page.$eval('body',e=>e.innerText)).slice(0,1800));
 await button("ENTER");await page.waitForSelector("canvas");await wait(2500);
 // Low preset uses normal visible control.
 const selects=await page.$$eval('select',els=>els.map(e=>({label:e.getAttribute('aria-label'),options:[...e.options].map(o=>[o.value,o.text])})));console.log('SELECTS',JSON.stringify(selects));
 const coords=()=>page.$eval('body',b=>b.innerText.match(/XYZ: ([^\n]+)/)?.[1]);
 const before=await coords();await page.keyboard.down('w');await wait(1300);await page.keyboard.up('w');await wait(300);assert.notEqual(await coords(),before);pass('Walking changes player position');
 await page.keyboard.press('v');await wait(300);await page.screenshot({path:'docs/screenshots/frontier-third-person.png'});await page.keyboard.press('v');pass('Perspective switching retains exploration');
 await page.keyboard.press('m');await wait(300);const paused=await coords();await page.keyboard.down('w');await wait(500);await page.keyboard.up('w');assert.equal(await coords(),paused);await page.keyboard.press('Escape');pass('Map blocks locomotion');
 // Walk farther into the garage until the physical chassis is in reach.
 await page.keyboard.down('w');await page.waitForFunction(()=>{const m=document.body.innerText.match(/XYZ: [-.0-9]+ \/ [-.0-9]+ \/ ([-.0-9]+)/);return m&&Number(m[1]) < -4;},{timeout:30000});await page.keyboard.up('w');await wait(400);console.log('GARAGE', (await page.$eval('body',e=>e.innerText)).slice(-1500));
 await page.keyboard.press('e');await wait(500);await button('START THE DRIVE');await page.waitForSelector('[data-testid="drive-state"]');pass('Garage inspection starts the Drive');
 await page.evaluate(()=>{const timer=setInterval(()=>{const el=document.querySelector('[data-testid="drive-state"]');if(!el){clearInterval(timer);for(const [key,code]of [['w','KeyW'],['a','KeyA'],['d','KeyD']])window.dispatchEvent(new KeyboardEvent('keyup',{key,code,bubbles:true}));return;}const s=el.dataset,x=+s.x,z=+s.z,yaw=+s.yaw,phase=Math.atan2(z,-x)+0.18,desired=Math.atan2(-45*Math.cos(phase)-x,45*Math.sin(phase)-z),error=Math.atan2(Math.sin(desired-yaw),Math.cos(desired-yaw));for(const [key,code,on]of [['w','KeyW',+s.speed<8],['a','KeyA',error<-.07],['d','KeyD',error>.07]])window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key,code,bubbles:true}));},100);});
 await page.waitForFunction(()=>document.body.innerText.includes('LAP VALIDATED'),{timeout:180000});pass('Keyboard-event-driven lap completes all gates and exits into telemetry debrief');
 await button('Review comparison');await page.waitForFunction(()=>document.body.innerText.includes('completed'));assert.equal(await page.$$eval('tbody tr',e=>e.length),4);await page.screenshot({path:'docs/screenshots/frontier-drive-debrief.png'});pass('Measured telemetry and four sector comparisons displayed; mission completed');
 assert.equal(errors.length,0);pass('No browser runtime errors');
}finally{fs.writeFileSync('docs/frontier-browser-results.json',JSON.stringify(report,null,2));await browser.close();}
