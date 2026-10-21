import type { ExperienceEntry, EducationEntry } from "@/types/experience";

export const experience: ExperienceEntry[] = [
  {
    id: "independent-motorsport",
    organization: "Independent Motorsport / eSports",
    role: "Race & Strategy Engineer",
    period: "2025 — PRESENT",
    focus: [
      "Proprietary lap simulation",
      "Race strategy",
      "Telemetry / data analysis",
      "Lap performance",
      "Tyre strategy",
      "Pit-window analysis",
      "Translating model outputs into strategy decisions",
    ],
    isPersonalProject: false,
  },
  {
    id: "ignict",
    organization: "IGNICT",
    role: "AI / ML Intern",
    period: "2026 — PRESENT",
    focus: [
      "Python",
      "Data preprocessing",
      "Model development",
      "Evaluation",
      "Testing",
      "Applied technical problem solving",
    ],
    isPersonalProject: false,
  },
];

export const education: EducationEntry = {
  institution: "VIT-AP University",
  program: "Integrated M.Tech — Computer Science & Engineering",
};
