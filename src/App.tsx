/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ArcReactorVisualizer } from "./components/ArcReactorVisualizer";
import { BrandGeneratorForm } from "./components/BrandGeneratorForm";
import { BrandBibleDashboard } from "./components/BrandBibleDashboard";
import { JarvisChatDrawer } from "./components/JarvisChatDrawer";
import { CosmicCelestialBackground } from "./components/CosmicCelestialBackground";
import { VoiceDesignPlayground } from "./components/VoiceDesignPlayground";
import { HuaweiPiAgentBridge } from "./components/HuaweiPiAgentBridge";
import { AiHumanVideoCall } from "./components/AiHumanVideoCall";
import { ThreeDimensionalDragonScene } from "./components/ThreeDimensionalDragonScene";
import { ScienceGenomicsLab } from "./components/ScienceGenomicsLab";
import { OmniVideoLab } from "./components/OmniVideoLab";
import { SearchAndVoiceTranscribe } from "./components/SearchAndVoiceTranscribe";
import { RealAccessTerminal } from "./components/RealAccessTerminal";
import { ApplicationManager } from "./components/ApplicationManager";
import { BrandBible } from "./types/brand";
import { VoicePersona, CelestialTheme, OFFICIAL_VOICE_PERSONAS } from "./types/voice";
import {
  playJarvisBeep,
  playArcCharge,
  playSuccessChime,
  speakWithJarvisVoice,
  stopSpeech,
} from "./utils/jarvisAudio";
import {
  Sparkles,
  Bot,
  Shield,
  ChevronRight,
  AudioLines,
  Cpu,
  Layers,
  Wand2,
  Orbit,
  Video,
  Box,
  Dna,
  Film,
  Search,
  Radio,
  Terminal,
  Gauge,
} from "lucide-react";

