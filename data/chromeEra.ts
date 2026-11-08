/** Original ASISH identity; historical inspiration is not team affiliation. */
export const chromeEra = {
 edition:"CHROME ERA ENGINEERING CAMPUS",
 silver:"#C8CDD2",bright:"#E8EBED",red:"#D71D35",deepRed:"#A51125",
 carbon:"#171A20",graphite:"#292D34",white:"#F4F3EF",metal:"#7E8790",
 status:"#64C99B",warning:"#E9B958",data:"#79AAD4",
} as const;
export const chromeSurfaces:Record<string,{base:string;pattern:"metal"|"paint"|"carbon"|"floor"|"light"|"glass";metalness:number;roughness:number}>={
 engineer_hair:{base:"#302019",pattern:"paint",metalness:0,roughness:.9},
 engineer_skin:{base:"#D3A17B",pattern:"paint",metalness:0,roughness:.85},
 engineer_trousers:{base:chromeEra.carbon,pattern:"paint",metalness:0,roughness:.9},
 engineer_jacket:{base:chromeEra.bright,pattern:"paint",metalness:.08,roughness:.8},
 chrome_polished:{base:chromeEra.silver,pattern:"metal",metalness:.78,roughness:.24},
 chrome_brushed:{base:chromeEra.bright,pattern:"metal",metalness:.55,roughness:.43},
 chrome_graphite:{base:chromeEra.graphite,pattern:"metal",metalness:.4,roughness:.62},
 chrome_carbon:{base:chromeEra.carbon,pattern:"carbon",metalness:.2,roughness:.6},
 chrome_red:{base:chromeEra.red,pattern:"paint",metalness:.35,roughness:.38},
 chrome_floor:{base:chromeEra.metal,pattern:"floor",metalness:.28,roughness:.68},
 chrome_light:{base:chromeEra.white,pattern:"light",metalness:0,roughness:.65},
 chrome_glass:{base:"#61717C",pattern:"glass",metalness:.15,roughness:.2},
};
export const chromeCssVariables={
 "--chrome-silver":chromeEra.silver,"--chrome-bright":chromeEra.bright,"--chrome-red":chromeEra.red,
 "--chrome-deep-red":chromeEra.deepRed,"--chrome-carbon":chromeEra.carbon,"--chrome-graphite":chromeEra.graphite,
 "--chrome-white":chromeEra.white,"--chrome-metal":chromeEra.metal,
};
