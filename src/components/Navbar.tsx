import React from "react";
import { MessageSquare, Sparkles, RefreshCw, Volume2, VolumeX, Shield, Terminal, Video, Download } from "lucide-react";
import { playJarvisBeep, playSuccessChime } from "../utils/jarvisAudio";

interface NavbarProps {
  onOpenChat: () => void;
  onReset: () => void;
  hasBrand: boolean;
  brandName?: string;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onStartVideoCall?: () => void;
  onOpenTerminal?: () => void;
  unreadChatCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  onReset,
  hasBrand,
  brandName,
  voiceEnabled,
  onToggleVoice,
  onStartVideoCall,
  onOpenTerminal,
  unreadChatCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-cyan-900/40 backdrop-blur-md shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
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

          {/* Download Complete Codebase ZIP */}
          <a
            href="/api/download-zip"
            download="universal-dragon-nova-suite.zip"
            onClick={() => playSuccessChime()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer"
            title="Download Complete Source Code ZIP (All Languages & Tools)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CODE (.ZIP)</span>
          </a>

          {/* Full Access Workspace Terminal */}
          <button
            onClick={() => {
              playJarvisBeep(1200, "sine", 0.04);
              onOpenTerminal?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-emerald-950 text-emerald-400 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer"
            title="Open Full Access Workspace Terminal"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">TERMINAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>

          {/* Live AI Video Call Trigger */}
          <button
            onClick={() => {
              playJarvisBeep(1400, "sine", 0.05);
              onStartVideoCall?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
            title="Start Live Face-to-Face AI Video Call with N.O.V.A."
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI VIDEO CALL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
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
