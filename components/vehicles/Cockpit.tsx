"use client";
import { getVoxelMaterial } from "@/lib/voxelTextures";
import { chromeEra,chromeSurfaces } from "@/data/chromeEra";
import { useEffect,useMemo,useRef,type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DriveState } from "@/lib/frontier/drive";
export function Cockpit({state}:{state:RefObject<DriveState>}){
 const wheel=useRef<THREE.Group>(null),elapsed=useRef(0);
 const display=useMemo(()=>{const canvas=document.createElement("canvas");canvas.width=512;canvas.height=256;const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return {canvas,texture};},[]);
 useEffect(()=>()=>display.texture.dispose(),[display]);
 useFrame((_,dt)=>{const s=state.current;if(!s)return;if(wheel.current)wheel.current.rotation.z=s.steering*2.5;elapsed.current+=dt;if(elapsed.current<.1)return;elapsed.current=0;const c=display.canvas.getContext("2d")!;c.fillStyle=chromeEra.carbon;c.fillRect(0,0,512,256);c.textAlign="center";c.fillStyle=chromeEra.silver;c.font="bold 22px monospace";c.fillText("FRONTIER / SIMULATED",256,30);c.fillStyle="white";c.font="bold 72px monospace";c.fillText((Math.abs(s.speed)*3.6).toFixed(0)+" km/h",256,106);c.font="26px monospace";c.fillText(`LAP 1   S${Math.min(4,s.nextGate)}`,256,147);c.fillText(s.time.toFixed(2)+" s",256,181);c.textAlign="left";c.font="20px monospace";c.fillStyle="#8ef2dc";c.fillText("T",10,218);c.fillRect(38,200,180*Math.abs(s.throttle),19);c.fillStyle=chromeEra.red;c.fillText("B",270,218);c.fillRect(300,200,180*s.brake,19);display.texture.needsUpdate=true;});
 const block=(p:[number,number,number],size:[number,number,number],color:string)=><mesh position={p}><boxGeometry args={size}/>{chromeSurfaces[color]?<primitive attach="material" object={getVoxelMaterial(color)}/>:<meshStandardMaterial color={color}/>}</mesh>;
 return <group name="frontier-cockpit">
 {block([0,.32,-.15],[.74,.18,1.2],"chrome_carbon")}{block([0,.65,-.65],[.68,.7,.16],"chrome_graphite")}
 {[-1,1].map(side=><group key={side}>{block([side*.48,.65,-.1],[.12,.7,1.5],"chrome_carbon")}{block([side*.9,.83,.7],[.3,.16,.16],"chrome_polished")}{block([side*.9,.85,.61],[.24,.1,.02],"#adc9cd")}{block([side*.48,1.34,-.1],[.07,.07,1.6],"chrome_polished")}</group>)}
 {block([0,1.34,.69],[1.02,.07,.07],"chrome_polished")}{block([0,1.03,.69],[.045,.62,.045],"chrome_polished")}
 {block([0,.66,.55],[.09,.09,.5],"chrome_graphite")}
 <group ref={wheel} position={[0,.83,.32]} name="steering-wheel">
 {block([0,0,0],[.64,.26,.09],"chrome_carbon")}{block([-.37,0,0],[.12,.42,.15],"chrome_graphite")}{block([.37,0,0],[.12,.42,.15],"chrome_graphite")}{block([0,-.18,0],[.7,.07,.09],"chrome_red")}
 <mesh position={[0,.015,-.052]} rotation={[0,Math.PI,0]}><planeGeometry args={[.55,.275]}/><meshBasicMaterial map={display.texture} toneMapped={false}/></mesh>
 {[-1,1].map(side=><group key={side}>{block([side*.37,-.05,-.08],[.13,.18,.12],"#e1a874")}{block([side*.37,-.22,-.18],[.12,.22,.18],"chrome_red")}</group>)}
 </group></group>;
}
