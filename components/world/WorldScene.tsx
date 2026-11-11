"use client";

import { ChromeEnvironment } from "./ChromeEnvironment";
import { WorldRenderBudget } from "./WorldRenderBudget";
import { VisitorWorldDisplays } from "@/components/visitor/VisitorWorld";
import { FieldGuides } from "@/components/frontier/FieldGuides";
import React from "react";
import { VoxelSky } from "./VoxelSky";
import { VoxelTerrain } from "../terrain/VoxelTerrain";
import { Circuit } from "../terrain/Circuit";
import { F1Garage } from "../garage/F1Garage";
import { VoxelEngineerAvatar } from "../profile/VoxelEngineerAvatar";
import { TelemetryTower } from "../telemetry/TelemetryTower";
import { SimulationLab } from "../simulation/SimulationLab";
import { TeamOperationsHQ } from "../operations/TeamOperationsHQ";
import { AIMLLab } from "../aiml/AIMLLab";
import { EngineeringHQ } from "../hq/EngineeringHQ";
import { CentralPlaza } from "./CentralPlaza";
import { BlockHighlight } from "./BlockHighlight";
import { ThreeDiagnosticsTracker } from "../diagnostics/ThreeDiagnosticsTracker";
import { DriveableF1Car } from "../vehicles/DriveableF1Car";
import { DroneTourCamera } from "../camera/DroneTourCamera";
import { DigitalTwinWorldReactivity } from "./DigitalTwinWorldReactivity";
import { getFacilityById } from "@/data/facilities";
import type { FacilityLocation } from "@/types/world";
import type { QualityProfile } from "@/lib/renderQuality";

export interface WorldSceneProps {
  quality: QualityProfile;
}

/**
 * Facility components keyed by facility id.
 *
 * Each component is rendered at its facility's canonical `coordinates` from
 * `data/facilities.ts`. Hard-coding a position here previously let the Ops HQ
 * render at one spot while the map, camera rig and collision model all used
 * another — so the pin pointed at empty grass.
 */
const FACILITY_COMPONENTS: Record<
  string,
  React.ComponentType<{ position: [number, number, number] }>
> = {
  garage: F1Garage,
  telemetry: TelemetryTower,
  simulation: SimulationLab,
  operations: TeamOperationsHQ,
  aiml: AIMLLab,
  hq: EngineeringHQ,
};

function Facility({ id }: { id: string }): React.ReactElement | null {
  const Component = FACILITY_COMPONENTS[id];
  const facility: FacilityLocation | undefined = getFacilityById(id);
  if (!Component || !facility) return null;

  const [x, y, z] = facility.coordinates;
  return <Component position={[x, y, z]} />;
}

export const WorldScene: React.FC<WorldSceneProps> = ({ quality }) => {
  return (
    <>
      {/* 0. Live WebGL Renderer Diagnostics Engine */}
      <ThreeDiagnosticsTracker /><ChromeEnvironment/>
      <WorldRenderBudget quality={quality} />

      {/* 1. Minecraft Daylight Atmosphere, Sun, Sky, Clouds & Warm Lighting */}
      <VoxelSky quality={quality} />

      {/* 2. 3D Crosshair Block Selection Wireframe Outline */}
      <BlockHighlight />

      {/* 3. Stepped Voxel Ground Terrain, Trees, Pond & Campus Paths */}
      <VoxelTerrain quality={quality} />

      {/* 4. Voxel Motorsport Circuit, Curbs, Pit Wall, Timing Gantry, Grandstand */}
      <Circuit />
      <FieldGuides /><VisitorWorldDisplays />

      {/* 4b. Central Engineering Plaza Landmark & Directional Compass */}
      <CentralPlaza position={[0, 0, 0]} />
      <DigitalTwinWorldReactivity />

      {/* 4c. Driveable Voxel F1 Car (Track Test Drive Mode) */}
      <DriveableF1Car />

      {/* 4d. 45-Second Recruiter Drone Tour Spline Rig */}
      <DroneTourCamera />

      {/* 5–10. Facilities, positioned from canonical data.
              garage · telemetry · simulation · operations · aiml · hq */}
      {Object.keys(FACILITY_COMPONENTS).map((id) => (
        <Facility key={id} id={id} />
      ))}

      {/* Signature voxel engineer avatar — present at spawn and near the garage. */}
      <VoxelEngineerAvatar
        position={[-13, 0.5, -5]}
        rotation={[0, -0.35, 0]}
        scale={1}
        idlePose
      />

      {/* Avatar preview for Engineering HQ identity panel. */}
      <VoxelEngineerAvatar
        position={[-27.5, 0.53, -17.5]}
        rotation={[0, 0.15, 0]}
        scale={0.9}
      />
    </>
  );
};
