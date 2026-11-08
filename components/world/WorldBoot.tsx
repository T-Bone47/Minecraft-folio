"use client";

import React, { useEffect, useState } from "react";
import { useWorldStore } from "@/state/worldStore";
import { useCameraStore } from "@/state/cameraStore";
import { ProfileSpawn } from "../profile/ProfileSpawn";

export const WorldBoot: React.FC = () => {
  const { bootComplete, finishBoot, reducedMotion } = useWorldStore();
  const { setTargetTransform, setCameraMode } = useCameraStore();
  const [shouldShowProfileSpawn, setShouldShowProfileSpawn] = useState<boolean | null>(null);

  useEffect(() => {
    // Defer the intro decision until after the first stable frame so the dev
    // screenshot always has something visible to inspect first.
    if (typeof window === "undefined") return;

    let existing: string | null = null;
    try {
      existing = sessionStorage.getItem("asish_world_intro_seen");
    } catch {
      // Showing the intro is safe when session storage is unavailable.
    }
    const introVisible = existing !== "true";
    setShouldShowProfileSpawn(introVisible);

    if (!introVisible) {
      setTargetTransform([-12, 1.65, 4], [-12, 0.5, -8]);
      setCameraMode("explore");
      finishBoot();
    }
  }, [setTargetTransform, setCameraMode, finishBoot]);

  const handleEnterWorld = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("asish_world_intro_seen", "true");
      } catch {
        // Entering the world must not depend on browser storage access.
      }
    }
    setShouldShowProfileSpawn(false);
    setTargetTransform([-12, 1.65, 4], [-12, 0.5, -8]);
    setCameraMode("explore");
    finishBoot();
  };

  if (bootComplete || !shouldShowProfileSpawn) return null;

  return <ProfileSpawn onEnterWorld={handleEnterWorld} />;
};
