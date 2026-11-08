import { create } from "zustand";
import { newDrive, type DriveState, type LapRecord } from "@/lib/frontier/drive";
interface State {
    current: DriveState;
    lastLap: LapRecord | null;
    resetToken: number;
    exitRequested: boolean;
    publish: (state: DriveState) => void;
    finish: (lap: LapRecord) => void;
    reset: () => void;
    requestExit: () => void;
    clearExit: () => void;
}
export const useDriveStore = create<State>((set) => ({ current: newDrive(), lastLap: null, resetToken: 0, exitRequested: false, publish: (current) => set({ current }), finish: (lastLap) => set({ lastLap, current: lastLap.state }), reset: () => set(s => ({ current: newDrive(), lastLap: null, resetToken: s.resetToken + 1 })), requestExit: () => set({ exitRequested: true }), clearExit: () => set({ exitRequested: false }) }));
