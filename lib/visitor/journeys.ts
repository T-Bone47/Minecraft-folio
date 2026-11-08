import { facilities } from "@/data/facilities";
export type JourneyId = "recruiter" | "developer" | "aiml" | "enthusiast" | "explorer";
export type TourLength = "short" | "long";
export const journeys: Record<JourneyId,{name:string;description:string;short:string[];long:string[]}> = {
 recruiter:{name:"Recruiter",description:"Meet Asish, inspect evidence, then reach resume and contact.",short:["hq","telemetry","garage"],long:["hq","telemetry","garage","aiml","simulation"]},
 developer:{name:"Developer",description:"Trace architecture, inspect implementation and review tests and limitations.",short:["telemetry","aiml","hq"],long:["telemetry","aiml","simulation","operations","hq"]},
 aiml:{name:"AI/ML engineer",description:"Inspect dataset splits, evaluate fitted models and baselines, then examine reproducibility, inference boundaries and source evidence.",short:["aiml","telemetry","hq"],long:["aiml","telemetry","simulation","hq"]},
 enthusiast:{name:"Motorsport engineer",description:"Drive a lap, inspect cockpit controls and sector traces, then review vehicle-model limits, race strategy and telemetry evidence.",short:["garage","aiml","telemetry"],long:["garage","simulation","aiml","telemetry","operations"]},
 explorer:{name:"Explorer",description:"Meet the campus guides and discover the engineering facilities.",short:["garage","telemetry","aiml"],long:facilities.map(f=>f.id)}
};
export const guideText:Record<string,{name:string;intro:string;station:string}>={
 hq:{name:"Campus guide",intro:"Start with the professional profile, then inspect the evidence gallery. The direct recruiter page includes education, experience and contact.",station:"visitor_gallery"},
 garage:{name:"Motorsport engineer",intro:"Inspect the original voxel chassis. Drive through four ordered gates, then compare your measured sectors with the reference.",station:"f1_car_inspect"},
 telemetry:{name:"Systems engineer",intro:"Follow provider data through the architecture exhibit. Then diagnose a fault in the local event-pipeline mission.",station:"pipeline_observatory"},
 aiml:{name:"AI researcher",intro:"Inspect the dataset split before training. Compare holdout metrics with a baseline; synthetic results do not prove external project accuracy.",station:"ml_playground"},
 simulation:{name:"Simulation guide",intro:"Inspect the lap model and its limitations. The driving demonstration uses a simpler model than the linked solver project.",station:"simulation_runner"},
 operations:{name:"Strategy guide",intro:"Inspect the project decisions and current scope. The race-manager project remains in development.",station:"strategy_board"}
};
export function tourRoute(id:JourneyId,length:TourLength){return journeys[id][length];}
export function reachedFacility(id:string,p:readonly number[]){const f=facilities.find(f=>f.id===id);return !!f && Math.hypot(p[0]-f.approachPosition[0],p[2]-f.approachPosition[2])<6;}
