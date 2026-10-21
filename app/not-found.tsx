import React from "react";
import Link from "next/link";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { siteIdentity } from "@/data/site";

export const metadata = {
  title: "SYSTEM NOT FOUND",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#f4f4f5] font-sans">
      <PortfolioNav />

      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-4 py-16"
      >
        <div className="mc-gui-box max-w-2xl w-full p-8 sm:p-12 text-center space-y-6">
          <div className="font-pixel text-[10px] uppercase tracking-widest text-[#ff8000]">
            Signal 404 // Lookup Failed
          </div>

          <h1 className="font-pixel text-2xl sm:text-4xl text-white mc-text-shadow leading-tight">
            SYSTEM NOT FOUND
          </h1>

          <p className="text-sm font-mono text-zinc-300 leading-relaxed">
            The requested engineering system could not be located. The block
            coordinates in the request do not correspond to anything built in
            this world.
          </p>

          <div className="mc-slot-box p-4 font-mono text-[11px] text-zinc-400 text-left space-y-1.5">
            <div>&gt; RESOLVING ROUTE...</div>
            <div className="text-red-400">&gt; ERROR: no matching facility</div>
            <div>&gt; FALLBACK: engineering world index</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/world"
              className="mc-btn-gold px-5 py-3 text-xs flex items-center gap-2"
            >
              RETURN TO WORLD
            </Link>
            <Link href="/work" className="mc-btn-stone px-4 py-3 text-xs">
              ENGINEERING INDEX
            </Link>
            <a
              href={`mailto:${siteIdentity.social.email}`}
              className="mc-btn-emerald px-4 py-3 text-xs"
            >
              EMAIL ASISH
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}