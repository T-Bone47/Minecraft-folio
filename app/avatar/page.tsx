import Link from "next/link";
import AvatarClient from "./AvatarClient";
export const metadata={title:'ASISH Race Engineer — character inspection',description:'Original Chrome Era voxel engineer, shared by the live player and campus previews.'};
export default function AvatarPage(){return <main id="main-content" className="mx-auto max-w-4xl p-6 text-zinc-100"><nav className="flex gap-6 mb-6"><Link href="/world">← Explore campus</Link><Link href="/recruiter">Recruiter profile</Link></nav><h1 className="text-3xl mb-3">ASISH Race Engineer</h1><p className="mb-5 text-zinc-300">Chrome Era jacket, racing headset, wrist telemetry device and utility radio. An original ASISH character.</p><AvatarClient/></main>;}
