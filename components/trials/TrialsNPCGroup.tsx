"use client";

import React from "react";
import { ALL_TRIALS } from "@/lib/trials/scenarioRegistry";
import { EngineerNPCAvatar } from "./EngineerNPCAvatar";

export function TrialsNPCGroup() {
  return (
    <group name="Frontier-Engineering-Trials-NPCs">
      {ALL_TRIALS.map((trial) => (
        <EngineerNPCAvatar
          key={trial.npc.id}
          npc={trial.npc}
          position={[trial.npc.coordinates[0], 0.5, trial.npc.coordinates[2]]}
        />
      ))}
    </group>
  );
}

