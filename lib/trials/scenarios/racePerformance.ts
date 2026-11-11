/**
 * TRIAL ONE — RACE PERFORMANCE ENGINEERING
 * "THE MISSING FOUR TENTHS"
 *
 * Location: Race Engineering Garage (canonical coords: [-12, 0, -8])
 * Lead NPC: Marcus Vance (Race Performance Lead)
 */

import type { TrialScenario } from "../types";

export const racePerformanceTrial: TrialScenario = {
  id: "race_performance_01",
  division: "race_performance",
  title: "The Missing Four Tenths",
  subtitle: "Telemetry Spatial Delta & Corner Apex Optimization",
  facilityId: "garage",
  locationName: "Race Engineering Garage & Pit Wall",
  estimatedMinutes: 3,
  provenanceLabel: "SIMULATOR-GENERATED TELEMETRY",

  npc: {
    id: "npc_marcus_vance",
    name: "Marcus Vance",
    role: "Race Performance Lead",
    division: "race_performance",
    facility: "garage",
    avatarVariant: "race",
    coordinates: [-10, 0, -5],
    dialogue: {
      greeting: "Welcome to the Race Engineering Garage. I'm Marcus Vance, Race Performance Lead.",
      briefing:
        "Our latest stint in the Frontier-01 is sitting at 73.224s — exactly 0.384 seconds off the benchmark controller pace. The driver thinks the car is lacking power down the straight, but our telemetry traces tell a different story. I need you to pinpoint where we are hemorrhaging lap time.",
      hint: "Don't just look at top speed. Inspect the distance-aligned time delta graph and compare minimum apex velocities across Turns 1 through 4.",
      duringInvestigation:
        "Check the Turn 3 hairpin telemetry. Look at where braking begins and how much speed drops at the apex.",
      onWrongHypothesis:
        "Look at the telemetry data again. Top speed on the main straight is 47.1 km/h for both cars. The power unit is delivering full kW. Focus your investigation on corner transitions.",
      onCorrectDiagnosis:
        "Spot on diagnosis. Turn 3 is where we lose 0.342 seconds. The driver is braking way too early, over-slowing the car to 32.4 km/h at apex compared to the reference 44.8 km/h.",
      onOptimalAction:
        "Superb race engineering. Shifting braking 8m deeper with smooth trail-braking projected an immediate 0.28s gain in our what-if model without unsettling the rear axle.",
      onSuboptimalAction:
        "That setup change adds drag without addressing the entry braking problem. We need an intervention that targets the Turn 3 deceleration phase directly.",
      completion:
        "Trial resolved. You diagnosed the apex speed deficit using spatial telemetry and formulated a winning engineering recommendation. Outstanding work.",
    },
  },

  briefing:
    "A completed flying lap in the Frontier-01 registered 73.224s against the benchmark reference of 72.840s (+0.384s deficit). Analyze multi-channel telemetry, identify the root cause of the lost time, and recommend an engineering adjustment.",

  initialInvestigationPrompt:
    "Inspect the spatial distance delta curve and turn-by-turn apex velocities below to isolate the sector where time loss accumulates.",

  investigationData: {
    stintLapTimeS: 73.224,
    referenceLapTimeS: 72.840,
    lapDeltaS: 0.384,
    topSpeedKmh: 47.1,
    refTopSpeedKmh: 47.1,
    straightLineDeltaS: 0.019,
    corners: [
      {
        name: "Turn 1 (North-East Sweeper)",
        approachSpeedKmh: 46.8,
        apexSpeedKmh: 44.2,
        refApexSpeedKmh: 42.1,
        timeDeltaS: -0.042, // Gained 0.042s
        observation: "Strong entry commitment; carried 2.1 km/h higher apex speed than reference.",
      },
      {
        name: "Turn 2 (South-East Chicane)",
        approachSpeedKmh: 45.1,
        apexSpeedKmh: 40.5,
        refApexSpeedKmh: 41.2,
        timeDeltaS: 0.065, // Lost 0.065s
        observation: "Minor hesitation on direction change; negligible lap deficit.",
      },
      {
        name: "Turn 3 (South-West Hairpin)",
        approachSpeedKmh: 44.8,
        apexSpeedKmh: 32.4,
        refApexSpeedKmh: 44.8,
        timeDeltaS: 0.342, // Lost 0.342s (PRIMARY DEFICIT)
        brakingOnsetM: 168.4,
        refBrakingOnsetM: 176.8, // 8.4m later
        observation: "Braking initiated 8.4m earlier than reference; car over-slowed to 32.4 km/h at apex (-12.4 km/h deficit).",
      },
      {
        name: "Turn 4 (Traction Zone to Straight)",
        approachSpeedKmh: 43.2,
        apexSpeedKmh: 41.8,
        refApexSpeedKmh: 42.0,
        timeDeltaS: 0.019,
        observation: "Clean throttle pickup onto pit straight; full acceleration reached.",
      },
    ],
  },

  hypotheses: [
    {
      id: "hypo_early_braking_t3",
      label: "Turn 3 Premature Braking & Low Apex Velocity",
      description:
        "The driver initiates braking 8.4m too early into the Turn 3 hairpin, scrubbing momentum and reducing apex velocity by 12.4 km/h, which accounts for +0.342s of the deficit.",
      isCorrect: true,
      feedback: "Correct diagnosis. 89% of the total stint deficit (+0.342s of +0.384s) is concentrated in the Turn 3 deceleration and apex phase.",
      technicalReasoning:
        "Spatial distance alignment proves that straight-line speeds are identical (47.1 km/h) and Turn 1 was actually 0.042s faster. The sole critical time-loss is Turn 3 apex speed retention.",
    },
    {
      id: "hypo_engine_derate",
      label: "Power Unit ERS Derate / Top Speed Deficit",
      description:
        "The car's electric motor or internal combustion engine is suffering energy clipping along the main straight.",
      isCorrect: false,
      feedback: "Incorrect. Telemetry shows both cars reached exactly 47.1 km/h down the main straight, with identical throttle traces.",
      technicalReasoning:
        "The driver's subjective report of 'lacking straight-line speed' is an artifact of slow corner exit speed, not a power unit output failure.",
    },
    {
      id: "hypo_aero_downforce_t1",
      label: "Insufficient Aerodynamic Downforce in Turn 1",
      description:
        "Lack of high-speed downforce causes front-axle understeer through the North-East sweeping turn.",
      isCorrect: false,
      feedback: "Incorrect. The visitor was actually 0.042s faster than the reference through Turn 1 with higher apex speed (44.2 vs 42.1 km/h).",
      technicalReasoning:
        "Modifying aero downforce for Turn 1 would compromise straight-line efficiency without solving the Turn 3 low-speed mechanical grip problem.",
    },
  ],

  actions: [
    {
      id: "act_trail_brake_t3",
      label: "Optimize Turn 3 Braking Marker & Trail-Braking Profile",
      description:
        "Instruct driver to brake 8 metres deeper into Turn 3, modulating pedal pressure to carry 42+ km/h through the apex.",
      isOptimal: true,
      consequences:
        "Simulated what-if stint model projects a 0.284s lap improvement, bringing overall lap time to 72.940s (+0.100s of benchmark) with zero aero drag penalties.",
      simulatedDeltaS: -0.284,
      tradeOffs: [
        "Slightly higher risk of front wheel lockup if trail-braking is not smooth.",
        "Requires driver focus during qualifying run.",
      ],
    },
    {
      id: "act_high_downforce_trim",
      label: "Add +2 Flap Angle Rear Aerodynamic Downforce",
      description:
        "Increase aerodynamic wing angle to boost high-speed cornering grip across the entire lap.",
      isOptimal: false,
      consequences:
        "Added aerodynamic drag reduces straight-line speed by 1.8 km/h. Turn 3 is a low-speed mechanical corner where aerodynamic downforce is negligible ($F_z \\propto v^2$). Net lap delta: +0.082s (slower).",
      simulatedDeltaS: 0.082,
      tradeOffs: [
        "Aerodynamic drag penalty on straights.",
        "Does not resolve low-speed mechanical apex understeer.",
      ],
    },
    {
      id: "act_switch_hard_tyres",
      label: "Switch to Hard Compound Tyre",
      description:
        "Equip C1 Hard compound slicks to reduce thermal sensitivity.",
      isOptimal: false,
      consequences:
        "Hard compound reduces mechanical grip coefficient $\\mu$ by 12%, lengthening Turn 3 braking distance by 6 metres and costing +0.550s per lap.",
      simulatedDeltaS: 0.550,
      tradeOffs: [
        "Severe mechanical grip deficit across all four corners.",
        "Increases lap time deficit to +0.934s.",
      ],
    },
  ],

  skillsDemonstrated: [
    "Multi-Channel Telemetry Interpretation (Speed, Throttle, Brake)",
    "Spatial Distance Alignment vs Temporal Skew",
    "Corner Segmentation & Apex Minimum Velocity Analysis",
    "Vehicle Dynamics Mechanical vs Aerodynamic Trade-Offs",
  ],

  codeReferences: [
    {
      title: "Distance-Aligned Spatial Delta Solver",
      file: "lib/digitalTwin/analysis.ts",
      description: "Piecewise linear binary search interpolation across 100 spatial bins.",
      url: "/projects/f1-lap-time-simulator",
    },
    {
      title: "Deterministic What-If Stint Predictor",
      file: "lib/digitalTwin/decisionEngine.ts",
      description: "Braking offset and lateral grip coefficient prediction model.",
      url: "/projects/racemind-ai",
    },
  ],
};

