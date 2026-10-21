import type { FacilityLocation } from "@/types/world";

/**
 * Facility geometry is declared once here and consumed by every consumer:
 * the terrain generator (to flatten building pads), the first-person
 * controller (to resolve collision), the cartographer map (to place pins) and
 * the camera rig (to frame shots). Anchoring `coordinates`, `pad` and
 * `collision` together is what keeps them from drifting apart.
 */
export const facilities: FacilityLocation[] = [
  {
    id: "garage",
    name: "Race Engineering Garage",
    code: "FAC-01 / GAR",
    tagline: "Race Strategy, Sim Telemetry & AI Co-Engineering",
    discipline: "Race Engineering & Telemetry Abstraction",
    projectSlug: "racemind-ai",
    coordinates: [-12, 0, -8],
    cameraPosition: [-12, 3.2, 0],
    cameraTarget: [-12, 1.4, -8],
    colorAccent: "#EF4444", // Racing Red
    accentRgb: [0.937, 0.267, 0.267],
    description: "Pit-lane engineering facility housing the telemetry bridge, live strategy board, and original voxel single-seater F1 car.",
    features: [
      "Voxel Single-Seater F1 Chassis Stand",
      "Game-Agnostic UDP Telemetry Terminal",
      "Tyre Thermal & Stint Degradation Monitor",
      "Live Strategy / Pit Window Interface",
    ],
    pad: [-19, -5, -16, 0],
    collision: [
      // Rear wall.
      { minX: -18.5, maxX: -5.5, minZ: -15.5, maxZ: -14 },
      // Side walls, leaving a wide pit-facing doorway between them.
      { minX: -18.5, maxX: -17, minZ: -14, maxZ: 1 },
      { minX: -7, maxX: -5.5, minZ: -14, maxZ: 1 },
    ],
  },
  {
    id: "telemetry",
    name: "Telemetry Tower / Race Control",
    code: "FAC-02 / CTL",
    tagline: "High-Throughput Distributed F1 Telemetry Ingestion",
    discipline: "Event Streaming & Real-Time Distributed Systems",
    projectSlug: "live-f1-intelligence",
    coordinates: [14, 0, -18],
    cameraPosition: [14, 5.5, -9],
    cameraTarget: [14, 4.0, -18],
    colorAccent: "#3B82F6", // Telemetry Cyan/Blue
    accentRgb: [0.231, 0.510, 0.965],
    description: "Multilevel timing gantry and race control center ingesting canonical events across four live telemetry providers.",
    features: [
      "1,067,193 Canonical Event Processing Tower",
      "~2,650 Events/Sec Real-Time Ingestion Gantry",
      "Multi-Provider Signal Stream (OpenF1, FastF1, Jolpica, SignalR)",
      "Real-Time Battle Detection & Degradation Core",
    ],
    pad: [8, 20, -24, -12],
    collision: [
      {
        minX: 10,
        maxX: 18,
        minZ: -22,
        maxZ: -14,
        // Race-control doorway on the track-facing (south) elevation.
        doorways: [{ axis: "x", from: 13, to: 15 }],
      },
    ],
  },
  {
    id: "simulation",
    name: "Vehicle Simulation Lab",
    code: "FAC-03 / SIM",
    tagline: "Numerical Quasi-Static Vehicle Performance Modelling",
    discipline: "Applied Mathematics & Vehicle Dynamics",
    projectSlug: "f1-lap-time-simulator",
    coordinates: [22, 0, 8],
    cameraPosition: [16, 4.5, 15],
    cameraTarget: [22, 2.2, 8],
    colorAccent: "#10B981", // Aero Emerald
    accentRgb: [0.063, 0.725, 0.506],
    description: "Vehicle performance research cell dedicated to solving lap times via friction circles, aero sensitivity, and grip envelopes.",
    features: [
      "Quasi-Static Point-Mass Lap Solver",
      "G-G Friction Circle Visualization",
      "Corner Apex Velocity & Deceleration Traces",
      "Aero Balance & Downforce Decompositions",
    ],
    pad: [15, 29, 2, 14],
    collision: [
      {
        minX: 17,
        maxX: 27,
        minZ: 4,
        maxZ: 12,
        // Entrance on the footpath-facing (west) elevation.
        doorways: [{ axis: "z", from: 7, to: 9 }],
      },
    ],
  },
  {
    id: "operations",
    name: "Team Operations HQ",
    code: "FAC-04 / OPS",
    tagline: "F1 Team Management & Strategic Decision Systems",
    discipline: "Simulation Game Architecture & Strategic Modelling",
    projectSlug: "f1-race-manager",
    coordinates: [-12, 0, 14],
    cameraPosition: [-4, 4.5, 20],
    cameraTarget: [-12, 2.0, 14],
    colorAccent: "#F59E0B", // Strategy Amber
    accentRgb: [0.961, 0.620, 0.043],
    description: "Strategic headquarters orchestrating race weekend operations, weather radar, tyre allocation, and team resource trees.",
    features: [
      "Race Weekend Strategy Wall",
      "Live Radar & Weather Volatility Array",
      "Safety Car & VSC Reaction Matrix",
      "Deterministic Unity Simulation Engine",
    ],
    pad: [-19, -5, 8, 20],
    collision: [
      {
        minX: -17,
        maxX: -7,
        minZ: 10,
        maxZ: 18,
        // South-facing entrance reached from the Garage footpath.
        doorways: [{ axis: "x", from: -13, to: -11 }],
      },
    ],
  },
  {
    id: "aiml",
    name: "AI / Data Intelligence Lab",
    code: "FAC-05 / ML",
    tagline: "Data Pipelines, Feature Engineering & Machine Learning",
    discipline: "Machine Learning & Natural Language Pipelines",
    projectSlug: "ea-fc-intelligence",
    coordinates: [0, 0, 24],
    cameraPosition: [0, 5.0, 15],
    cameraTarget: [0, 2.5, 24],
    colorAccent: "#8B5CF6", // Neural Purple
    accentRgb: [0.545, 0.361, 0.965],
    description: "Twin-cluster AI facility housing the EA FC player intelligence matrices and VyaparPulse offline voice-to-forecast pipelines.",
    features: [
      "EA FC Player Vector Representation Server",
      "VyaparPulse Vosk Offline Audio Ingestion Engine",
      "XGBoost Revenue Forecasting Node",
      "FastAPI Ledger & Reconciliation Core",
    ],
    pad: [-9, 9, 18, 30],
    collision: [
      {
        minX: -7,
        maxX: 7,
        minZ: 20,
        maxZ: 28,
        // Twin-wing entrance on the footpath-facing (north) elevation.
        doorways: [{ axis: "x", from: -2, to: 2 }],
      },
    ],
  },
  {
    id: "hq",
    name: "Engineering HQ & Command Monolith",
    code: "FAC-00 / HQ",
    tagline: "Engineering Trajectory, Systems Arsenal & Direct Contact",
    discipline: "Core Systems & Professional Trajectory",
    coordinates: [-26, 0, -22],
    cameraPosition: [-18, 5.5, -14],
    cameraTarget: [-26, 3.0, -22],
    colorAccent: "#06B6D4", // Engineering Cyan
    accentRgb: [0.024, 0.714, 0.831],
    description: "Central command monolith detailing professional engineering experience, system architecture principles, and communication terminals.",
    features: [
      "Motorsport Engineering Career Timeline",
      "Technical Arsenal & Software Stack Matrix",
      "Direct Terminal Uplink (dreamteamoliver@gmail.com)",
      "Return to Canonical Engineering Portfolio Portal",
    ],
    pad: [-33, -19, -28, -14],
    collision: [
      {
        minX: -32,
        maxX: -20,
        minZ: -27,
        maxZ: -15,
        // East-facing entrance facing the campus footpath.
        doorways: [{ axis: "z", from: -22, to: -20 }],
      },
    ],
  },
];

export const getFacilityById = (id: string): FacilityLocation | undefined =>
  facilities.find((f) => f.id === id);

export const getFacilityByProjectSlug = (slug: string): FacilityLocation | undefined =>
  facilities.find((f) => f.projectSlug === slug);
