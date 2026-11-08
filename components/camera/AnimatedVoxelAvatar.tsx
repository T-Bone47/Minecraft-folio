"use client";
import { RaceEngineerAvatar, type EngineerState } from "@/components/avatar/RaceEngineerAvatar";
import { VoxelGadget } from "./VoxelGadget";
import { useWorldStore } from "@/state/worldStore";
export interface AnimatedVoxelAvatarProps extends EngineerState {liveState?:()=>EngineerState}
export function AnimatedVoxelAvatar({liveState,...state}:AnimatedVoxelAvatarProps){const slot=useWorldStore(s=>s.activeHotbarSlot);return <RaceEngineerAvatar position={state.position} rotation={[0,state.yaw,0]} liveState={liveState??(()=>state)} accessory={<VoxelGadget slotIndex={slot} scale={.5}/>}/>;}
