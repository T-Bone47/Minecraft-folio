"use client";
import dynamic from "next/dynamic";
import React, {useEffect,useState} from "react";
import Image from "next/image";
import { profileData } from "@/data/profile";
const Preview=dynamic(()=>import('@/components/avatar/AvatarPreview'),{ssr:false,loading:()=> <p>Loading character preview…</p>});
function Portrait(){return <figure><Image src={profileData.avatar.src} alt={profileData.avatar.alt} width={300} height={480}/><figcaption>3D preview unavailable. The portrait shows the same ASISH Race Engineer model.</figcaption></figure>;}
class PreviewBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<Portrait/>:this.props.children;}
}
export default function AvatarClient(){
 const [supported,setSupported]=useState<boolean|null>(null);
 useEffect(()=>{try{const canvas=document.createElement('canvas'),context=canvas.getContext('webgl2');setSupported(!!context);context?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setSupported(false);}},[]);
 if(supported===null)return <p>Checking character preview…</p>;
 return supported?<PreviewBoundary><Preview/></PreviewBoundary>:<Portrait/>;
}
