"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  glowColor: string;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  phase: number;
  type: "redstone" | "xp" | "cyan" | "portal";
}

export const MinecraftAtmosphere: React.FC = () => {
  const pathname=usePathname();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if(pathname === "/world" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Palette of authentic Minecraft particles
    const particleTypes: Array<{
      color: string;
      glowColor: string;
      type: "redstone" | "xp" | "cyan" | "portal";
      weight: number;
    }> = [
      // Redstone & McLaren Papaya Embers (Majority)
      { color: "#ff8000", glowColor: "rgba(255,128,0,0.8)", type: "redstone", weight: 35 },
      { color: "#ff4400", glowColor: "rgba(255,68,0,0.8)", type: "redstone", weight: 20 },
      { color: "#ffaa33", glowColor: "rgba(255,170,51,0.7)", type: "redstone", weight: 15 },
      // Minecraft XP / Emerald Sparkles
      { color: "#80ff00", glowColor: "rgba(128,255,0,0.8)", type: "xp", weight: 15 },
      { color: "#10b981", glowColor: "rgba(16,185,129,0.8)", type: "xp", weight: 8 },
      // Cyan DRS & Stardust Motes
      { color: "#00d2be", glowColor: "rgba(0,210,190,0.8)", type: "cyan", weight: 10 },
      { color: "#38bdf8", glowColor: "rgba(56,189,248,0.7)", type: "cyan", weight: 5 },
      // Nether / Portal Purple Shimmer
      { color: "#a855f7", glowColor: "rgba(168,85,247,0.7)", type: "portal", weight: 5 },
    ];

    // Pick random weighted particle spec
    const getWeightedType = () => {
      const totalWeight = particleTypes.reduce((acc, p) => acc + p.weight, 0);
      let rand = Math.random() * totalWeight;
      for (const pt of particleTypes) {
        if (rand < pt.weight) return pt;
        rand -= pt.weight;
      }
      return particleTypes[0] || { color: "#ff8000", glowColor: "rgba(255,128,0,0.8)", type: "redstone" as const, weight: 35 };
    };

    // Instantiate 55 floating square particles
    const count = 55;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const spec = getWeightedType();
      const baseAlpha = 0.25 + Math.random() * 0.55;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        // Pixel sizes: 2px, 3px, 4px, or 5px (authentic sharp pixel blocks)
        size: Math.random() < 0.5 ? 3 : Math.random() < 0.75 ? 2 : 4,
        color: spec.color,
        glowColor: spec.glowColor,
        type: spec.type,
        vx: (Math.random() - 0.5) * 0.35,
        // Gentle upward drift like fire embers or redstone dust
        vy: -0.25 - Math.random() * 0.65,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        pulseSpeed: 0.015 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Disable image smoothing for pixel-crisp particle edges
      ctx.imageSmoothingEnabled = false;

      for (const p of particles) {
        // Move upward with gentle lateral sway
        p.y += p.vy;
        p.x += p.vx + Math.sin(time + p.phase) * 0.4;

        // Wrap around screen boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Oscillate opacity for twinkle effect
        const currentAlpha = p.baseAlpha + Math.sin(time * 2 + p.phase) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(0.95, currentAlpha));

        ctx.save();
        ctx.globalAlpha = clampedAlpha;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = p.size >= 3 ? 6 : 3;
        ctx.fillStyle = p.color;

        // Draw crisp pixel square (Minecraft block particle)
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    // Check visibility to save GPU/battery when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, [pathname]);

  if(pathname === "/world")return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Rich Volumetric Ambient Glow Highlights */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            /* Papaya Orange / Redstone Core Aura Behind Hero */
            radial-gradient(ellipse 70% 45% at 50% 12%, rgba(255, 128, 0, 0.16) 0%, transparent 70%),
            /* Cyan DRS Atmospheric Beam Top-Right */
            radial-gradient(ellipse 55% 40% at 85% 28%, rgba(0, 210, 190, 0.12) 0%, transparent 65%),
            /* Emerald XP Glow Mid-Left */
            radial-gradient(ellipse 50% 35% at 15% 55%, rgba(16, 185, 129, 0.09) 0%, transparent 60%),
            /* Warm Gold Energy Bottom-Center */
            radial-gradient(circle 600px at 50% 90%, rgba(234, 111, 0, 0.10) 0%, transparent 70%)
          `,
        }}
      />

      {/* 2. Minecraft Chunk Boundary Subtle Grid (F3+G style 64px grid with corner marks) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundSize: "64px 64px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
        }}
      />

      {/* 3. Subtle 16px Voxel Texture Grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundSize: "16px 16px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 128, 0, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 210, 190, 0.025) 1px, transparent 1px)
          `,
        }}
      />

      {/* 4. Canvas with Floating Pixel Embers & XP Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 5. Deep Cinematic Obsidian Vignette Around Screen Edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 40%, rgba(5, 5, 8, 0.6) 80%, rgba(5, 5, 8, 0.95) 100%)`,
        }}
      />
    </div>
  );
};
