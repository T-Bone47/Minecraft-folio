import { create } from "zustand";
export const useCockpitStore=create<{mode:"chase"|"cockpit";fov:number;seat:number;key:string;toggle:()=>void;configure:(v:{fov?:number;seat?:number;key?:string})=>void}>(set=>({mode:"chase",fov:70,seat:0,key:"KeyC",toggle:()=>set(s=>({mode:s.mode==="chase"?"cockpit":"chase"})),configure:v=>set(v)}));
