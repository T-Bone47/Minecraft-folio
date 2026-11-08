"use client";
import { useSettingsStore } from "@/state/settingsStore";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
/** One procedural soft-box bake; no external HDR, realtime reflection or new scene lights. */
export function ChromeEnvironment(){const {scene,gl}=useThree();const time=useSettingsStore(s=>s.timeOfDay);useEffect(()=>{const previous=scene.environment,previousIntensity=scene.environmentIntensity;const room=new RoomEnvironment(),generator=new PMREMGenerator(gl);const target=generator.fromScene(room,.05,.1,100,{size:128});scene.environment=target.texture;scene.environmentIntensity=.55;room.dispose();generator.dispose();return()=>{scene.environment=previous;scene.environmentIntensity=previousIntensity;target.dispose();};},[scene,gl]);useEffect(()=>{scene.environmentIntensity=time==="night"?.25:.55;},[scene,time]);return null;}
