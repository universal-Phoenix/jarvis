import React, { useEffect, useRef, useState } from "react";
import { CelestialTheme } from "../types/voice";
import { Sparkles, Sun, Moon, Orbit, Compass, Eye } from "lucide-react";
import { playJarvisBeep } from "../utils/jarvisAudio";

interface CosmicCelestialBackgroundProps {
  currentTheme: CelestialTheme;
  onThemeChange: (theme: CelestialTheme) => void;
}

export const CosmicCelestialBackground: React.FC<CosmicCelestialBackgroundProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeEra, setActiveEra] = useState<"universe" | "nebula" | "sun" | "moon">("universe");
  const [isCosmosBarCollapsed, setIsCosmosBarCollapsed] = useState(false);

  // Auto-cycle through cosmos eras if theme is 'cycle'
  useEffect(() => {
    if (currentTheme !== "cycle") {
      if (currentTheme !== "eclipse") {
        setActiveEra(currentTheme as any);
      } else {
        setActiveEra("moon");
      }
      return;
    }

    const eras: Array<"universe" | "nebula" | "sun" | "moon"> = ["universe", "nebula", "sun", "moon"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % eras.length;
      setActiveEra(eras[idx]);
    }, 18000); // 18 seconds smooth epoch cycle

    return () => clearInterval(interval);
  }, [currentTheme]);

  // Canvas starfield & celestial particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Stars
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    // Floating Stardust Dust Particles
    const dustCount = 35;
    const dust = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Render Stars
      for (const star of stars) {
        star.phase += star.speed;
        const currentAlpha = Math.sin(star.phase) * 0.4 + 0.5;

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Cosmic Floating Dust
      for (const p of dust) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle =
          activeEra === "sun"
            ? `rgba(251, 191, 36, ${p.alpha * 0.7})`
            : activeEra === "nebula"
            ? `rgba(168, 85, 247, ${p.alpha * 0.7})`
            : activeEra === "moon"
            ? `rgba(147, 197, 253, ${p.alpha * 0.6})`
            : `rgba(6, 182, 212, ${p.alpha * 0.5})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeEra]);

  return (
    <>
      {/* Dynamic Celestial Backdrop Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000 ease-in-out">
        {/* Deep base gradient */}
        <div className="absolute inset-0 bg-[#080c14]" />

        {/* 1. ERA: NEBULA */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeEra === "nebula" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px]" />
          <div className="absolute -bottom-20 left-1/4 w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[150px]" />
        </div>

        {/* 2. ERA: SUN (Solar Flare & Coronal Atmosphere) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeEra === "sun" ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Glowing Solar Core in Upper Right */}
          <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-amber-300/30 via-orange-500/20 to-transparent blur-[110px]" />
          <div className="absolute top-10 right-[28%] w-36 h-36 rounded-full bg-amber-100/40 blur-2xl animate-pulse" />
          <div className="absolute inset-0 bg-radial-gradient from-amber-950/20 via-transparent to-transparent opacity-60" />
        </div>

        {/* 3. ERA: MOON & ECLIPSE */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeEra === "moon" ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Luminous Lunar Glow */}
          <div className="absolute top-16 right-16 w-44 h-44 rounded-full border border-sky-300/30 shadow-[0_0_80px_rgba(56,189,248,0.25)] bg-gradient-to-br from-slate-200/10 via-sky-900/10 to-transparent opacity-80 backdrop-blur-sm">
            <div className="absolute inset-2 rounded-full border border-sky-200/20" />
            <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-sky-200/10 blur-xs" />
          </div>
          <div className="absolute -bottom-32 right-1/3 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[140px]" />
        </div>

        {/* 4. ERA: UNIVERSE (Deep Cosmos & Galactic Rift) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeEra === "universe" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-1/4 left-1/3 w-[700px] h-[400px] -rotate-12 bg-cyan-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-700/10 rounded-full blur-[130px]" />
        </div>

        {/* Starfield canvas overlay */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Subtle holographic cosmic scanlines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,12,20,0.4)_100%)] pointer-events-none" />
      </div>

      {/* Floating Official Celestial Theme Selector - Repositioned lower down so it aligns with the footer and NEVER covers terminal commands */}
      <div className="fixed bottom-0.5 left-2 z-20 hidden sm:flex items-center gap-1 p-0.5 rounded-full bg-slate-950/95 border border-cyan-900/60 backdrop-blur-xl shadow-lg">
        {isCosmosBarCollapsed ? (
          <button
            onClick={() => {
              playJarvisBeep(1100, "sine", 0.03);
              setIsCosmosBarCollapsed(false);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-cyan-400 hover:text-cyan-200 hover:bg-slate-900/80 cursor-pointer"
            title="Expand Cosmos theme selector"
          >
            <Orbit className="w-2.5 h-2.5 animate-spin [animation-duration:12s]" />
            <span>COSMOS: {activeEra.toUpperCase()}</span>
            <span className="text-slate-500 text-[8px]">[+]</span>
          </button>
        ) : (
          <>
            <span className="text-[9px] font-mono font-bold text-cyan-400 px-1.5 flex items-center gap-1">
              <Orbit className="w-2.5 h-2.5 animate-spin [animation-duration:12s]" />
              COSMOS:
            </span>

            {[
              { id: "cycle", label: "Auto", icon: Sparkles },
              { id: "universe", label: "Universe", icon: Orbit },
              { id: "nebula", label: "Nebula", icon: Eye },
              { id: "sun", label: "Solar", icon: Sun },
              { id: "moon", label: "Lunar", icon: Moon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTheme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playJarvisBeep(1250, "sine", 0.04);
                    onThemeChange(item.id as CelestialTheme);
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                  }`}
                >
                  <Icon className="w-2.5 h-2.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                playJarvisBeep(900, "sine", 0.03);
                setIsCosmosBarCollapsed(true);
              }}
              className="px-1 text-[9px] text-slate-500 hover:text-slate-300 cursor-pointer ml-0.5"
              title="Minimize Cosmos selector"
            >
              −
            </button>
          </>
        )}
      </div>
    </>
  );
};
