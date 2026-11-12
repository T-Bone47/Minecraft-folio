/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER DIRECTOR 2.0
 * Unified Navigation Transition Controller
 *
 * Single authoritative coordinator that arbitrates:
 *  1. Camera ownership (First-Person, Third-Person, Cinematic Showcase, Facility Focus, Orbit)
 *  2. Pointer lock acquisition & safe release
 *  3. DOM focus / active element unblurring
 *  4. Coordinate grounding (terrain surface snapping) & depenetration
 *  5. Subsystem tour cancellations (stopping conflicting drone tours)
 *  6. URL query-param synchronization without page reload
 */

import { getTerrainSurfaceY, depenetrate } from "@/lib/terrainModel";
import { getFacilityById } from "@/data/facilities";
import type {
  DirectorMode,
  ExperienceId,
  EvidenceLayerId,
  NavigationState,
  NavigationTransitionRequest,
} from "./types";

export type NavigationListener = (state: NavigationState) => void;

class UnifiedNavigationController {
  private state: NavigationState = {
    currentMode: "explore",
    previousMode: "explore",
    activeExperienceId: null,
    activeStepIndex: 0,
    activeEvidenceLayer: "problem",
    isInspectorOpen: false,
    isExperienceModalOpen: false,
    isRecruiterMode: false,
    isPlaying: true,
    playbackSpeed: 1,
    lastSafePlayerPosition: [0, 1.65, 0],
    transitionInProgress: false,
  };

  private listeners: Set<NavigationListener> = new Set();
  private externalWorldSync?: (action: string, payload: unknown) => void;

  /**
   * Register an external world synchronization hook (e.g., to worldStore or cameraStore).
   */
  public registerWorldSync(syncFn: (action: string, payload: unknown) => void) {
    this.externalWorldSync = syncFn;
  }

  public getState(): Readonly<NavigationState> {
    return { ...this.state };
  }

