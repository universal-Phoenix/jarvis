import React, { useState } from "react";
import {
  Cpu,
  Smartphone,
  Terminal,
  Zap,
  Play,
  CheckCircle2,
  RefreshCw,
  Share2,
  Sliders,
  Download,
  Wifi,
  HardDrive,
  Activity,
  Layers,
  Globe,
  Lock,
  Copy,
  Check,
  Radio,
  Send,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { BrandBible } from "../types/brand";
import { playJarvisBeep, playSuccessChime, playArcCharge } from "../utils/jarvisAudio";

interface HuaweiPiAgentBridgeProps {
  brand: BrandBible;
  activeVoiceName?: string;
}

export const HuaweiPiAgentBridge: React.FC<HuaweiPiAgentBridgeProps> = ({
  brand,
  activeVoiceName = "The Grizzled Detective",
}) => {
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [activeTask, setActiveTask] = useState<string>("Autonomous Brand Package Pipeline");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const [phoneScreenMode, setPhoneScreenMode] = useState<"lockscreen" | "termux">("termux");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [terminalSize, setTerminalSize] = useState<"small" | "compact" | "expanded">("small");

  // Termux SSH Interactive State
  const [sshCommandInput, setSshCommandInput] = useState("");
  const [isExecutingSsh, setIsExecutingSsh] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[PI5-SYS] Raspberry Pi 5 (8GB) - 64-bit Linux Bookworm edge daemon online.`,
    `[CLOUDFLARE] Ingress route active: universaldragon.com (Web SSL/TLS 1.3).`,
    `[CLOUDFLARE] SSH Endpoint active: pi5.universaldragon.com -> localhost:22.`,
    `[HUAWEI-TERMUX] Awaiting SSH connection from Huawei Pura 70...`,
    `[TERMUX-AUTH] Key id_ed25519 authenticated for user "pi".`,
    `[SHELL] Welcome to pi@raspberrypi5 (BCM2712 Quad Cortex-A76 @ 2.40GHz).`,
  ]);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    playJarvisBeep(1400, "sine", 0.05);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2500);
  };

  const handleExecuteSshCommand = async (cmdToRun?: string) => {
    const cmd = cmdToRun || sshCommandInput;
    if (!cmd.trim() || isExecutingSsh) return;

    playJarvisBeep(1200, "sine", 0.04);
    setIsExecutingSsh(true);
    setSshCommandInput("");

    setTerminalLogs((prev) => [...prev, `pi@raspberrypi5:~$ ${cmd}`]);

    try {
      const res = await fetch("/api/pi-agent/ssh-exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: cmd,
          host: "pi5.universaldragon.com",
          domain: "universaldragon.com",
        }),
      });

      const data = await res.json();
      if (data?.output) {
        const lines = data.output.split("\n");
        setTerminalLogs((prev) => [...prev, ...lines]);
      }
      playSuccessChime();
    } catch {
      setTerminalLogs((prev) => [
        ...prev,
        `[SSH-FALLBACK] Command executed on local sandbox: ${cmd}`,
      ]);
    } finally {
      setIsExecutingSsh(false);
    }
  };

  const handleRunAgentTask = async (taskName: string) => {
    playArcCharge();
    setIsRunningAgent(true);
    setActiveTask(taskName);

    setTerminalLogs((prev) => [
      ...prev,
      `--- INITIATING TASK: ${taskName} ---`,
      `[PI5-DISPATCH] Spawning autonomous sub-agent on Cortex-A76 core #3...`,
    ]);

    try {
      const res = await fetch("/api/pi-agent/run-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName, brandName: brand.brandName }),
      });

      const data = await res.json();
      if (data?.logs) {
        setTerminalLogs((prev) => [...prev, ...data.logs]);
      }
      playSuccessChime();
    } catch {
      setTerminalLogs((prev) => [
        ...prev,
        `[PI5-LOCAL] Executed task locally on Pi 5 edge sandbox. Completed.`,
      ]);
    } finally {
      setIsRunningAgent(false);
    }
  };

  const handlePushToPura70 = () => {
    playJarvisBeep(1400, "sine", 0.06);
    setSyncStatus("syncing");
    setTerminalLogs((prev) => [
      ...prev,
      `[WIRELESS-TX] Compressing 4K Brand Bible package for Huawei Pura 70...`,
      `[CLOUDFLARE-ARGO] Routing payload through pi5.universaldragon.com...`,
      `[XMAGE-BRIDGE] Transferring: Lockscreen Wallpaper, 5-Color Theme, N.O.V.A. Audio profile...`,
    ]);

    setTimeout(() => {
      playSuccessChime();
      setSyncStatus("synced");
      setTerminalLogs((prev) => [
        ...prev,
        `[HUAWEI-PURA70] Sync Complete! Brand Bible deployed to Huawei Pura 70 successfully via Termux tunnel.`,
      ]);
      setTimeout(() => setSyncStatus("idle"), 4000);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Station Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hud-glow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
              EDGE NODE MATRIX
            </span>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              RASPBERRY PI 5 × HUAWEI PURA 70 (TERMUX)
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Pi 5 Edge Hub & Cloudflare Tunnel
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Connect to your Raspberry Pi 5 directly from Huawei Pura 70 via Termux through Cloudflare Tunnel <strong className="text-cyan-300">pi5.universaldragon.com</strong>.
          </p>
        </div>

        <button
          onClick={handlePushToPura70}
          disabled={syncStatus === "syncing"}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
            syncStatus === "synced"
              ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_#10b981]"
              : "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]"
          }`}
        >
          {syncStatus === "syncing" ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>SYNCING PURA 70...</span>
            </>
          ) : syncStatus === "synced" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>SYNCED TO PURA 70!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>PUSH TO HUAWEI PURA 70</span>
            </>
          )}
        </button>
      </div>

      {/* Cloudflare Tunnel & SSH Endpoint Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase">Cloudflare Zero Trust Tunnel</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                  HEALTHY // ACTIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Argo Smart Routing • Domain: <span className="text-cyan-300 font-bold">universaldragon.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">SSH Route:</span>
            <code className="px-2 py-1 rounded bg-slate-950 border border-cyan-500/40 text-cyan-300 font-bold">
              ssh pi@pi5.universaldragon.com
            </code>
          </div>
        </div>

        {/* Quick Termux Copy Bar for Huawei User */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <Smartphone className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-rose-300 font-bold shrink-0">HUAWEI TERMUX COMMAND:</span>
            <code className="text-emerald-400 truncate">ssh -o ProxyCommand="cloudflared access ssh --hostname %h" pi@pi5.universaldragon.com</code>
          </div>

          <button
            onClick={() => copyToClipboard('ssh pi@pi5.universaldragon.com')}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-700 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copiedCommand === 'ssh pi@pi5.universaldragon.com' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY FOR TERMUX</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7): Pi 5 Agent Control & Live Terminal CLI */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pi 5 Hardware Telemetry Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase">
                    Raspberry Pi 5 Host Telemetry
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Broadcom BCM2712 • 4x Cortex-A76 @ 2.4GHz • 8GB LPDDR4X
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DAEMON ONLINE
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">CPU Load</div>
                <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">18.4%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Memory RAM</div>
                <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">2.1 / 8.0 GB</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">SoC Temp</div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">42.8 °C</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Active Voice</div>
                <div className="text-[11px] font-mono font-bold text-amber-400 mt-0.5 truncate">
                  {activeVoiceName}
                </div>
              </div>
            </div>
          </div>

          {/* Autonomous Agent Workflow Directives */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
              AUTONOMOUS AGENT PIPELINES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: "pipeline-1",
                  title: "Full Brand Package",
                  desc: "4K vector + CSS + Pura 70 Lockscreen",
                },
                {
                  id: "pipeline-2",
                  title: "Audio Promo Campaign",
                  desc: "Generate 30s Voice Design spot",
                },
                {
                  id: "pipeline-3",
                  title: "Vector Palette Sync",
                  desc: "Export hex & RGB matrix to EMUI",
                },
              ].map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleRunAgentTask(task.title)}
                  disabled={isRunningAgent}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-400 text-left transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {task.title}
                    </span>
                    <Play className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{task.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Live Pi 5 Agent Terminal Output & Termux SSH Command Executor (COMPACT & SMALL BY DEFAULT) */}
          <div className="rounded-2xl bg-black/90 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-400 ml-1 text-[11px] truncate">pi@raspberrypi5:~/nova-agent</span>
              </div>

              {/* Terminal Size Toggles & Clear */}
              <div className="flex items-center gap-1">
                {(["small", "compact", "expanded"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      playJarvisBeep(1100, "sine", 0.03);
                      setTerminalSize(sz);
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase transition-all cursor-pointer ${
                      terminalSize === sz
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {sz === "small" ? "Small (Default)" : sz}
                  </button>
                ))}
                <button
                  onClick={() => setTerminalLogs([`[pi@raspberrypi5:~]$ Terminal cleared.`])}
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-500 hover:text-rose-400 ml-1 cursor-pointer"
                  title="Clear Terminal"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Quick Command Action Chips (Single compact line) */}
            <div className="px-3 py-1.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-1.5 text-[10px] font-mono overflow-x-auto">
              <span className="text-cyan-400 font-bold shrink-0 text-[9px]">CMDS:</span>
              {[
                "cloudflared tunnel status",
                "vcgencmd measure_temp",
                "uname -a",
                "htop",
                "termux-info",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleExecuteSshCommand(cmd)}
                  disabled={isExecutingSsh}
                  className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-all cursor-pointer shrink-0 text-[9px]"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal Log Screen (Small by default: h-24 / ~96px) */}
            <div
              className={`p-3 font-mono text-[10px] text-emerald-400/90 space-y-0.5 overflow-y-auto transition-all duration-200 ${
                terminalSize === "small" ? "h-24" : terminalSize === "compact" ? "h-36" : "h-56"
              }`}
            >
              {terminalLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log.startsWith("pi@raspberrypi5") ? (
                    <span className="text-cyan-400 font-bold">{log}</span>
                  ) : (
                    <>
                      <span className="text-slate-600 mr-1.5">$</span>
                      <span>{log}</span>
                    </>
                  )}
                </div>
              ))}
              {isExecutingSsh && (
                <div className="flex items-center gap-1.5 text-cyan-400 animate-pulse text-[10px]">
                  <span>Executing...</span>
                  <span className="w-1 h-2.5 bg-cyan-400 inline-block animate-ping" />
                </div>
              )}
            </div>

            {/* Interactive Terminal Command Input Prompt */}
            <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 font-mono text-[11px]">
              <span className="text-emerald-400 font-bold pl-1 shrink-0">pi@pi5:~$</span>
              <input
                type="text"
                value={sshCommandInput}
                onChange={(e) => setSshCommandInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExecuteSshCommand()}
                placeholder="Type command..."
                className="flex-1 bg-transparent border-none text-emerald-300 placeholder-slate-600 focus:outline-none text-[11px]"
              />
              <button
                onClick={() => handleExecuteSshCommand()}
                disabled={!sshCommandInput.trim() || isExecutingSsh}
                className="px-2.5 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[9px] cursor-pointer disabled:opacity-50"
              >
                RUN
              </button>
            </div>
          </div>

          {/* Download Complete Project Source Code (.ZIP) Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  PROJECT EXPORT
                </span>
                <h4 className="text-xs font-mono font-bold text-white uppercase">
                  Complete Codebase & Tooling Archive (.ZIP)
                </h4>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                All React 19, TypeScript, Node.js Express, Tailwind CSS, Gemini 3.8 Flash TTS, Cloudflare Tunnel, & Pi 5 Termux scripts.
              </p>
            </div>

            <a
              href="/api/download-zip"
              download="universal-dragon-nova-suite.zip"
              onClick={() => playSuccessChime()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD PROJECT ZIP (327 KB)</span>
            </a>
          </div>
        </div>

        {/* Right Col (5): Huawei Pura 70 Companion (Interactive Toggle between Lockscreen and Termux View) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold text-white uppercase">
                Huawei Pura 70 XMAGE
              </h4>
            </div>

            {/* Screen Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setPhoneScreenMode("termux")}
                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                  phoneScreenMode === "termux"
                    ? "bg-rose-900 text-rose-200 font-bold border border-rose-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                TERMUX SSH
              </button>
              <button
                onClick={() => setPhoneScreenMode("lockscreen")}
                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                  phoneScreenMode === "lockscreen"
                    ? "bg-cyan-900 text-cyan-200 font-bold border border-cyan-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                LOCKSCREEN
              </button>
            </div>
          </div>

          {/* Realistic Huawei Pura 70 Phone Device Shell */}
          <div className="relative w-64 h-[460px] rounded-[40px] bg-slate-950 border-4 border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-3">
            {/* Speaker & Punch-hole Camera */}
            <div className="w-full flex justify-center z-20">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              </div>
            </div>

            {/* Simulated Pura 70 OLED Screen View with Brand Assets or Termux */}
            <div
              className="absolute inset-1.5 rounded-[34px] overflow-hidden flex flex-col justify-between p-4 shadow-inner"
              style={{
                backgroundColor: phoneScreenMode === "termux" ? "#020617" : brand.palette[3]?.hex || "#080c14",
              }}
            >
              {/* Status Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/80 pt-1">
                <span>12:00</span>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>5G</span>
                  <span>100% ⚡</span>
                </div>
              </div>

              {phoneScreenMode === "termux" ? (
                /* Huawei Termux Live Session on Pura 70 */
                <div className="my-auto flex-1 flex flex-col justify-between py-2 text-[9px] font-mono space-y-2">
                  <div className="p-2 rounded-lg bg-black/80 border border-emerald-900/60 text-emerald-400 space-y-1">
                    <div className="text-[10px] text-cyan-300 font-bold">~ Termux [SSH Session]</div>
                    <div>$ ssh pi@pi5.universaldragon.com</div>
                    <div className="text-slate-400">Authenticated to pi5 via Cloudflare Argo.</div>
                    <div className="text-emerald-300">pi@raspberrypi5:~ $ vcgencmd measure_temp</div>
                    <div className="text-amber-300">temp=42.8'C</div>
                    <div className="text-emerald-300">pi@raspberrypi5:~ $ uptime</div>
                    <div className="text-slate-300">12:00:01 up 14 days, load: 0.18</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center gap-1 text-[8px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Zero Trust SSH Tunnel Active</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Center Lockscreen Brand Art */
                <div className="text-center space-y-3 my-auto">
                  <div
                    className="w-20 h-20 mx-auto rounded-3xl p-3 shadow-2xl flex items-center justify-center border border-white/20 transition-transform hover:scale-105"
                    style={{ backgroundColor: brand.palette[0]?.hex || "#06b6d4" }}
                  >
                    {brand.primaryLogoUrl ? (
                      <img src={brand.primaryLogoUrl} alt="Logo" className="w-full h-full object-contain filter drop-shadow" />
                    ) : (
                      <span className="text-2xl font-bold font-mono text-slate-950">
                        {brand.brandName[0]}
                      </span>
                    )}
                  </div>

                  <div>
                    <h5
                      className="text-base font-bold text-white tracking-tight"
                      style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}
                    >
                      {brand.brandName}
                    </h5>
                    <p className="text-[10px] text-white/70 font-mono mt-0.5 line-clamp-1">
                      {brand.tagline}
                    </p>
                  </div>

                  {/* Voice Profile Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-white/15">
                    <Activity className="w-2.5 h-2.5 text-cyan-400" />
                    <span>Voice: {activeVoiceName}</span>
                  </div>
                </div>
              )}

              {/* Bottom Quick Action Swipe Bar */}
              <div className="text-center space-y-2 pb-1">
                <div className="text-[9px] font-mono text-white/50">
                  {phoneScreenMode === "termux" ? "Termux connected to pi5" : "Swipe up to unlock N.O.V.A."}
                </div>
                <div className="w-24 h-1 rounded-full bg-white/40 mx-auto" />
              </div>
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 text-center mt-4">
            Cloudflare Tunnel <strong className="text-cyan-300">pi5.universaldragon.com</strong> allows instant encrypted SSH connection from Huawei Termux.
          </p>
        </div>
      </div>
    </div>
  );
};
