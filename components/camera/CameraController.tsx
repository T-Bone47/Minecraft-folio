"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCameraStore } from "@/state/cameraStore";
import { useWorldStore } from "@/state/worldStore";

const _vPos = new THREE.Vector3();
const _vLook = new THREE.Vector3();
const _currentLook = new THREE.Vector3();

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { targetPosition, targetLookAt, isTransitioning, setTransitioning } =
    useCameraStore();
  const { mode, reducedMotion } = useWorldStore();

  const isFirstFrame = useRef(true);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (isFirstFrame.current) {
      camera.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      lookAtTarget.current.set(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
      camera.lookAt(lookAtTarget.current);
      isFirstFrame.current = false;
    }
  }, [camera, targetPosition, targetLookAt]);

  useFrame((_, delta) => {
    // If reduced motion is on, jump directly without smoothing
    if (reducedMotion) {
      camera.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      lookAtTarget.current.set(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
      camera.lookAt(lookAtTarget.current);
      if (isTransitioning) setTransitioning(false);
      return;
    }

    _vPos.set(targetPosition[0], targetPosition[1], targetPosition[2]);
    _vLook.set(targetLookAt[0], targetLookAt[1], targetLookAt[2]);

    // Framerate-independent exponential smoothing
    const posSpeed = mode === "inspect" ? 3.5 : 2.5;
    const lookSpeed = 3.0;

    const posAlpha = 1.0 - Math.exp(-posSpeed * delta);
    const lookAlpha = 1.0 - Math.exp(-lookSpeed * delta);

    camera.position.lerp(_vPos, posAlpha);
    lookAtTarget.current.lerp(_vLook, lookAlpha);

    camera.lookAt(lookAtTarget.current);

    // Check if close enough to mark transition complete
    if (isTransitioning && camera.position.distanceTo(_vPos) < 0.05) {
      setTransitioning(false);
    }
  });

  return null;
};
