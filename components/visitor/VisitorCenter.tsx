"use client";
import { useInteractionRegistry } from "@/state/interactionRegistry";
import { guideText } from "@/lib/visitor/journeys";
import { useState } from "react";
import { VisitorJourney } from "./VisitorJourney";
import { ProjectExhibit } from "./ProjectExhibit";
import { EvidenceGallery } from "./EvidenceGallery";
import { ArchitectureMuseum } from "./ArchitectureMuseum";
import { projectEvidence } from "@/data/projectEvidence";
export function VisitorCenter({inWorld=false}:{inWorld?:boolean}){const [tab,setTab]=useState("journey"),[project,setProject]=useState(projectEvidence[0].id);return <div className="visitor-center"><nav aria-label="Campus field guide"><button onClick={()=>setTab("journey")}>Journeys</button><button onClick={()=>setTab("projects")}>Project exhibits</button><button onClick={()=>setTab("live")}>Live F1 architecture</button><button onClick={()=>setTab("ignict")}>IGNICT architecture</button><button onClick={()=>setTab("guides")}>Meet the guides</button><button onClick={()=>setTab("evidence")}>Evidence gallery</button></nav>{tab==="guides"?<section className="visitor-content">{Object.entries(guideText).map(([id,g])=><article key={id}><h2>{g.name}</h2><p>{g.intro}</p>{inWorld?<button onClick={()=>useInteractionRegistry.getState().openStationModal(`guide_${id}`)}>Talk to {g.name}</button>:<a href="/world">Visit the campus</a>}</article>)}</section>:tab==="journey"?<VisitorJourney inWorld={inWorld}/>:tab==="projects"?<><label>Project <select value={project} onChange={e=>setProject(e.target.value)}>{projectEvidence.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><ProjectExhibit key={project} projectId={project}/></>:tab==="evidence"?<EvidenceGallery/>:<ArchitectureMuseum key={tab} systemId={tab==="live"?"live-f1-intelligence":"ignict"}/>}</div>}


