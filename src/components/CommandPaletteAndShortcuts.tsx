import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Command,
  Terminal,
  Box,
  Layers,
  Dna,
  Film,
  Video,
  AudioLines,
  Cpu,
  Wand2,
  Bot,
  Volume2,
  VolumeX,
  Orbit,
  Sparkles,
  Download,
  X,
  Keyboard,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { playJarvisBeep, playSuccessChime } from "../utils/jarvisAudio";
import { CelestialTheme } from "../types/voice";

export interface ShortcutCommand {
  id: string;
  title: string;
  category: "views" | "ai" | "cosmos" | "utility";
  shortcut: string;
  shortcutKeys: string[];
  icon: React.FC<{ className?: string }>;
  description: string;
  action: () => void;
}

interface CommandPaletteAndShortcutsProps {
  onSelectView: (view: string) => void;
  onToggleChat: () => void;
  onToggleVoice: () => void;
  voiceEnabled: boolean;
  onPlayBriefing?: () => void;
  onThemeChange: (theme: CelestialTheme) => void;
  currentTheme: CelestialTheme;
  activeView: string;
}

export const CommandPaletteAndShortcuts: React.FC<CommandPaletteAndShortcutsProps> = ({
  onSelectView,
  onToggleChat,
  onToggleVoice,
  voiceEnabled,
  onPlayBriefing,
  onThemeChange,
  currentTheme,
  activeView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Define commands list
  const commands: ShortcutCommand[] = [
    // Views
    {
      id: "view-core",
      title: "Switch to QBIT NOVA CORE Dashboard",
      category: "views",
      shortcut: "Ctrl+Shift+D",
      shortcutKeys: ["Ctrl", "Shift", "D"],
      icon: Layers,
      description: "Display sovereign brand specification, chromatic palette & guidelines",
      action: () => onSelectView("dashboard"),
    },
    {
      id: "view-terminal",
      title: "Open Full Access Terminal",
      category: "views",
      shortcut: "Ctrl+Shift+T",
      shortcutKeys: ["Ctrl", "Shift", "T"],
      icon: Terminal,
      description: "Launch bash shell, g.ts CLI suite, and Desktop Commander bridge",
      action: () => onSelectView("terminal"),
    },
    {
      id: "view-apps",
      title: "Open Software Center & Package Manager",
      category: "views",
      shortcut: "Ctrl+Shift+S",
      shortcutKeys: ["Ctrl", "Shift", "S"],
      icon: Box,
      description: "Manage Android APKs, Pi 5 Debian packages, and system diagnostics",
      action: () => onSelectView("app-manager"),
    },
    {
      id: "view-3d",
      title: "Open 3D Quantum Dragon Scene",
      category: "views",
      shortcut: "Ctrl+Shift+3",
      shortcutKeys: ["Ctrl", "Shift", "3"],
      icon: Box,
      description: "Interactive Three.js particle dragon core with orbital camera",
      action: () => onSelectView("3d-core"),
    },
    {
      id: "view-video-call",
      title: "Start AI Human Real-time Video Call",
      category: "views",
      shortcut: "Ctrl+Shift+V",
      shortcutKeys: ["Ctrl", "Shift", "V"],
      icon: Video,
      description: "Face-to-face video call with N.O.V.A. emotional personas",
      action: () => onSelectView("video-call"),
    },
    {
      id: "view-voices",
      title: "Open Emotional Voice Playground",
      category: "views",
      shortcut: "Ctrl+Shift+E",
      shortcutKeys: ["Ctrl", "Shift", "E"],
      icon: AudioLines,
      description: "Configure Madras Tamil, Tanglish, and physiological acoustics",
      action: () => onSelectView("voices"),
    },
    {
      id: "view-pi",
      title: "Open Raspberry Pi 5 & Huawei Bridge",
      category: "views",
      shortcut: "Ctrl+Shift+P",
      shortcutKeys: ["Ctrl", "Shift", "P"],
      icon: Cpu,
      description: "Termux SSH tunnel, Cloudflare Zero Trust, and hardware telemetry",
      action: () => onSelectView("pi-agent"),
    },

    // AI & Voice Controls
    {
      id: "ai-chat",
      title: "Toggle N.O.V.A. AI Chat Drawer",
      category: "ai",
      shortcut: "Ctrl+Shift+C",
      shortcutKeys: ["Ctrl", "Shift", "C"],
      icon: Bot,
      description: "Open floating AI Studio multi-turn chat consultation drawer",
      action: () => onToggleChat(),
    },
    {
      id: "ai-voice-toggle",
      title: voiceEnabled ? "Mute Voice Engine" : "Enable Voice Engine",
      category: "ai",
      shortcut: "Ctrl+Space",
      shortcutKeys: ["Ctrl", "Space"],
      icon: voiceEnabled ? VolumeX : Volume2,
      description: "Toggle speech synthesis and acoustic voice responses",
      action: () => onToggleVoice(),
    },
    {
      id: "ai-briefing",
      title: "Play N.O.V.A. Audio Briefing",
      category: "ai",
      shortcut: "Ctrl+Shift+B",
      shortcutKeys: ["Ctrl", "Shift", "B"],
      icon: Volume2,
      description: "Synthesize vocal brief with active Tamil/Tanglish acoustic persona",
      action: () => onPlayBriefing?.(),
    },

    // Cosmos Theme
    {
      id: "cosmos-cycle",
      title: "Set Cosmos Theme: Auto Cycle",
      category: "cosmos",
      shortcut: "Ctrl+Shift+1",
      shortcutKeys: ["Ctrl", "Shift", "1"],
      icon: Sparkles,
      description: "Auto-cycle through Universe, Nebula, Solar Core, and Lunar eras",
      action: () => onThemeChange("cycle"),
    },
    {
      id: "cosmos-universe",
      title: "Set Cosmos Theme: Universe",
      category: "cosmos",
      shortcut: "Ctrl+Shift+2",
      shortcutKeys: ["Ctrl", "Shift", "2"],
      icon: Orbit,
      description: "Deep space galactic rift with high-density starfield",
      action: () => onThemeChange("universe"),
    },

    // Utility
    {
      id: "util-help",
      title: "Show Keyboard Shortcuts Guide",
      category: "utility",
      shortcut: "Ctrl+/",
      shortcutKeys: ["Ctrl", "/"],
      icon: Keyboard,
      description: "Display global keyboard shortcuts cheat sheet modal",
      action: () => setIsHelpOpen(true),
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      !searchQuery ||
      cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybindings inside standard text inputs or textareas unless it's Ctrl+K or Ctrl+Space
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Ctrl+K / Cmd+K -> Toggle Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playJarvisBeep(1400, "sine", 0.04);
        setIsOpen((prev) => !prev);
        setSearchQuery("");
        setSelectedIndex(0);
        return;
      }

      // Ctrl+Space -> Toggle Voice Engine
      if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        e.preventDefault();
        onToggleVoice();
        return;
      }

      // Ctrl+/ or ? -> Show Shortcuts Help Modal
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        playJarvisBeep(1200, "sine", 0.03);
        setIsHelpOpen((prev) => !prev);
        return;
      }

      // Handle shortcuts when not inside text inputs
      if (!isInput && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        const key = e.key.toUpperCase();
        if (key === "D") {
          e.preventDefault();
          onSelectView("dashboard");
        } else if (key === "T") {
          e.preventDefault();
          onSelectView("terminal");
        } else if (key === "S") {
          e.preventDefault();
          onSelectView("app-manager");
        } else if (key === "V") {
          e.preventDefault();
          onSelectView("video-call");
        } else if (key === "C") {
          e.preventDefault();
          onToggleChat();
        } else if (key === "P") {
          e.preventDefault();
          onSelectView("pi-agent");
        } else if (key === "E") {
          e.preventDefault();
          onSelectView("voices");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectView, onToggleChat, onToggleVoice]);

  // Focus search input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleRunCommand = (cmd: ShortcutCommand) => {
    playJarvisBeep(1500, "sine", 0.05);
    setIsOpen(false);
    cmd.action();
  };

  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleRunCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Top Floating Quick Trigger Bar Button */}
      <button
        onClick={() => {
          playJarvisBeep(1200, "sine", 0.03);
          setIsOpen(true);
        }}
        className="fixed top-3.5 right-20 z-40 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-md shadow-lg text-[11px] font-mono cursor-pointer transition-all hover:scale-105"
        title="Open Command Palette (Ctrl+K)"
      >
        <Command className="w-3.5 h-3.5 text-cyan-400" />
        <span>Palette</span>
        <span className="px-1.5 py-0.2 rounded bg-slate-950 text-cyan-400 font-bold border border-slate-800 text-[10px]">
          Ctrl+K
        </span>
      </button>

      {/* COMMAND PALETTE MODAL (Ctrl+K) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md font-mono select-none">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col space-y-0">
            {/* Search Input Box */}
            <div className="flex items-center gap-3 p-4 bg-slate-950 border-b border-slate-800">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handlePaletteKeyDown}
                placeholder="Search commands, views, or keybindings (e.g. Terminal, Voice, Ctrl+K)..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm font-mono focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1 divide-y divide-slate-850">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No matching commands found for "{searchQuery}"
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <div
                      key={cmd.id}
                      onClick={() => handleRunCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all text-xs ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                          : "hover:bg-slate-800/80 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-slate-950" : "text-cyan-400"}`} />
                        <div className="min-w-0">
                          <p className="font-bold truncate">{cmd.title}</p>
                          <p className={`text-[10px] truncate ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
                            {cmd.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {cmd.shortcutKeys.map((key, kIdx) => (
                          <span
                            key={kIdx}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              isSelected
                                ? "bg-slate-950 text-cyan-300 font-bold"
                                : "bg-slate-950 text-slate-400 border border-slate-800"
                            }`}
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Execute</span>
                <span>Esc Close</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsHelpOpen(true);
                }}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Shortcuts Cheat Sheet (?)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHORTCUTS CHEAT SHEET MODAL (?) */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-mono select-none">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-5 relative">
            <button
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Keyboard className="w-6 h-6 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Global Keyboard Shortcuts</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { label: "Open Command Palette", key: "Ctrl + K" },
                { label: "Toggle Voice Speech Engine", key: "Ctrl + Space" },
                { label: "Toggle N.O.V.A. Chat Drawer", key: "Ctrl + Shift + C" },
                { label: "Switch to Full Access Terminal", key: "Ctrl + Shift + T" },
                { label: "Switch to Software Center & Apps", key: "Ctrl + Shift + S" },
                { label: "Start AI Real-time Video Call", key: "Ctrl + Shift + V" },
                { label: "Switch to QBIT NOVA CORE", key: "Ctrl + Shift + D" },
                { label: "Shortcuts Cheat Sheet", key: "Ctrl + /" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-900/60 font-mono text-[11px] font-bold">
                    {item.key}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Close Shortcuts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
