import React, { useState } from "react";
import { Sparkles, Zap, Wand2, Compass, Layers, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { playJarvisBeep, playArcCharge } from "../utils/jarvisAudio";

interface BrandGeneratorFormProps {
  onGenerate: (data: {
    companyName: string;
    industry: string;
    mission: string;
    targetAudience: string;
    vibe: string;
    preferredColors: string;
    logoResolution: "1K" | "2K" | "4K";
  }) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    name: "Stark Quantum",
    industry: "Deep Tech & Aerospace",
    mission: "Pioneering compact fusion reactors and autonomous clean energy shields to power humanity's multi-planetary expansion.",
    audience: "Global defense ministries, aerospace conglomerates, and visionary founders",
    vibe: "Futuristic, Arc-Reactor Tech, Precision Engineering",
    colors: "Arc Cyan (#06B6D4), Stark Gold, Deep Space Obsidian",
  },
  {
    name: "Aura Botanicals",
    industry: "Luxury Bio-Wellness",
    mission: "Harmonizing regenerative wild-harvested peptides with cellular biotechnology to reverse dermal aging cleanly and sustainably.",
    audience: "Eco-conscious high-net-worth wellness seekers & dermatological clinics",
    vibe: "Warm Artisanal, Organic Luxury, Serene Minimalist",
    colors: "Sage Herb, Warm Alabaster, Terracotta Earth, Olive",
  },
  {
    name: "Krypton Cyber",
    industry: "Zero-Trust Cybersecurity",
    mission: "Defending global financial pipelines with quantum-resistant cryptographic lattices and autonomous threat neutralization.",
    audience: "FinTech unicorns, sovereign wealth banks, and defense contractors",
    vibe: "Sleek Cyberpunk, Cryptographic Modernism, High Security",
    colors: "Electric Neon Violet, Emerald Code Green, Deep Carbon",
  },
  {
    name: "Maison Auric",
    industry: "Haute Horology & Fine Goods",
    mission: "Preserving generational European watchmaking heritage through micro-architectural titanium tourbillons engineered for eternity.",
    audience: "Discerning luxury collectors, connoisseurs, and tastemakers",
    vibe: "Luxury Editorial, Timeless Royal, Mastercraft",
    colors: "Imperial Champagne Gold, Royal Navy, Bone White, Jet Black",
  },
];

const VIBE_OPTIONS = [
  "Futuristic & Arc Tech",
  "Minimalist Modern",
  "Luxury Editorial",
  "Cyberpunk & High-Octane",
  "Eco-Organic & Serene",
  "Bold Neo-Brutalist",
];

export const BrandGeneratorForm: React.FC<BrandGeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [mission, setMission] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [vibe, setVibe] = useState("Futuristic & Arc Tech");
  const [preferredColors, setPreferredColors] = useState("");
  const [logoResolution, setLogoResolution] = useState<"1K" | "2K" | "4K">("2K");

  const applyPreset = (preset: typeof PRESETS[0]) => {
    playJarvisBeep(1200, "sine", 0.08);
    setCompanyName(preset.name);
    setIndustry(preset.industry);
    setMission(preset.mission);
    setTargetAudience(preset.audience);
    setVibe(preset.vibe);
    setPreferredColors(preset.colors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !mission.trim()) return;
    playArcCharge();
    onGenerate({
      companyName,
      industry,
      mission,
      targetAudience,
      vibe,
      preferredColors,
      logoResolution,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 md:p-8 hud-glow relative overflow-hidden">
      {/* Decorative HUD corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-cyan-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
              DIRECTIVE // SYNTHESIS 6.1
            </span>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              GEMINI-3-PRO VISION ENGINE
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk'] flex items-center gap-2">
            Architect Your Brand Bible
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            State your mission, sir. N.O.V.A. will synthesize an immaculate brand identity system.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
              Entity / Venture Name *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stark Quantum, Nova Dynamics, Aurelia"
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium transition-all"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
              Industry Domain
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Clean Energy, AI Robotics, Sustainable Luxury"
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium transition-all"
            />
          </div>
        </div>

        {/* Mission Statement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider">
              Core Company Mission & Purpose *
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              The foundational truth guiding visual & verbal identity
            </span>
          </div>
          <textarea
            required
            rows={3}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Describe what your venture stands for, the problem it solves, and why it matters in the world..."
            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-normal transition-all leading-relaxed"
          />
        </div>

        {/* Target Audience & Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
              Target Audience & Archetype
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Enterprise CTOs, design purists, eco-conscious Gen Z"
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
              Color Palette Preferences (Optional)
            </label>
            <input
              type="text"
              value={preferredColors}
              onChange={(e) => setPreferredColors(e.target.value)}
              placeholder="e.g. Arc Cyan and Obsidian, or Warm Terracotta, or Midnight Blue"
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium transition-all"
            />
          </div>
        </div>

        {/* Brand Vibe Selection */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2.5">
            Aesthetic Vibe & Design Language
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  playJarvisBeep(980, "sine", 0.05);
                  setVibe(v);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  vibe === v
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-300"
                    : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Affordance: Image Size Resolution (1K, 2K, 4K) using gemini-3-pro-image-preview */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Logo Render Resolution (gemini-3-pro-image-preview)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-700 rounded">
                Feature Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select output resolution for master logo vector rendering & brand marks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {(["1K", "2K", "4K"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  playJarvisBeep(1100, "sine", 0.06);
                  setLogoResolution(size);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  logoResolution === size
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] border border-cyan-200"
                    : "bg-slate-900 text-slate-400 border border-slate-700 hover:text-slate-200"
                }`}
              >
                {size} {size === "4K" ? "★ Ultra" : size === "2K" ? "High-Res" : "Standard"}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !companyName.trim() || !mission.trim()}
            className="w-full relative group py-4 px-6 rounded-xl font-bold font-['Space_Grotesk'] text-base tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] active:scale-[0.99] cursor-pointer"
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>SYNTHESIZING PROTOCOL MARK VII IN PROGRESS...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>INITIALIZE BRAND BIBLE GENERATION</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
