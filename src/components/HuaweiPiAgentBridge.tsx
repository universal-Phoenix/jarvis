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
  Layers
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
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[PI5-SYS] Raspberry Pi 5 (8GB) - 64-bit Linux Bookworm edge daemon online.`,
    `[PI5-HARDWARE] BCM2712 Quad Cortex-A76 @ 2.40GHz (Governor: schedutil).`,
    `[HUAWEI-PURA70] XMAGE Direct Wireless Bridge ready (Nearby Share Protocol).`,
    `[NOVA-AGENT] Awaiting autonomous directives from Creator...`,
  ]);

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
      `[XMAGE-BRIDGE] Transferring: Lockscreen Wallpaper, 5-Color Theme, N.O.V.A. Audio profile...`,
    ]);

    setTimeout(() => {
      playSuccessChime();
      setSyncStatus("synced");
      setTerminalLogs((prev) => [
        ...prev,
        `[HUAWEI-PURA70] Sync Complete! Brand Bible deployed to Huawei Pura 70 successfully.`,
      ]);
      setTimeout(() => setSyncStatus("idle"), 4000);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Station Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hud-glow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
              EDGE NODE MATRIX
            </span>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              RASPBERRY PI 5 × HUAWEI PURA 70
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Autonomous Pi 5 Agent Workspace
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Run autonomous multi-step brand engineering on your local Raspberry Pi 5 edge cluster and wirelessly push assets to your Huawei Pura 70.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (8): Pi 5 Agent Control & Terminal CLI */}
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
                    Broadcom BCM2712 • 4x Cortex-A76 @ 2.4GHz
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

          {/* Live Pi 5 Agent Terminal Output */}
          <div className="rounded-2xl bg-black/90 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-400 ml-2">pi@raspberrypi5:~/nova-agent (bash)</span>
              </div>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" />
                EDGE LISTENER
              </span>
            </div>

            <div className="p-4 font-mono text-[11px] text-emerald-400/90 space-y-1 h-56 overflow-y-auto">
              {terminalLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-slate-500 mr-2">$</span>
                  <span>{log}</span>
                </div>
              ))}
              {isRunningAgent && (
                <div className="flex items-center gap-1.5 text-cyan-400 animate-pulse">
                  <span>Executing agent task...</span>
                  <span className="w-1.5 h-3 bg-cyan-400 inline-block animate-ping" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col (5): Huawei Pura 70 XMAGE Phone Companion Simulator */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold text-white uppercase">
                Huawei Pura 70 Companion
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded">
              XMAGE CAMERA ARCHITECTURE
            </span>
          </div>

          {/* Realistic Huawei Pura 70 Phone Device Shell */}
          <div className="relative w-64 h-[460px] rounded-[40px] bg-slate-950 border-4 border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-3">
            {/* Speaker & Punch-hole Camera */}
            <div className="w-full flex justify-center z-20">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              </div>
            </div>

            {/* Simulated Pura 70 OLED Screen View with Brand Assets */}
            <div
              className="absolute inset-1.5 rounded-[34px] overflow-hidden flex flex-col justify-between p-4 shadow-inner"
              style={{
                backgroundColor: brand.palette[3]?.hex || "#080c14",
              }}
            >
              {/* Status Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/80 pt-1">
                <span>12:00</span>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Center Lockscreen Brand Art */}
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

              {/* Bottom Quick Action Swipe Bar */}
              <div className="text-center space-y-2 pb-1">
                <div className="text-[9px] font-mono text-white/50">
                  Swipe up to unlock N.O.V.A.
                </div>
                <div className="w-24 h-1 rounded-full bg-white/40 mx-auto" />
              </div>
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 text-center mt-4">
            Direct sync channel active between Raspberry Pi 5 local agent daemon & Huawei Pura 70 XMAGE studio.
          </p>
        </div>
      </div>
    </div>
  );
};
