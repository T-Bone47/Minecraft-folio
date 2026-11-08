"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/state/worldStore";
import { worldSound } from "@/lib/audio";

interface TourWaypoint {
  pos: [number, number, number];
  lookAt: [number, number, number];
  title: string;
  facility: string;
  subtitle: string;
  tags: string[];
}

export const TOUR_WAYPOINTS: TourWaypoint[] = [
  {
    pos: [0, 15, 26],
    lookAt: [0, 2, 0],
    title: "CAMPUS CENTRAL PLAZA",
    facility: "Central Landmark",
    subtitle: "3D Voxel Motorsport & AI Engineering Frontier",
    tags: ["Three.js", "R3F", "TypeScript", "Next.js"],
  },
  {
    pos: [-12, 6.5, 6],
    lookAt: [-12, 1.2, -8],
    title: "RACE ENGINEERING GARAGE",
    facility: "RaceMind-AI",
    subtitle: "Modernised Chrome Era simulator with recorded lap telemetry",
    tags: ["Fixed-step model", "Lap telemetry", "Original voxel car", "Web Audio"],
  },
  {
    pos: [14, 11, -8],
    lookAt: [14, 4, -18],
    title: "LIVE TELEMETRY TOWER",
    facility: "Live F1 Intelligence",
    subtitle: "Source-backed ingestion architecture and a local fault-recovery mission",
    tags: ["Canonical events", "Validation", "Replay", "Source evidence"],
  },
  {
    pos: [22, 7.5, 18],
    lookAt: [22, 2.2, 8],
    title: "VEHICLE SIMULATION LAB",
    facility: "F1 Lap-Time Simulator",
    subtitle: "Numerical Quasi-Static Lap-Time Prediction & G-G Diagram Analysis",
    tags: ["Numerical Methods", "Quasi-Static", "G-G Diagram", "Vehicle Modeling"],
  },
  {
    pos: [-12, 9, 6],
    lookAt: [-12, 3, 14],
    title: "TEAM OPERATIONS HQ",
    facility: "F1 Race Manager",
    subtitle: "Strategy exhibits and an in-development race-management project",
    tags: ["Strategy", "Project scope", "Design decisions", "Evidence"],
  },
  {
    pos: [0, 9, 15],
    lookAt: [0, 3, 24],
    title: "AI & ML RESEARCH LAB",
    facility: "VyaparPulse · SAKSHAM · EA FC OS",
    subtitle: "Seeded datasets, fitted local models, held-out evaluation and baselines",
    tags: ["Classification", "Regression", "Forecasting", "Evaluation"],
  },
  {
    pos: [-15, 10, -13],
    lookAt: [-26, 4, -22],
    title: "ENGINEERING HQ MONOLITH",
    facility: "Asish Oliver M Credentials",
    subtitle: "Asish Oliver M · Integrated M.Tech CSE student at VIT-AP",
    tags: ["VIT-AP", "M.Tech CSE", "Full-Stack", "High-Performance Computing"],
  },
];

export const TOUR_DURATION_SECONDS = 42;

export const DroneTourCamera: React.FC = () => {
  const isDroneTourActive = useWorldStore((s) => s.isDroneTourActive);
  const stopDroneTour = useWorldStore((s) => s.stopDroneTour);
  const setPlayerPosition = useWorldStore((s) => s.setPlayerPosition);
  const { camera } = useThree();

  const elapsed = useRef(0);

  // Build Catmull-Rom Splines for camera position and lookAt
  const { posSpline, lookSpline } = useMemo(() => {
    const posPoints = TOUR_WAYPOINTS.map((w) => new THREE.Vector3(...w.pos));
    const lookPoints = TOUR_WAYPOINTS.map((w) => new THREE.Vector3(...w.lookAt));

    // Close the loop smoothly back to start
    posPoints.push(new THREE.Vector3(...TOUR_WAYPOINTS[0]!.pos));
    lookPoints.push(new THREE.Vector3(...TOUR_WAYPOINTS[0]!.lookAt));

    const pSpline = new THREE.CatmullRomCurve3(posPoints, false, "catmullrom", 0.4);
    const lSpline = new THREE.CatmullRomCurve3(lookPoints, false, "catmullrom", 0.4);

    return { posSpline: pSpline, lookSpline: lSpline };
  }, []);

  useEffect(() => {
    if (isDroneTourActive) {
      elapsed.current = 0;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" || e.code === "Escape") {
          e.preventDefault();
          worldSound.playClick();
          stopDroneTour();
          setPlayerPosition([0, 1.65, 5]);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isDroneTourActive, stopDroneTour, setPlayerPosition]);

  useFrame((_, delta) => {
    if (!isDroneTourActive) return;

    elapsed.current += delta;
    const progress = Math.min(1.0, elapsed.current / TOUR_DURATION_SECONDS);

    // Sample camera spline
    const currentCamPos = posSpline.getPoint(progress);
    const currentLookAt = lookSpline.getPoint(progress);

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // When tour finishes
    if (progress >= 1.0) {
      stopDroneTour();
      setPlayerPosition([0, 1.65, 5]);
      worldSound.playClick();
    }
  });

  return null;
};

