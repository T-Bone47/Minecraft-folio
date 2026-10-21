import * as THREE from "three";

/**
 * Traverses a Three.js object hierarchy and safely disposes geometries,
 * materials, and textures without leaking GPU memory.
 */
export function disposeHierarchy(object: THREE.Object3D): void {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(mesh.material);
        }
      }
    }
  });
}

function disposeMaterial(material: THREE.Material): void {
  material.dispose();
  for (const key of Object.keys(material)) {
    const value = (material as unknown as Record<string, unknown>)[key];
    if (value && typeof value === "object" && "isTexture" in value && value.isTexture) {
      (value as THREE.Texture).dispose();
    }
  }
}
