import React from "react";
import { MessageSquare, Sparkles, RefreshCw, Volume2, VolumeX, Shield, Terminal } from "lucide-react";
import { playJarvisBeep } from "../utils/jarvisAudio";

interface NavbarProps {
  onOpenChat: () => void;
  onReset: () => void;
  hasBrand: boolean;
  brandName?: string;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  unreadChatCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  onReset,
  hasBrand,
  brandName,
  voiceEnabled,
  onToggleVoice,
  unreadChatCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 border-b border-cyan-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                N.O.V.A.
                <span className="text-cyan-400 font-mono text-xs font-normal">BRAND ARCHITECT</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                ONLINE
              </span>
              <span>//</span>
              <span>NOVA CORE 6.1 PROTOCOL</span>
            </div>
          </div>
        </div>

        {/* Center Active Brand Badge */}
        {hasBrand && brandName && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono text-cyan-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>ACTIVE VENTURE:</span>
            <span className="font-bold text-white">{brandName}</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {hasBrand && (
            <button
              onClick={() => {
                playJarvisBeep(1000, "sine", 0.05);
                onReset();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>NEW SYNTHESIS</span>
            </button>
          )}

          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              voiceEnabled
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
            title={voiceEnabled ? "Mute N.O.V.A. Voice" : "Enable N.O.V.A. Voice"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* N.O.V.A. Chat Trigger */}
          <button
            onClick={() => {
              playJarvisBeep(1300, "sine", 0.06);
              onOpenChat();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">CONSULT N.O.V.A.</span>
            <span className="sm:hidden">CHAT</span>
            {unreadChatCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
