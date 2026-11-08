"use client";
import { useCockpitStore } from "@/state/cockpitStore";
import { useEffect, useState, useRef } from "react";
import { touchInput } from "@/lib/frontier/input";
import { useWorldStore } from "@/state/worldStore";
export function TouchControls() { const [touch, setTouch] = useState(false), last = useRef({ x: 0, y: 0 }), mode = useWorldStore(s => s.mode), driving=useWorldStore(s=>s.isDriving); useEffect(() => { setTouch(matchMedia("(pointer: coarse)").matches); }, []); if (!touch || mode !== "explore")
    return null; return <div className={`frontier-touch ${driving?"driving-touch":""}`}><div>{([['left', '←'], ['forward', '↑'], ['backward', '↓'], ['right', '→'], ['jump', 'Jump'], ['sprint', 'Run']] as const).map(([key, label]) => <button key={key} aria-label={key} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); touchInput[key] = true; }} onPointerUp={() => { touchInput[key] = false; }} onLostPointerCapture={() => { touchInput[key] = false; }}>{driving&&key==="jump"?"Brake":label}</button>)}</div><button aria-label="Switch perspective" onClick={() => useWorldStore.getState().isDriving ? useCockpitStore.getState().toggle() : useWorldStore.getState().togglePerspective()}>View</button><button aria-label="Drag to look" onPointerDown={e => { last.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) {
    touchInput.lookX += (e.clientX - last.current.x) * 0.004;
    touchInput.lookY += (e.clientY - last.current.y) * 0.004;
    last.current = { x: e.clientX, y: e.clientY };
} }}>Drag to look</button><button onClick={() => useWorldStore.getState().nearbyTarget?.action()}>Interact</button></div>; }



