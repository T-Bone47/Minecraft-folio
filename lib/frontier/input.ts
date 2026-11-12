import { useWorldStore } from "@/state/worldStore";
import { useSettingsStore } from "@/state/settingsStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useAdvancementStore } from "@/state/advancementStore";
import { useXRayStore } from "@/state/xrayStore";
import { navigationController } from "@/lib/frontierDirector/navigationController";

export function gameplayBlocked() {
    const s = useSettingsStore.getState();
    const director = navigationController.getState();
    return (
        useWorldStore.getState().mode !== "explore" ||
        director.currentMode !== "explore" ||
        director.isInspectorOpen ||
        director.isExperienceModalOpen ||
        s.minimapOpen ||
        s.commandPaletteOpen ||
        s.profileModalOpen ||
        s.directoryOpen ||
        useAdvancementStore.getState().isModalOpen ||
        useXRayStore.getState().isModalOpen ||
        !!useInteractionRegistry.getState().activeStationModal
    );
}
export function typingTarget(target: EventTarget | null) {
    return target instanceof HTMLElement && !!target.closest("input,textarea,select,[contenteditable=true],[role=dialog]");
}
export const touchInput = { forward: false, backward: false, left: false, right: false, jump: false, sprint: false, lookX: 0, lookY: 0 };
