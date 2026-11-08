"use client";
import { useEffect, useState } from "react";
import { worldSound } from "@/lib/audio";
import { useWorldStore } from "@/state/worldStore";
export function AudioControls(){
 const mode=useWorldStore(s=>s.mode);
 const [muted,setMuted]=useState(true),[volume,setVolume]=useState(.45),[position,setPosition]=useState({left:12,top:80});
 useEffect(()=>{setMuted(worldSound.getIsMuted());setVolume(worldSound.getVolume());},[mode]);
 if(mode!=="explore")return null;
 return <details className="frontier-audio" onToggle={e=>{if(e.currentTarget.open){const r=e.currentTarget.getBoundingClientRect();setPosition({left:Math.max(12,Math.min(r.left,innerWidth-312)),top:Math.max(12,Math.min(r.bottom+6,innerHeight-180))});}}}><summary>Audio</summary><div className="frontier-audio-panel" style={position}><button aria-pressed={!muted} onClick={()=>{const next=!muted;worldSound.setMuted(next);setMuted(next);useWorldStore.setState({audioEnabled:!next});}}>{muted?"Enable sound":"Mute sound"}</button><label>Volume <input aria-label="Master volume" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>{const value=+e.target.value;worldSound.setVolume(value);setVolume(value);}}/></label><output>{Math.round(volume*100)}%</output></div></details>;
}
export function WorldAudio(){const driving=useWorldStore(s=>s.isDriving),mode=useWorldStore(s=>s.mode);if(driving||mode!=="explore")return null;return <div className="frontier-world-audio"><AudioControls/></div>;}
