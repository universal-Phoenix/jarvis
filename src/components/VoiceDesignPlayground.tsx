import React, { useState } from "react";
import {
  Play,
  Square,
  Plus,
  Volume2,
  Check,
  Sparkles,
  Layers,
  Wand2,
  X,
  ChevronRight,
  Radio,
  Sliders,
  AudioLines
} from "lucide-react";
import { VoicePersona, OFFICIAL_VOICE_PERSONAS } from "../types/voice";
import { playJarvisBeep, playSuccessChime, speakWithJarvisVoice, stopSpeech } from "../utils/jarvisAudio";

interface VoiceDesignPlaygroundProps {
  activeVoiceId: string;
  onSelectActiveVoice: (persona: VoicePersona) => void;
  brandName?: string;
}

export const VoiceDesignPlayground: React.FC<VoiceDesignPlaygroundProps> = ({
  activeVoiceId,
  onSelectActiveVoice,
  brandName = "Nova Brand",
}) => {
  const [voices, setVoices] = useState<VoicePersona[]>(OFFICIAL_VOICE_PERSONAS);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Modal for "Create new voice"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStylePrompt, setNewStylePrompt] = useState("");
  const [newBaseVoice, setNewBaseVoice] = useState<"Fenrir" | "Charon" | "Kore" | "Puck" | "Zephyr">("Fenrir");
  const [testText, setTestText] = useState("Greetings. This is a custom emotional voice prototype generated for our venture.");

  const stopCurrentPlayback = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    stopSpeech();
    setPlayingVoiceId(null);
  };

  const handlePlayVoicePreview = async (persona: VoicePersona) => {
    if (playingVoiceId === persona.id) {
      stopCurrentPlayback();
      return;
    }

    stopCurrentPlayback();
    playJarvisBeep(1200, "sine", 0.05);
    setPlayingVoiceId(persona.id);
    setIsLoadingAudio(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: persona.previewSample,
          voice: persona.baseVoice,
          stylePrompt: persona.stylePrompt,
        }),
      });

      const data = await res.json();
      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => {
          setPlayingVoiceId(null);
          setCurrentAudio(null);
        };
        audio.onerror = () => {
          fallbackSpeech(persona);
        };
        setCurrentAudio(audio);
        audio.play().catch(() => fallbackSpeech(persona));
      } else {
        fallbackSpeech(persona);
      }
    } catch {
      fallbackSpeech(persona);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const fallbackSpeech = (persona: VoicePersona) => {
    speakWithJarvisVoice(
      persona.previewSample,
      () => setPlayingVoiceId(persona.id),
      () => setPlayingVoiceId(null)
    );
  };

  const handleCreateVoice = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    playSuccessChime();
    const createdPersona: VoicePersona = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      iconType: "spark",
      stylePrompt: newStylePrompt.trim() || newDescription.trim(),
      baseVoice: newBaseVoice,
      previewSample: testText.trim() || "A custom emotional voice calibrated to perfection.",
      isCustom: true,
    };

    setVoices((prev) => [createdPersona, ...prev]);
    onSelectActiveVoice(createdPersona);
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewStylePrompt("");
  };

  const renderIcon = (type: VoicePersona["iconType"]) => {
    switch (type) {
      case "triangle":
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-cyan-400 fill-none stroke-[1.5]">
              <polygon points="12 3 21 20 3 20" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "dotted-circle":
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-dashed border-cyan-400 animate-spin [animation-duration:16s]" />
          </div>
        );
      case "burst":
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
        );
      case "sphere":
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-cyan-400 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-cyan-300" />
            </div>
          </div>
        );
      case "vinyl":
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-cyan-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
          </div>
        );
      case "spark":
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-amber-400" />
          </div>
        );
      case "beaker":
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-rose-400" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-cyan-400" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Playground Header (Matches AI Studio Voice Design format) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-cyan-500/30 p-6 md:p-8 hud-glow">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
              GEMINI 3.8 FLASH TTS // VOICE DESIGN
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              Flagship Promptable Speech Synthesis
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Turn text into natural-sounding speech
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Flagship TTS model for Voice Design and emotional timbre control. Prompt custom vocal personas, direct line-by-line delivery, and add nuanced psychological resonance to your Brand Bible.
          </p>
        </div>
      </div>

      {/* Voice Shelf: Explore thousands of voices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioLines className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Explore emotional voice personas
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              ({voices.length} Available)
            </span>
          </div>

          <button
            onClick={() => {
              playJarvisBeep(1300, "sine", 0.05);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>CREATE NEW VOICE</span>
          </button>
        </div>

        {/* Horizontal Scroll / Grid of Voice Cards matching AI Studio screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Create New Voice Button Card */}
          <div
            onClick={() => {
              playJarvisBeep(1200, "sine", 0.05);
              setIsModalOpen(true);
            }}
            className="group relative h-48 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 hover:border-cyan-400 hover:bg-slate-900/90 transition-all p-5 flex flex-col items-center justify-center cursor-pointer text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-700 group-hover:border-cyan-400 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 transition-colors shadow-inner">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Create new voice
              </h4>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Design custom persona & style prompt
              </p>
            </div>
          </div>

          {/* Cards 2+: Prebuilt & Custom Voices */}
          {voices.map((persona) => {
            const isPlaying = playingVoiceId === persona.id;
            const isActive = activeVoiceId === persona.id;

            return (
              <div
                key={persona.id}
                className={`group relative h-48 rounded-2xl p-5 flex flex-col justify-between transition-all border ${
                  isActive
                    ? "bg-slate-900/95 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                {/* Top Row: Geometric Icon & Play Button */}
                <div className="flex items-start justify-between">
                  <div className="p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                    {renderIcon(persona.iconType)}
                  </div>

                  {/* Play Preview Button */}
                  <button
                    onClick={() => handlePlayVoicePreview(persona)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isPlaying
                        ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_#22d3ee] animate-pulse"
                        : "bg-slate-950/90 text-slate-300 border border-slate-700 hover:text-white hover:border-cyan-400"
                    }`}
                    title={isPlaying ? "Stop Preview" : "Listen to Voice Preview"}
                  >
                    {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* Middle: Title & Description */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white tracking-tight">{persona.title}</h4>
                    {persona.isCustom && (
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {persona.description}
                  </p>
                </div>

                {/* Bottom Row: Set as Active N.O.V.A. Voice */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => {
                      playSuccessChime();
                      onSelectActiveVoice(persona);
                    }}
                    className={`text-[11px] font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isActive
                        ? "text-cyan-400 font-bold"
                        : "text-slate-400 hover:text-cyan-300"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>ACTIVE N.O.V.A. VOICE</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3 h-3" />
                        <span>SET FOR N.O.V.A.</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] font-mono text-slate-500">
                    {persona.baseVoice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "Create New Voice" Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 md:p-8 hud-glow relative shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Design New Emotional Voice Persona
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                  Voice Name / Persona Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Cosmic Oracle, Cyberpunk Hacker, Sovereign Queen"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Low, gravelly, world-weary noir narration."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                  Detailed Promptable Style Prompt (Voice Design Directive)
                </label>
                <textarea
                  rows={2}
                  value={newStylePrompt}
                  onChange={(e) => setNewStylePrompt(e.target.value)}
                  placeholder="e.g. Velvet, breathy, conspiratorial whisper with intimate close-mic resonance..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                  Base Acoustic Timbre
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(["Fenrir", "Charon", "Kore", "Puck", "Zephyr"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setNewBaseVoice(v)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer ${
                        newBaseVoice === v
                          ? "bg-cyan-500 text-slate-950 font-bold border border-cyan-300"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                  Test Audition Script
                </label>
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Test text to audition..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newTitle.trim() || !newDescription.trim()}
                onClick={handleCreateVoice}
                className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-40"
              >
                Save & Set Active Voice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
