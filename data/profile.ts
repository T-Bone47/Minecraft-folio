export interface SystemAvailability {
  system: string;
  status: "ONLINE" | "READY" | "STANDBY";
  bars: number; // 1 to 10 block bars
}

export interface ProfileExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface ProfileData {
  name: string;
  roles: string[];
  statement: string;
  location: {
    city: string;
    state: string;
    country: string;
    display: string;
  };
  education: {
    institution: string;
    degree: string;
    specialization: string;
  };
  focusAreas: string[];
  experience: ProfileExperience[];
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
  systemStatus: SystemAvailability[];
  avatar: {
    src: string;
    alt: string;
  };
  metadata: {
    discipline: string;
    world: string;
    year: string;
  };
}

export const profileData: ProfileData = {
  name: "ASISH OLIVER M",
  roles: ["MOTORSPORT SOFTWARE ENGINEER", "AI / ML ENGINEER"],
  statement:
    "Building software, simulation, telemetry and intelligent systems for engineering problems.",
  location: {
    city: "Trichy",
    state: "Tamil Nadu",
    country: "India",
    display: "TRICHY · TAMIL NADU · INDIA",
  },
  education: {
    institution: "VIT-AP UNIVERSITY",
    degree: "INTEGRATED M.TECH",
    specialization: "COMPUTER SCIENCE & ENGINEERING",
  },
  focusAreas: [
    "MOTORSPORT SOFTWARE",
    "TELEMETRY",
    "SIMULATION",
    "AI / ML",
    "RACE ENGINEERING",
    "INTELLIGENT SYSTEMS",
  ],
  experience: [
    {
      title: "Race & Strategy Engineer",
      company: "Independent Motorsport / eSports",
      period: "2025 — PRESENT",
      description:
        "High-throughput telemetry processing, real-time stint degradation analysis, and automated race engineer decision models.",
    },
    {
      title: "AI / ML Intern",
      company: "IGNICT",
      period: "2026 — PRESENT",
      description:
        "Machine learning pipelines, unsupervised player embeddings, feature engineering, and offline speech-to-text integration.",
    },
  ],
  links: {
    github: "https://github.com/T-Bone47",
    linkedin: "https://www.linkedin.com/in/asish-oliver-56b454324",
    email: "dreamteamoliver@gmail.com",
  },
  systemStatus: [
    { system: "SOFTWARE", status: "READY", bars: 10 },
    { system: "SIMULATION", status: "READY", bars: 10 },
    { system: "TELEMETRY", status: "READY", bars: 10 },
    { system: "AI / ML", status: "READY", bars: 10 },
  ],
  avatar: {
    src: "/world/avatar/asish-oliver-avatar.png",
    alt: "Voxel avatar representing Asish Oliver M",
  },
  metadata: {
    discipline: "MOTORSPORT SOFTWARE · AI / ML",
    world: "ENGINEERING WORLD",
    year: "2026",
  },
};
