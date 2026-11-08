"use client";
import { ChromeTrackFurniture } from "@/components/theme/ChromeCampusDetails";
import React, { useMemo, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { TRACK_RADIUS, TRACK_HALF_WIDTH } from "@/lib/frontier/drive";
import { getVoxelMaterial, getVoxelSignMaterial } from "@/lib/voxelTextures";
function Blocks({ positions, material }: {
    positions: [
        number,
        number,
        number
    ][];
    material: THREE.Material;
}) {
    const ref = useRef<THREE.InstancedMesh>(null);
    useLayoutEffect(() => { const m = new THREE.Matrix4(); positions.forEach((p, i) => { m.makeTranslation(...p); ref.current?.setMatrixAt(i, m); }); if (ref.current) {
        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.computeBoundingSphere();
    } }, [positions]);
    return <instancedMesh ref={ref} args={[undefined, undefined, positions.length]} receiveShadow><boxGeometry args={[1, 0.12, 1]}/><primitive object={material} attach="material"/></instancedMesh>;
}
export const Circuit: React.FC = () => {
    const blocks = useMemo(() => { const road: [
        number,
        number,
        number
    ][] = [], red: [
        number,
        number,
        number
    ][] = [], white: [
        number,
        number,
        number
    ][] = []; for (let x = -49; x <= 49; x++)
        for (let z = -49; z <= 49; z++) {
            const d = Math.abs(Math.hypot(x, z) - TRACK_RADIUS);
            if (d <= TRACK_HALF_WIDTH)
                road.push([x, 0.56, z]);
            else if (d <= TRACK_HALF_WIDTH + 0.8)
                (Math.floor(Math.atan2(z, x) * 20) % 2 === 0 ? red : white).push([x, 0.62, z]);
        } return { road, red, white }; }, []);
    return <group><ChromeTrackFurniture/><Blocks positions={blocks.road} material={getVoxelMaterial("asphalt")}/><Blocks positions={blocks.red} material={getVoxelMaterial("chrome_red")}/><Blocks positions={blocks.white} material={getVoxelMaterial("curb_white")}/>{[0, 1, 2, 3].map(i => { const a = i * Math.PI / 2, x = -TRACK_RADIUS * Math.cos(a), z = TRACK_RADIUS * Math.sin(a); return <group key={i} position={[x, 0, z]} rotation={[0, a, 0]}><mesh position={[0, 4.5, 0]}><boxGeometry args={[7, 0.8, 0.4]}/><primitive object={getVoxelSignMaterial(i === 0 ? "FRONTIER / START" : "SECTOR " + i, "ENGINEERING CIRCUIT")} attach="material"/></mesh>{[-3.5, 3.5].map(px => <mesh key={px} position={[px, 2.3, 0]}><boxGeometry args={[0.3, 4.6, 0.3]}/><meshStandardMaterial color="#C8CDD2"/></mesh>)}<mesh position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5, 0.45]}/><meshBasicMaterial color="#F4F3EF"/></mesh></group>; })}</group>;
};
