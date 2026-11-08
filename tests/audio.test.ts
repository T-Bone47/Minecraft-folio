import test from "node:test";
import assert from "node:assert/strict";
import { drivingSoundTargets } from "../lib/frontier/audio";
test("driving synthesis stays bounded for invalid/extreme controls and reverse", () => {
 for(const speed of [NaN,Infinity,-20,0,.5,1,10000]) for(const throttle of [NaN,Infinity,-10000,-1,0,.5,1,10000]) {
  const sound=drivingSoundTargets(speed,throttle);
  assert.ok(sound.gain>=.18&&sound.gain<=.36);
  assert.ok(sound.frequency>=65&&sound.frequency<=385);
  assert.ok(sound.cutoff>=300&&sound.cutoff<=2300);
 }
 assert.ok(drivingSoundTargets(.5,1).frequency>drivingSoundTargets(0,1).frequency);
 assert.equal(drivingSoundTargets(.5,-1).gain,drivingSoundTargets(.5,1).gain);
});
