import test from "node:test";
import assert from "node:assert/strict";
import { journeys,tourRoute,reachedFacility } from "../lib/visitor/journeys";
import { facilities } from "../data/facilities";
import { useVisitorStore } from "../state/visitorStore";
import { useMissionStore } from "../state/missionStore";
import { projectExhibits } from "../data/projectExhibits";
import { projectEvidence } from "../data/projectEvidence";
test("every journey has valid short and long physical facility routes",()=>{for(const id of Object.keys(journeys) as (keyof typeof journeys)[])for(const length of ["short","long"] as const){const route=tourRoute(id,length);assert.ok(route.length>=3);for(const fid of route){const f=facilities.find(f=>f.id===fid)!;assert.ok(f);assert.ok(reachedFacility(fid,f.approachPosition));assert.equal(reachedFacility(fid,[100,0,100]),false);}}});
test("all five tours complete and switching preserves missions",()=>{const missions=useMissionStore.getState().progress;for(const id of Object.keys(journeys) as (keyof typeof journeys)[]){useVisitorStore.getState().choose(id);useVisitorStore.getState().start("short");useVisitorStore.getState().pause();useVisitorStore.getState().advance();assert.equal(useVisitorStore.getState().index,0);useVisitorStore.getState().resume();for(const _ of tourRoute(id,"short"))useVisitorStore.getState().advance();assert.equal(useVisitorStore.getState().status,"completed");}assert.deepEqual(useMissionStore.getState().progress,missions);useVisitorStore.getState().cancel();assert.equal(useVisitorStore.getState().status,"idle");});
test("every canonical project shares three exhibit levels and evidence identity",()=>{assert.equal(projectExhibits.length,projectEvidence.length);for(const p of projectExhibits){assert.ok(p.project);assert.equal(p.levels.length,3);assert.equal(p.evidence,projectEvidence.find(e=>e.id===p.id));}});

test("cinematic tour looks at the canonical facility rather than stale map coordinates",async()=>{const {TOUR_WAYPOINTS}=await import("../components/camera/DroneTourCamera");for(const [index,id] of ["garage","telemetry","simulation","operations","aiml","hq"].entries()){const f=facilities.find(f=>f.id===id)!;assert.equal(TOUR_WAYPOINTS[index+1].lookAt[0],f.coordinates[0]);assert.equal(TOUR_WAYPOINTS[index+1].lookAt[2],f.coordinates[2]);}});
