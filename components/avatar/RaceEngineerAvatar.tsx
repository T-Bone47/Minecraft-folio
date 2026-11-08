"use client";
import { useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getVoxelMaterial } from "@/lib/voxelTextures";
import { useWorldStore } from "@/state/worldStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { gameplayBlocked } from "@/lib/frontier/input";
import { createAvatarPose,stepAvatarPose } from "@/lib/frontier/avatarMotion";
const cube=new THREE.BoxGeometry(1,1,1);
type Vec=[number,number,number];
function Block({p,s,m="engineer_jacket",r=0}:{p:Vec;s:Vec;m?:string;r?:number}){return <mesh geometry={cube} dispose={null} position={p} scale={s} rotation={[0,0,r]} castShadow receiveShadow><primitive object={getVoxelMaterial(m)} attach="material"/></mesh>}
function Emblem({p,side=false}:{p:Vec;side?:boolean}){return <group position={p} rotation={[0,side?Math.PI/2:0,0]}><Block p={[-.035,0,0]} s={[.033,.12,.012]} r={-.45} m="chrome_graphite"/><Block p={[.02,0,0]} s={[.033,.12,.012]} r={-.45} m="chrome_red"/></group>}
export interface EngineerState {position:Vec;yaw:number;isMoving:boolean;isSprinting:boolean;isGrounded:boolean;verticalVelocity:number}
export function RaceEngineerAvatar({position=[0,0,0],rotation=[0,0,0],scale=1,liveState,tablet=false,accessory,reducedMotion}:{position?:Vec;rotation?:Vec;scale?:number;liveState?:()=>EngineerState;tablet?:boolean;accessory?:ReactNode;reducedMotion?:boolean}){
 const root=useRef<THREE.Group>(null),body=useRef<THREE.Group>(null),head=useRef<THREE.Group>(null),leftLeg=useRef<THREE.Group>(null),rightLeg=useRef<THREE.Group>(null),leftArm=useRef<THREE.Group>(null),rightArm=useRef<THREE.Group>(null);
 const pose=useRef(createAvatarPose()),last=useRef<Vec|null>(null);
 useFrame((_,delta)=>{
  const dt=Math.min(delta,.1),state=liveState?.(),reduced=reducedMotion??useWorldStore.getState().reducedMotion;
  let speed=0;
  if(state&&root.current){root.current.position.set(...state.position);root.current.rotation.y=state.yaw;
   if(last.current){const distance=Math.hypot(state.position[0]-last.current[0],state.position[2]-last.current[2]);speed=distance<2?Math.min(8,distance/Math.max(dt,.001)):0;last.current[0]=state.position[0];last.current[2]=state.position[2];}
   else last.current=[...state.position];
  }
  const blocked=!!state&&gameplayBlocked(),interacting=tablet||!!state&&(!!useInteractionRegistry.getState().activeStationModal||useWorldStore.getState().mode==="inspect");
  const p=stepAvatarPose(pose.current,dt,blocked?0:speed,state?.isGrounded??true,state?.verticalVelocity??0,interacting,reduced);
  if(body.current){body.current.position.y=.86+p.bob;body.current.rotation.x=p.lean;}
  if(head.current)head.current.rotation.x=-p.lean*.45;
  if(leftLeg.current)leftLeg.current.rotation.x=p.leftLeg;
  if(rightLeg.current)rightLeg.current.rotation.x=p.rightLeg;
  if(leftArm.current)leftArm.current.rotation.x=p.leftArm;
  if(rightArm.current)rightArm.current.rotation.x=p.rightArm;
 });
 return <group ref={root} name="ASISH-Race-Engineer" position={position} rotation={rotation} scale={scale}>
  {[-1,1].map(side=><group key={side} ref={side<0?leftLeg:rightLeg} position={[side*.18,.86,0]}>
   <Block p={[0,-.34,0]} s={[.3,.68,.32]} m="engineer_trousers"/>
   <Block p={[side*.16,-.27,.01]} s={[.055,.23,.25]} m="chrome_graphite"/>
   <Block p={[side*.193,-.27,.02]} s={[.013,.12,.035]} m="chrome_red"/>
   <Block p={[0,-.75,.055]} s={[.32,.15,.46]} m="chrome_carbon"/>
   <Block p={[0,-.825,.055]} s={[.34,.055,.48]} m="chrome_brushed"/>
   <Block p={[0,-.735,.29]} s={[.12,.055,.016]} m="chrome_red"/>
  </group>)}
  <group ref={body} position={[0,.86,0]}>
   <Block p={[0,.38,0]} s={[.66,.74,.38]}/>
   <Block p={[0,.04,0]} s={[.68,.09,.4]} m="chrome_carbon"/>
   <Block p={[0,.38,.198]} s={[.025,.68,.016]} m="chrome_graphite"/>
   <Block p={[0,.66,.21]} s={[.045,.1,.025]} m="chrome_carbon"/>
   {[-1,1].map(side=><group key={side}>
    <Block p={[side*.265,.27,.2]} s={[.035,.32,.018]} m="chrome_red"/>
    <Block p={[side*.23,.45,.2]} s={[.035,.16,.018]} r={side*.65} m="chrome_red"/>
    <Block p={[side*.26,.26,-.2]} s={[.038,.32,.018]} m="chrome_red"/>
    <Block p={[side*.22,.45,-.2]} s={[.035,.19,.018]} r={-side*.65} m="chrome_red"/>
    <Block p={[side*.14,.76,0]} s={[.16,.14,.38]} r={side*.25}/>
    <Block p={[side*.13,.77,.2]} s={[.055,.12,.025]} r={side*.25} m="chrome_red"/>
   </group>)}
   <Emblem p={[.17,.58,.208]}/>
   <Block p={[-.28,.05,.28]} s={[.14,.23,.1]} m="chrome_graphite"/>
   <Block p={[-.28,.23,.28]} s={[.02,.15,.02]} m="chrome_carbon"/>
   {[0,1,2].map(i=><Block key={i} p={[-.32+i*.035,.015+i*.02,.336]} s={[.02,.045+i*.025,.012]} m="chrome_red"/>)}
   {[-1,1].map(side=><group key={side} ref={side<0?leftArm:rightArm} position={[side*.46,.68,0]}>
    <Block p={[0,-.19,0]} s={[.25,.4,.29]}/>
    <Block p={[side*.132,-.17,0]} s={[.018,.34,.1]} m="chrome_red"/>
    <Block p={[0,-.46,0]} s={[.23,.16,.27]}/>
    <Block p={[0,-.565,0]} s={[.24,.06,.28]} m="chrome_graphite"/>
    <Block p={[0,-.68,0]} s={[.21,.18,.23]} m="engineer_skin"/>
    {side<0&&<group><Block p={[-.14,-.55,0]} s={[.06,.17,.2]} m="chrome_carbon"/>{[0,1,2].map(i=><Block key={i} p={[-.175,-.59+i*.025,-.055+i*.05]} s={[.012,.045+i*.025,.025]} m={i===0?"chrome_brushed":"chrome_red"}/>)}</group>}
    {side>0&&tablet&&<Block p={[0,-.7,.16]} s={[.35,.42,.04]} m="chrome_graphite"/>}
    {side>0&&accessory&&<group position={[0,-.73,.1]} rotation={[-.35,.2,0]}>{accessory}</group>}
   </group>)}
   <group ref={head} position={[0,.8,0]}>
    <Block p={[0,.14,0]} s={[.54,.54,.5]} m="engineer_skin"/>
    {[-1,1].map(side=><group key={side}>
     <Block p={[side*.13,.16,.258]} s={[.13,.09,.014]} m="chrome_light"/>
     <Block p={[side*.11,.16,.268]} s={[.055,.082,.012]} m="engineer_hair"/>
     <Block p={[side*.1,.185,.276]} s={[.018,.025,.008]} m="chrome_light"/>
     <Block p={[side*.13,.24,.27]} s={[.15,.035,.025]} r={side*.12} m="engineer_hair"/>
     <Block p={[side*.27,.19,-.03]} s={[.045,.42,.48]} m="engineer_hair"/>
     <Block p={[side*.316,.12,.01]} s={[.1,.25,.25]} m="chrome_carbon"/>
     <Block p={[side*.372,.12,.01]} s={[.018,.2,.2]} m="chrome_red"/>
     <Emblem p={[side*.385,.12,.01]} side/>
    </group>)}
    <Block p={[0,.025,.268]} s={[.09,.02,.016]} m="engineer_hair"/>
    <Block p={[0,.1,.267]} s={[.055,.06,.028]} m="engineer_skin"/>
    <Block p={[0,.425,-.015]} s={[.59,.12,.55]} m="engineer_hair"/>
    <Block p={[0,.14,-.26]} s={[.57,.5,.04]} m="engineer_hair"/>
    {[-2,-1,0,1,2].map((x,i)=><Block key={x} p={[x*.105,.34+(i%2)*.045,.25]} s={[.11,.13+(i%2)*.055,.08]} m="engineer_hair"/>)}
    <Block p={[0,.505,-.02]} s={[.6,.04,.1]} m="chrome_graphite"/>
    <Block p={[-.32,-.015,.19]} s={[.035,.035,.3]} m="chrome_graphite"/>
    <Block p={[-.21,-.015,.33]} s={[.24,.035,.035]} m="chrome_carbon"/>
    <Block p={[-.1,-.015,.33]} s={[.09,.055,.055]} m="chrome_carbon"/>
   </group>
  </group>
 </group>;
}

