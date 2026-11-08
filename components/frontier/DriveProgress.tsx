"use client";
import { useDriveStore } from "@/state/driveStore";
export function DriveProgress() { const s = useDriveStore(v => v.current); return <div className="frontier-drive-progress" data-testid="drive-state" data-x={s.x} data-z={s.z} data-yaw={s.yaw} data-speed={s.speed} data-progress={s.progress}><strong>THE DRIVE</strong><span>{s.time.toFixed(2)} s · Gate {Math.min(s.nextGate, 4)}/4 · {(Math.max(0, s.progress) / (Math.PI * 2) * 100).toFixed(0)}%</span><span>W accelerate · S brake / reverse · A/D steer · Space brake · R reset</span><button onClick={() => useDriveStore.getState().reset()}>Reset vehicle</button><small>Modernised Chrome Era simulator · fictional circuit · no gear/RPM model · C camera</small></div>; }

