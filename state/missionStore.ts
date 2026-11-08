import { create } from "zustand";
import { initialProgress, transitionMission, type MissionId, type MissionEvent, type MissionProgress } from "@/lib/frontier/missions";
interface State {
    progress: Record<MissionId, MissionProgress>;
    send: (id: MissionId, event: MissionEvent) => void;
}
export const useMissionStore = create<State>((set) => ({ progress: { drive: initialProgress(), experiment: initialProgress(), system: initialProgress() }, send: (id, event) => set(s => ({ progress: { ...s.progress, [id]: transitionMission(id, s.progress[id], event) } })) }));
