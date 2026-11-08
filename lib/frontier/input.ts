import { useWorldStore } from "@/state/worldStore";
import { useSettingsStore } from "@/state/settingsStore";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { useAdvancementStore } from "@/state/advancementStore";
export function gameplayBlocked() {
    const s = useSettingsStore.getState();
    return useWorldStore.getState().mode !== "explore" || s.minimapOpen || s.commandPaletteOpen || s.profileModalOpen || s.directoryOpen || useAdvancementStore.getState().isModalOpen || !!useInteractionRegistry.getState().activeStationModal;
}
export function typingTarget(target: EventTarget | null) {
    return target instanceof HTMLElement && !!target.closest("input,textarea,select,[contenteditable=true],[role=dialog]");
}
export const touchInput = { forward: false, backward: false, left: false, right: false, jump: false, sprint: false, lookX: 0, lookY: 0 };
