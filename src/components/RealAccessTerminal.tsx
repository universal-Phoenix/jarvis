/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  Cpu,
  Smartphone,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  Key,
  Shield,
  FileCode,
  Folder,
  Send,
  Check,
  Copy,
  ChevronRight,
  Server,
  Zap,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Square,
  Save,
  Download,
  Upload,
  X,
  Code,
  Sparkles,
  Globe,
  Radio,
  History,
  Clock,
  Search,
  ArrowUpRight,
  Filter,
} from "lucide-react";

export interface TerminalHistoryItem {
  id: string;
  command: string;
  timestamp: number;
  success?: boolean;
}

export interface TerminalMacro {
  id: string;
  title: string;
  description: string;
  category: "remote" | "system" | "deployment" | "voice" | "custom";
  icon: string;
  commands: string[];
  isBuiltin?: boolean;
}

const INITIAL_HISTORY: TerminalHistoryItem[] = [
  { id: "hist-1", command: "g.ts", timestamp: Date.now() - 3600000, success: true },
  { id: "hist-2", command: "npx @wonderwhy-er/desktop-commander@latest remote", timestamp: Date.now() - 3000000, success: true },
  { id: "hist-3", command: "status", timestamp: Date.now() - 2400000, success: true },
  { id: "hist-4", command: "ollama sync", timestamp: Date.now() - 1800000, success: true },
  { id: "hist-5", command: "g.ts voice", timestamp: Date.now() - 1200000, success: true },
  { id: "hist-6", command: "hardware", timestamp: Date.now() - 900000, success: true },
  { id: "hist-7", command: "cat index.html", timestamp: Date.now() - 600000, success: true },
  { id: "hist-8", command: "nova run src/nova_scripts/dragon_core.nova", timestamp: Date.now() - 300000, success: true },
];

const DEFAULT_MACROS: TerminalMacro[] = [
  {
    id: "macro-dc-remote",
    title: "Desktop Commander Remote Bridge",
    category: "remote",
    icon: "🌐",
    description: "Launches @wonderwhy-er/desktop-commander remote daemon with full terminal access to Pi 5 & Huawei Pura 70.",
    commands: [
      "npx @wonderwhy-er/desktop-commander@latest remote",
      "status",
      "hardware",
    ],
    isBuiltin: true,
  },
  {
    id: "macro-sys-health",
    title: "System & Hardware Health Sweep",
    category: "system",
    icon: "🐉",
    description: "Runs full hardware telemetry, g.ts CLI suite, Pi 5 BCM2712 status, and CV2 Face Mesh.",
    commands: [
      "status",
      "g.ts",
      "hardware",
      "cv2 status",
    ],
    isBuiltin: true,
  },
  {
    id: "macro-voice-sync",
    title: "Ollama Voice & Tamil Dialect Sync",
    category: "voice",
    icon: "🎙️",
    description: "Syncs Local Madras Tamil, Tanglish, and acoustic cues (Moochi, Irumal, Smily) to Ollama custom model.",
    commands: [
      "ollama sync",
      "ollama status",
      "g.ts voice",
    ],
    isBuiltin: true,
  },
  {
    id: "macro-nova-deploy",
    title: "NOVA Language Actor Deployment",
    category: "deployment",
    icon: "⚡",
    description: "Compiles & executes the custom NOVA actor-stream script beyond Go runtime.",
    commands: [
      "nova --version",
      "nova run src/nova_scripts/dragon_core.nova",
      "read src/nova_scripts/dragon_core.nova",
    ],
    isBuiltin: true,
  },
  {
    id: "macro-ssh-pi5",
    title: "Pi 5 SSH & Cloudflare Mesh Ping",
    category: "remote",
    icon: "🛡️",
    description: "Verifies SSH port 22 and Cloudflare Zero Trust tunnel for universaldragon.com.",
    commands: [
      "echo 'Testing SSH bridge to Raspberry Pi 5 node...'",
      "ssh pi5.universaldragon.com",
      "curl -I https://universaldragon.com",
    ],
    isBuiltin: true,
  },
  {
    id: "macro-workspace-audit",
    title: "Workspace & Web Entry Audit",
    category: "system",
    icon: "📜",
    description: "Inspects workspace root, HTML entry point, and applet metadata.",
    commands: [
      "ls -la",
      "cat index.html",
      "cat metadata.json",
    ],
    isBuiltin: true,
  },
];

