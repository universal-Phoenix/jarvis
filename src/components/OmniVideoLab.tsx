/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Film,
  Play,
  Pause,
  Sparkles,
  Download,
  Image as ImageIcon,
  Smartphone,
  Tv,
  RefreshCw,
  Video,
  Layers,
  Wand2,
} from "lucide-react";

interface OmniVideoLabProps {
  brandLogoUrl?: string;
  brandName?: string;
}

export function OmniVideoLab({ brandLogoUrl, brandName = "Universal Dragon" }: OmniVideoLabProps) {
  const [prompt, setPrompt] = useState(
    `A majestic cybernetic dragon soaring through a glowing cyan and gold celestial nebula, sovereign quantum particles swirling in 4K ultra-realistic cinematic motion.`
  );
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [duration, setDuration] = useState<"5s" | "10s">("5s");
  const [useLogoAsStartingFrame, setUseLogoAsStartingFrame] = useState(false);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImageBase64(event.target?.result as string);
        setUseLogoAsStartingFrame(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setNotice("Initiating Gemini Omni Flash video synthesis pipeline (gemini-omni-1.1-flash)...");

    try {
      const startingImage = useLogoAsStartingFrame
        ? brandLogoUrl
        : customImageBase64 || null;

      const res = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration,
          resolution: "720p",
          startingImageBase64: startingImage,
          brandName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedVideoUrl(data.videoUrl);
        setNotice(data.notice || "Video synthesis completed.");
      } else {
        setNotice(data.error || "Generation error.");
      }
    } catch (err: any) {
      console.error(err);
      setNotice(`Synthesis error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/95 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Film className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-indigo-300">
                GEMINI OMNI FLASH // VIDEO & MOTION SYNTHESIS LAB
              </span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-mono">
                gemini-omni-1.1-flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Generate 4K cinematic video from text or animate brand logo marks into fluid 60fps video.
            </p>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setAspectRatio("16:9")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              aspectRatio === "16:9"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>16:9 (CINEMATIC)</span>
          </button>
          <button
            onClick={() => setAspectRatio("9:16")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              aspectRatio === "9:16"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 (PURA 70 / REELS)</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Column Lab */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto">
        {/* Left Column: Directives & Frame Input Controls */}
        <div className="lg:col-span-5 p-4 flex flex-col space-y-4">
          {/* Prompt Directive Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-indigo-300 font-bold flex items-center justify-between">
              <span>CINEMATIC MOTION DIRECTIVE</span>
              <span className="text-[10px] text-slate-500 font-normal">Omni Video Pipeline</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe motion, camera pans, lighting, atmospheric dynamics..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
            />
          </div>

          {/* Image-to-Video Animation Frame Source */}
          <div className="space-y-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>STARTING FRAME (IMAGE-TO-VIDEO)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Optional</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Option 1: Use Current Brand Logo */}
              {brandLogoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setUseLogoAsStartingFrame(!useLogoAsStartingFrame);
                    if (!useLogoAsStartingFrame) setCustomImageBase64(null);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    useLogoAsStartingFrame
                      ? "bg-indigo-950/60 border-indigo-500 text-indigo-300 shadow-sm"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <img
                    src={brandLogoUrl}
                    alt="Brand Logo"
                    className="w-12 h-12 object-contain rounded bg-slate-950 border border-slate-800 p-1"
                  />
                  <span className="text-[10px] font-mono font-bold text-center">
                    {useLogoAsStartingFrame ? "✓ ANIMATE LOGO" : "ANIMATE LOGO"}
                  </span>
                </button>
              )}

              {/* Option 2: Upload Custom Image */}
              <label
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  customImageBase64
                    ? "bg-indigo-950/60 border-indigo-500 text-indigo-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {customImageBase64 ? (
                  <img
                    src={customImageBase64}
                    alt="Custom Upload"
                    className="w-12 h-12 object-cover rounded bg-slate-950 border border-slate-800"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
                <span className="text-[10px] font-mono font-bold text-center">
                  {customImageBase64 ? "✓ IMAGE ATTACHED" : "UPLOAD IMAGE"}
                </span>
              </label>
            </div>
          </div>

          {/* Duration & Resolution */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">OUTPUT DURATION:</span>
            <div className="flex items-center gap-1.5">
              {(["5s", "10s"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    duration === d
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono font-extrabold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SYNTHESIZING VIDEO WITH OMNI FLASH...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>
                  {useLogoAsStartingFrame || customImageBase64
                    ? "ANIMATE IMAGE INTO VIDEO"
                    : "GENERATE VIDEO FROM TEXT"}
                </span>
              </>
            )}
          </button>

          {notice && (
            <p className="text-[11px] font-mono text-cyan-300 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 leading-relaxed">
              {notice}
            </p>
          )}
        </div>

        {/* Right Column: Video Playback Stage */}
        <div className="lg:col-span-7 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-400" />
              <span className="text-white font-bold">CINEMATIC VIDEO MONITOR</span>
              <span className="text-slate-500">//</span>
              <span className="text-indigo-400 font-bold">{aspectRatio}</span>
            </div>
            {generatedVideoUrl && (
              <a
                href={generatedVideoUrl}
                download="universal-dragon-omni-video.mp4"
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD MP4</span>
              </a>
            )}
          </div>

          {/* Video Player Display Container */}
          <div
            className={`relative flex-1 w-full min-h-[320px] rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner ${
              aspectRatio === "9:16" ? "max-w-[280px] mx-auto aspect-[9/16]" : "aspect-[16/9]"
            }`}
          >
            {generatedVideoUrl ? (
              <video
                src={generatedVideoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain rounded-2xl"
              />
            ) : (
              /* Simulated Motion Canvas Engine with Celestial Dragon Visual */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-cyan-950/20">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border border-indigo-500/40 animate-ping absolute inset-0 m-auto" />
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Film className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-mono font-bold text-white">
                    GEMINI OMNI FLASH MOTION ENGINE
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Enter a cinematic directive or select your brand mark to synthesize full 60fps video.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    16:9 & 9:16 Supported
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    720p / 1080p / 4K
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
