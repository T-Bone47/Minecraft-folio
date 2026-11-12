"use client";
import { Cockpit } from "./Cockpit";
import { useCockpitStore } from "@/state/cockpitStore";
import { CarChromeDetails } from "./CarChromeDetails";
import React, { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { useDriveStore } from "@/state/driveStore";
import { useMissionStore } from "@/state/missionStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { worldSound } from "@/lib/audio";
import { getVoxelMaterial } from "@/lib/voxelTextures";
import { getTerrainSurfaceY, depenetrate } from "@/lib/terrainModel";
import { gameplayBlocked, typingTarget, touchInput } from "@/lib/frontier/input";
import { FIXED_DT, newDrive, stepDrive, type TelemetrySample } from "@/lib/frontier/drive";
import { useDigitalTwinStore } from "@/state/digitalTwinStore";
import { createLapRecord } from "@/lib/digitalTwin/telemetrySchema";

export const DriveableF1Car: React.FC = () => {
 const isDriving=useWorldStore(s=>s.isDriving);
 const resetToken=useDriveStore(s=>s.resetToken);
 const {camera}=useThree();
 const carGroupRef=useRef<THREE.Group>(null);
 const frontLeftWheelRef=useRef<THREE.Group>(null),frontRightWheelRef=useRef<THREE.Group>(null);
 const rearLeftWheelRef=useRef<THREE.Mesh>(null),rearRightWheelRef=useRef<THREE.Mesh>(null),flWheelMeshRef=useRef<THREE.Mesh>(null),frWheelMeshRef=useRef<THREE.Mesh>(null);
 const sim=useRef(newDrive()),samples=useRef<TelemetrySample[]>([]),accumulator=useRef(0),tick=useRef(0);
 const cameraTarget=useRef(new THREE.Vector3()),cameraLook=useRef(new THREE.Vector3());
 useEffect(()=>{if(!isDriving)return;const c=camera as THREE.PerspectiveCamera;const fov=c.fov,near=c.near;return()=>{c.fov=fov;c.near=near;c.updateProjectionMatrix();};},[camera,isDriving]);
 const keys=useRef({forward:false,backward:false,left:false,right:false,handbrake:false});
 const carbonMat=getVoxelMaterial("chrome_carbon"),silverMat=getVoxelMaterial("chrome_polished"),redMat=getVoxelMaterial("chrome_red"),tireMat=getVoxelMaterial("tire_black"),rimMat=getVoxelMaterial("curb_white");
 const clearKeys=useCallback(()=>{keys.current={forward:false,backward:false,left:false,right:false,handbrake:false};},[]);
 const exit=useCallback(()=>{
  const s=sim.current,free=depenetrate(s.x*0.91,s.z*0.91,0.38),y=getTerrainSurfaceY(free.x,free.z)+1.65;
  useWorldStore.getState().stopDriving();
  useWorldStore.getState().setPlayerPosition([free.x,y,free.z]);
  useCameraStore.getState().setTargetTransform([free.x,y,free.z],[s.x,y,s.z]);
  useDriveStore.getState().clearExit();clearKeys();worldSound.stopDrivingEngine();
 },[clearKeys]);
 useEffect(()=>{ if(!isDriving)return;sim.current=newDrive();samples.current=[];tick.current=0;accumulator.current=0;clearKeys();useDriveStore.getState().publish(sim.current);worldSound.startDrivingEngine();return ()=>worldSound.stopDrivingEngine(); },[isDriving,resetToken,clearKeys]);
 useEffect(()=>{
  if(!isDriving)return;
  const down=(e:KeyboardEvent)=>{if(typingTarget(e.target)||gameplayBlocked())return;
   const handled=["KeyW","KeyS","KeyA","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","KeyV","KeyR","KeyE","Escape",useCockpitStore.getState().key];
   if(!handled.includes(e.code))return;
   if(e.code==="Space"&&e.target instanceof HTMLElement&&e.target.closest("button,a,summary"))return;
   e.preventDefault();
   if(e.code==="KeyW"||e.code==="ArrowUp")keys.current.forward=true;
   if(e.code==="KeyS"||e.code==="ArrowDown")keys.current.backward=true;
   if(e.code==="KeyA"||e.code==="ArrowLeft")keys.current.left=true;
   if(e.code==="KeyD"||e.code==="ArrowRight")keys.current.right=true;
   if(e.code==="Space")keys.current.handbrake=true;
   if(!e.repeat&&(e.code==="KeyV"||e.code===useCockpitStore.getState().key))useCockpitStore.getState().toggle();
   if(!e.repeat&&e.code==="KeyR")useDriveStore.getState().reset();
   if(!e.repeat&&(e.code==="KeyE"||e.code==="Escape"))exit();
  };
  const up=(e:KeyboardEvent)=>{if(["KeyW","ArrowUp"].includes(e.code))keys.current.forward=false;if(["KeyS","ArrowDown"].includes(e.code))keys.current.backward=false;if(["KeyA","ArrowLeft"].includes(e.code))keys.current.left=false;if(["KeyD","ArrowRight"].includes(e.code))keys.current.right=false;if(e.code==="Space")keys.current.handbrake=false;};
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);window.addEventListener("blur",clearKeys);
  return ()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.removeEventListener("blur",clearKeys);};
 },[isDriving,exit,clearKeys]);
 useFrame((_,delta)=>{
  if(!isDriving||!carGroupRef.current)return;
  if(useDriveStore.getState().exitRequested){exit();return;}
  if(gameplayBlocked()){clearKeys();accumulator.current=0;if(document.pointerLockElement)document.exitPointerLock();return;}
  accumulator.current+=Math.min(delta,1.0); let steps=0;
  while(accumulator.current>=FIXED_DT&&steps<65){ steps++;
   accumulator.current-=FIXED_DT;
   const forward=keys.current.forward||touchInput.forward,backward=keys.current.backward||touchInput.backward;
   const keyboardInput={throttle:forward?1:backward&&sim.current.speed<=0.2?-1:0,brake:keys.current.handbrake||touchInput.jump?1:backward&&sim.current.speed>0.2?1:0,steering:(keys.current.right||touchInput.right?1:0)-(keys.current.left||touchInput.left?1:0)};
   const autoDriver=typeof window!=="undefined"&&(window as any).__frontierLapDriver;
   const input=autoDriver?autoDriver(sim.current,keyboardInput):keyboardInput;
   const result=stepDrive(sim.current,input);sim.current=result.state;tick.current++; if(typeof window!=="undefined")(window as any).__frontierDriveState=result.state;
   if(tick.current%6===0||result.state.completed){ if(samples.current.length<6000)samples.current.push(result.sample);useDriveStore.getState().publish(result.state);
    const kmh=Math.abs(result.state.speed)*3.6;useWorldStore.getState().setF1Telemetry({speedKmh:Math.round(kmh),rpm:0,gear:0,throttle:input.throttle,brake:input.brake});useWorldStore.getState().setPlayerPosition([result.state.x,2.15,result.state.z]);}
   if(result.state.completed){const lapRecord = createLapRecord(result.state, [...samples.current], "visitor");useDriveStore.getState().finish({state:result.state,samples:[...samples.current],source:"visitor"});useDigitalTwinStore.getState().ingestCompletedLap(lapRecord);useMissionStore.getState().send("drive",{type:"objective",name:"lap"});exit();useInteractionRegistry.getState().openStationModal("drive_debrief");break;}
  }
  const s=sim.current;carGroupRef.current.position.set(s.x,0.58,s.z);carGroupRef.current.rotation.y=s.yaw;
  for(const wheel of [frontLeftWheelRef,frontRightWheelRef])if(wheel.current)wheel.current.rotation.y=s.steering;
  for(const wheel of [rearLeftWheelRef,rearRightWheelRef,flWheelMeshRef,frWheelMeshRef])if(wheel.current){wheel.current.rotation.z=Math.PI/2;wheel.current.rotation.x+=s.speed*delta/0.38;}
  const config=useCockpitStore.getState(),cockpit=config.mode==="cockpit",c=camera as THREE.PerspectiveCamera;
  const desiredFov=cockpit?config.fov:65;if(c.fov!==desiredFov||c.near!==.035){c.fov=desiredFov;c.near=.035;c.updateProjectionMatrix();}
  carGroupRef.current.updateMatrixWorld(true);
  const target=cameraTarget.current.set(0,cockpit?1.04+config.seat:2.8,cockpit?-.48:-4.8);carGroupRef.current.localToWorld(target);
  const look=cameraLook.current.set(0,cockpit?.88:1,8);carGroupRef.current.localToWorld(look);
  camera.position.lerp(target,cockpit||useWorldStore.getState().reducedMotion?1:1-Math.exp(-12*delta));camera.lookAt(look);  worldSound.updateDrivingEngine(Math.abs(s.speed)/22,s.throttle);
 });
 if(!isDriving)return null;
  return (
    <group ref={carGroupRef} position={[-45, 0.58, 0]}>
      <CarChromeDetails/>
      {/* 1. Carbon Floor / Underbody Plank */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.1, 4.4]} />
        <primitive object={carbonMat} attach="material" />
      </mesh>

      {/* 2. Stepped Front Wing Assembly */}
      <group position={[0, 0.18, 2.3]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.08, 0.5]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.07, -0.08]} castShadow>
          <boxGeometry args={[2.3, 0.06, 0.3]} />
          <primitive object={redMat} attach="material" />
        </mesh>
        <mesh position={[1.2, 0.12, 0]} castShadow>
          <boxGeometry args={[0.08, 0.32, 0.55]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        <mesh position={[-1.2, 0.12, 0]} castShadow>
          <boxGeometry args={[0.08, 0.32, 0.55]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* 3. Nosecone */}
      <mesh position={[0, 0.28, 1.85]} castShadow>
        <boxGeometry args={[0.42, 0.2, 0.6]} />
        <primitive object={silverMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.34, 1.35]} castShadow>
        <boxGeometry args={[0.54, 0.26, 0.7]} />
        <primitive object={silverMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.48, 1.35]}>
        <boxGeometry args={[0.12, 0.02, 0.65]} />
        <primitive object={redMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.42, 0.75]} castShadow>
        <boxGeometry args={[0.68, 0.34, 0.7]} />
        <primitive object={silverMat} attach="material" />
      </mesh>

      <Cockpit state={sim}/>
      {/* 6. Sidepods */}
      <group position={[0.72, 0.38, -0.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.36, 1.35]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.06, 0.68]}>
          <boxGeometry args={[0.42, 0.22, 0.08]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>
      <group position={[-0.72, 0.38, -0.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.36, 1.35]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.06, 0.68]}>
          <boxGeometry args={[0.42, 0.22, 0.08]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>

      {/* 7. Rear Wing Assembly */}
      <group position={[0, 1.05, -2.1]}>
        <mesh position={[0.42, -0.35, 0]} castShadow>
          <boxGeometry args={[0.08, 0.7, 0.12]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        <mesh position={[-0.42, -0.35, 0]} castShadow>
          <boxGeometry args={[0.08, 0.7, 0.12]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[1.9, 0.1, 0.45]} />
          <primitive object={carbonMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.12, -0.06]} castShadow>
          <boxGeometry args={[1.86, 0.08, 0.28]} />
          <primitive object={redMat} attach="material" />
        </mesh>
        <mesh position={[0.96, 0.04, 0]} castShadow>
          <boxGeometry args={[0.08, 0.42, 0.58]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
        <mesh position={[-0.96, 0.04, 0]} castShadow>
          <boxGeometry args={[0.08, 0.42, 0.58]} />
          <primitive object={silverMat} attach="material" />
        </mesh>
      </group>

      {/* 8. Front Steerable Wheels */}
      <group ref={frontLeftWheelRef} position={[1.15, 0.38, 1.45]}>
        <mesh ref={flWheelMeshRef} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.36, 16]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
        <mesh position={[0.02, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.38, 8]} />
          <primitive object={rimMat} attach="material" />
        </mesh>
      </group>

      <group ref={frontRightWheelRef} position={[-1.15, 0.38, 1.45]}>
        <mesh ref={frWheelMeshRef} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.36, 16]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
        <mesh position={[-0.02, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.38, 8]} />
          <primitive object={rimMat} attach="material" />
        </mesh>
      </group>

      {/* 9. Rear Driven Wheels */}
      <group position={[1.25, 0.45, -1.5]}>
        <mesh ref={rearLeftWheelRef} castShadow>
          <cylinderGeometry args={[0.44, 0.44, 0.48, 16]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
      </group>

      <group position={[-1.25, 0.45, -1.5]}>
        <mesh ref={rearRightWheelRef} castShadow>
          <cylinderGeometry args={[0.44, 0.44, 0.48, 16]} />
          <primitive object={tireMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
