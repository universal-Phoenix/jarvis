import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Trash2,
  Check,
  Smartphone,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  Play,
  Terminal,
  Shield,
  Layers,
  Box,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  ExternalLink,
  Code,
  HardDrive,
  Radio,
  FileCode,
  Sparkles,
  X,
  ChevronRight,
  Zap,
  Activity,
  Pause,
  Sliders,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { playJarvisBeep, playSuccessChime } from "../utils/jarvisAudio";

export interface SoftwarePackage {
  id: string;
  name: string;
  description: string;
  category: "mobile-apk" | "pi5-deb" | "nova-runtime" | "script";
  platform: "Android ARM64" | "Raspberry Pi 5 (BCM2712)" | "Linux x86_64" | "Cross-Platform";
  version: string;
  size: string;
  developer: string;
  icon: string;
  installPath: string;
  launchCommand: string;
  dependencies: string[];
  filename: string;
  downloadUrl: string;
  status: "installed" | "not-installed" | "installing" | "uninstalling";
  pid?: number;
  memoryMb?: number;
  cpuLoad?: number;
  signalState?: string;
  installStage?: string;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  packageId: string;
  packageName: string;
  level: "INFO" | "EXEC" | "SIGNAL" | "WARN" | "SUCCESS" | "ERROR";
  message: string;
  pid?: number;
}

const DEFAULT_PACKAGES: SoftwarePackage[] = [
  {
    id: "app-ud-mobile",
    name: "Universal Dragon Mobile Companion",
    description: "Sovereign Android mobile app with 3D dragon visualizer, voice control, and telemetry.",
    category: "mobile-apk",
    platform: "Android ARM64",
    version: "v6.1.4",
    size: "48.2 MB",
    developer: "Universal Dragon Research",
    icon: "🐉",
    installPath: "/data/app/com.universaldragon.mobile-1/base.apk",
    launchCommand: "am start -n com.universaldragon.mobile/.MainActivity",
    dependencies: ["Android 10+", "OpenGL ES 3.2", "Termux Bridge"],
    filename: "UniversalDragon_v6.1_arm64.apk",
    downloadUrl: "/api/apps/download/ud-mobile-apk",
    status: "installed",
    pid: 8042,
    memoryMb: 112,
    cpuLoad: 3.4,
    signalState: "SIGCONT (Running)",
    installStage: "POSTINST / READY",
  },
  {
    id: "app-nova-bridge",
    name: "NOVA Mobile Camera & Voice Bridge",
    description: "High-speed audio/video stream bridge for Huawei Pura 70 and Termux nodes.",
    category: "mobile-apk",
    platform: "Android ARM64",
    version: "v4.8.0",
    size: "18.5 MB",
    developer: "N.O.V.A. Core Team",
    icon: "⚡",
    installPath: "/data/app/com.nova.bridge-1/base.apk",
    launchCommand: "termux-exec nova_bridge_parser.py",
    dependencies: ["Termux v0.118", "Python 3.11", "OpenCV 4.10"],
    filename: "NOVA_Mobile_Bridge_v4.8.apk",
    downloadUrl: "/api/apps/download/nova-bridge-apk",
    status: "installed",
    pid: 9114,
    memoryMb: 68,
    cpuLoad: 1.8,
    signalState: "SIGCONT (Active)",
    installStage: "BRIDGE_LISTEN",
  },
  {
    id: "app-qbit-nova-c",
    name: "qbit-nova-c BCM2712 Runtime",
    description: "Native C/C++ hyper-concurrent actor language compiler optimized for Broadcom BCM2712.",
    category: "pi5-deb",
    platform: "Raspberry Pi 5 (BCM2712)",
    version: "v4.8.0-release",
    size: "34.1 MB",
    developer: "QBIT NOVA Labs",
    icon: "🐧",
    installPath: "/usr/local/bin/qbit-nova-c",
    launchCommand: "qbit-nova-c --runtime-status",
    dependencies: ["glibc 2.36", "libv3d-compute", "libssl3"],
    filename: "qbit-nova-c_v4.8.0_arm64.deb",
    downloadUrl: "/api/apps/download/pi5-qbit-deb",
    status: "installed",
    pid: 14092,
    memoryMb: 215,
    cpuLoad: 5.2,
    signalState: "SIGUSR1 (Healthy)",
    installStage: "SYSTEMD_SERVICE",
  },
  {
    id: "app-udos-2100",
    name: "UDOS 2100 Sovereign Operating System",
    description: "Full sovereign mobile operating system suite with zero-latency speech synthesis.",
    category: "mobile-apk",
    platform: "Android ARM64",
    version: "v2100.3.1",
    size: "85.0 MB",
    developer: "UDOS Autonomous Team",
    icon: "📱",
    installPath: "/data/app/com.udos.sovereign-1/base.apk",
    launchCommand: "udos_pi5_mobile_resume.sh",
    dependencies: ["Android 11+", "UDOS Microkernel", "Ollama Local"],
    filename: "UDOS_2100_Sovereign_OS.apk",
    downloadUrl: "/api/apps/download/udos-mobile-apk",
    status: "not-installed",
    pid: undefined,
    memoryMb: 0,
    cpuLoad: 0,
    signalState: "INACTIVE",
    installStage: "NOT_INSTALLED",
  },
  {
    id: "app-novakutty-brain",
    name: "Novakutty Pi 5 Offline Local Brain",
    description: "Offline local language weights, Madras Tamil speech dialect models, and acoustic profiles.",
    category: "nova-runtime",
    platform: "Raspberry Pi 5 (BCM2712)",
    version: "v5.2.3-final",
    size: "142 MB",
    developer: "Novakutty AI",
    icon: "📦",
    installPath: "/home/aslam/novakutty-dragon-brain",
    launchCommand: "bash askutty_core_readonly.sh",
    dependencies: ["Ollama 0.3.14", "eSpeak-NG", "FFmpeg"],
    filename: "novakutty-pi5-v0.4.tar.gz",
    downloadUrl: "/api/apps/download/novakutty-weights",
    status: "installed",
    pid: 12401,
    memoryMb: 480,
    cpuLoad: 2.1,
    signalState: "SIGCONT (Warm)",
    installStage: "OLLAMA_MOUNTED",
  },
  {
    id: "app-hyper-dragon-installer",
    name: "Hyper Dragon 1-Click Setup Shell Script",
    description: "Automated bash setup script provisioning Cloudflare tunnels, Pi 5 services, and audio tools.",
    category: "script",
    platform: "Linux x86_64",
    version: "v1.0.0",
    size: "4.2 KB",
    developer: "Universal Dragon",
    icon: "📜",
    installPath: "/home/aslam/install_hyper_dragon.sh",
    launchCommand: "bash /home/aslam/install_hyper_dragon.sh",
    dependencies: ["bash", "curl", "sudo"],
    filename: "install_hyper_dragon_pi5.sh",
    downloadUrl: "/api/apps/download/pi5-auto-install",
    status: "not-installed",
    pid: undefined,
    memoryMb: 0,
    cpuLoad: 0,
    signalState: "INACTIVE",
    installStage: "NOT_INSTALLED",
  },
];