// Initial Demo Brand for immediate pristine showcase: Universal Dragon by Universal Dragon Aslam
const INITIAL_DEMO_BRAND: BrandBible = {
  brandName: "Universal Dragon",
  tagline: "Sovereign AI Power. Cosmic Dragon Flight.",
  missionStatement:
    "Empowering humanity and cosmic exploration through universal quantum intelligence, dragon-tier defense networks, and sovereign celestial power directed by Universal Dragon Aslam.",
  visionStatement:
    "A unified cosmos of limitless clean power, autonomous AI agents, and interstellar enlightenment directed by Universal Dragon Aslam.",
  jarvisBriefing:
    "Allow me to present the Universal Dragon Brand Bible, Architect Aslam. The chromatic spectrum has been calibrated to our signature Dragon Cyan, Solar Gold, and Deep Space Obsidian matrix. Primary and secondary marks have been mathematically balanced for orbital scale down to micro-die engraving.",
  valuePillars: [
    {
      title: "Dragon Sovereignty",
      description: "Unyielding technological supremacy and uncompromised cosmic autonomy.",
    },
    {
      title: "Universal Intelligence",
      description: "Deploying multi-agent quantum cognition across edge nodes and celestial clouds.",
    },
    {
      title: "Solar Force Velocity",
      description: "Refusing incrementalism in favor of paradigm-shifting breakthroughs.",
    },
    {
      title: "Majesty in Form",
      description: "Aesthetic superiority married to unstoppable computational force.",
    },
  ],
  brandVoice: {
    archetype: "The Celestial Sovereign",
    toneKeywords: ["Cosmic Authority", "Dragon Precision", "Audacious", "Unstoppable"],
    doRules: [
      "Speak with calm, sovereign authority and cosmic accuracy.",
      "Highlight dragon-tier quantum AI, celestial lattices, and edge node autonomy.",
      "Keep sentences crisp, active, and mathematically confident.",
    ],
    dontRules: [
      "Never sound uncertain, bureaucratic, or timid.",
      "Avoid hollow corporate buzzwords; speak with direct sovereign power.",
      "Never compromise on high-contrast chromatic discipline.",
    ],
  },
  palette: [
    {
      name: "Dragon Cyan",
      hex: "#06B6D4",
      rgb: "rgb(6, 182, 212)",
      role: "Primary Brand Color",
      usageNotes: "The core kinetic signature. Use on primary call-to-action elements, glowing dragon emblems, and key indicators.",
      suggestedApplications: "Primary buttons, active indicators, hero vector dragon accents",
    },
    {
      name: "Solar Dragon Gold",
      hex: "#F59E0B",
      rgb: "rgb(245, 158, 11)",
      role: "Secondary Accent",
      usageNotes: "High-value sovereign tier. Use for master certifications, royal crests, and premium distinctions.",
      suggestedApplications: "Certification seals, VIP indicators, luxury hardware trims",
    },
    {
      name: "Deep Space Obsidian",
      hex: "#080C14",
      rgb: "rgb(8, 12, 20)",
      role: "Dark Neutral Background",
      usageNotes: "The canvas of infinity. Dominant backdrop for all digital dashboards, print covers, and exhibition stands.",
      suggestedApplications: "Main dashboard canvas, packaging exteriors, mobile app backgrounds",
    },
    {
      name: "Dragon Scale Slate",
      hex: "#1E293B",
      rgb: "rgb(30, 41, 59)",
      role: "Surface & Card Container",
      usageNotes: "Structural containment. Houses cards, input fields, data tables, and secondary panels.",
      suggestedApplications: "HUD card containers, table headers, border structures",
    },
    {
      name: "Celestial Luminescence",
      hex: "#F8FAFC",
      rgb: "rgb(248, 250, 252)",
      role: "Light Text & High-Contrast",
      usageNotes: "Maximum legibility text and master vector linework against dark obsidian surfaces.",
      suggestedApplications: "Display headlines, key body copy, master white mark variants",
    },
  ],
  typography: {
    headingFont: {
      name: "Space Grotesk",
      category: "Geometric Tech Sans",
      googleFontFamily: "Space+Grotesk",
      weights: "500, 700",
      rationale: "Deep technological gravitas with aerospace geometric proportions and distinctive cybernetic curves.",
    },
    bodyFont: {
      name: "Inter",
      category: "Modern Ergonomic Sans",
      googleFontFamily: "Inter",
      weights: "400, 500, 600",
      rationale: "Unrivaled optical readability across high-density telemetry displays, mission documents, and mobile interfaces.",
    },
    pairingRationale:
      "Space Grotesk commands display hierarchy with futuristic sovereign authority, while Inter provides tranquil, frictionless legibility.",
    hierarchyNotes: {
      h1: "48px - 64px, Weight 700, Letter-spacing -0.02em",
      h2: "28px - 36px, Weight 600, Letter-spacing -0.01em",
      body: "15px - 16px, Weight 400, Line-height 1.6",
      caption: "11px - 12px, Weight 600, Uppercase, Letter-spacing +0.08em",
    },
  },
  logoDesign: {
    primaryConcept: {
      title: "Universal Dragon Sovereign Crest",
      symbolism:
        "A soaring geometric cybernetic dragon embracing a quantum celestial core, signifying sovereign intelligence governed by cosmic equilibrium.",
      imagePrompt:
        "Minimalist iconic logo mark for Universal Dragon, majestic geometric winged dragon emblem, cyan and gold glowing cybernetic details, vector graphic emblem on dark matte background",
    },
    secondaryMarks: [
      {
        name: "UD Interlocking Monogram",
        type: "Monogram Sub-mark",
        description: "Sharply beveled 'U' and 'D' sovereign ligature suitable for hardware stampings and chassis.",
        useCase: "Hardware chassis, laser engraving, executive stationery",
        symbolText: "UD",
      },
      {
        name: "Dragon Eye Core",
        type: "Icon Badge",
        description: "Spherical containment node with pulsing cyan dragon core enclosed in a hexagonal bezel.",
        useCase: "Mobile app icons, social media avatars, software taskbar icons",
        symbolText: "🐉",
      },
      {
        name: "Celestial Crest",
        type: "Favicon & Watermark",
        description: "Ultra-compact 16px vector dot matrix representation of the dragon triad.",
        useCase: "Browser favicon, document corner watermarks, micro telemetry indicators",
        symbolText: "✦",
      },
    ],
  },
  logoResolution: "2K",
  primaryLogoUrl:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='400' height='400'><rect width='400' height='400' fill='%23080c14'/><circle cx='200' cy='200' r='150' fill='none' stroke='%2306b6d4' stroke-width='4' stroke-dasharray='12 8' opacity='0.7'/><circle cx='200' cy='200' r='110' fill='none' stroke='%2338bdf8' stroke-width='6'/><path d='M200,70 L240,150 L330,170 L260,225 L280,310 L200,260 L120,310 L140,225 L70,170 L160,150 Z' fill='none' stroke='%23f59e0b' stroke-width='5'/><circle cx='200' cy='200' r='36' fill='%2306b6d4'/><circle cx='200' cy='200' r='18' fill='%23ffffff'/><text x='200' y='365' font-family='sans-serif' font-size='22' font-weight='bold' fill='%2338bdf8' text-anchor='middle' letter-spacing='4'>UNIVERSAL DRAGON</text></svg>",
};