interface RealAccessTerminalProps {
  onClose?: () => void;
  brandName?: string;
  defaultSize?: "small" | "standard" | "fullscreen";
}

export function RealAccessTerminal({
  onClose,
  brandName = "Universal Dragon",
  defaultSize = "standard",
}: RealAccessTerminalProps) {
  const [activeTab, setActiveTab] = useState<"console" | "macros" | "editor">("console");
  const [commandInput, setCommandInput] = useState("");

  // Persistent Command History State
  const [historyItems, setHistoryItems] = useState<TerminalHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("ud_terminal_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_HISTORY;
  });

  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ud_terminal_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: TerminalHistoryItem) => item.command);
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_HISTORY.map((item) => item.command);
  });

  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showHistorySidebar, setShowHistorySidebar] = useState(true);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [historyFilterTag, setHistoryFilterTag] = useState<string>("all");
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeModel, setActiveModel] = useState("gemini-3.8-flash");
  const [terminalSize, setTerminalSize] = useState<"small" | "standard" | "fullscreen">(defaultSize);

  // Macros state
  const [macros, setMacros] = useState<TerminalMacro[]>(() => {
    try {
      const saved = localStorage.getItem("ud_terminal_macros");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_MACROS;
  });

  const [activeMacroRunning, setActiveMacroRunning] = useState<{
    id: string;
    title: string;
    currentStep: number;
    totalSteps: number;
    command: string;
  } | null>(null);

  const [macroCategoryFilter, setMacroCategoryFilter] = useState<string>("all");
  const [macroSearchQuery, setMacroSearchQuery] = useState("");
  const [editingMacro, setEditingMacro] = useState<TerminalMacro | null>(null);
  const [copiedMacroId, setCopiedMacroId] = useState<string | null>(null);

  // Macro Editor Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<TerminalMacro["category"]>("custom");
  const [formIcon, setFormIcon] = useState("⚡");
  const [formCommandsText, setFormCommandsText] = useState("");

  const [terminalLines, setTerminalLines] = useState<
    { type: "prompt" | "stdout" | "stderr" | "system" | "macro"; text: string }[]
  >([
    {
      type: "system",
      text: "UNIVERSAL DRAGON N.O.V.A. FULL-ACCESS SYSTEM TERMINAL [v6.1.4]",
    },
    {
      type: "system",
      text: "NOVA Language Engine: v4.8.0-advanced [Hyper-Concurrent Actor Runtime (Beyond Go)]",
    },
    {
      type: "system",
      text: "Remote Bridge Engine: @wonderwhy-er/desktop-commander ready for single-click remote links",
    },
    {
      type: "system",
      text: "Single-Click Macros: 6 pre-configured deployment, health & voice sync pipelines online",
    },
    {
      type: "system",
      text: "Ollama Voice Sync: Local Tamil, Tanglish, Urdu, Hindi, English (Moochi, Irumal, Smily active)",
    },
    {
      type: "system",
      text: "Hardware Bridge: pi5.universaldragon.com (SSH:22) <-> Huawei Pura 70 (Termux)",
    },
    {
      type: "system",
      text: "Type 'help' or click any Macro pill above to execute multi-line automation",
    },
  ]);

  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const macroAbortRef = useRef<boolean>(false);

  // Save macros to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ud_terminal_macros", JSON.stringify(macros));
    } catch {
      // ignore
    }
  }, [macros]);

  // Fetch initial terminal status
  useEffect(() => {
    fetch("/api/terminal/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.currentModel) {
          setActiveModel(data.currentModel);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-scroll on new output
  useEffect(() => {
    if (activeTab === "console") {
      outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines, activeTab]);

  const executeCommandRaw = async (cmd: string): Promise<{ output: string; exitCode: number }> => {
    const res = await fetch("/api/terminal/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: cmd }),
    });

    const data = await res.json();
    if (data.currentModel) {
      setActiveModel(data.currentModel);
    }

    return {
      output: data.output || "",
      exitCode: data.exitCode ?? 0,
    };
  };

  const executeSingleCommandLine = async (cmdToRun: string) => {
    const cmd = cmdToRun.trim();
    if (!cmd) return;

    // Check if multi-line command was entered or pasted
    const lines = cmd.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
    if (lines.length > 1) {
      await runCommandsSequence(lines, "Pasted Multi-Line Batch");
      return;
    }

    // Add to history list & persistent storage
    const newHistoryItem: TerminalHistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      command: cmd,
      timestamp: Date.now(),
      success: true,
    };

    setHistoryItems((prev) => {
      const filtered = prev.filter((item) => item.command !== cmd);
      const updated = [newHistoryItem, ...filtered].slice(0, 150);
      try {
        localStorage.setItem("ud_terminal_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setCommandInput("");

    // Append prompt line
    setTerminalLines((prev) => [
      ...prev,
      { type: "prompt", text: `universal-dragon@nova:~$ ${cmd}` },
    ]);

    if (cmd === "clear") {
      setTerminalLines([]);
      return;
    }

    setIsExecuting(true);

    try {
      const { output, exitCode } = await executeCommandRaw(cmd);

      if (output) {
        setTerminalLines((prev) => [
          ...prev,
          {
            type: exitCode === 0 ? "stdout" : "stderr",
            text: output,
          },
        ]);
      } else if (exitCode === 0) {
        setTerminalLines((prev) => [
          ...prev,
          { type: "system", text: "[Command executed with exit code 0]" },
        ]);
      }
    } catch (err: any) {
      setTerminalLines((prev) => [
        ...prev,
        { type: "stderr", text: `Execution failed: ${err.message}` },
      ]);
    } finally {
      setIsExecuting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Run sequence of commands (Macro Engine)
  const runCommandsSequence = async (commands: string[], macroTitle: string, macroId?: string) => {
    if (isExecuting || commands.length === 0) return;

    setActiveTab("console");
    setIsExecuting(true);
    macroAbortRef.current = false;

    setTerminalLines((prev) => [
      ...prev,
      {
        type: "macro",
        text: `\n🚀 [MACRO INITIATED] ▶ "${macroTitle}" (${commands.length} steps)\n----------------------------------------------------------------------`,
      },
    ]);

    for (let i = 0; i < commands.length; i++) {
      if (macroAbortRef.current) {
        setTerminalLines((prev) => [
          ...prev,
          {
            type: "stderr",
            text: `⚠️ [MACRO ABORTED] "${macroTitle}" was stopped by user at Step ${i + 1}/${commands.length}.`,
          },
        ]);
        break;
      }

      const cmd = commands[i].trim();
      if (!cmd || cmd.startsWith("#")) continue;

      setActiveMacroRunning({
        id: macroId || "adhoc",
        title: macroTitle,
        currentStep: i + 1,
        totalSteps: commands.length,
        command: cmd,
      });

      // Prompt line
      setTerminalLines((prev) => [
        ...prev,
        {
          type: "prompt",
          text: `[Step ${i + 1}/${commands.length}] universal-dragon@nova:~$ ${cmd}`,
        },
      ]);

      try {
        const { output, exitCode } = await executeCommandRaw(cmd);
        if (output) {
          setTerminalLines((prev) => [
            ...prev,
            {
              type: exitCode === 0 ? "stdout" : "stderr",
              text: output,
            },
          ]);
        }
      } catch (err: any) {
        setTerminalLines((prev) => [
          ...prev,
          {
            type: "stderr",
            text: `[Step ${i + 1} Error]: ${err.message}`,
          },
        ]);
      }

      // Small pacing pause between steps for visual clarity
      if (i < commands.length - 1) {
        await new Promise((r) => setTimeout(r, 120));
      }
    }

    if (!macroAbortRef.current) {
      setTerminalLines((prev) => [
        ...prev,
        {
          type: "macro",
          text: `----------------------------------------------------------------------\n✅ [MACRO COMPLETED] "${macroTitle}" executed all ${commands.length} steps successfully.`,
        },
      ]);
    }

    setActiveMacroRunning(null);
    setIsExecuting(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleStopMacro = () => {
    macroAbortRef.current = true;
    setActiveMacroRunning(null);
    setIsExecuting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSingleCommandLine(commandInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommandInput(commandHistory[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setCommandInput(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setCommandInput("");
      }
    }
  };

  const handleSwitchModel = (modelName: string) => {
    executeSingleCommandLine(`model set ${modelName}`);
  };

  const handleSelectHistoryCommand = (cmd: string, autoRun: boolean = false) => {
    setCommandInput(cmd);
    if (autoRun) {
      executeSingleCommandLine(cmd);
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
        if (inputRef.current) {
          inputRef.current.selectionStart = cmd.length;
          inputRef.current.selectionEnd = cmd.length;
        }
      }, 50);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all terminal command history?")) {
      setHistoryItems([]);
      setCommandHistory([]);
      try {
        localStorage.removeItem("ud_terminal_history");
      } catch {}
    }
  };

  const formatHistoryTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const filteredHistory = historyItems.filter((item) => {
    const matchesSearch =
      !historySearchQuery ||
      item.command.toLowerCase().includes(historySearchQuery.toLowerCase());
    const matchesTag =
      historyFilterTag === "all" ||
      (historyFilterTag === "g.ts" && item.command.startsWith("g.ts")) ||
      (historyFilterTag === "remote" &&
        (item.command.includes("remote") ||
          item.command.includes("ssh") ||
          item.command.includes("desktop-commander"))) ||
      (historyFilterTag === "status" &&
        (item.command.includes("status") ||
          item.command.includes("health") ||
          item.command.includes("hardware"))) ||
      (historyFilterTag === "voice" &&
        (item.command.includes("voice") || item.command.includes("ollama")));
    return matchesSearch && matchesTag;
  });

  // Macro Management Handlers
  const openCreateMacroModal = () => {
    setEditingMacro(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("custom");
    setFormIcon("⚡");
    setFormCommandsText("");
    setActiveTab("editor");
  };

  const openEditMacroModal = (macro: TerminalMacro) => {
    setEditingMacro(macro);
    setFormTitle(macro.title);
    setFormDescription(macro.description);
    setFormCategory(macro.category);
    setFormIcon(macro.icon || "⚡");
    setFormCommandsText(macro.commands.join("\n"));
    setActiveTab("editor");
  };

  const handleSaveMacro = (e: React.FormEvent) => {
    e.preventDefault();
    const title = formTitle.trim();
    const lines = formCommandsText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (!title || lines.length === 0) return;

    if (editingMacro) {
      setMacros((prev) =>
        prev.map((m) =>
          m.id === editingMacro.id
            ? {
                ...m,
                title,
                description: formDescription.trim(),
                category: formCategory,
                icon: formIcon,
                commands: lines,
              }
            : m
        )
      );
    } else {
      const newMacro: TerminalMacro = {
        id: `macro-custom-${Date.now()}`,
        title,
        description: formDescription.trim() || `Custom multi-step script with ${lines.length} commands.`,
        category: formCategory,
        icon: formIcon,
        commands: lines,
        isBuiltin: false,
      };
      setMacros((prev) => [newMacro, ...prev]);
    }

    setActiveTab("macros");
  };

  const handleDeleteMacro = (id: string) => {
    setMacros((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDuplicateMacro = (macro: TerminalMacro) => {
    const duplicated: TerminalMacro = {
      ...macro,
      id: `macro-custom-${Date.now()}`,
      title: `${macro.title} (Copy)`,
      isBuiltin: false,
    };
    setMacros((prev) => [duplicated, ...prev]);
  };

  const handleResetDefaultMacros = () => {
    if (window.confirm("Reset all macros to factory defaults?")) {
      setMacros(DEFAULT_MACROS);
    }
  };

  const copyMacroCommands = (macro: TerminalMacro) => {
    navigator.clipboard.writeText(macro.commands.join("\n"));
    setCopiedMacroId(macro.id);
    setTimeout(() => setCopiedMacroId(null), 1500);
  };

  const formatAnsiText = (text: string) => {
    return text.replace(/\x1b\[[0-9;]*m/g, "");
  };

  const getContainerHeightClass = () => {
    if (terminalSize === "small") return "h-40";
    if (terminalSize === "fullscreen") return "h-[560px]";
    return "h-88";
  };

  // Filtered macros
  const filteredMacros = macros.filter((m) => {
    const matchesCategory =
      macroCategoryFilter === "all" || m.category === macroCategoryFilter;
    const matchesSearch =
      !macroSearchQuery ||
      m.title.toLowerCase().includes(macroSearchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(macroSearchQuery.toLowerCase()) ||
      m.commands.some((c) => c.toLowerCase().includes(macroSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col bg-slate-950/95 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md font-mono">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold tracking-wider">
            N.O.V.A. // FULL ACCESS WORKSPACE TERMINAL
          </span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
            ACTIVE: {activeModel}
          </span>
        </div>

        {/* View Switcher: Console vs Macros Library vs History Sidebar */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab("console")}
            className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "console"
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>
          {activeTab === "console" && (
            <button
              onClick={() => setShowHistorySidebar((prev) => !prev)}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                showHistorySidebar
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-900 text-amber-400 hover:text-amber-200"
              }`}
              title="Toggle Searchable Command History Sidebar"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/80 text-[10px]">
                {historyItems.length}
              </span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("macros")}
            className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "macros" || activeTab === "editor"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Macros</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-900/80 text-[10px]">
              {macros.length}
            </span>
          </button>
        </div>

        {/* Viewport Size & Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setTerminalSize("small")}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                terminalSize === "small"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Small
            </button>
            <button
              onClick={() => setTerminalSize("standard")}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                terminalSize === "standard"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setTerminalSize("fullscreen")}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                terminalSize === "fullscreen"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Full Access
            </button>
          </div>

          <button
            onClick={() => setTerminalLines([])}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* AI Model Quick Switch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-bold">AI MODEL:</span>
          <div className="flex flex-wrap items-center gap-1">
            {[
              "gemini-3.8-flash",
              "gemini-4-argon",
              "gemini-3.1-flash-lite",
              "gemini-omni-1.1-flash",
              "gemini-3.5-transcribe",
              "gemini-3.8-flash-tts",
            ].map((m) => (
              <button
                key={m}
                onClick={() => handleSwitchModel(m)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  activeModel === m
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Hardware & Key Links */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>pi5.universaldragon.com</span>
          </span>
          <span>•</span>
          <span className="text-slate-400">Huawei Pura 70</span>
        </div>
      </div>

      {/* Single-Click MACROS CAROUSEL / QUICK BAR */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/90 border-b border-slate-800/90 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1 text-cyan-400 font-bold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>1-CLICK MACROS:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {macros.slice(0, 5).map((macro) => (
            <button
              key={macro.id}
              onClick={() => runCommandsSequence(macro.commands, macro.title, macro.id)}
              disabled={isExecuting}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-slate-900 to-slate-850 hover:from-cyan-950/80 hover:to-slate-850 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/60 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              title={`${macro.description} (${macro.commands.length} commands)`}
            >
              <span>{macro.icon}</span>
              <span className="font-semibold">{macro.title}</span>
              <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-400">
                {macro.commands.length}
              </span>
            </button>
          ))}

          <button
            onClick={() => setActiveTab("macros")}
            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-800/60 text-[10px] font-bold cursor-pointer shrink-0 flex items-center gap-1"
          >
            <Layers className="w-3 h-3" />
            <span>More Macros ({macros.length})</span>
          </button>
        </div>
      </div>

      {/* Active Macro In-Flight Progress Banner */}
      {activeMacroRunning && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-cyan-950/60 border-b border-cyan-800/80 text-xs text-cyan-300 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold">
              Executing Macro: &quot;{activeMacroRunning.title}&quot;
            </span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-900 text-[10px] text-cyan-200">
              Step {activeMacroRunning.currentStep} of {activeMacroRunning.totalSteps}
            </span>
            <span className="text-slate-400 truncate max-w-xs font-mono text-[11px]">
              &gt; {activeMacroRunning.command}
            </span>
          </div>

          <button
            onClick={handleStopMacro}
            className="px-2.5 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-white text-[10px] font-bold cursor-pointer flex items-center gap-1"
          >
            <Square className="w-2.5 h-2.5 fill-current" />
            <span>Stop Macro</span>
          </button>
        </div>
      )}

      {/* TAB CONTENT: 1. Console View */}
      {activeTab === "console" && (
        <>
          {/* Quick Command Pills */}
          <div className="flex flex-wrap items-center gap-1.5 px-4 py-1.5 bg-slate-950/70 border-b border-slate-800 text-[10px]">
            <span className="text-emerald-400 font-bold mr-1">QUICK CMDS:</span>
            {[
              { label: "🚀 run g.ts", cmd: "g.ts" },
              { label: "🌐 desktop-commander", cmd: "npx @wonderwhy-er/desktop-commander@latest remote" },
              { label: "🎤 g.ts voice", cmd: "g.ts voice" },
              { label: "📜 cat index.html", cmd: "cat index.html" },
              { label: "⚡ nova run core", cmd: "nova run src/nova_scripts/dragon_core.nova" },
              { label: "🎙️ ollama sync", cmd: "ollama sync" },
              { label: "🤖 ollama status", cmd: "ollama status" },
              { label: "👁️ cv2 status", cmd: "cv2 status" },
              { label: "help", cmd: "help" },
              { label: "status", cmd: "status" },
              { label: "model list", cmd: "model list" },
              { label: "secrets / apikey", cmd: "secrets" },
              { label: "hardware ping", cmd: "hardware" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => executeSingleCommandLine(item.cmd)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 cursor-pointer transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Split Screen Stage: Terminal Canvas + Searchable Command History Sidebar */}
          <div className={`w-full ${getContainerHeightClass()} flex overflow-hidden bg-slate-950 divide-x divide-slate-800/80`}>
            {/* Left Column: Terminal Output Canvas */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
              <div className="flex-1 p-4 overflow-y-auto text-slate-200 text-xs leading-relaxed space-y-1.5 select-text font-mono">
                {terminalLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`whitespace-pre-wrap break-all ${
                      line.type === "prompt"
                        ? "text-emerald-400 font-bold"
                        : line.type === "stderr"
                        ? "text-rose-400"
                        : line.type === "system"
                        ? "text-cyan-400/90"
                        : line.type === "macro"
                        ? "text-amber-300 font-bold"
                        : "text-slate-300"
                    }`}
                  >
                    {formatAnsiText(line.text)}
                  </div>
                ))}
                {isExecuting && !activeMacroRunning && (
                  <div className="flex items-center gap-2 text-cyan-400 animate-pulse text-xs">
                    <span>Executing command...</span>
                  </div>
                )}
                <div ref={outputEndRef} />
              </div>
            </div>

            {/* Right Column: Searchable Command History Sidebar */}
            {showHistorySidebar && (
              <aside className="w-72 sm:w-80 border-l border-slate-800 bg-slate-950/95 flex flex-col shrink-0 overflow-hidden select-none">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-white font-bold text-xs tracking-wide">Command History</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 text-[10px] font-mono">
                      {filteredHistory.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {historyItems.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 cursor-pointer"
                        title="Clear command history"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowHistorySidebar(false)}
                      className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 cursor-pointer"
                      title="Collapse history sidebar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Search & Quick Filters */}
                <div className="p-2 border-b border-slate-800/80 bg-slate-900/50 shrink-0 space-y-1.5">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      placeholder="Search past commands..."
                      className="w-full pl-8 pr-7 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    {historySearchQuery && (
                      <button
                        onClick={() => setHistorySearchQuery("")}
                        className="absolute right-2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    {["all", "g.ts", "remote", "status", "voice"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setHistoryFilterTag(tag)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          historyFilterTag === tag
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                            : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clickable Past Commands List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-900">
                  {filteredHistory.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs space-y-1">
                      <Clock className="w-5 h-5 mx-auto text-slate-600 mb-1" />
                      <p className="font-semibold text-slate-400">No commands found</p>
                      <p className="text-[10px] text-slate-600">
                        {historySearchQuery
                          ? "Try a different search query"
                          : "Executed commands appear here"}
                      </p>
                    </div>
                  ) : (
                    filteredHistory.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        onClick={() => handleSelectHistoryCommand(item.command, false)}
                        className="group relative flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-900/70 hover:bg-slate-850 border border-slate-850 hover:border-amber-500/60 cursor-pointer transition-all text-xs"
                        title="Click to immediately re-populate input prompt"
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-mono text-emerald-400 font-bold">
                              #{filteredHistory.length - idx}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {formatHistoryTime(item.timestamp)}
                            </span>
                          </div>
                          <p className="font-mono text-slate-200 text-xs break-all font-medium group-hover:text-amber-300 transition-colors">
                            {item.command}
                          </p>
                        </div>

                        {/* Action Buttons: Populate & Quick Run */}
                        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectHistoryCommand(item.command, false);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-amber-950/80 text-slate-300 hover:text-amber-300 border border-slate-700/60 cursor-pointer"
                            title="Populate input prompt"
                          >
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectHistoryCommand(item.command, true);
                            }}
                            className="p-1 rounded bg-emerald-950/80 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-800/60 cursor-pointer transition-colors"
                            title="Run command immediately"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Sidebar Footer Hint */}
                <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between shrink-0 font-mono">
                  <span>Click item to populate prompt</span>
                  <span className="text-emerald-400 font-bold">▶ Run</span>
                </div>
              </aside>
            )}
          </div>

          {/* Interactive Command Input Prompt */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs">
            <span className="text-emerald-400 font-bold shrink-0">
              universal-dragon@nova:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g. g.ts, npx @wonderwhy-er/desktop-commander@latest remote, cat index.html)..."
              className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs"
              autoFocus
            />
            <button
              onClick={() => executeSingleCommandLine(commandInput)}
              disabled={isExecuting || !commandInput.trim()}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 shrink-0"
            >
              <Send className="w-3 h-3" />
              <span>RUN</span>
            </button>
          </div>
        </>
      )}

      {/* TAB CONTENT: 2. Macros Manager View */}
      {activeTab === "macros" && (
        <div className={`w-full ${getContainerHeightClass()} flex flex-col p-4 bg-slate-950 overflow-y-auto text-xs`}>
          {/* Macro Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Single-Click Terminal Macros</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                {filteredMacros.length} available
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openCreateMacroModal}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Macro</span>
              </button>

              <button
                onClick={handleResetDefaultMacros}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs cursor-pointer"
                title="Restore default built-in macros"
              >
                Reset Defaults
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <div className="flex items-center gap-1">
              {["all", "remote", "system", "deployment", "voice", "custom"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMacroCategoryFilter(cat)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                    macroCategoryFilter === cat
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={macroSearchQuery}
              onChange={(e) => setMacroSearchQuery(e.target.value)}
              placeholder="Search macros or commands..."
              className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
            />
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {filteredMacros.map((macro) => (
              <div
                key={macro.id}
                className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{macro.icon || "⚡"}</span>
                      <div>
                        <h4 className="font-bold text-white text-xs">{macro.title}</h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700 uppercase">
                          {macro.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyMacroCommands(macro)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                        title="Copy commands to clipboard"
                      >
                        {copiedMacroId === macro.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditMacroModal(macro)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                        title="Edit macro"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateMacro(macro)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                        title="Duplicate macro"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      {!macro.isBuiltin && (
                        <button
                          onClick={() => handleDeleteMacro(macro.id)}
                          className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="Delete macro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px] mb-2.5 leading-relaxed">
                    {macro.description}
                  </p>

                  {/* Commands Preview List */}
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-850 font-mono text-[10px] text-slate-300 space-y-1 max-h-24 overflow-y-auto mb-3">
                    {macro.commands.map((cmd, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-400">
                        <span className="text-slate-600 select-none">{i + 1}.</span>
                        <span className="text-cyan-300 truncate">{cmd}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                  <span className="text-[10px] text-slate-500">
                    {macro.commands.length} step{macro.commands.length > 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => runCommandsSequence(macro.commands, macro.title, macro.id)}
                    disabled={isExecuting}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-sm hover:shadow-emerald-950 disabled:opacity-40"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Macro</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Macro Editor Form */}
      {activeTab === "editor" && (
        <div className={`w-full ${getContainerHeightClass()} flex flex-col p-4 bg-slate-950 overflow-y-auto text-xs`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                {editingMacro ? "Edit Terminal Macro" : "Create New Terminal Macro"}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("macros")}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveMacro} className="space-y-3 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Macro Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Remote Bridge & Pi5 Update"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="remote">Remote Bridge</option>
                  <option value="system">System Health</option>
                  <option value="deployment">Deployment</option>
                  <option value="voice">Voice Sync</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Description</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief explanation of what this automation does..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300">
                  Multi-Line Commands (1 command per line) *
                </label>
                <span className="text-[10px] text-cyan-400">
                  {
                    formCommandsText
                      .split("\n")
                      .filter((l) => l.trim().length > 0 && !l.trim().startsWith("#")).length
                  }{" "}
                  steps
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={formCommandsText}
                onChange={(e) => setFormCommandsText(e.target.value)}
                placeholder={`npx @wonderwhy-er/desktop-commander@latest remote\nstatus\nhardware\ng.ts voice`}
                className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
              <p className="text-[10px] text-slate-500">
                Each line will be sequentially executed in order. Lines starting with # are treated as comments.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("macros")}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Macro</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
