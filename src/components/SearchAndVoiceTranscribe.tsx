/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import {
  Search,
  Mic,
  MicOff,
  Globe,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Send,
  Radio,
  Terminal,
} from "lucide-react";

interface SearchAndVoiceTranscribeProps {
  onApplyTranscriptionToMission?: (text: string) => void;
  brandName?: string;
}

export function SearchAndVoiceTranscribe({
  onApplyTranscriptionToMission,
  brandName = "Universal Dragon",
}: SearchAndVoiceTranscribeProps) {
  // Google Search Grounding States
  const [searchQuery, setSearchQuery] = useState(
    "Universal Dragon sovereign quantum cloud computing architecture and edge intelligence"
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);

  // Audio Transcription (gemini-3.5-transcribe) States
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Execute Google Search Grounded Intel
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);
    setGroundingSources([]);

    try {
      const res = await fetch("/api/ai/search-grounded-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResult(data.intel);
        if (data.groundingMetadata?.groundingChunks) {
          setGroundingSources(data.groundingMetadata.groundingChunks);
        }
      } else {
        setSearchResult(data.error || "Failed to retrieve intelligence.");
      }
    } catch (err: any) {
      setSearchResult(`Error: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  // Start Mic Recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await transcribeAudio(base64Audio);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      alert(`Microphone access notice: ${err.message}`);
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Transcribe via gemini-3.5-transcribe
  const transcribeAudio = async (base64Audio: string) => {
    setIsTranscribing(true);
    try {
      const res = await fetch("/api/ai/transcribe-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioData: base64Audio,
          mimeType: "audio/webm",
        }),
      });

      const data = await res.json();
      if (data.success && data.transcription) {
        setTranscription(data.transcription);
      } else {
        setTranscription(data.error || "No transcription generated.");
      }
    } catch (err: any) {
      setTranscription(`Transcription error: ${err.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopyTranscription = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/95 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Globe className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-sky-300">
                GOOGLE SEARCH GROUNDING & LIVE MIC TRANSCRIBE STATION
              </span>
              <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-mono">
                gemini-3.8-flash + gemini-3.5-transcribe
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time live Google Search web intelligence & accurate voice dictation for brand directives.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Split Pane */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto">
        {/* Left Column: Live Google Search Grounding */}
        <div className="lg:col-span-6 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 font-bold text-sky-300">
              <Search className="w-4 h-4 text-sky-400" />
              <span>LIVE GOOGLE SEARCH GROUNDING</span>
            </div>
            <span className="text-[10px] text-slate-500">model: gemini-3.8-flash</span>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search current web data, competitors, technology standards..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>SEARCH</span>
            </button>
          </form>

          {/* Search Result Box */}
          <div className="flex-1 min-h-[200px] p-3 rounded-xl bg-slate-900/50 border border-slate-800 overflow-y-auto text-xs font-sans text-slate-300 leading-relaxed space-y-2">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
                <span>Executing search grounding queries across Google index...</span>
              </div>
            ) : searchResult ? (
              <div className="space-y-3">
                <p className="whitespace-pre-wrap">{searchResult}</p>

                {groundingSources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Citations & Web Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {groundingSources.map((chunk, idx) => (
                        <a
                          key={idx}
                          href={chunk.web?.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-sky-300 border border-slate-700"
                        >
                          <span>{chunk.web?.title || `Source ${idx + 1}`}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs text-center p-4">
                <Globe className="w-8 h-8 text-slate-600 mb-2" />
                <span>Query the live Google Search index to enrich your brand intelligence.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Mic Audio Transcription */}
        <div className="lg:col-span-6 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <Radio className="w-4 h-4 text-rose-400" />
              <span>LIVE MICROPHONE AUDIO TRANSCRIBE</span>
            </div>
            <span className="text-[10px] text-slate-500">model: gemini-3.5-transcribe</span>
          </div>

          {/* Recording Control Box */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center space-y-3 text-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isRecording
                  ? "bg-rose-600 text-white animate-pulse shadow-rose-600/50"
                  : "bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 hover:border-rose-500/50"
              }`}
            >
              {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            <div>
              <div className="text-xs font-mono font-bold text-white">
                {isRecording ? "RECORDING IN PROGRESS..." : "CLICK TO RECORD AUDIO"}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                {isRecording
                  ? "Speak your mission statement or commands clearly. Click again to transcribe."
                  : "Uses gemini-3.5-transcribe for near-instant speech-to-text conversion."}
              </p>
            </div>
          </div>

          {/* Transcription Output */}
          <div className="flex-1 min-h-[160px] p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>TRANSCRIPTION OUTPUT:</span>
                {transcription && (
                  <button
                    onClick={handleCopyTranscription}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "COPIED" : "COPY TEXT"}</span>
                  </button>
                )}
              </div>

              {isTranscribing ? (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 py-4">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transcribing audio via gemini-3.5-transcribe...</span>
                </div>
              ) : transcription ? (
                <p className="text-xs text-white font-mono leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  "{transcription}"
                </p>
              ) : (
                <p className="text-xs text-slate-500 font-mono py-4 text-center">
                  Spoken transcription will appear here.
                </p>
              )}
            </div>

            {/* Apply Button */}
            {transcription && onApplyTranscriptionToMission && (
              <button
                onClick={() => onApplyTranscriptionToMission(transcription)}
                className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>USE AS MISSION STATEMENT IN BRAND GENERATOR</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
