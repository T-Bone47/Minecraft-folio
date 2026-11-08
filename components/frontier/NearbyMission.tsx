"use client";
import { useWorldStore } from "@/state/worldStore";
import { useMissionStore } from "@/state/missionStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { gameplayBlocked } from "@/lib/frontier/input";
import { missions, type MissionId } from "@/lib/frontier/missions";
const stations: {
    id: MissionId;
    x: number;
    z: number;
    station: string;
    guide: string;
}[] = [{ id: "drive", x: -12, z: -8, station: "f1_car_inspect", guide: "Race engineer" }, { id: "experiment", x: 0, z: 24, station: "ml_playground", guide: "AI researcher" }, { id: "system", x: 14, z: -18, station: "pipeline_observatory", guide: "Systems engineer" }];
export function NearbyMission() { const p = useWorldStore(s => s.playerPosition), driving = useWorldStore(s => s.isDriving), progress = useMissionStore(s => s.progress); if (driving || gameplayBlocked())
    return null; const nearby = stations.find(s => Math.hypot(p[0] - s.x, p[2] - s.z) < 7); if (!nearby)
    return null; const m = missions[nearby.id]; return <aside className="frontier-nearby" aria-label="Nearby engineering mission"><small>{nearby.guide} / {m.facility}</small><strong>{m.title}</strong><span>{m.description}</span><button onClick={() => useInteractionRegistry.getState().openStationModal(nearby.station)}>Open {m.title}</button><small>{progress[nearby.id].status} · {progress[nearby.id].step}/{m.objectives.length}</small>{nearby.id === "drive" && <button onClick={() => useInteractionRegistry.getState().openStationModal("drive_debrief")}>Review last lap</button>}</aside>; }
