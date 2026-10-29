import React, { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Layers,
  Palette,
  Type,
  Eye,
  Shield,
  FileText,
  Volume2,
  Code,
  Smartphone,
  CreditCard,
  Globe,
  Sliders,
  CheckCircle2,
  XCircle,
  Maximize2
} from "lucide-react";
import { BrandBible, ColorItem } from "../types/brand";
import { playJarvisBeep, playSuccessChime } from "../utils/jarvisAudio";

interface BrandBibleDashboardProps {
  brand: BrandBible;
  onRegenerateLogo: (resolution: "1K" | "2K" | "4K", customPrompt?: string) => Promise<void>;
  isGeneratingLogo: boolean;
  onPlayJarvisBriefing: () => void;
  isSpeaking: boolean;
}

export const BrandBibleDashboard: React.FC<BrandBibleDashboardProps> = ({
  brand,
  onRegenerateLogo,
  isGeneratingLogo,
  onPlayJarvisBriefing,
  isSpeaking,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "logo" | "palette" | "typography" | "mockups">("overview");
  const [subSection, setSubSection] = useState<string>("all");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedCss, setCopiedCss] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedResolution, setSelectedResolution] = useState<"1K" | "2K" | "4K">(brand.logoResolution || "2K");
  const [specimenText, setSpecimenText] = useState("Engineering the boundary of the impossible.");

  // Dynamically load suggested Google Fonts so user sees live typography
  useEffect(() => {
    const headFont = brand.typography?.headingFont?.name;
    const bodyFont = brand.typography?.bodyFont?.name;
    if (!headFont && !bodyFont) return;

    const fontsToLoad = [headFont, bodyFont].filter(Boolean);
    const linkId = "dynamic-brand-google-fonts";
    let linkEl = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.id = linkId;
      linkEl.rel = "stylesheet";
      document.head.appendChild(linkEl);
    }

    const formattedFamilies = fontsToLoad
      .map((f) => `family=${f!.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800`)
      .join("&");

    linkEl.href = `https://fonts.googleapis.com/css2?${formattedFamilies}&display=swap`;
  }, [brand.typography]);

  const copyToClipboard = (text: string, type: "hex" | "css") => {
    navigator.clipboard.writeText(text);
    playJarvisBeep(1400, "sine", 0.05);
    if (type === "hex") {
      setCopiedHex(text);
      setTimeout(() => setCopiedHex(null), 2000);
    } else {
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  const handleDownloadLogo = () => {
    if (!brand.primaryLogoUrl) return;
    playSuccessChime();
    const link = document.createElement("a");
    link.href = brand.primaryLogoUrl;
    link.download = `${brand.brandName.toLowerCase().replace(/\s+/g, "-")}-logo-${brand.logoResolution || "2K"}.png`;
    link.click();
  };

  const handleExportJson = () => {
    playSuccessChime();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brand, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${brand.brandName.toLowerCase().replace(/\s+/g, "-")}-brand-bible.json`);
    downloadAnchor.click();
  };

  const generateCssVariables = () => {
    const lines = [
      `/* Brand Colors for ${brand.brandName} */`,
      `:root {`,
      ...brand.palette.map((c, i) => `  --color-${c.role.toLowerCase().replace(/\s+/g, "-")}: ${c.hex}; /* ${c.name} */`),
      `  --font-heading: '${brand.typography.headingFont.name}', sans-serif;`,
      `  --font-body: '${brand.typography.bodyFont.name}', sans-serif;`,
      `}`,
    ];
    return lines.join("\n");
  };

  return (
    <div className="space-y-8">
      {/* Top Brand Banner & Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 p-6 md:p-8 hud-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-700/60 rounded">
                CLASSIFIED // QBIT NOVA CORE SPECIFICATION
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                {brand.brandVoice.archetype}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-900/40 text-cyan-400 rounded border border-cyan-800/40">
                RES: {brand.logoResolution || "2K"}
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}
            >
              {brand.brandName}
            </h1>

            <p className="text-lg md:text-xl text-cyan-400/90 font-medium italic">
              "{brand.tagline}"
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onPlayJarvisBriefing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_#22d3ee] animate-pulse"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? "BRIEFING IN PROGRESS..." : "HEAR N.O.V.A. BRIEFING"}</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT JSON</span>
            </button>
          </div>
        </div>

        {/* N.O.V.A. Executive Quote */}
        {brand.jarvisBriefing && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-cyan-900/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono text-slate-300 leading-relaxed">
              <span className="text-cyan-400 font-bold mr-1">N.O.V.A.:</span>
              "{brand.jarvisBriefing}"
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          {[
            { id: "overview", label: "Overview & Mission", icon: Shield },
            { id: "logo", label: "Logo & Marks System", icon: Layers },
            { id: "palette", label: "5-Color Palette Matrix", icon: Palette },
            { id: "typography", label: "Google Font Pairings", icon: Type },
            { id: "mockups", label: "Brand In Action", icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playJarvisBeep(1200, "sine", 0.04);
                  setActiveTab(tab.id as any);
                  setSubSection("all");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & MISSION */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Quick Option Buttons: Zero infinite scrolling */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-mono text-cyan-400 px-2 flex items-center gap-1 shrink-0">
              <Sliders className="w-3.5 h-3.5" /> SECTION OPTIONS:
            </span>
            {[
              { id: "all", label: "View All Sections" },
              { id: "mission", label: "Mission & Vision" },
              { id: "pillars", label: "Value Pillars" },
              { id: "voice", label: "Voice & Rules" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  playJarvisBeep(1150, "sine", 0.04);
                  setSubSection(opt.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  subSection === opt.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(subSection === "all" || subSection === "mission" || subSection === "pillars") && (
              <div className={`${subSection === "all" ? "lg:col-span-2" : "lg:col-span-3"} space-y-6`}>
                {(subSection === "all" || subSection === "mission") && (
                  <>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                        FOUNDATIONAL PURPOSE
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3">Company Mission Statement</h3>
                      <p
                        className="text-base text-slate-300 leading-relaxed font-normal p-4 rounded-xl bg-slate-950/60 border border-slate-800/80"
                        style={{ fontFamily: `'${brand.typography.bodyFont.name}', sans-serif` }}
                      >
                        {brand.missionStatement}
                      </p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                        STRATEGIC HORIZON
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3">Vision Statement</h3>
                      <p
                        className="text-base text-slate-300 leading-relaxed font-normal p-4 rounded-xl bg-slate-950/60 border border-slate-800/80"
                        style={{ fontFamily: `'${brand.typography.bodyFont.name}', sans-serif` }}
                      >
                        {brand.visionStatement}
                      </p>
                    </div>
                  </>
                )}

                {(subSection === "all" || subSection === "pillars") && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                      CORE PRINCIPLES
                    </span>
                    <h3 className="text-xl font-bold text-white mb-4">Value Pillars</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {brand.valuePillars.map((pillar, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-cyan-500/40 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] font-mono flex items-center justify-center font-bold">
                              0{idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(subSection === "all" || subSection === "voice") && (
              <div className={`${subSection === "all" ? "" : "lg:col-span-3"} space-y-6`}>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                    VERBAL IDENTITY
                  </span>
                  <h3 className="text-lg font-bold text-white mb-3">Tone of Voice</h3>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {brand.brandVoice.toneKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Do's and Don'ts */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ALWAYS COMMUNICATE LIKE THIS
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {brand.brandVoice.doRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <h5 className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                        <XCircle className="w-3.5 h-3.5" />
                        NEVER DO THIS
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {brand.brandVoice.dontRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-400">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Palette Preview Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                    CHROMATIC HARMONY
                  </span>
                  <h3 className="text-lg font-bold text-white mb-3">5-Color Spectrum</h3>
                  <div className="grid grid-cols-5 gap-2 h-16 rounded-xl overflow-hidden p-1 bg-slate-950 border border-slate-800">
                    {brand.palette.map((color, idx) => (
                      <div
                        key={idx}
                        className="h-full rounded-lg relative group cursor-pointer transition-transform hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex, "hex")}
                        title={`Click to copy ${color.hex}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                    <span>Primary</span>
                    <span>Secondary</span>
                    <span>Accent</span>
                    <span>Dark</span>
                    <span>Light</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LOGO & SECONDARY MARKS */}
      {activeTab === "logo" && (
        <div className="space-y-4">
          {/* Option Buttons: Instant Sub-view Switching */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-mono text-cyan-400 px-2 flex items-center gap-1 shrink-0">
              <Sliders className="w-3.5 h-3.5" /> LOGO OPTIONS:
            </span>
            {[
              { id: "all", label: "View All (Master & Marks)" },
              { id: "master", label: "Master Corporate Emblem" },
              { id: "render", label: "Re-render & 4K Resolution" },
              { id: "secondary", label: "Secondary Marks (UD / 🐉 / ✦)" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  playJarvisBeep(1150, "sine", 0.04);
                  setSubSection(opt.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  subSection === opt.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Master Logo View */}
            {(subSection === "all" || subSection === "master") && (
              <div className={`${subSection === "all" ? "lg:col-span-7" : "lg:col-span-12"} bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 hud-glow`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                      PRIMARY EMBLEM
                    </span>
                    <h3 className="text-xl font-bold text-white">Master Corporate Mark</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 rounded">
                      gemini-3-pro-image-preview [{brand.logoResolution || "2K"}]
                    </span>
                    <button
                      onClick={handleDownloadLogo}
                      disabled={!brand.primaryLogoUrl}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                      title="Download High-Res Logo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Logo Visual Stage */}
                <div className="relative aspect-square max-h-[420px] mx-auto rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-8">
                  {brand.primaryLogoUrl ? (
                    <img
                      src={brand.primaryLogoUrl}
                      alt={`${brand.brandName} Primary Logo`}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-2xl">
                        {brand.brandName.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-sm text-slate-400 font-mono">
                        Generating vector logo mark via gemini-3-pro-image-preview...
                      </p>
                    </div>
                  )}

                  {/* Grid Overlay lines */}
                  <div className="absolute inset-0 bg-transparent pointer-events-none hud-grid opacity-30" />
                </div>

                {/* Symbolism & Concept Breakdown */}
                <div className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Design Architecture & Symbolism
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {brand.logoDesign.primaryConcept.symbolism}
                  </p>
                </div>
              </div>
            )}

            {/* Re-render Tool & Secondary Marks */}
            {(subSection === "all" || subSection === "render" || subSection === "secondary") && (
              <div className={`${subSection === "all" ? "lg:col-span-5" : "lg:col-span-12"} space-y-6`}>
                {(subSection === "all" || subSection === "render") && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                      IMAGE GENERATION AFFORDANCE
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">Re-render Logo & Size</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Powered by <code className="text-cyan-300">gemini-3-pro-image-preview</code>. Configure resolution up to 4K for master print and vector digitization.
                    </p>

                    {/* Resolution Selector: 1K, 2K, 4K */}
                    <div className="mb-4">
                      <label className="block text-xs font-mono text-slate-300 mb-2">
                        Select Target Resolution:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["1K", "2K", "4K"] as const).map((res) => (
                          <button
                            key={res}
                            type="button"
                            onClick={() => {
                              playJarvisBeep(1100, "sine", 0.05);
                              setSelectedResolution(res);
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              selectedResolution === res
                                ? "bg-cyan-500 text-slate-950 border border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Optional Prompt Refinement */}
                    <div className="mb-4">
                      <label className="block text-xs font-mono text-slate-300 mb-2">
                        Custom Prompt Modifier (Optional):
                      </label>
                      <textarea
                        rows={2}
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g. Make it more geometric and minimal, circular arc layout..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isGeneratingLogo}
                      onClick={() => onRegenerateLogo(selectedResolution, customPrompt)}
                      className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase transition-all bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingLogo ? "animate-spin" : ""}`} />
                      <span>{isGeneratingLogo ? "RENDERING HIGH-RES IMAGE..." : `RE-RENDER AT ${selectedResolution}`}</span>
                    </button>
                  </div>
                )}

                {/* Secondary Marks System */}
                {(subSection === "all" || subSection === "secondary") && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                      MODULAR IDENTIFIERS
                    </span>
                    <h3 className="text-lg font-bold text-white mb-4">Secondary Marks</h3>

                    <div className="space-y-3">
                      {brand.logoDesign.secondaryMarks.map((mark, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            {/* Dynamic Symbol Preview Icon */}
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
                              style={{
                                backgroundColor: brand.palette[0]?.hex || "#06b6d4",
                                color: brand.palette[3]?.hex || "#080c14",
                                fontFamily: `'${brand.typography.headingFont.name}', sans-serif`,
                              }}
                            >
                              {mark.symbolText || brand.brandName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{mark.name}</h5>
                              <span className="text-[10px] font-mono text-cyan-400 block">{mark.type}</span>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{mark.useCase}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 5-COLOR PALETTE MATRIX */}
      {activeTab === "palette" && (
        <div className="space-y-4">
          {/* Quick Option Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-mono text-cyan-400 px-2 flex items-center gap-1 shrink-0">
              <Sliders className="w-3.5 h-3.5" /> PALETTE OPTIONS:
            </span>
            {[
              { id: "all", label: "View All Palette Data" },
              { id: "swatches", label: "5 Swatch Cards & Specs" },
              { id: "ratio", label: "60-30-10 Distribution Bar" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  playJarvisBeep(1150, "sine", 0.04);
                  setSubSection(opt.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  subSection === opt.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                EXACT 5-COLOR FORMULATION
              </span>
              <h3 className="text-xl font-bold text-white">Chromatics & Accessibility Guide</h3>
              <p className="text-xs text-slate-400">
                Precision hex codes, calibrated contrast, and strict application guidelines.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(generateCssVariables(), "css")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900/60 transition-all cursor-pointer self-start sm:self-auto"
            >
              {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
              <span>{copiedCss ? "CSS COPIED!" : "COPY CSS VARIABLES"}</span>
            </button>
          </div>

          {/* 5 Full Color Swatch Cards */}
          {(subSection === "all" || subSection === "swatches") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {brand.palette.map((color, idx) => {
                const isLight = ["#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#fff"].some((c) =>
                  color.hex.toLowerCase().startsWith(c)
                );
                return (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col transition-all group"
                  >
                    {/* Color Swatch Display */}
                    <div
                      className="h-36 relative p-4 flex flex-col justify-between cursor-pointer transition-transform group-hover:scale-[1.02]"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex, "hex")}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md"
                          style={{
                            backgroundColor: isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                            color: isLight ? "#0f172a" : "#ffffff",
                          }}
                        >
                          {color.role}
                        </span>

                        <button
                          className="p-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                          style={{
                            backgroundColor: isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
                            color: isLight ? "#0f172a" : "#ffffff",
                          }}
                          title="Copy Hex"
                        >
                          {copiedHex === color.hex ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div>
                        <div
                          className="text-lg font-mono font-bold"
                          style={{ color: isLight ? "#0f172a" : "#ffffff" }}
                        >
                          {color.hex.toUpperCase()}
                        </div>
                        <div
                          className="text-[11px] font-mono opacity-80"
                          style={{ color: isLight ? "#0f172a" : "#ffffff" }}
                        >
                          {color.rgb}
                        </div>
                      </div>
                    </div>

                    {/* Color Details & Usage Notes */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-slate-950/60">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{color.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{color.usageNotes}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                          APPLICATION:
                        </span>
                        <p className="text-[11px] text-slate-300 font-mono">{color.suggestedApplications}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 60-30-10 Rule Visual Ratio Bar */}
          {(subSection === "all" || subSection === "ratio") && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  60 - 30 - 10 Hierarchy Distribution
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Primary Neutral (60%) // Secondary (30%) // Accent (10%)
                </span>
              </div>
              <div className="h-6 rounded-xl overflow-hidden flex shadow-inner">
                <div
                  className="h-full flex items-center justify-center text-[10px] font-mono font-bold"
                  style={{ width: "60%", backgroundColor: brand.palette[3]?.hex || "#080c14", color: "#94a3b8" }}
                >
                  60% Base
                </div>
                <div
                  className="h-full flex items-center justify-center text-[10px] font-mono font-bold"
                  style={{ width: "30%", backgroundColor: brand.palette[0]?.hex || "#06b6d4", color: "#080c14" }}
                >
                  30% Brand
                </div>
                <div
                  className="h-full flex items-center justify-center text-[10px] font-mono font-bold"
                  style={{ width: "10%", backgroundColor: brand.palette[2]?.hex || "#f59e0b", color: "#080c14" }}
                >
                  10%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TYPOGRAPHY SYSTEM */}
      {activeTab === "typography" && (
        <div className="space-y-4">
          {/* Quick Option Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-mono text-cyan-400 px-2 flex items-center gap-1 shrink-0">
              <Sliders className="w-3.5 h-3.5" /> FONT OPTIONS:
            </span>
            {[
              { id: "all", label: "View All Font Specs" },
              { id: "pairings", label: "Display & Body Pairings" },
              { id: "hierarchy", label: "Live Hierarchy Scale" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  playJarvisBeep(1150, "sine", 0.04);
                  setSubSection(opt.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  subSection === opt.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {(subSection === "all" || subSection === "pairings") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heading Font Card */}
              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 hud-glow">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                    HEADINGS & DISPLAY
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {brand.typography.headingFont.category}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}>
                  {brand.typography.headingFont.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{brand.typography.headingFont.rationale}</p>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                    WEIGHTS & SPECIFICATION:
                  </span>
                  <div className="text-xs font-mono text-slate-300">
                    Weights: <span className="text-white">{brand.typography.headingFont.weights}</span>
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}>
                    Aa Bb Cc Dd Ee Ff 0123456789
                  </div>
                </div>
              </div>

              {/* Body Font Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 rounded">
                    BODY & INTERFACE
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {brand.typography.bodyFont.category}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: `'${brand.typography.bodyFont.name}', sans-serif` }}>
                  {brand.typography.bodyFont.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{brand.typography.bodyFont.rationale}</p>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                    WEIGHTS & SPECIFICATION:
                  </span>
                  <div className="text-xs font-mono text-slate-300">
                    Weights: <span className="text-white">{brand.typography.bodyFont.weights}</span>
                  </div>
                  <div className="text-base text-slate-200" style={{ fontFamily: `'${brand.typography.bodyFont.name}', sans-serif` }}>
                    The quick brown fox jumps over the lazy dog. 0123456789
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Specimen & Hierarchy Scale */}
          {(subSection === "all" || subSection === "hierarchy") && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                    INTERACTIVE SPECIMEN
                  </span>
                  <h4 className="text-lg font-bold text-white">Live Hierarchy Scale</h4>
                </div>

                {/* Editable Specimen Input */}
                <div className="w-full sm:w-80">
                  <input
                    type="text"
                    value={specimenText}
                    onChange={(e) => setSpecimenText(e.target.value)}
                    placeholder="Type preview text..."
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* H1 Display */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500">
                  H1 DISPLAY // {brand.typography.headingFont.name} // {brand.typography.hierarchyNotes.h1}
                </span>
                <h1
                  className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
                  style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}
                >
                  {specimenText}
                </h1>
              </div>

              {/* H2 Title */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500">
                  H2 SUBSECTION // {brand.typography.headingFont.name} // {brand.typography.hierarchyNotes.h2}
                </span>
                <h2
                  className="text-2xl md:text-3xl font-bold text-slate-200"
                  style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}
                >
                  {specimenText}
                </h2>
              </div>

              {/* Body Paragraph */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500">
                  BODY PARAGRAPH // {brand.typography.bodyFont.name} // {brand.typography.hierarchyNotes.body}
                </span>
                <p
                  className="text-base text-slate-300 leading-relaxed max-w-3xl"
                  style={{ fontFamily: `'${brand.typography.bodyFont.name}', sans-serif` }}
                >
                  {brand.missionStatement}
                </p>
              </div>

              {/* UI Caption */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500">
                  CAPTION & LABELS // {brand.typography.hierarchyNotes.caption}
                </span>
                <p
                  className="text-xs uppercase tracking-wider text-cyan-400 font-medium"
                  style={{ fontFamily: `'${brand.typography.bodyFont.name}', sans-serif` }}
                >
                  {brand.tagline} // ALL SYSTEMS OPERATIONAL
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: BRAND IN ACTION (MOCKUPS) */}
      {activeTab === "mockups" && (
        <div className="space-y-4">
          {/* Quick Option Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-mono text-cyan-400 px-2 flex items-center gap-1 shrink-0">
              <Sliders className="w-3.5 h-3.5" /> APPLICATION OPTIONS:
            </span>
            {[
              { id: "all", label: "View All Applications" },
              { id: "card", label: "Universal Dragon Business Card" },
              { id: "mobile", label: "Huawei Pura 70 App Icon" },
              { id: "hero", label: "Web Platform Hero View" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  playJarvisBeep(1150, "sine", 0.04);
                  setSubSection(opt.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  subSection === opt.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mockup 1: Luxury Business Card */}
            {(subSection === "all" || subSection === "card") && (
              <div className={`${subSection === "card" ? "md:col-span-2" : ""} bg-slate-900/80 border border-slate-800 rounded-2xl p-6`}>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  PREMIUM BUSINESS CARD (FRONT & REVERSE)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front of card */}
                  <div
                    className="aspect-[1.75/1] rounded-xl p-5 flex flex-col justify-between shadow-2xl border border-white/10 relative overflow-hidden"
                    style={{
                      backgroundColor: brand.palette[3]?.hex || "#080c14",
                      color: brand.palette[4]?.hex || "#ffffff",
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/10">
                      {brand.primaryLogoUrl ? (
                        <img src={brand.primaryLogoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="font-bold text-xs">{brand.brandName[0]}</span>
                      )}
                    </div>

                    <div>
                      <div
                        className="font-bold text-sm tracking-wide"
                        style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}
                      >
                        {brand.brandName}
                      </div>
                      <div className="text-[10px] opacity-75 font-mono">{brand.tagline}</div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="aspect-[1.75/1] rounded-xl p-5 flex flex-col justify-between shadow-2xl border border-white/10 relative overflow-hidden"
                    style={{
                      backgroundColor: brand.palette[0]?.hex || "#06b6d4",
                      color: brand.palette[3]?.hex || "#080c14",
                    }}
                  >
                    <div className="text-right">
                      <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
                        UNIVERSAL DRAGON // SOVEREIGN
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs">Universal Dragon Aslam</div>
                      <div className="text-[10px] font-mono opacity-80">Founder & Cosmic Architect</div>
                      <div className="text-[9px] font-mono opacity-70 mt-1">universaldragon14@gmail.com</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mockup 2: Mobile App Icon & Screen */}
            {(subSection === "all" || subSection === "mobile") && (
              <div className={`${subSection === "mobile" ? "md:col-span-2" : ""} bg-slate-900/80 border border-slate-800 rounded-2xl p-6`}>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  MOBILE ECOSYSTEM & APP BADGE
                </span>

                <div className="flex items-center gap-6">
                  {/* App Icon */}
                  <div className="text-center space-y-2">
                    <div
                      className="w-20 h-20 rounded-2xl p-2 shadow-2xl flex items-center justify-center border border-white/20 transition-transform hover:scale-105"
                      style={{
                        backgroundColor: brand.palette[0]?.hex || "#06b6d4",
                      }}
                    >
                      {brand.primaryLogoUrl ? (
                        <img src={brand.primaryLogoUrl} alt="App Icon" className="w-full h-full object-contain filter drop-shadow" />
                      ) : (
                        <span className="text-slate-950 font-bold text-2xl font-mono">
                          {brand.brandName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 block">{brand.brandName}</span>
                  </div>

                  {/* Mini Phone Frame */}
                  <div
                    className="flex-1 rounded-xl p-4 border border-slate-800 shadow-xl space-y-3"
                    style={{ backgroundColor: brand.palette[3]?.hex || "#080c14" }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-60 text-slate-300">
                      <span>9:41</span>
                      <span>100% ⚡</span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className="text-xs font-bold"
                        style={{
                          color: brand.palette[4]?.hex || "#ffffff",
                          fontFamily: `'${brand.typography.headingFont.name}', sans-serif`,
                        }}
                      >
                        Welcome to {brand.brandName}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-2">
                        {brand.missionStatement}
                      </div>
                    </div>
                    <button
                      className="w-full py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase"
                      style={{
                        backgroundColor: brand.palette[0]?.hex || "#06b6d4",
                        color: brand.palette[3]?.hex || "#080c14",
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mockup 3: Hero Landing Page Banner */}
            {(subSection === "all" || subSection === "hero") && (
              <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  RESPONSIVE WEB PLATFORM HERO VIEW
                </span>

                <div
                  className="rounded-xl p-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
                  style={{
                    backgroundColor: brand.palette[3]?.hex || "#080c14",
                    color: brand.palette[4]?.hex || "#ffffff",
                  }}
                >
                  <div className="space-y-4 max-w-lg z-10">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase"
                      style={{
                        backgroundColor: `${brand.palette[0]?.hex}22`,
                        color: brand.palette[0]?.hex || "#06b6d4",
                      }}
                    >
                      NEW PROTOCOL // {brand.brandVoice.archetype}
                    </span>

                    <h2
                      className="text-3xl md:text-4xl font-extrabold tracking-tight"
                      style={{ fontFamily: `'${brand.typography.headingFont.name}', sans-serif` }}
                    >
                      {brand.tagline}
                    </h2>

                    <p
                      className="text-xs md:text-sm opacity-85 leading-relaxed"
                      style={{ fontFamily: `'${brand.typography.bodyFont.name}', sans-serif` }}
                    >
                      {brand.missionStatement}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        className="px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase shadow-lg transition-transform hover:scale-105"
                        style={{
                          backgroundColor: brand.palette[0]?.hex || "#06b6d4",
                          color: brand.palette[3]?.hex || "#080c14",
                        }}
                      >
                        Deploy Protocol
                      </button>
                      <button
                        className="px-4 py-2 rounded-xl text-xs font-mono border transition-all"
                        style={{
                          borderColor: brand.palette[0]?.hex || "#06b6d4",
                          color: brand.palette[4]?.hex || "#ffffff",
                        }}
                      >
                        Read Brand Bible
                      </button>
                    </div>
                  </div>

                  <div className="w-48 h-48 rounded-2xl flex items-center justify-center p-4 bg-white/5 border border-white/10">
                    {brand.primaryLogoUrl ? (
                      <img src={brand.primaryLogoUrl} alt="Logo Hero" className="max-w-full max-h-full object-contain filter drop-shadow-2xl" />
                    ) : (
                      <div className="text-4xl font-bold">{brand.brandName[0]}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
