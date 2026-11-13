export type DossierTrackId = "motorsport" | "systems" | "aiml" | "architect";

export interface DossierMetric {
  label: string;
  value: string;
  subtext: string;
  verificationLevel: "PRODUCTION_VERIFIED" | "BENCHMARK_PROVED" | "CRYPTOGRAPHIC_AUDIT";
}

export interface DossierProjectProof {
  id: string;
  name: string;
  slug: string;
  repoUrl: string;
  commitSha: string;
  roleSummary: string;
  impactMetrics: string[];
  keyInvariants: string[];
  evidenceLayerCount: number;
}

export interface DossierArchitecturalInvariant {
  name: string;
  domain: string;
  formulationLatex: string;
  explanation: string;
  testSuite: string;
  codeLocation: string;
}

export interface DossierTrackProfile {
  id: DossierTrackId;
  title: string;
  subtitle: string;
  targetRoles: string[];
  executiveSummary: string;
  keyMetrics: DossierMetric[];
  featuredProjects: DossierProjectProof[];
  coreCompetencies: {
    primaryStack: string[];
    systemsArchitecture: string[];
    mathematicalModeling: string[];
    reliabilityAndQA: string[];
  };
  architecturalInvariants: DossierArchitecturalInvariant[];
  hiringCommitteeRationale: {
    technicalMaturity: string;
    executionSpeed: string;
    domainDifferentiation: string;
    recommendedLevel: string;
  };
}

export interface CandidateDossierManifest {
  candidateName: string;
  degree: string;
  institution: string;
  location: string;
  canonicalOrigin: string;
  githubProfile: string;
  email: string;
  linkedin: string;
  dossierVersion: string;
  generatedDate: string;
  activeTrack: DossierTrackId;
  tracks: Record<DossierTrackId, DossierTrackProfile>;
}

