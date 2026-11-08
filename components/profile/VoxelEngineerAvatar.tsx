"use client";
import { RaceEngineerAvatar } from "@/components/avatar/RaceEngineerAvatar";
export function VoxelEngineerAvatar({position=[0,0,0],rotation=[0,0,0],scale=1,idlePose=false}:{position?:[number,number,number];rotation?:[number,number,number];scale?:number;idlePose?:boolean}){return <RaceEngineerAvatar position={position} rotation={rotation} scale={scale} tablet={idlePose}/>;}