  public subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error("[NavigationController] Listener error:", err);
      }
    });
  }

  /**
   * Safe DOM cleanup: exit pointer lock and blur any active button.
   */
  public releaseInputFocus() {
    if (typeof document !== "undefined") {
      try {
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      } catch {
        // Pointer lock exit is non-fatal if already exiting
      }
      try {
        if (
          document.activeElement &&
          document.activeElement instanceof HTMLElement
        ) {
          document.activeElement.blur();
        }
      } catch {
        // Blur is best-effort
      }
    }
  }

  /**
   * Ground and depenetrate coordinates to prevent player falling or getting stuck in walls.
   */
  public sanitizePlayerCoordinates(
    x: number,
    z: number
  ): [number, number, number] {
    const safe2D = depenetrate(x, z, 0.45);
    const surfaceY = getTerrainSurfaceY(safe2D.x, safe2D.z);
    const safeY = Math.max(0, surfaceY) + 1.65;
    return [safe2D.x, safeY, safe2D.z];
  }

  /**
   * Execute an authoritative transition.
   */
  public async executeTransition(
    req: NavigationTransitionRequest
  ): Promise<boolean> {
    if (this.state.transitionInProgress) {
      console.warn(
        "[NavigationController] Transition already in progress, queuing or ignoring",
        req.action
      );
    }

    this.state.transitionInProgress = true;
    const prevMode = this.state.currentMode;

    try {
      switch (req.action) {
        case "ENTER_EXPLORATION": {
          this.releaseInputFocus();
          this.state.previousMode = prevMode;
          this.state.currentMode = "explore";
          this.state.isInspectorOpen = false;
          this.state.isExperienceModalOpen = false;

          // Notify external world store to switch to explore
          if (this.externalWorldSync) {
            this.externalWorldSync("SET_WORLD_MODE", "explore");
            this.externalWorldSync("STOP_DRONE_TOUR", null);
          }
          this.syncUrlParams({ mode: "explore" });
          break;
        }

        case "START_SHOWCASE": {
          this.releaseInputFocus();
          const expId = req.experienceId || "motorsport";
          this.state.previousMode = prevMode;
          this.state.currentMode = "showcase";
          this.state.activeExperienceId = expId;
          this.state.activeStepIndex = req.stepIndex ?? 0;
          this.state.isInspectorOpen = false;
          this.state.isExperienceModalOpen = false;
          this.state.isRecruiterMode = Boolean(req.recruiterMode);
          this.state.isPlaying = true;

          if (this.externalWorldSync) {
            this.externalWorldSync("STOP_DRONE_TOUR", null);
            this.externalWorldSync("SET_WORLD_MODE", "cinematic");
          }
          this.syncUrlParams({
            experience: expId,
            mode: "showcase",
            step: this.state.activeStepIndex,
          });
          break;
        }

        case "STEP_SHOWCASE": {
          if (req.stepIndex !== undefined) {
            this.state.activeStepIndex = req.stepIndex;
            this.syncUrlParams({
              experience: this.state.activeExperienceId || "motorsport",
              mode: "showcase",
              step: this.state.activeStepIndex,
            });
          }
          break;
        }

        case "SKIP_SHOWCASE": {
          // Immediately transition to Engineering Proof mode for the active experience
          this.releaseInputFocus();
          this.state.previousMode = prevMode;
          this.state.currentMode = "proof";
          this.state.isInspectorOpen = true;
          this.state.activeEvidenceLayer = req.evidenceLayer || "problem";

          this.syncUrlParams({
            experience: this.state.activeExperienceId || "motorsport",
            mode: "proof",
            layer: this.state.activeEvidenceLayer,
          });
          break;
        }

        case "OPEN_EVIDENCE": {
          this.releaseInputFocus();
          this.state.previousMode = prevMode;
          this.state.currentMode = "proof";
          this.state.isInspectorOpen = true;
          if (req.experienceId) {
            this.state.activeExperienceId = req.experienceId;
          }
          if (req.evidenceLayer) {
            this.state.activeEvidenceLayer = req.evidenceLayer;
          }

          this.syncUrlParams({
            experience: this.state.activeExperienceId || "motorsport",
            mode: "proof",
            layer: this.state.activeEvidenceLayer,
          });
          break;
        }

        case "SWITCH_EVIDENCE_LAYER": {
          if (req.evidenceLayer) {
            this.state.activeEvidenceLayer = req.evidenceLayer;
            this.syncUrlParams({
              experience: this.state.activeExperienceId || "motorsport",
              mode: "proof",
              layer: this.state.activeEvidenceLayer,
            });
          }
          break;
        }

        case "CLOSE_EVIDENCE": {
          this.releaseInputFocus();
          this.state.isInspectorOpen = false;
          this.state.currentMode = "explore";
          if (this.externalWorldSync) {
            this.externalWorldSync("SET_WORLD_MODE", "explore");
          }
          this.syncUrlParams({ mode: "explore" });
          break;
        }

        case "FAST_TRAVEL": {
          this.releaseInputFocus();
          let targetX = 0;
          let targetZ = 0;

          if (req.facilityId) {
            const fac = getFacilityById(req.facilityId);
            if (fac) {
              targetX = fac.approachPosition[0];
              targetZ = fac.approachPosition[2];
            }
          } else if (req.targetPosition) {
            targetX = req.targetPosition[0];
            targetZ = req.targetPosition[2];
          }

          const safePos = this.sanitizePlayerCoordinates(targetX, targetZ);
          this.state.lastSafePlayerPosition = safePos;
          this.state.currentMode = "explore";
          this.state.isInspectorOpen = false;
          this.state.isExperienceModalOpen = false;

          if (this.externalWorldSync) {
            this.externalWorldSync("STOP_DRONE_TOUR", null);
            this.externalWorldSync("TELEPORT_PLAYER", safePos);
            this.externalWorldSync("SET_WORLD_MODE", "explore");
          }
          break;
        }

        case "RESET_TO_SPAWN": {
          this.releaseInputFocus();
          const spawnPos = this.sanitizePlayerCoordinates(0, 0);
          this.state.lastSafePlayerPosition = spawnPos;
          this.state.currentMode = "explore";
          this.state.isInspectorOpen = false;
          this.state.isExperienceModalOpen = false;

          if (this.externalWorldSync) {
            this.externalWorldSync("STOP_DRONE_TOUR", null);
            this.externalWorldSync("TELEPORT_PLAYER", spawnPos);
            this.externalWorldSync("SET_WORLD_MODE", "explore");
          }
          break;
        }

        default:
          break;
      }

      this.state.transitionInProgress = false;
      this.notify();
      return true;
    } catch (err) {
      console.error("[NavigationController] Transition failed:", err);
      this.state.transitionInProgress = false;
      this.notify();
      return false;
    }
  }

  public setExperienceModalOpen(open: boolean) {
    this.releaseInputFocus();
    this.state.isExperienceModalOpen = open;
    this.notify();
  }

  public setInspectorOpen(open: boolean) {
    this.releaseInputFocus();
    this.state.isInspectorOpen = open;
    if (open) {
      this.state.currentMode = "proof";
    } else if (this.state.currentMode === "proof") {
      this.state.currentMode = "explore";
    }
    this.notify();
  }

  public setPlaybackState(isPlaying: boolean, speed?: 1 | 1.5 | 2) {
    this.state.isPlaying = isPlaying;
    if (speed) this.state.playbackSpeed = speed;
    this.notify();
  }

  /**
   * Update browser address bar query parameters smoothly without reloading.
   */
  private syncUrlParams(params: Record<string, string | number | boolean | undefined>) {
    if (typeof window === "undefined" || !window.history) return;
    try {
      const url = new URL(window.location.href);
      Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) {
          url.searchParams.delete(k);
        } else {
          url.searchParams.set(k, String(v));
        }
      });
      window.history.replaceState(null, "", url.toString());
    } catch {
      // Best-effort in sandboxes
    }
  }
}

export const navigationController = new UnifiedNavigationController();

