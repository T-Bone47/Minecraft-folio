export interface AvatarPose { phase:number; leftLeg:number; rightLeg:number; leftArm:number; rightArm:number; lean:number; bob:number; landing:number; grounded:boolean }
export const createAvatarPose=():AvatarPose=>({phase:0,leftLeg:0,rightLeg:0,leftArm:0,rightArm:0,lean:0,bob:0,landing:0,grounded:true});
export function stepAvatarPose(p:AvatarPose,dt:number,speed:number,grounded:boolean,vy:number,interacting=false,reduced=false){
 dt=Math.max(0,Math.min(.1,dt)); const blend=1-Math.exp(-16*dt);
 if(grounded&&!p.grounded)p.landing=1;
 p.grounded=grounded;p.landing=Math.max(0,p.landing-dt*6);
 p.phase+=dt*(speed>.08?speed*3.4:1.8);
 const swing= Math.sin(p.phase)*Math.min(.72,speed*.1);
 const leg=grounded?swing:(vy>0?-.42:-.18);
 p.leftLeg+=(leg-p.leftLeg)*blend;p.rightLeg+=((grounded?-swing:.3)-p.rightLeg)*blend;
 p.leftArm+=((interacting?-.9:grounded?-swing*.75:.4)-p.leftArm)*blend;
 p.rightArm+=((interacting?-1.1:grounded?swing*.75:.4)-p.rightArm)*blend;
 p.lean+=((grounded?Math.min(.12,speed*.016):vy>0?-.08:.1)-p.lean)*blend;
 p.bob=reduced?0:grounded?(speed>.08?Math.abs(Math.sin(p.phase))*.018:Math.sin(p.phase)*.004)-p.landing*.035:0;
 return p;
}
