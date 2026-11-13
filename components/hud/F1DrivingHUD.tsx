"use client";
import { AudioControls } from "@/components/frontier/AudioControls";
import { useWorldStore } from "@/state/worldStore";
import { useDriveStore } from "@/state/driveStore";
import { useCockpitStore } from "@/state/cockpitStore";
import { DriveProgress } from "@/components/frontier/DriveProgress";
import { computeGhostLapDelta } from "@/lib/digitalTwin/ghostLapEngine";
export function F1DrivingHUD(_props: {speedKmh?:number;rpm?:number;gear?:number;throttle?:number;brake?:number}){
  const driving=useWorldStore(s=>s.isDriving),s=useDriveStore(v=>v.current),c=useCockpitStore();
  if(!driving)return null;
  const ghostDelta = computeGhostLapDelta(s.time, Math.max(0, s.progress / (Math.PI * 2)), s.speed);
  return <aside className="cockpit-hud">
    <DriveProgress/>
    <div data-testid="cockpit-instruments" data-camera={c.mode} data-steering={s.steering} data-speed={s.speed} data-time={s.time}>
      <strong>{Math.round(Math.abs(s.speed)*3.6)} km/h</strong> · LAP 1 · S{Math.min(4,s.nextGate)} · {s.time.toFixed(2)} s
      {" · "}
      <span className={ghostDelta.isAhead ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
        GHOST: {ghostDelta.formattedDelta} {ghostDelta.isAhead ? "(AHEAD)" : "(BEHIND)"}
      </span>
      <br/>Throttle {Math.round(Math.abs(s.throttle)*100)}% · Brake {Math.round(s.brake*100)}% · {c.mode}
    </div>
    <div>
      <AudioControls/>
      <button onClick={c.toggle}>Switch camera</button>
      <button onClick={()=>useDriveStore.getState().requestExit()}>[E] EXIT CAR</button><details><summary>Camera settings</summary><label>FOV <input aria-label="Cockpit FOV" type="range" min="55" max="85" value={c.fov} onChange={e=>c.configure({fov:+e.target.value})}/></label><label>Seat height <input aria-label="Seat height" type="range" min="-.08" max=".12" step=".01" value={c.seat} onChange={e=>c.configure({seat:+e.target.value})}/></label><label>Camera key <select value={c.key} onChange={e=>c.configure({key:e.target.value})}><option value="KeyC">C</option><option value="KeyB">B</option></select></label></details></div></aside>}