const INITIAL_LOGS: SystemLogEntry[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 15000).toLocaleTimeString(),
    packageId: "app-qbit-nova-c",
    packageName: "qbit-nova-c BCM2712 Runtime",
    level: "INFO",
    message: "Initializing BCM2712 actor runtime core v4.8.0...",
    pid: 14092,
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 12000).toLocaleTimeString(),
    packageId: "app-novakutty-brain",
    packageName: "Novakutty Pi 5 Offline Local Brain",
    level: "EXEC",
    message: "Ollama local weights loaded into RAM (480MB RSS | Tamil dialect active)",
    pid: 12401,
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 8000).toLocaleTimeString(),
    packageId: "app-nova-bridge",
    packageName: "NOVA Mobile Camera & Voice Bridge",
    level: "SIGNAL",
    message: "Process signal SIGCONT received from Huawei Pura 70 Termux listener",
    pid: 9114,
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 4000).toLocaleTimeString(),
    packageId: "app-ud-mobile",
    packageName: "Universal Dragon Mobile Companion",
    level: "SUCCESS",
    message: "Package verify SHA256 passed: 8f9a2b... [Install status: INSTALLED]",
    pid: 8042,
  },
];

export const ApplicationManager: React.FC = () => {
  const [packages, setPackages] = useState<SoftwarePackage[]>(() => {
    try {
      const saved = localStorage.getItem("ud_app_manager_states");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PACKAGES;
  });

  const [activeTab, setActiveTab] = useState<"software-center" | "system-diagnostics">(
    "software-center"
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusPackage, setSelectedStatusPackage] = useState<SoftwarePackage | null>(null);
  const [installProgress, setInstallProgress] = useState<{ id: string; percent: number } | null>(null);

  // System Diagnostics View States
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>(INITIAL_LOGS);
  const [isStreamPaused, setIsStreamPaused] = useState(false);
  const [logLevelFilter, setLogLevelFilter] = useState<string>("ALL");
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [selectedLogPackageId, setSelectedLogPackageId] = useState<string>("ALL");

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Save state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ud_app_manager_states", JSON.stringify(packages));
    } catch {}
  }, [packages]);

  // Simulated live system log tick every 2.5s if not paused
  useEffect(() => {
    if (isStreamPaused) return;

    const interval = setInterval(() => {
      const installedPkgs = packages.filter((p) => p.status === "installed");
      if (installedPkgs.length === 0) return;

      const randomPkg = installedPkgs[Math.floor(Math.random() * installedPkgs.length)];
      const logMessages = [
        `Heartbeat signal check SIGUSR1 ok for PID ${randomPkg.pid || 8000}`,
        `Memory RSS check: ${randomPkg.memoryMb || 120}MB allocated on Broadcom BCM2712`,
        `Direct IPC pipe ping to pi5.universaldragon.com:22 (latency: 1.2ms)`,
        `Process signal SIGCONT verified for ${randomPkg.filename}`,
        `Ollama acoustic sync tick: Tamil/Tanglish audio buffer ready`,
      ];

      const levels: SystemLogEntry["level"][] = ["INFO", "EXEC", "SIGNAL", "SUCCESS"];
      const selectedLevel = levels[Math.floor(Math.random() * levels.length)];
      const selectedMsg = logMessages[Math.floor(Math.random() * logMessages.length)];

      const newEntry: SystemLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        packageId: randomPkg.id,
        packageName: randomPkg.name,
        level: selectedLevel,
        message: selectedMsg,
        pid: randomPkg.pid || Math.floor(8000 + Math.random() * 2000),
      };

      setSystemLogs((prev) => [...prev.slice(-120), newEntry]);
    }, 2500);

    return () => clearInterval(interval);
  }, [packages, isStreamPaused]);

  // Auto scroll logs container when new logs arrive in diagnostics view
  useEffect(() => {
    if (activeTab === "system-diagnostics" && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [systemLogs, activeTab]);

  const appendSystemLog = (
    pkg: SoftwarePackage,
    level: SystemLogEntry["level"],
    message: string
  ) => {
    const newLog: SystemLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      packageId: pkg.id,
      packageName: pkg.name,
      level,
      message,
      pid: pkg.pid || Math.floor(8000 + Math.random() * 2000),
    };
    setSystemLogs((prev) => [...prev, newLog]);
  };

  const handleInstallPackage = (pkg: SoftwarePackage) => {
    playJarvisBeep(1200, "sine", 0.04);
    const assignedPid = Math.floor(8000 + Math.random() * 2000);

    appendSystemLog(
      pkg,
      "INFO",
      `Initiating installation pipeline for ${pkg.filename} (${pkg.size})...`
    );

    // Update status to installing
    setPackages((prev) =>
      prev.map((p) =>
        p.id === pkg.id
          ? {
              ...p,
              status: "installing",
              pid: assignedPid,
              installStage: "FETCH_PKG",
              signalState: "SIGCONT (Installing)",
            }
          : p
      )
    );

    let current = 0;
    const stages = ["FETCH_PKG", "VERIFY_SHA256", "UNPACK_TGZ", "DPKG_INSTALL", "POSTINST", "READY"];

    const interval = setInterval(() => {
      current += 20;
      const stageIdx = Math.min(stages.length - 1, Math.floor((current / 100) * stages.length));
      const currentStage = stages[stageIdx];

      setInstallProgress({ id: pkg.id, percent: current });

      appendSystemLog(
        pkg,
        "EXEC",
        `[Stage ${currentStage}] Progress ${current}% | PID ${assignedPid}`
      );

      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, installStage: currentStage } : p))
      );

      if (current >= 100) {
        clearInterval(interval);
        setInstallProgress(null);
        playSuccessChime();

        appendSystemLog(
          pkg,
          "SUCCESS",
          `Installation complete for ${pkg.name}. Status set to INSTALLED [PID ${assignedPid}]`
        );

        setPackages((prev) =>
          prev.map((p) =>
            p.id === pkg.id
              ? {
                  ...p,
                  status: "installed",
                  memoryMb: Math.floor(50 + Math.random() * 200),
                  cpuLoad: parseFloat((1.5 + Math.random() * 4).toFixed(1)),
                  signalState: "SIGCONT (Running)",
                  installStage: "SYSTEMD_ACTIVE",
                }
              : p
          )
        );
      }
    }, 350);
  };

  const handleUninstallPackage = (pkg: SoftwarePackage) => {
    if (!window.confirm(`Uninstall "${pkg.name}" from target system?`)) return;

    playJarvisBeep(900, "sine", 0.04);

    appendSystemLog(
      pkg,
      "WARN",
      `Sending SIGTERM signal to PID ${pkg.pid || 8000} for package removal...`
    );

    setPackages((prev) =>
      prev.map((p) =>
        p.id === pkg.id
          ? { ...p, status: "uninstalling", signalState: "SIGTERM (Stopping)" }
          : p
      )
    );

    setTimeout(() => {
      appendSystemLog(pkg, "INFO", `Purged binary and config files at ${pkg.installPath}`);

      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkg.id
            ? {
                ...p,
                status: "not-installed",
                pid: undefined,
                memoryMb: 0,
                cpuLoad: 0,
                signalState: "INACTIVE",
                installStage: "NOT_INSTALLED",
              }
            : p
        )
      );
      playJarvisBeep(1400, "sine", 0.05);
    }, 800);
  };

  const handleSendSignalToPackage = (pkg: SoftwarePackage, signalName: string) => {
    playJarvisBeep(1300, "sine", 0.03);

    const updatedSignal = `${signalName} (Acknowledged)`;
    appendSystemLog(
      pkg,
      "SIGNAL",
      `Manual process signal '${signalName}' dispatched to PID ${pkg.pid || 8000} (${pkg.name})`
    );

    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, signalState: updatedSignal } : p))
    );
  };

  const handleResetDefaultPackages = () => {
    if (window.confirm("Reset all software packages to default factory state?")) {
      setPackages(DEFAULT_PACKAGES);
      setSystemLogs(INITIAL_LOGS);
      try {
        localStorage.removeItem("ud_app_manager_states");
      } catch {}
      playSuccessChime();
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "mobile-apk" && pkg.category === "mobile-apk") ||
      (activeCategory === "pi5-deb" && pkg.category === "pi5-deb") ||
      (activeCategory === "nova-runtime" && pkg.category === "nova-runtime") ||
      (activeCategory === "script" && pkg.category === "script");

    const matchesSearch =
      !searchQuery ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.filename.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const filteredLogs = systemLogs.filter((log) => {
    const matchesLevel = logLevelFilter === "ALL" || log.level === logLevelFilter;
    const matchesPackage = selectedLogPackageId === "ALL" || log.packageId === selectedLogPackageId;
    const matchesSearch =
      !logSearchQuery ||
      log.message.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.packageName.toLowerCase().includes(logSearchQuery.toLowerCase());

    return matchesLevel && matchesPackage && matchesSearch;
  });

  const installedCount = packages.filter((p) => p.status === "installed").length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-mono text-slate-100 pb-12 select-none">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              SYSTEM APPLICATION MANAGER
            </span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
              {installedCount} / {packages.length} INSTALLED
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-['Space_Grotesk']">
            <Box className="w-7 h-7 text-emerald-400" />
            <span>Software Center & System Diagnostics</span>
          </h1>
          <p className="text-xs text-slate-400">
            Install, manage, inspect, and monitor process signals & real-time installation logs for Android APKs, Pi 5 Debian packages, and NOVA runtimes.
          </p>
        </div>

        {/* View Mode Switcher: Software Center vs System Diagnostics */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveTab("software-center");
              }}
              className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === "software-center"
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)] font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Software Center</span>
            </button>

            <button
              onClick={() => {
                playJarvisBeep(1200, "sine", 0.04);
                setActiveTab("system-diagnostics");
              }}
              className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === "system-diagnostics"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>System Diagnostics</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </button>
          </div>

          <button
            onClick={handleResetDefaultPackages}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            title="Reset All Software States"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SOFTWARE CENTER */}
      {activeTab === "software-center" && (
        <>
          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: "all", label: "All Software", count: packages.length },
                {
                  id: "mobile-apk",
                  label: "Android APKs",
                  count: packages.filter((p) => p.category === "mobile-apk").length,
                },
                {
                  id: "pi5-deb",
                  label: "Pi 5 Debian (.deb)",
                  count: packages.filter((p) => p.category === "pi5-deb").length,
                },
                {
                  id: "nova-runtime",
                  label: "NOVA Runtimes",
                  count: packages.filter((p) => p.category === "nova-runtime").length,
                },
                {
                  id: "script",
                  label: "Scripts",
                  count: packages.filter((p) => p.category === "script").length,
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playJarvisBeep(1100, "sine", 0.03);
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-850"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-900/80 text-[10px]">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Instant Search Input */}
            <div className="relative flex items-center w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages by name or developer..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Software Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const isInstalled = pkg.status === "installed";
              const isInstalling = pkg.status === "installing";
              const isUninstalling = pkg.status === "uninstalling";

              return (
                <div
                  key={pkg.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden"
                >
                  {/* Progress Overlay during installation */}
                  {isInstalling && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-950">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_#22d3ee]"
                        style={{
                          width: `${
                            installProgress?.id === pkg.id ? installProgress.percent : 40
                          }%`,
                        }}
                      />
                    </div>
                  )}

                  {/* Package Top Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                          {pkg.icon}
                        </span>
                        <div>
                          <h3 className="font-bold text-white text-base leading-snug">{pkg.name}</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">{pkg.developer}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 uppercase tracking-wider ${
                          isInstalled
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : isInstalling
                            ? "bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse"
                            : isUninstalling
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        {isInstalling
                          ? `INSTALLING (${installProgress?.percent || 20}%)`
                          : isUninstalling
                          ? "REMOVING..."
                          : isInstalled
                          ? "INSTALLED"
                          : "NOT INSTALLED"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{pkg.description}</p>

                    {/* Package Specs Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {pkg.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                        {pkg.version}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {pkg.size}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Toolbar: Install, Uninstall, Status */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* STATUS BUTTON */}
                      <button
                        onClick={() => {
                          playJarvisBeep(1100, "sine", 0.03);
                          setSelectedStatusPackage(pkg);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                        title="View Package Status & Diagnostic Details"
                      >
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Status</span>
                      </button>

                      {/* FILE DOWNLOAD PACKAGE BUTTON */}
                      <a
                        href={pkg.downloadUrl}
                        download={pkg.filename}
                        className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800 text-xs cursor-pointer transition-all"
                        title={`Download real ${pkg.filename} file`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* INSTALL / UNINSTALL BUTTONS */}
                    <div>
                      {isInstalled ? (
                        <button
                          onClick={() => handleUninstallPackage(pkg)}
                          disabled={isUninstalling}
                          className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 hover:border-rose-700 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Uninstall</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleInstallPackage(pkg)}
                          disabled={isInstalling}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isInstalling ? "Installing..." : "Install"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* VIEW 2: SYSTEM DIAGNOSTICS & PROCESS SIGNALS */}
      {activeTab === "system-diagnostics" && (
        <div className="space-y-6">
          {/* Per-Package Process Signals & Live Status Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-wider uppercase">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Process Signals & Installation Progress Telemetry</span>
              </h2>
              <span className="text-xs text-slate-400">
                Broadcom BCM2712 / Android ARM64 Target Signals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{pkg.icon}</span>
                      <div>
                        <h3 className="font-bold text-white text-xs leading-snug">{pkg.name}</h3>
                        <p className="text-[10px] text-slate-400">PID: {pkg.pid || "INACTIVE"}</p>
                      </div>
                    </div>

                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${
                        pkg.status === "installed"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : pkg.status === "installing"
                          ? "bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  {/* Stage & Signal Indicators */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 space-y-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Signal State:</span>
                      <span className="text-cyan-400 font-bold">{pkg.signalState || "INACTIVE"}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>Install Stage:</span>
                      <span className="text-amber-300 font-bold">{pkg.installStage || "READY"}</span>
                    </div>

                    {pkg.status === "installed" && (
                      <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                        <span>Memory / CPU:</span>
                        <span className="text-emerald-400">
                          {pkg.memoryMb || 85}MB | {pkg.cpuLoad || 1.2}% CPU
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Process Signal Dispatch Buttons */}
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <button
                      onClick={() => handleSendSignalToPackage(pkg, "SIGUSR1")}
                      disabled={pkg.status !== "installed"}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer disabled:opacity-40"
                      title="Send SIGUSR1 (Health Check signal)"
                    >
                      SIGUSR1
                    </button>
                    <button
                      onClick={() => handleSendSignalToPackage(pkg, "SIGCONT")}
                      disabled={pkg.status !== "installed"}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white cursor-pointer disabled:opacity-40"
                      title="Send SIGCONT (Resume signal)"
                    >
                      SIGCONT
                    </button>
                    <button
                      onClick={() => handleSendSignalToPackage(pkg, "SIGTERM")}
                      disabled={pkg.status !== "installed"}
                      className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 cursor-pointer disabled:opacity-40"
                      title="Send SIGTERM (Graceful termination)"
                    >
                      SIGTERM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Live System Log Console */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-2xl">
            {/* Console Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs tracking-wider">
                  REAL-TIME SYSTEM DIAGNOSTIC LOG STREAM
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px]">
                  {filteredLogs.length} LOGS
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Level Filter */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
                  {["ALL", "INFO", "EXEC", "SIGNAL", "SUCCESS", "WARN"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogLevelFilter(lvl)}
                      className={`px-2 py-0.5 rounded cursor-pointer font-bold ${
                        logLevelFilter === lvl
                          ? "bg-cyan-500 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* Pause / Resume Button */}
                <button
                  onClick={() => setIsStreamPaused((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                    isStreamPaused
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {isStreamPaused ? (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Resume Stream</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 fill-current" />
                      <span>Pause Stream</span>
                    </>
                  )}
                </button>

                {/* Clear Logs */}
                <button
                  onClick={() => setSystemLogs([])}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Log Stream Output Box */}
            <div
              ref={logContainerRef}
              className="h-80 w-full p-4 rounded-xl bg-slate-950 border border-slate-850 overflow-y-auto font-mono text-xs leading-relaxed space-y-1.5 select-text"
            >
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-600 space-y-1">
                  <Terminal className="w-6 h-6 mx-auto text-slate-700 mb-1" />
                  <p>No system log entries matching current filter</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 break-all">
                    <span className="text-slate-500 shrink-0 text-[10px] font-mono pt-0.5">
                      [{log.timestamp}]
                    </span>

                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                        log.level === "INFO"
                          ? "bg-sky-950 text-sky-400 border border-sky-800"
                          : log.level === "EXEC"
                          ? "bg-purple-950 text-purple-300 border border-purple-800"
                          : log.level === "SIGNAL"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : log.level === "SUCCESS"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-rose-950 text-rose-300 border border-rose-800"
                      }`}
                    >
                      {log.level}
                    </span>

                    <span className="text-cyan-400 font-bold shrink-0">
                      [{log.packageName}]
                    </span>

                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Package Status & Diagnostics Detail Modal Drawer */}
      {selectedStatusPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 font-mono text-slate-200 relative">
            <button
              onClick={() => setSelectedStatusPackage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {selectedStatusPackage.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold uppercase">
                    {selectedStatusPackage.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                      selectedStatusPackage.status === "installed"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    {selectedStatusPackage.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedStatusPackage.name}
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
              {selectedStatusPackage.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  Target Platform
                </span>
                <p className="font-bold text-cyan-300">{selectedStatusPackage.platform}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  Package Size & Version
                </span>
                <p className="font-bold text-emerald-400">
                  {selectedStatusPackage.version} ({selectedStatusPackage.size})
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1 sm:col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  Installation Binary Target Path
                </span>
                <p className="font-mono text-cyan-400 text-xs break-all">
                  {selectedStatusPackage.installPath}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1 sm:col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  Terminal Launch Directive
                </span>
                <p className="font-mono text-amber-300 text-xs break-all">
                  {selectedStatusPackage.launchCommand}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase">
                System Dependencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStatusPackage.dependencies.map((dep, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px]"
                  >
                    ✓ {dep}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <a
                href={selectedStatusPackage.downloadUrl}
                download={selectedStatusPackage.filename}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Package File ({selectedStatusPackage.filename})</span>
              </a>

              <button
                onClick={() => setSelectedStatusPackage(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