export default function App() {
  const [brand, setBrand] = useState<BrandBible>(INITIAL_DEMO_BRAND);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("CORE SYSTEMS OPTIMAL // READY FOR DIRECTIVES");
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "terminal"
    | "app-manager"
    | "3d-core"
    | "science"
    | "video-lab"
    | "search-transcribe"
    | "video-call"
    | "voices"
    | "pi-agent"
    | "create"
  >("dashboard");

  // User-requested Features: Dynamic Celestial background + Emotional Voice Personas
  const [celestialTheme, setCelestialTheme] = useState<CelestialTheme>("cycle");
  const [activeVoicePersona, setActiveVoicePersona] = useState<VoicePersona>(OFFICIAL_VOICE_PERSONAS[0]); // Default: The Grizzled Detective

  // Welcome voice greeting on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (voiceEnabled) {
        speakWithJarvisVoice(
          `Welcome to the N.O.V.A. Brand Intelligence Lab, sir. Active voice engine set to ${activeVoicePersona.title}.`,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleVoice = () => {
    playJarvisBeep(voiceEnabled ? 600 : 1200, "sine", 0.06);
    if (voiceEnabled) {
      stopSpeech();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleSelectActiveVoice = (persona: VoicePersona) => {
    setActiveVoicePersona(persona);
    setStatusText(`N.O.V.A. VOICE ENGINE RE-CALIBRATED // ${persona.title.toUpperCase()}`);
    if (voiceEnabled) {
      speakWithJarvisVoice(
        `Voice engine synchronized to ${persona.title}. Ready for mission briefing.`,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const handlePlayJarvisBriefing = async () => {
    if (!brand.jarvisBriefing) return;
    playArcCharge();
    setIsSpeaking(true);
    setStatusText(`VOCAL BRIEFING PLAYBACK // ${activeVoicePersona.title.toUpperCase()}`);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: brand.jarvisBriefing,
          voice: activeVoicePersona.baseVoice,
          stylePrompt: activeVoicePersona.stylePrompt,
        }),
      });
      const data = await res.json();
      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => {
          setIsSpeaking(false);
          setStatusText("SYSTEM OPTIMAL // READY");
        };
        audio.onerror = () => {
          speakWithJarvisVoice(
            brand.jarvisBriefing,
            () => setIsSpeaking(true),
            () => {
              setIsSpeaking(false);
              setStatusText("SYSTEM OPTIMAL // READY");
            }
          );
        };
        audio.play();
        return;
      }
    } catch {
      // Fallback to client-side speech
    }

    speakWithJarvisVoice(
      brand.jarvisBriefing,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        setStatusText("SYSTEM OPTIMAL // READY");
      }
    );
  };

  const handleGenerateBrand = async (formData: {
    companyName: string;
    industry: string;
    mission: string;
    targetAudience: string;
    vibe: string;
    preferredColors: string;
    logoResolution: "1K" | "2K" | "4K";
  }) => {
    setIsLoading(true);
    setStatusText(`SYNTHESIZING PROTOCOL FOR ${formData.companyName.toUpperCase()}...`);

    if (voiceEnabled) {
      speakWithJarvisVoice(`Understood, sir. Initializing Brand Bible synthesis for ${formData.companyName}.`);
    }

    try {
      // 1. Generate complete Brand Bible data
      const res = await fetch("/api/generate-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to synthesize Brand Bible.");
      }

      const generatedBrand: BrandBible = {
        ...data.brand,
        logoResolution: formData.logoResolution,
      };

      setBrand(generatedBrand);
      setActiveView("dashboard");
      setIsLoading(false);
      setStatusText(`BRAND ARCHITECTURE CREATED // RENDERING LOGO AT ${formData.logoResolution}...`);

      // 2. Generate High-Quality Logo Image with gemini-3-pro-image-preview
      setIsGeneratingLogo(true);
      try {
        const logoRes = await fetch("/api/generate-logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: generatedBrand.logoDesign.primaryConcept.imagePrompt,
            imageSize: formData.logoResolution,
            brandName: generatedBrand.brandName,
          }),
        });

        const logoData = await logoRes.json();
        if (logoData.success && logoData.imageUrl) {
          setBrand((prev) => ({
            ...prev,
            primaryLogoUrl: logoData.imageUrl,
            logoResolution: formData.logoResolution,
          }));
        }
      } catch (logoErr) {
        console.warn("Logo generation notice, keeping vector emblem:", logoErr);
      } finally {
        setIsGeneratingLogo(false);
        playSuccessChime();
        setStatusText("BRAND BIBLE SYNTHESIS COMPLETE // N.O.V.A. PROTOCOL DEPLOYED");

        if (voiceEnabled && generatedBrand.jarvisBriefing) {
          setTimeout(() => {
            handlePlayJarvisBriefing();
          }, 800);
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatusText(`ERROR: ${err.message || "Synthesis interrupted."}`);
      alert(`Synthesis Error: ${err.message || "Please check your network and try again."}`);
      setIsLoading(false);
      setIsGeneratingLogo(false);
    }
  };

  const handleRegenerateLogo = async (resolution: "1K" | "2K" | "4K", customPrompt?: string) => {
    setIsGeneratingLogo(true);
    setStatusText(`RE-RENDERING LOGO EMBLEM AT ${resolution} VIA GEMINI-3-PRO...`);
    playArcCharge();

    try {
      const promptToUse = customPrompt
        ? `${brand.logoDesign.primaryConcept.imagePrompt}. ${customPrompt}`
        : brand.logoDesign.primaryConcept.imagePrompt;

      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          imageSize: resolution,
          brandName: brand.brandName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to render new logo mark.");
      }

      setBrand((prev) => ({
        ...prev,
        primaryLogoUrl: data.imageUrl,
        logoResolution: resolution,
      }));

      playSuccessChime();
      setStatusText(`MASTER LOGO RENDER COMPLETE AT ${resolution}`);

      if (voiceEnabled) {
        speakWithJarvisVoice(`Logo re-rendered successfully at ${resolution} resolution, sir.`);
      }
    } catch (err: any) {
      alert(`Logo generation note: ${err.message}`);
      setStatusText("LOGO RENDER COMPLETE");
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] text-slate-100 flex flex-col font-['Inter',sans-serif] overflow-hidden select-none bg-slate-950">
      {/* 1. Dynamic Animated Celestial Background (Universe, Moon, Nebula, Sun cycle) */}
      <CosmicCelestialBackground
        currentTheme={celestialTheme}
        onThemeChange={setCelestialTheme}
      />

      {/* Top Navigation */}
      <Navbar
        onOpenChat={() => setIsChatOpen(true)}
        onReset={() => setActiveView("create")}
        hasBrand={Boolean(brand)}
        brandName={brand?.brandName}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        onStartVideoCall={() => {
          playJarvisBeep(1400, "sine", 0.05);
          setActiveView("video-call");
        }}
        onOpenTerminal={() => {
          playJarvisBeep(1200, "sine", 0.04);
          setActiveView("terminal");
        }}
      />

      {/* Top Executive Control Deck: Compact Arc Reactor & Station Pill Bar */}
      <div className="relative z-10 shrink-0 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-1 space-y-2">
        {/* N.O.V.A. Arc Reactor HUD Banner with Active Voice Tag */}
        <ArcReactorVisualizer
          isSpeaking={isSpeaking}
          isGenerating={isLoading || isGeneratingLogo}
          voiceEnabled={voiceEnabled}
          onToggleVoice={handleToggleVoice}
          statusText={`${statusText} [VOICE: ${activeVoicePersona.title.toUpperCase()}]`}
          onReactorClick={() => {
            playJarvisBeep(1500, "sine", 0.08);
            setIsChatOpen(true);
          }}
        />

        {/* View Switcher Station Bar (Official Application Station Deck) */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-1 bg-slate-950/80 border border-slate-900 rounded-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Tab 1: QBIT NOVA CORE */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("dashboard");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "dashboard"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>QBIT NOVA CORE</span>
            </button>

            {/* Tab: Real Full Access Terminal */}
            <button
              onClick={() => {
                playJarvisBeep(1200, "sine", 0.04);
                setActiveView("terminal");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "terminal"
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-emerald-400 hover:text-white border border-emerald-900/50"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>TERMINAL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Tab: Application Manager & Software Center */}
            <button
              onClick={() => {
                playJarvisBeep(1300, "sine", 0.04);
                setActiveView("app-manager");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "app-manager"
                  ? "bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-emerald-400 hover:text-white border border-emerald-900/50"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>SOFTWARE CENTER</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>

            {/* Tab 2: 3D Quantum Dragon Core (Three.js) */}
            <button
              onClick={() => {
                playJarvisBeep(1200, "sine", 0.04);
                setActiveView("3d-core");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "3d-core"
                  ? "bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-cyan-400 hover:text-white border border-slate-800"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D QUANTUM CORE</span>
            </button>

            {/* Tab 3: Genomics & Structural Biology (Science Skill) */}
            <button
              onClick={() => {
                playJarvisBeep(1200, "sine", 0.04);
                setActiveView("science");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "science"
                  ? "bg-teal-400 text-slate-950 shadow-[0_0_12px_rgba(45,212,191,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-teal-400 hover:text-white border border-slate-800"
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>GENOMICS & SCIENCE</span>
            </button>

            {/* Tab 4: Omni Video Lab (gemini-omni-1.1-flash) */}
            <button
              onClick={() => {
                playJarvisBeep(1200, "sine", 0.04);
                setActiveView("video-lab");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "video-lab"
                  ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-indigo-400 hover:text-white border border-slate-800"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>OMNI VIDEO LAB</span>
            </button>

            {/* Tab 5: Search & Voice Transcribe */}
            <button
              onClick={() => {
                playJarvisBeep(1200, "sine", 0.04);
                setActiveView("search-transcribe");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "search-transcribe"
                  ? "bg-sky-500 text-slate-950 shadow-[0_0_12px_rgba(14,165,233,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-sky-400 hover:text-white border border-slate-800"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH & TRANSCRIBE</span>
            </button>

            {/* Tab 6: AI Human Real-time Video Call */}
            <button
              onClick={() => {
                playJarvisBeep(1400, "sine", 0.05);
                setActiveView("video-call");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "video-call"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.6)] font-extrabold"
                  : "bg-slate-900/90 text-emerald-400 hover:text-white border border-emerald-900/60"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>AI VIDEO CALL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>

            {/* Tab 7: Emotional Voices */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("voices");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "voices"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <AudioLines className="w-3.5 h-3.5" />
              <span>EMOTIONAL VOICES</span>
            </button>

            {/* Tab 8: Raspberry Pi 5 × Huawei Pura 70 Agent & Termux SSH */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("pi-agent");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "pi-agent"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-rose-400" />
              <span>PI 5 × PURA 70</span>
            </button>

            {/* Tab 9: Synthesize New Brand */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("create");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "create"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>SYNTHESIZE NEW</span>
            </button>
          </div>

          <button
            onClick={() => setIsChatOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Consult N.O.V.A. ({activeVoicePersona.title})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Workstation Stage (Dedicated Scroll Pane - Zero Browser Window Scroll) */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 overflow-y-auto overflow-x-hidden">
        {activeView === "create" ? (
          <BrandGeneratorForm onGenerate={handleGenerateBrand} isLoading={isLoading} />
        ) : activeView === "terminal" ? (
          <RealAccessTerminal brandName={brand.brandName} defaultSize="fullscreen" />
        ) : activeView === "app-manager" ? (
          <ApplicationManager />
        ) : activeView === "3d-core" ? (
          <ThreeDimensionalDragonScene />
        ) : activeView === "science" ? (
          <ScienceGenomicsLab />
        ) : activeView === "video-lab" ? (
          <OmniVideoLab
            brandLogoUrl={brand.primaryLogoUrl}
            brandName={brand.brandName}
          />
        ) : activeView === "search-transcribe" ? (
          <SearchAndVoiceTranscribe
            brandName={brand.brandName}
            onApplyTranscriptionToMission={(transcribedText) => {
              setActiveView("create");
              setStatusText("TRANSCRIPTION APPLIED TO MISSION STATEMENT");
            }}
          />
        ) : activeView === "video-call" ? (
          <AiHumanVideoCall
            brand={brand}
            activeVoicePersona={activeVoicePersona}
            onSelectPersona={handleSelectActiveVoice}
            onCloseCall={() => setActiveView("dashboard")}
          />
        ) : activeView === "voices" ? (
          <VoiceDesignPlayground
            activeVoiceId={activeVoicePersona.id}
            onSelectActiveVoice={handleSelectActiveVoice}
            brandName={brand.brandName}
          />
        ) : activeView === "pi-agent" ? (
          <HuaweiPiAgentBridge
            brand={brand}
            activeVoiceName={activeVoicePersona.title}
          />
        ) : (
          <BrandBibleDashboard
            brand={brand}
            onRegenerateLogo={handleRegenerateLogo}
            isGeneratingLogo={isGeneratingLogo}
            onPlayJarvisBriefing={handlePlayJarvisBriefing}
            isSpeaking={isSpeaking}
          />
        )}
      </main>

      {/* Floating Multi-turn N.O.V.A. Chat Drawer */}
      <JarvisChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        brandContext={brand}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        activeVoicePersona={activeVoicePersona}
      />

      {/* Official Native App Status Bar (Docked Bottom Strip - Exactly 28px height) */}
      <footer className="relative z-10 shrink-0 h-7 border-t border-slate-900 bg-slate-950/95 backdrop-blur-md px-4 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300 font-bold">UNIVERSAL DRAGON ARCHITECT</span>
          <span className="text-slate-600">//</span>
          <span className="hidden sm:inline">N.O.V.A. PROTOCOL 6.1 (ZERO-SCROLL WORKSTATION)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 hidden sm:inline">OFFICIAL NATIVE SUITE</span>
          <span className="text-slate-600">//</span>
          <span>pi5.universaldragon.com</span>
        </div>
      </footer>
    </div>
  );
}
