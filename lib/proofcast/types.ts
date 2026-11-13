/**
 * FRONTIER PROOFCAST — TYPES & DATA MODEL
 * Pillar 1 of Frontier Evolution
 *
 * Provides typed data contracts for interactive engineering documentaries:
 * 60s recruiter fast-path, 3-minute showcase, and director's cut.
 */

export type ProofCastRole = "motorsport" | "backend" | "aiml" | "data" | "software";

export type PresentationMode = "RECRUITER_60S" | "SHOWCASE_3M" | "DIRECTORS_CUT";

export interface EvidenceProof {
  repoName: string;
  repoUrl: string;
  filePath: string;
  commitSha: string;
  codeSnippet: string;
  language: string;
  highlightLines?: number[];
  explanation: string;
  verifiableCommand?: string;
}

export interface ProofCastBeat {
  id: string;
  chapter: number;
  chapterTitle: string;
  title: string;
  subtitle: string;
  narrative: string;
  timestampStart: number; // in seconds
  duration: number; // in seconds
  roleHeadline: string;
  keyMetric: {
    label: string;
    value: string;
    verified: boolean;
    unit?: string;
  };
  architectureStep: {
    subsystem: string;
    label: string;
    description: string;
  };
  evidenceProof: EvidenceProof;
  visualTag: string;
  cameraHint?: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface ProofCastStory {
  role: ProofCastRole;
  mode: PresentationMode;
  roleDisplayName: string;
  title: string;
  tagline: string;
  summary: string;
  totalDurationSeconds: number;
  beats: ProofCastBeat[];
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  activeBeatIndex: number;
  playbackSpeed: number;
  isInspecting: boolean;
  inspectedBeat: ProofCastBeat | null;
  mode: PresentationMode;
  role: ProofCastRole;
}

