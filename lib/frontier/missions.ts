export type MissionId = "drive" | "experiment" | "system";
export type MissionStatus = "available" | "active" | "paused" | "completed" | "failed" | "reset";
export interface MissionDefinition {
    id: MissionId;
    title: string;
    facility: string;
    description: string;
    objectives: string[];
    events: string[];
    prerequisites: MissionId[];
    projects: string[];
    reset: string;
    failure?: string;
    discoveries: string[];
}
export const missions: Record<MissionId, MissionDefinition> = {
    drive: { id: "drive", title: "The Drive", facility: "garage", description: "Validate a timed lap and explain the telemetry.", objectives: ["Inspect the chassis", "Complete all four gates in order", "Review lap telemetry"], events: ["inspect", "lap", "review"], prerequisites: [], projects: ["racemind-ai", "live-f1-intelligence"], reset: "Clear this run and return to the starting grid.", discoveries: ["Braking costs time; smooth steering preserves speed."] },
    experiment: { id: "experiment", title: "The Experiment", facility: "aiml", description: "Train a small model and evaluate unseen examples.", objectives: ["Inspect dataset and split", "Fit and evaluate a model", "Compare held-out baseline"], events: ["inspect", "evaluate", "compare"], prerequisites: [], projects: ["vyaparpulse", "ignict"], reset: "Discard fitted results.", discoveries: ["A strong training fit is not evidence of generalisation."] },
    system: { id: "system", title: "The System", facility: "telemetry", description: "Diagnose a telemetry fault and validate recovery.", objectives: ["Inspect the incident evidence", "Apply a successful repair", "Validate recovered output"], events: ["inspect", "repair", "validate"], prerequisites: [], projects: ["live-f1-intelligence", "racemind-ai"], reset: "Replay the original incident fixture.", failure: "A repair that loses valid events does not complete recovery.", discoveries: ["Transport throughput alone cannot prove data integrity."] }
};
export interface MissionProgress {
    status: MissionStatus;
    step: number;
}
export type MissionEvent = {
    type: "start" | "pause" | "resume" | "reset" | "fail";
} | {
    type: "objective";
    name: string;
};
export const initialProgress = (): MissionProgress => ({ status: "available", step: 0 });
export function transitionMission(id: MissionId, state: MissionProgress, event: MissionEvent): MissionProgress {
    if (event.type === "reset")
        return { status: "reset", step: 0 };
    if (event.type === "start" && ["available", "reset", "failed"].includes(state.status))
        return { status: "active", step: 0 };
    if (event.type === "pause" && state.status === "active")
        return { ...state, status: "paused" };
    if (event.type === "resume" && state.status === "paused")
        return { ...state, status: "active" };
    if (event.type === "fail" && state.status === "active")
        return { ...state, status: "failed" };
    if (event.type !== "objective" || state.status !== "active" || missions[id].events[state.step] !== event.name)
        return state;
    const step = state.step + 1;
    return { step, status: step === missions[id].events.length ? "completed" : "active" };
}
