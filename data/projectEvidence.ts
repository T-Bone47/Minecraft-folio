import { projects } from "./projects";
export interface ProjectEvidence {
    id: string;
    name: string;
    description: string;
    problem: string;
    architecture: string;
    technologies: string[];
    implementation: string;
    outcomes: {
        value: string;
        label: string;
        grade: string;
    }[];
    dataSources: string[];
    repository?: string;
    documentation?: string;
    screenshots: string[];
    facility: string;
    missions: string[];
    review: string;
}
export const projectEvidence: ProjectEvidence[] = projects.map(p => ({ id: p.slug, name: p.title, description: p.description, problem: p.problemStatement, architecture: p.architecture.summary, technologies: p.technologies, implementation: p.implementationDetails, outcomes: (p.metrics ?? []).map(m => ({ value: m.value, label: m.label, grade: m.evidence ?? "unverified" })), dataSources: p.links.repository ? [p.links.repository] : [], repository: p.links.repository, documentation: p.links.documentation, screenshots: p.media?.items.filter(m => m.kind === "screenshot").map(m => m.src) ?? [], facility: p.facility, missions: ["racemind-ai", "live-f1-intelligence"].includes(p.slug) ? ["drive", "system"] : ["experiment"], review: p.evidenceReview?.summary ?? "Evidence pending" }));
export const supportingSources = {
    ignict: { repository: "https://github.com/T-Bone47/IGNICT", review: "Public repository was empty when inspected on 2026-11-07. No implementation or model results verified." },
    football: { repository: "https://github.com/T-Bone47/Football_OS", review: "Public source contains API, data, migrations and tests. No benchmark was reproduced here." }
};
