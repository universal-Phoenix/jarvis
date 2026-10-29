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
  Orbit
} from "lucide-react";

// Initial Demo Brand for immediate pristine showcase
const INITIAL_DEMO_BRAND: BrandBible = {
  brandName: "Stark Quantum",
  tagline: "Limitless Power. Sovereign Defense.",
  missionStatement:
    "Pioneering compact fusion containment and autonomous clean energy grids to power humanity's multi-planetary expansion and safeguard civilization.",
  visionStatement:
    "An unconstrained post-scarcity future where clean fusion energy drives sovereign defense, terraforming, and deep space infrastructure.",
  jarvisBriefing:
    "Allow me to present the Stark Quantum Brand Bible, sir. The chromatic spectrum has been calibrated to our signature Arc Cyan and Tungsten Obsidian matrix. Primary and secondary marks have been mathematically balanced for orbital scale down to micro-die engraving.",
  valuePillars: [
    {
      title: "Zero-Point Integrity",
      description: "Relentless engineering perfection with tolerance thresholds calculated to subatomic precision.",
    },
    {
      title: "Sovereign Stewardship",
      description: "Deploying world-class defense shields strictly to preserve planetary equilibrium and human life.",
    },
    {
      title: "Quantum Leap Velocity",
      description: "Refusing incrementalism in favor of paradigm-shifting technological breakthroughs.",
    },
    {
      title: "Elegance in Force",
      description: "Form follows lethal function; aesthetic superiority married to raw kinetic capability.",
    },
  ],
  brandVoice: {
    archetype: "The Visionary Architect",
    toneKeywords: ["Unapologetically Brilliant", "Aristocratic Precision", "Audacious", "Composed"],
    doRules: [
      "Speak with calm, sovereign authority and indisputable technical accuracy.",
      "Highlight breakthrough fusion physics, titanium alloys, and autonomous shields.",
      "Keep sentences crisp, active, and mathematically confident.",
    ],
    dontRules: [
      "Never sound uncertain, bureaucratic, or apologetic.",
      "Avoid corporate buzzwords like 'synergy' or 'paradigm shift'.",
      "Never compromise on visual clarity or high-contrast chromatic discipline.",
    ],
  },
  palette: [
    {
      name: "Arc Cyan",
      hex: "#06B6D4",
      rgb: "rgb(6, 182, 212)",
      role: "Primary Brand Color",
      usageNotes: "The core kinetic signature. Use on primary call-to-action elements, glowing emblems, and pivotal highlights.",
      suggestedApplications: "Primary buttons, active indicators, hero vector accents",
    },
    {
      name: "Stark Gold",
      hex: "#F59E0B",
      rgb: "rgb(245, 158, 11)",
      role: "Secondary Accent",
      usageNotes: "High-value engineering tier. Use sparingly for master certifications, security badges, and premium tier distinctions.",
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
      name: "Titanium Slate",
      hex: "#1E293B",
      rgb: "rgb(30, 41, 59)",
      role: "Surface & Card Container",
      usageNotes: "Structural containment. Houses cards, input fields, data tables, and secondary panels.",
      suggestedApplications: "HUD card containers, table headers, border structures",
    },
    {
      name: "Pure Luminescence",
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
      "Space Grotesk commands display hierarchy with futuristic mechanical authority, while Inter provides tranquil, frictionless legibility.",
    hierarchyNotes: {
      h1: "48px - 64px, Weight 700, Letter-spacing -0.02em",
      h2: "28px - 36px, Weight 600, Letter-spacing -0.01em",
      body: "15px - 16px, Weight 400, Line-height 1.6",
      caption: "11px - 12px, Weight 600, Uppercase, Letter-spacing +0.08em",
    },
  },
  logoDesign: {
    primaryConcept: {
      title: "Tri-Sector Arc Reactor Monogram",
      symbolism:
        "Three converging energy containment arcs forming an interlocking quantum loop, signifying infinite power governed by perfect balance.",
      imagePrompt:
        "Minimalist iconic logo mark for Stark Quantum, glowing cyan arc reactor triad geometry, vector graphic emblem on dark matte background",
    },
    secondaryMarks: [
      {
        name: "SQ Interlocking Monogram",
        type: "Monogram Sub-mark",
        description: "Sharply beveled 'S' and 'Q' ligature suitable for hardware stampings and titanium chassis.",
        useCase: "Hardware chassis, laser engraving, executive stationery",
        symbolText: "SQ",
      },
      {
        name: "Arc Core App Badge",
        type: "Icon Badge",
        description: "Spherical containment node with pulsing cyan core enclosed in a hexagonal bezel.",
        useCase: "Mobile app icons, social media avatars, software taskbar icons",
        symbolText: "⚛",
      },
      {
        name: "Micro Favicon Mark",
        type: "Favicon & Watermark",
        description: "Ultra-compact 16px vector dot matrix representation of the arc triad.",
        useCase: "Browser favicon, document corner watermarks, micro telemetry indicators",
        symbolText: "✦",
      },
    ],
  },
  logoResolution: "2K",
  primaryLogoUrl:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='400' height='400'><rect width='400' height='400' fill='%23080c14'/><circle cx='200' cy='200' r='140' fill='none' stroke='%2306b6d4' stroke-width='4' stroke-dasharray='12 8' opacity='0.7'/><circle cx='200' cy='200' r='100' fill='none' stroke='%2338bdf8' stroke-width='8'/><polygon points='200,90 295,255 105,255' fill='none' stroke='%23f59e0b' stroke-width='6'/><circle cx='200' cy='200' r='40' fill='%2306b6d4'/><circle cx='200' cy='200' r='20' fill='%23ffffff'/></svg>",
};

export default function App() {
  const [brand, setBrand] = useState<BrandBible>(INITIAL_DEMO_BRAND);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("CORE SYSTEMS OPTIMAL // READY FOR DIRECTIVES");
  const [activeView, setActiveView] = useState<"dashboard" | "voices" | "pi-agent" | "create">("dashboard");

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
    <div className="relative min-h-screen text-slate-100 flex flex-col font-['Inter',sans-serif] overflow-x-hidden">
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
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

        {/* View Switcher Pill Bar (All 4 Core Stations) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tab 1: Brand Bible */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("dashboard");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "dashboard"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>BRAND BIBLE DASHBOARD</span>
            </button>

            {/* Tab 2: Emotional Voices (Voice Design Playground from Screenshot) */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("voices");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "voices"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <AudioLines className="w-3.5 h-3.5" />
              <span>EMOTIONAL VOICES</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                7+ Personas
              </span>
            </button>

            {/* Tab 3: Raspberry Pi 5 × Huawei Pura 70 Agent */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("pi-agent");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "pi-agent"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-rose-400" />
              <span>PI 5 × PURA 70 AGENT</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                XMAGE Sync
              </span>
            </button>

            {/* Tab 4: Synthesize New Brand */}
            <button
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setActiveView("create");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "create"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>SYNTHESIZE NEW BRAND</span>
            </button>
          </div>

          <button
            onClick={() => setIsChatOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Consult N.O.V.A. ({activeVoicePersona.title})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Content Rendering */}
        {activeView === "create" ? (
          <BrandGeneratorForm onGenerate={handleGenerateBrand} isLoading={isLoading} />
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

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900/80 bg-slate-950/60 backdrop-blur-md py-6 px-4 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>NOVA QUANTUM LABS // N.O.V.A. PROTOCOL 6.1 // RASPBERRY PI 5 EDGE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by Gemini 3.8 Flash TTS, Gemini 3 Pro Vision & Huawei Pura 70 XMAGE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
