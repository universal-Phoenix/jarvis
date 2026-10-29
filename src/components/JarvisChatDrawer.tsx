import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  X,
  Maximize2,
  Minimize2,
  Cpu,
  Layers,
  ChevronDown,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { ChatMessage, BrandBible } from "../types/brand";
import { VoicePersona } from "../types/voice";
import { playJarvisBeep, playSuccessChime, speakWithJarvisVoice, stopSpeech } from "../utils/jarvisAudio";

interface JarvisChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandContext: BrandBible | null;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  activeVoicePersona?: VoicePersona;
}

const QUICK_PROMPTS = [
  "வா மச்சி வணக்கம்!",
  "Hey thalaiva, Pi5 and Nova engine ready ah?",
  "Adaab Aslam bhai jaan, status update farmayiye.",
  "Namaste Aslam bhai, full pipeline check karo.",
  "Nova, suggest 3 alternative accent colors.",
  "Refine our mission statement to be more cinematic.",
];

export const JarvisChatDrawer: React.FC<JarvisChatDrawerProps> = ({
  isOpen,
  onClose,
  brandContext,
  voiceEnabled,
  onToggleVoice,
  activeVoicePersona,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: "At your service, sir. N.O.V.A. Brand Intelligence protocol is fully operational. How may I assist your brand architecture today?",
      timestamp: Date.now(),
      modelUsed: "gemini-3.8-flash",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"gemini-3.8-flash" | "gemini-4-argon" | "gemini-3.1-flash-lite">(
    "gemini-3.8-flash"
  );
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Voice speech synthesis on new assistant message if voiceEnabled
  const speakMessage = async (text: string) => {
    if (!voiceEnabled) return;
    try {
      // First try backend Gemini TTS with the active emotional voice persona!
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: activeVoicePersona?.baseVoice || "Fenrir",
          stylePrompt: activeVoicePersona?.stylePrompt || "Polite, refined, articulate AI assistant",
        }),
      });
      const data = await res.json();
      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play().catch(() => {
          speakWithJarvisVoice(text);
        });
        return;
      }
    } catch {
      // Fallback to client-side speech
    }
    speakWithJarvisVoice(text);
  };

  // Web Speech Recognition for voice input
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      playJarvisBeep(1200, "sine", 0.08);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        playJarvisBeep(1400, "sine", 0.06);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    playJarvisBeep(880, "sine", 0.05);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages,
          message: query,
          brandContext,
          modelPreference: selectedModel,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to receive response from N.O.V.A.");
      }

      const botMsg: ChatMessage = {
        id: `nova-${Date.now()}`,
        role: "assistant",
        text: data.reply,
        timestamp: Date.now(),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, botMsg]);
      playSuccessChime();

      if (voiceEnabled) {
        speakMessage(data.reply);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: `My apologies, sir. Diagnostic report: ${err.message || "Subroutine communication failure."}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    playJarvisBeep(1400, "sine", 0.04);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl bg-slate-900/95 border-l border-cyan-500/40 backdrop-blur-xl ${
        isExpanded
          ? "inset-4 md:inset-10 rounded-2xl border"
          : "bottom-0 right-0 top-0 w-full md:w-[460px]"
      }`}
    >
      {/* Top Bar */}
      <div className="p-4 border-b border-cyan-900/60 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full bg-slate-900 border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#06b6d4]">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-1.5">
                N.O.V.A.
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                CHIEF BRAND ARCHITECT
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Multi-turn Brand Advisory System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleVoice}
            className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              voiceEnabled ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "text-slate-400 hover:text-white"
            }`}
            title={voiceEnabled ? "Mute Voice" : "Enable Voice Output"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Selector Bar (Per Feature 2: gemini-4-argon for complex, gemini-3.8-flash for general, gemini-3.1-flash-lite for fast) */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400 flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          Intelligence Engine:
        </span>

        <div className="flex items-center gap-1">
          {[
            { id: "gemini-3.8-flash", label: "3.8 Flash (Standard)" },
            { id: "gemini-4-argon", label: "4-Argon (Deep)" },
            { id: "gemini-3.1-flash-lite", label: "3.1 Lite (Speed)" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                setSelectedModel(m.id as any);
              }}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                selectedModel === m.id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-slate-950 border border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[82%] space-y-1 ${isUser ? "text-right" : "text-left"}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed font-normal inline-block ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                      : "bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none hud-glow"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Sub-bar with timestamp, model badge, and actions */}
                <div
                  className={`flex items-center gap-2 text-[10px] font-mono text-slate-500 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {msg.modelUsed && (
                    <span className="text-cyan-500/80">[{msg.modelUsed}]</span>
                  )}
                  {!isUser && (
                    <>
                      <button
                        onClick={() => speakMessage(msg.text)}
                        className="hover:text-cyan-400 transition-colors"
                        title="Read Aloud in N.O.V.A. Voice"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="hover:text-cyan-400 transition-colors"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-950 border border-cyan-400 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-900/60 rounded-tl-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono text-cyan-400 ml-1">N.O.V.A. formulating response...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/60 hover:text-cyan-300 transition-all cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-cyan-900/60">
        <div className="flex items-center gap-2">
          {/* Voice Input (Speech Recognition) */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? "bg-rose-500 text-white border-rose-400 animate-pulse shadow-[0_0_15px_#f43f5e]"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-cyan-300 hover:border-cyan-500"
            }`}
            title={isListening ? "Listening... click to stop" : "Voice Input (Speech-to-Text)"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isListening ? "Listening to your voice..." : "Consult N.O.V.A. on brand strategy..."}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
          />

          {/* Send button */}
          <button
            type="button"
            disabled={!inputText.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
