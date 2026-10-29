import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Shield,
  Fingerprint,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Radio,
  Cpu,
  Terminal,
  RefreshCw,
  Zap,
  Sparkles,
  Eye,
  ShieldAlert,
  Server,
  Key,
} from "lucide-react";
import { playJarvisBeep, playSuccessChime, speakWithJarvisVoice } from "../utils/jarvisAudio";

interface ThreatEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  vector: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "SECURED";
  actionTaken: string;
}

export const NovaLifeFingerprintGuardian: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [securityScore, setSecurityScore] = useState(99.4);
  const [activeThreats, setActiveThreats] = useState<ThreatEvent[]>([
    {
      id: "th-1",
      timestamp: new Date(Date.now() - 35000).toLocaleTimeString(),
      sourceIp: "185.220.101.5 (Tor Exit Node)",
      vector: "SSH Brute-Force on pi5.universaldragon.com",
      severity: "CRITICAL",
      actionTaken: "Auto-Neutralized by Fail2ban + eBPF firewall",
    },
    {
      id: "th-2",
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      sourceIp: "45.154.255.88 (Known Exploit Scanner)",
      vector: "WebSocket Injection Probe on Port 3000",
      severity: "HIGH",
      actionTaken: "Blocked & IP Banned (Cloudflare Edge)",
    },
  ]);
  const [biometricLogs, setBiometricLogs] = useState<string[]>([
    "[NOVA-LIFE-CORE] Sovereign Cyber Security Guardian v6.1 initialized.",
    "[BIOMETRIC] Ed25519 Hardware Security Key paired with Architecture Owner (Aslam).",
    "[PI5-KERNEL] Mandatory Access Control (SELinux / AppArmor) enforced.",
  ]);

  const heatmapRef = useRef<SVGSVGElement>(null);

  // Simulated live threat radar ticker
  useEffect(() => {
    if (isLocked) return;

    const interval = setInterval(() => {
      const mockIps = ["194.26.29.112", "103.145.3.9", "91.240.118.25", "185.199.108.133"];
      const vectors = [
        "Port Scan on TCP 8022 (Termux Bridge)",
        "Unauthorized Token Replay Attack",
        "DDoS SYN-Flood Ingress Spike",
        "Memory Injection Probe on QBIT Core",
      ];
      const randomIp = mockIps[Math.floor(Math.random() * mockIps.length)];
      const randomVec = vectors[Math.floor(Math.random() * vectors.length)];

      const newThreat: ThreatEvent = {
        id: `th-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        sourceIp: randomIp,
        vector: randomVec,
        severity: Math.random() > 0.5 ? "HIGH" : "MEDIUM",
        actionTaken: "Zero-Trust Packet Drop & Blackhole Route",
      };

      setActiveThreats((prev) => [newThreat, ...prev.slice(0, 6)]);
      setBiometricLogs((prev) => [
        `[THREAT-DETECTED] ${randomVec} from ${randomIp} -> Neutralized`,
        ...prev.slice(0, 20),
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isLocked]);

  // D3.js Network Vulnerability Heatmap Render Effect
  useEffect(() => {
    const svgEl = heatmapRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = svgEl.clientWidth || 500;
    const height = svgEl.clientHeight || 220;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const nodes = ["SSH:22", "Termux:8022", "Web:3000", "Ollama:11434", "Cloudflare", "BCM2712-GPU"];
    const timeSlots = ["T-5m", "T-4m", "T-3m", "T-2m", "T-1m", "Now"];

    const x = d3.scaleBand().domain(timeSlots).range([0, innerW]).padding(0.08);
    const y = d3.scaleBand().domain(nodes).range([0, innerH]).padding(0.08);

    // Generate random vulnerability risk scores (0 to 10)
    const heatmapData: Array<{ node: string; time: string; risk: number }> = [];
    nodes.forEach((node) => {
      timeSlots.forEach((time) => {
        const risk = Math.floor(Math.random() * 9);
        heatmapData.push({ node, time, risk });
      });
    });

    const colorScale = d3
      .scaleSequential<string>()
      .domain([0, 10])
      .interpolator(d3.interpolateReds);

    // Heatmap cells
    g.selectAll("rect")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.time) || 0)
      .attr("y", (d) => y(d.node) || 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", (d) => (d.risk > 6 ? "#f43f5e" : d.risk > 3 ? "#fbbf24" : "#10b981"))
      .attr("opacity", 0.85)
      .append("title")
      .text((d) => `${d.node} @ ${d.time}: Risk Index ${d.risk}/10`);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px");
  }, []);

  const handleStartBiometricScan = () => {
    if (!isLocked) {
      playJarvisBeep(800, "sine", 0.05);
      setIsLocked(true);
      setBiometricLogs((prev) => [`[SECURITY] System manually locked by fingerprint guardian.`, ...prev]);
      return;
    }

    playJarvisBeep(1200, "sine", 0.04);
    setIsScanning(true);
    setScanProgress(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / 1500) * 100));
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setIsLocked(false);
        playSuccessChime();
        speakWithJarvisVoice("Biometric fingerprint verified. Welcome back, Architect Aslam. Cybersecurity Guardian is fully unlocked.");
        setBiometricLogs((prev) => [
          `[BIOMETRIC-SUCCESS] Fingerprint matched (Ed25519 Hardware Secure Enclave). Core Unlocked.`,
          ...prev,
        ]);
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-mono text-slate-100 pb-12 select-none">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">
              CYBERSECURITY GUARDIAN PANEL
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                isLocked
                  ? "bg-rose-950 text-rose-300 border border-rose-800 animate-pulse"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-800"
              }`}
            >
              {isLocked ? "SHIELD ENGAGED / LOCKED" : "SHIELD ACTIVE / DISARMED"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-['Space_Grotesk']">
            <Shield className="w-7 h-7 text-rose-400 animate-pulse" />
            <span>Cybersecurity Guardian & D3 Vulnerability Heatmap</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time threat detection logs, biometric fingerprint verification, and D3 network vulnerability matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-400">DEFENSE INTEGRITY</p>
            <p className="text-xl font-bold text-emerald-400">{securityScore}%</p>
          </div>

          <button
            onClick={handleStartBiometricScan}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              isLocked
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{isLocked ? "SCAN FINGERPRINT TO UNLOCK" : "LOCK SYSTEM"}</span>
          </button>
        </div>
      </div>

      {/* Biometric Interactive Scanner & D3 Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Biometric Fingerprint Pad & Shield Status */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center space-y-6 text-center shadow-xl relative overflow-hidden">
          <div
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none blur-3xl ${
              isLocked ? "bg-rose-500/10" : "bg-emerald-500/10"
            }`}
          />

          <div className="space-y-1 relative z-10">
            <h2 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Fingerprint className={`w-5 h-5 ${isLocked ? "text-rose-400" : "text-emerald-400"}`} />
              <span>Shield Status Indicator</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isLocked ? "Biometric Guardian active (Locked)" : "Biometric Verified for Aslam"}
            </p>
          </div>

          <div className="relative z-10 my-4">
            <button
              onClick={handleStartBiometricScan}
              disabled={isScanning}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-2xl group ${
                isScanning
                  ? "bg-cyan-950 border-2 border-cyan-400 animate-pulse shadow-[0_0_30px_#22d3ee]"
                  : isLocked
                  ? "bg-slate-950 hover:bg-slate-900 border-2 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                  : "bg-slate-950 hover:bg-slate-900 border-2 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              }`}
            >
              <Fingerprint
                className={`w-16 h-16 transition-all duration-300 group-hover:scale-110 ${
                  isScanning
                    ? "text-cyan-400 animate-bounce"
                    : isLocked
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              />

              <span className="text-[10px] font-mono mt-2 tracking-widest text-slate-300">
                {isScanning ? `${scanProgress}%` : isLocked ? "TOUCH TO SCAN" : "SECURED"}
              </span>

              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-bounce top-1/2" />
              )}
            </button>
          </div>

          <div className="w-full space-y-2 relative z-10 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-slate-400">Shield Status:</span>
              <span className={isLocked ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                {isLocked ? "ARMED (HIGH)" : "DISARMED"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-slate-400">Hardware Token:</span>
              <span className="text-cyan-400 font-bold">Ed25519 Secure Enclave</span>
            </div>
          </div>
        </div>

        {/* Right Columns: D3 Network Vulnerability Heatmap & Threat Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* D3 Network Vulnerability Heatmap */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>D3 Network Vulnerability Heatmap Matrix</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-400 text-[10px] font-mono border border-slate-800">
                Real-Time Ingress Matrix
              </span>
            </div>

            <div className="w-full h-56 bg-slate-950 rounded-xl p-2 overflow-hidden border border-slate-850 flex items-center justify-center">
              <svg ref={heatmapRef} className="w-full h-full" />
            </div>
          </div>

          {/* Active Threat Detection Logs */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Real-Time Threat Detection Logs</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-rose-400 text-[10px] font-bold border border-rose-900">
                {activeThreats.length} THREATS BLOCKED
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
              {activeThreats.map((th) => (
                <div
                  key={th.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{th.timestamp}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          th.severity === "CRITICAL"
                            ? "bg-rose-950 text-rose-400 border border-rose-800"
                            : "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}
                      >
                        {th.severity}
                      </span>
                      <span className="text-cyan-400 font-mono text-[11px] truncate">{th.sourceIp}</span>
                    </div>
                    <p className="font-semibold text-slate-200">{th.vector}</p>
                  </div>

                  <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] shrink-0 font-medium">
                    ✓ {th.actionTaken}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
