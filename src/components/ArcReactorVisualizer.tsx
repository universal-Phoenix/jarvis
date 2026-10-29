import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Radio, Sparkles } from "lucide-react";

interface ArcReactorVisualizerProps {
  isSpeaking: boolean;
  isGenerating: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  statusText?: string;
  onReactorClick?: () => void;
}

export const ArcReactorVisualizer: React.FC<ArcReactorVisualizerProps> = ({
  isSpeaking,
  isGenerating,
  voiceEnabled,
  onToggleVoice,
  statusText = "SYSTEM OPTIMAL // PROTOCOL ONLINE",
  onReactorClick,
}) => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md hud-glow overflow-hidden">
      {/* Background scanline effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Left: Arc Reactor Core & Status */}
      <div className="flex items-center gap-4 z-10">
        <button
          onClick={onReactorClick}
          title="Click to interact with N.O.V.A."
          className="group relative w-16 h-16 flex items-center justify-center rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer transition-transform active:scale-95"
        >
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/60 animate-spin"
            style={{ animationDuration: isSpeaking ? "4s" : isGenerating ? "2s" : "12s" }}
          />

          {/* Middle counter-rotating ring */}
          <div
            className="absolute inset-1 rounded-full border border-cyan-500/40 border-t-transparent animate-spin"
            style={{
              animationDuration: isSpeaking ? "2s" : "8s",
              animationDirection: "reverse",
            }}
          />

          {/* Glowing central core */}
          <div
            className={`w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center ${
              isSpeaking
                ? "bg-cyan-300 shadow-[0_0_25px_#22d3ee] scale-110"
                : isGenerating
                ? "bg-amber-400 shadow-[0_0_25px_#f59e0b] animate-pulse"
                : "bg-cyan-500/80 shadow-[0_0_12px_#06b6d4]"
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
          </div>

          {/* Tri-blade aperture overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 border-t-2 border-r-2 border-cyan-300 rotate-45 rounded-sm" />
          </div>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              N.O.V.A. CORE VII
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              v6.1 SPEECH
            </span>
          </div>
          <p className="font-mono text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="truncate max-w-[240px] sm:max-w-xs">{statusText}</span>
          </p>
        </div>
      </div>

      {/* Center: Dynamic Audio Frequency Bars */}
      <div className="hidden lg:flex items-center gap-1 px-4 py-2 bg-slate-950/60 rounded-xl border border-cyan-900/50">
        {[4, 12, 24, 38, 55, 75, 90, 60, 42, 28, 50, 70, 85, 45, 30, 18, 8].map((baseHeight, idx) => {
          const mod = (pulsePhase + idx * 7) % 100;
          const dynamicHeight = isSpeaking
            ? Math.max(12, Math.min(42, Math.sin((mod / 100) * Math.PI * 2) * 20 + 22))
            : isGenerating
            ? Math.max(8, Math.min(32, Math.cos((mod / 100) * Math.PI) * 14 + 16))
            : Math.max(4, Math.sin((mod / 100) * Math.PI) * 8 + 6);

          return (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-75 ${
                isSpeaking
                  ? "bg-gradient-to-t from-cyan-500 to-cyan-200 shadow-[0_0_6px_#06b6d4]"
                  : isGenerating
                  ? "bg-gradient-to-t from-amber-500 to-amber-200"
                  : "bg-cyan-950"
              }`}
              style={{ height: `${dynamicHeight}px` }}
            />
          );
        })}
      </div>

      {/* Right: Voice Audio Toggle & Controls */}
      <div className="flex items-center gap-2 z-10">
        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
            voiceEnabled
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
          }`}
        >
          {voiceEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>VOICE: ACTIVE</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span>VOICE: MUTED</span>
            </>
          )}
        </button>

        <div className="flex items-center text-[11px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-800/40">
          <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
          <span>NOVA QUANTUM CORE</span>
        </div>
      </div>
    </div>
  );
};
