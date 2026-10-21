import { create } from "zustand";
import type { CameraMode } from "@/types/world";

interface CameraState {
  cameraMode: CameraMode;
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  isTransitioning: boolean;
  transitionProgress: number;

  setCameraMode: (mode: CameraMode) => void;
  setTargetTransform: (
    position: [number, number, number],
    lookAt: [number, number, number]
  ) => void;
  setTransitioning: (transitioning: boolean) => void;
  setTransitionProgress: (progress: number) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  cameraMode: "boot",
  targetPosition: [0, 28, 32],
  targetLookAt: [0, 0, 0],
  isTransitioning: false,
  transitionProgress: 0,

  setCameraMode: (cameraMode) => set({ cameraMode }),
  setTargetTransform: (targetPosition, targetLookAt) =>
    set({ targetPosition, targetLookAt, isTransitioning: true }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  setTransitionProgress: (transitionProgress) => set({ transitionProgress }),
}));
