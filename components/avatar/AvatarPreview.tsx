"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect,useState,useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { RaceEngineerAvatar } from "./RaceEngineerAvatar";
export default function AvatarPreview(){
 const [angle,setAngle]=useState(0),[reduced,setReduced]=useState(false);
 const controls=useRef<OrbitControlsImpl>(null);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');setReduced(m.matches);const change=()=>setReduced(m.matches);m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[]);
 return <section aria-label="Interactive race engineer model" className="border border-zinc-600 bg-zinc-950 p-3">
 <div data-testid="avatar-preview" data-angle={angle} style={{height:480,maxHeight:'65vh',touchAction:'none'}}>
 <Canvas camera={{position:[0,1.3,4.6],fov:36}} dpr={[1,1.5]} gl={{antialias:true,alpha:false}}><color attach="background" args={['#171A20']}/><ambientLight intensity={1.6}/><directionalLight position={[3,5,4]} intensity={3}/><directionalLight position={[-3,2,-3]} intensity={2}/><group rotation={[0,angle,0]}><RaceEngineerAvatar reducedMotion={reduced}/></group><OrbitControls ref={controls} target={[0,1.05,0]} enablePan={false} minDistance={3} maxDistance={6} enableDamping={!reduced}/></Canvas>
 </div><div className="flex flex-wrap gap-3 mt-3">{[['Front',0],['Side',Math.PI/2],['Back',Math.PI]].map(([label,a])=><button key={label} onClick={()=>{if(controls.current){controls.current.reset();controls.current.target.set(0,1.05,0);controls.current.object.position.set(0,1.3,4.6);controls.current.update();}setAngle(+a);}} className="border border-zinc-500 px-4 py-2" aria-pressed={angle===a}>{label}</button>)}</div><p className="text-sm text-zinc-300 mt-3">Drag to orbit; scroll to zoom. Front, side and back controls also work with the keyboard.</p>
 </section>;
}

