import { projects } from "./projects";
import { projectEvidence } from "./projectEvidence";
export const projectExhibits=projectEvidence.map(e=>({id:e.id,evidence:e,project:projects.find(p=>p.slug===e.id)!,levels:["Understand","Experience","Deep dive"] as const}));
