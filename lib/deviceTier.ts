import type { DeviceTier } from "@/types/world";

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "high";

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  if (isMobile) return "mobile";

  const concurrency = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

  if (concurrency >= 8 && memory >= 8) {
    return "high";
  } else if (concurrency >= 4 && memory >= 4) {
    return "medium";
  } else {
    return "low";
  }
}
