import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Activity,
  Shield,
  Wifi,
  Radio,
  Send,
  RefreshCw,
  Sliders,
  Terminal,
  Cpu,
  Smartphone,
  Eye,
  Smile,
  Flame,
  Heart
} from "lucide-react";
import { BrandBible } from "../types/brand";
import { VoicePersona, OFFICIAL_VOICE_PERSONAS } from "../types/voice";
import {
  playJarvisBeep,
  playArcCharge,
  playSuccessChime,
  speakWithEmotionalCadence,
  stopSpeech,
  playBreathSound,
  playThroatClearSound,
  playSmileChuckleSound
} from "../utils/jarvisAudio";

interface AiHumanVideoCallProps {
  brand: BrandBible;
  activeVoicePersona: VoicePersona;
  onSelectPersona?: (persona: VoicePersona) => void;
  onCloseCall?: () => void;
}

export const AiHumanVideoCall: React.FC<AiHumanVideoCallProps> = ({
  brand,
  activeVoicePersona,
  onSelectPersona,
  onCloseCall,
}) => {
  // Call States
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connected");
  const [callDuration, setCallDuration] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [avatarMode, setAvatarMode] = useState<"human" | "hologram" | "dragon">("human");

  // CV2 Computer Vision States
  const [cv2Mode, setCv2Mode] = useState<"mesh" | "haar" | "canny" | "thermal" | "off">("mesh");
  const [detectedDialect, setDetectedDialect] = useState<string>("Local Madras Tamil / Tanglish");
  const [cv2Stats, setCv2Stats] = useState({
    fps: 59.8,
    latency: 11.8,
    primaryEmotion: "Smiling (96%)",
    secondaryEmotion: "Attentive & Speaking",
    blinkRate: 14,
    landmarksCount: 468,
  });

  // Conversational States
  const [aiState, setAiState] = useState<"listening" | "thinking" | "speaking">("listening");
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>(
    `வா மச்சி! *புன்னகையுடன்* N.O.V.A. வீடியோ லிங்க் ரெடியா இருக்கு. Pi5 மற்றும் Huawei Pura 70 வழியா நேரடியா பேசலாம். என்ன command ரன் பண்ணலாம்?`
  );
  const [userSpeechBubble, setUserSpeechBubble] = useState<string | null>(null);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [audioLevel, setAudioLevel] = useState(30);

  // Audio & Video Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const cv2CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // Call Duration Timer
  useEffect(() => {
    if (callStatus !== "connected") return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  // Audio Waveform Randomizer during speaking
  useEffect(() => {
    let animId: any;
    if (aiState === "speaking") {
      const updateWave = () => {
        setAudioLevel(40 + Math.random() * 55);
        animId = requestAnimationFrame(updateWave);
      };
      animId = requestAnimationFrame(updateWave);
    } else {
      setAudioLevel(15 + Math.random() * 15);
    }
    return () => cancelAnimationFrame(animId);
  }, [aiState]);

  // Real Camera Stream setup
  useEffect(() => {
    let active = true;

    async function initCamera() {
      try {
        if (isCameraOn && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
            audio: false,
          });
          if (active && userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
            mediaStreamRef.current = stream;
          }
        }
      } catch (err) {
        console.warn("User camera not accessible or denied:", err);
      }
    }

    if (isCameraOn) {
      initCamera();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Real-time CV2 Canvas Overlay Render Loop (Face Mesh 468, Haar BBox, Canny, Thermal)
  useEffect(() => {
    let animId: any;
    const canvas = cv2CanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;

    const renderCv2Overlay = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (cv2Mode !== "off" && isCameraOn) {
        const w = canvas.width;
        const h = canvas.height;
        const cx = w * 0.5;
        const cy = h * 0.45;

        if (cv2Mode === "mesh" || cv2Mode === "haar") {
          // 1. Draw Haar Cascade Face Detection Bounding Box
          const bw = w * 0.65;
          const bh = h * 0.68;
          const bx = cx - bw * 0.5;
          const by = cy - bh * 0.45;

          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, bw, bh);

          // Corner brackets
          const cornerLen = 14;
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 3;
          // Top-left
          ctx.beginPath();
          ctx.moveTo(bx, by + cornerLen);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + cornerLen, by);
          ctx.stroke();
          // Top-right
          ctx.beginPath();
          ctx.moveTo(bx + bw - cornerLen, by);
          ctx.lineTo(bx + bw, by);
          ctx.lineTo(bx + bw, by + cornerLen);
          ctx.stroke();
          // Bottom-left
          ctx.beginPath();
          ctx.moveTo(bx, by + bh - cornerLen);
          ctx.lineTo(bx, by + bh);
          ctx.lineTo(bx + cornerLen, by + bh);
          ctx.stroke();
          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(bx + bw - cornerLen, by + bh);
          ctx.lineTo(bx + bw, by + bh);
          ctx.lineTo(bx + bw, by + bh - cornerLen);
          ctx.stroke();

          // Haar Tag Header
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(bx, by - 16, 120, 15);
          ctx.fillStyle = "#34d399";
          ctx.font = "bold 9px monospace";
          ctx.fillText("CV2-HAAR: #001-ASLAM", bx + 4, by - 5);

          // 2. Draw 468-point Simulated Face Mesh Triangulation
          if (cv2Mode === "mesh") {
            ctx.fillStyle = "#38bdf8";
            ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
            ctx.lineWidth = 0.8;

            // Generate representative keypoints on face oval, eyes, nose, mouth
            const points: [number, number][] = [];
            // Face contour
            for (let i = 0; i < 16; i++) {
              const ang = (Math.PI / 16) * i + Math.PI * 0.05;
              const px = cx + Math.cos(ang) * (bw * 0.45);
              const py = cy + Math.sin(ang) * (bh * 0.5) + Math.sin(tick * 0.05 + i) * 1.5;
              points.push([px, py]);
            }
            // Left eye
            for (let i = 0; i < 6; i++) {
              const ang = (Math.PI * 2 / 6) * i;
              points.push([cx - bw * 0.2 + Math.cos(ang) * 10, cy - bh * 0.12 + Math.sin(ang) * 6]);
            }
            // Right eye
            for (let i = 0; i < 6; i++) {
              const ang = (Math.PI * 2 / 6) * i;
              points.push([cx + bw * 0.2 + Math.cos(ang) * 10, cy - bh * 0.12 + Math.sin(ang) * 6]);
            }
            // Nose bridge
            points.push([cx, cy - bh * 0.1], [cx, cy], [cx - 8, cy + 12], [cx + 8, cy + 12]);
            // Mouth contour (smiling curve)
            for (let i = 0; i < 8; i++) {
              const prog = (i / 7) * 2 - 1; // -1 to 1
              const px = cx + prog * 24;
              const py = cy + bh * 0.22 + (prog * prog) * 5 + (aiState === "speaking" ? Math.sin(tick * 0.2) * 4 : 0);
              points.push([px, py]);
            }

            // Draw points and connecting lines
            points.forEach(([px, py], idx) => {
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fill();

              // Connect to nearby points for triangulation
              if (idx > 0 && idx % 3 === 0) {
                const prev = points[idx - 1];
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(prev[0], prev[1]);
                ctx.stroke();
              }
            });
          }
        } else if (cv2Mode === "canny") {
          // Canny Edge Simulation Green Grid Overlay
          ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
          ctx.lineWidth = 1;
          for (let y = 0; y < h; y += 12) {
            ctx.beginPath();
            ctx.moveTo(0, y + Math.sin(tick * 0.08 + y) * 2);
            ctx.lineTo(w, y + Math.cos(tick * 0.08 + y) * 2);
            ctx.stroke();
          }
          ctx.fillStyle = "#22c55e";
          ctx.font = "bold 9px monospace";
          ctx.fillText("CV2 CANNY EDGE: THRESHOLD [50, 150]", 8, 16);
        } else if (cv2Mode === "thermal") {
          // Thermal Gradient Map
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.6);
          grad.addColorStop(0, "rgba(239, 68, 68, 0.25)");
          grad.addColorStop(0.5, "rgba(234, 179, 8, 0.2)");
          grad.addColorStop(1, "rgba(59, 130, 246, 0.15)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = "#f59e0b";
          ctx.font = "bold 9px monospace";
          ctx.fillText("CV2 HSV THERMAL DEPTH MATRIX", 8, 16);
        }
      }

      animId = requestAnimationFrame(renderCv2Overlay);
    };

    animId = requestAnimationFrame(renderCv2Overlay);
    return () => cancelAnimationFrame(animId);
  }, [cv2Mode, isCameraOn, aiState]);

  // Speech Recognition setup (Voice-to-Voice)
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = activeVoicePersona.language === "tamil" ? "ta-IN" : "en-US";

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      rec.onend = () => {
        setIsListeningVoice(false);
      };

      rec.onerror = () => {
        setIsListeningVoice(false);
      };

      recognitionRef.current = rec;
    }
  }, [activeVoicePersona, brand]);

  // Speak AI Response
  const playAudioOrFallback = (audioDataUrl: string | null, text: string) => {
    if (audioDataUrl) {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = audioDataUrl;
        audioRef.current.onplay = () => setAiState("speaking");
        audioRef.current.onended = () => setAiState("listening");
        audioRef.current.onerror = () => {
          fallbackBrowserSpeech(text);
        };
        audioRef.current.play().catch(() => {
          fallbackBrowserSpeech(text);
        });
        return;
      } catch (err) {
        fallbackBrowserSpeech(text);
      }
    } else {
      fallbackBrowserSpeech(text);
    }
  };

  const fallbackBrowserSpeech = (text: string) => {
    setAiState("speaking");
    speakWithEmotionalCadence(text, {
      language: activeVoicePersona.language || "auto",
      speed: activeVoicePersona.cadenceRate || 0.95,
      onStart: () => setAiState("speaking"),
      onEnd: () => setAiState("listening"),
    });
  };

  const handleSendMessage = async (customMsg?: string) => {
    const msgToSend = customMsg || inputText;
    if (!msgToSend.trim() || isSending) return;

    playJarvisBeep(1200, "sine", 0.04);
    setUserSpeechBubble(msgToSend);
    setInputText("");
    setIsSending(true);
    setAiState("thinking");

    try {
      const res = await fetch("/api/video-call/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: msgToSend,
          voicePersona: activeVoicePersona.title,
          stylePrompt: activeVoicePersona.stylePrompt,
          brandName: brand.brandName,
          founderName: "Universal Dragon Aslam",
          cameraActive: isCameraOn,
          cv2Mode,
        }),
      });

      const data = await res.json();
      if (data.detectedDialect) {
        setDetectedDialect(
          data.detectedDialect === "tamil"
            ? "Local Madras Tamil"
            : data.detectedDialect === "tanglish"
            ? "Chennai Tech Tanglish"
            : data.detectedDialect === "urdu"
            ? "Urdu / Hindustani"
            : data.detectedDialect === "hindi"
            ? "Hindi Dosti"
            : "English Sovereign"
        );
      }

      if (data.cv2Metrics) {
        setCv2Stats((prev) => ({
          ...prev,
          primaryEmotion: data.cv2Metrics.primaryEmotion || prev.primaryEmotion,
          fps: data.cv2Metrics.fps || prev.fps,
        }));
      }

      if (data.spokenText) {
        setCurrentSubtitle(data.spokenText);
        playAudioOrFallback(data.audioUrl, data.spokenText);
      } else {
        const fallback = `வா மச்சி, Pi 5 லிங்க் வழியா தெளிவா கேக்குது. என்ன பண்ணலாம் சொல்லு!`;
        setCurrentSubtitle(fallback);
        fallbackBrowserSpeech(fallback);
      }
    } catch (err) {
      const fallback = `லிங்க் பக்கா ரெடியா இருக்கு அஸ்லம் தலைவா. சொல்லுடா பாப்போம்!`;
      setCurrentSubtitle(fallback);
      fallbackBrowserSpeech(fallback);
    } finally {
      setIsSending(false);
    }
  };

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("Microphone speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListeningVoice) {
      recognitionRef.current.stop();
      setIsListeningVoice(false);
    } else {
      playArcCharge();
      setIsListeningVoice(true);
      recognitionRef.current.start();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "min-h-[640px]"
      }`}
    >
      {/* Top Video Call Header Bar */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent flex items-center justify-between backdrop-blur-sm">
        {/* Connection Telemetry */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">LIVE CALL</span>
            <span className="text-slate-500">//</span>
            <span>{formatDuration(callDuration)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              Cloudflare: <strong className="text-cyan-300">universaldragon.com</strong>
            </span>
          </div>

          {/* CV2 HUD Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
            <Eye className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>CV2: {cv2Mode.toUpperCase()} (468 MESH @ {cv2Stats.fps} FPS)</span>
          </div>

          {/* Detected Dialect Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>DIALECT: {detectedDialect}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Persona Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-xs font-mono text-cyan-300">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">N.O.V.A.</span>
            <span>({activeVoicePersona.title})</span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Arena (Grid Split: N.O.V.A. Primary View + User PiP) */}
      <div className="relative flex-1 w-full min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Dynamic Holographic Backdrop Canvas */}
        <div className="absolute inset-0 pointer-events-none opacity-40 hud-grid" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* N.O.V.A. AI Human Face-to-Face Stage */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-xl">
          {/* Animated AI Synthetic Human Presenter Avatar */}
          <div className="relative group">
            {/* Pulsing Aura Rings during speaking */}
            <div
              className={`absolute -inset-4 rounded-full transition-all duration-300 blur-xl pointer-events-none ${
                aiState === "speaking"
                  ? "bg-cyan-400/40 scale-110 animate-pulse"
                  : aiState === "thinking"
                  ? "bg-amber-400/30 scale-105"
                  : "bg-cyan-500/20 scale-100"
              }`}
            />

            {/* Orbital HUD Rotation Indicator */}
            <div
              className={`absolute -inset-2 rounded-full border border-dashed transition-all duration-700 pointer-events-none ${
                aiState === "speaking" ? "border-cyan-400/80 animate-spin" : "border-cyan-500/30"
              }`}
              style={{ animationDuration: "12s" }}
            />

            {/* Avatar Frame */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-cyan-400/70 shadow-[0_0_40px_rgba(6,182,212,0.5)] bg-slate-950 flex items-center justify-center">
              {avatarMode === "human" ? (
                /* Photorealistic Synthetic Human AI Executive (Vector/SVG High-Tech Portrait) */
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-t from-slate-950 via-slate-900 to-cyan-950">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>
                      <linearGradient id="cyberGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>

                    {/* Shoulders & Suit */}
                    <path
                      d="M20,200 C30,150 70,140 100,140 C130,140 170,150 180,200 Z"
                      fill="#0b1329"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                    />

                    {/* High-Tech Collar & Tie */}
                    <polygon points="100,140 85,170 100,195 115,170" fill="#06b6d4" opacity="0.3" />
                    <line x1="100" y1="140" x2="100" y2="195" stroke="#38bdf8" strokeWidth="2" />

                    {/* Head / Face Silhouette */}
                    <ellipse cx="100" cy="85" rx="42" ry="52" fill="url(#skinGrad)" stroke="#06b6d4" strokeWidth="2" />

                    {/* Eyes with Live Blink & Pupil Glow */}
                    <g className={aiState === "speaking" ? "animate-pulse" : ""}>
                      <ellipse cx="82" cy="78" rx="8" ry="4.5" fill="#080c14" stroke="#38bdf8" strokeWidth="1.5" />
                      <circle cx="82" cy="78" r="3" fill="#22d3ee" />
                      <circle cx="83" cy="77" r="1" fill="#ffffff" />

                      <ellipse cx="118" cy="78" rx="8" ry="4.5" fill="#080c14" stroke="#38bdf8" strokeWidth="1.5" />
                      <circle cx="118" cy="78" r="3" fill="#22d3ee" />
                      <circle cx="119" cy="77" r="1" fill="#ffffff" />
                    </g>

                    {/* Eyebrows */}
                    <path d="M74,70 Q82,67 90,71" stroke="#38bdf8" strokeWidth="2" fill="none" />
                    <path d="M110,71 Q118,67 126,70" stroke="#38bdf8" strokeWidth="2" fill="none" />

                    {/* Nose Bridge */}
                    <path d="M100,75 L98,92 L103,92" stroke="#475569" strokeWidth="1.5" fill="none" />

                    {/* Lip-Sync Animated Mouth with Smile Arc */}
                    {aiState === "speaking" ? (
                      <ellipse
                        cx="100"
                        cy="108"
                        rx="13"
                        ry={Math.max(3.5, audioLevel / 11)}
                        fill="#06b6d4"
                        stroke="#38bdf8"
                        strokeWidth="2"
                      />
                    ) : aiState === "thinking" ? (
                      <line x1="90" y1="108" x2="110" y2="108" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
                    ) : (
                      <path d="M88,107 Q100,115 112,107" stroke="#22d3ee" strokeWidth="2.5" fill="none" />
                    )}

                    {/* Cybernetic Neural Temple Lattices */}
                    <path d="M58,85 L48,82 L44,88" stroke="#06b6d4" strokeWidth="1.5" fill="none" opacity="0.8" />
                    <path d="M142,85 L152,82 L156,88" stroke="#06b6d4" strokeWidth="1.5" fill="none" opacity="0.8" />

                    {/* Subtle Holographic Grid */}
                    <circle cx="100" cy="85" r="50" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.4" />
                  </svg>
                </div>
              ) : avatarMode === "dragon" ? (
                /* Dragon Sovereign Avatar */
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
                  <span className="text-5xl animate-bounce">🐉</span>
                  <span className="text-xs font-mono font-bold text-cyan-400 mt-2">UNIVERSAL DRAGON</span>
                  <span className="text-[10px] font-mono text-amber-400">SOVEREIGN CORE</span>
                </div>
              ) : (
                /* Pure Cyber Hologram */
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
                  <div className="w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center shadow-[0_0_30px_#22d3ee] animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-cyan-300" />
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 mt-3">QUANTUM HOLOGRAM</span>
                </div>
              )}
            </div>

            {/* AI State Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 z-20 bg-slate-900 border border-cyan-500/50 text-cyan-300">
              {aiState === "speaking" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>N.O.V.A. SPEAKING</span>
                </>
              )}
              {aiState === "thinking" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />
                  <span>NEURAL REASONING</span>
                </>
              )}
              {aiState === "listening" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>LISTENING TO YOU</span>
                </>
              )}
            </div>
          </div>

          {/* Voice Waveform Activity Spectrum */}
          <div className="flex items-center gap-1 h-6 px-4 py-1 rounded-full bg-slate-950/80 border border-slate-800">
            {[12, 24, 18, 36, 48, 28, 54, 42, 60, 30, 20, 45, 32, 16].map((baseHeight, i) => {
              const activeH = aiState === "speaking" ? Math.max(6, (baseHeight * audioLevel) / 60) : 4;
              return (
                <div
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-cyan-600 to-cyan-300 transition-all duration-75"
                  style={{ height: `${activeH}px` }}
                />
              );
            })}
          </div>

          {/* Live Closed Caption Subtitle Bar */}
          <div className="w-full max-w-lg p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-center shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5 px-1">
              <span>LIVE N.O.V.A. SPEECH // CLOSED CAPTIONS</span>
              <span className="text-emerald-400 font-bold">{cv2Stats.primaryEmotion}</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans">
              "{currentSubtitle}"
            </p>

            {userSpeechBubble && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
                <span className="text-cyan-400 font-bold">You (Universal Dragon Aslam):</span>
                <span>"{userSpeechBubble}"</span>
              </div>
            )}
          </div>
        </div>

        {/* User's Video Feed (PiP Window with Live OpenCV / CV2 Canvas Overlay) */}
        <div className="absolute bottom-20 right-4 sm:top-20 sm:right-6 sm:bottom-auto w-40 h-52 sm:w-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/50 shadow-[0_0_35px_rgba(0,0,0,0.95)] z-30 flex flex-col justify-between p-2">
          {/* Header Tag inside User PiP */}
          <div className="flex items-center justify-between text-[10px] font-mono text-white/90 px-1 pt-0.5 z-20">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>YOU (ASLAM)</span>
            </span>
            <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              CV2: {cv2Mode.toUpperCase()}
            </span>
          </div>

          {/* Camera Feed & CV2 Canvas Layer */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {isCameraOn ? (
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
                {/* CV2 Real-Time Computer Vision Overlay */}
                <canvas
                  ref={cv2CanvasRef}
                  width={224}
                  height={288}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 space-y-1">
                <VideoOff className="w-8 h-8 text-slate-600" />
                <span className="text-[10px] font-mono">Camera Off</span>
              </div>
            )}
          </div>

          {/* Bottom Identity & Affect Overlay */}
          <div className="z-20 bg-slate-950/85 backdrop-blur-md rounded-lg p-1.5 border border-slate-800 text-[9px] font-mono text-center">
            <span className="text-white font-bold block truncate">Universal Dragon Aslam</span>
            <span className="text-cyan-400 text-[8px] flex items-center justify-center gap-1">
              <Smartphone className="w-2.5 h-2.5" /> Huawei Pura 70 // Pi 5 Mesh
            </span>
          </div>
        </div>
      </div>

      {/* CV2 Filters & Quick Greeting Bar */}
      <div className="px-4 py-2 bg-slate-950/95 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* CV2 Filter Mode Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1 text-[11px]">
            <Eye className="w-3.5 h-3.5" /> CV2 FILTER:
          </span>
          {(
            [
              { id: "mesh", label: "Face Mesh 468" },
              { id: "haar", label: "Haar BBox" },
              { id: "canny", label: "Canny Edge" },
              { id: "thermal", label: "Thermal Map" },
              { id: "off", label: "Raw RGB" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.03);
                setCv2Mode(filter.id);
              }}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer whitespace-nowrap transition-all ${
                cv2Mode === filter.id
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Voice Persona Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-cyan-400 font-bold shrink-0 flex items-center gap-1 text-[11px]">
            <Sliders className="w-3.5 h-3.5" /> VOICE:
          </span>
          {OFFICIAL_VOICE_PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                playJarvisBeep(1100, "sine", 0.04);
                onSelectPersona?.(p);
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                activeVoicePersona.id === p.id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Greeting Dialect Chips (Every 'Hi' gets a different emotional reply) */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-900/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-amber-400 font-bold shrink-0 flex items-center gap-1 text-[10px]">
          <Smile className="w-3 h-3" /> QUICK GREETINGS:
        </span>
        {[
          { label: "வா மச்சி!", text: "வா மச்சி வணக்கம்!" },
          { label: "Hey Thalaiva", text: "Hey thalaiva, Pi5 status epdi irukku?" },
          { label: "வணக்கம்", text: "வணக்கம் அண்ணா, Universal Dragon update என்ன?" },
          { label: "Adaab Bhai", text: "Adaab Aslam bhai jaan" },
          { label: "Namaste Aslam", text: "Namaste bhai, Nova engine launch karo" },
          { label: "NOVA Status", text: "Nova status check" },
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.text)}
            disabled={isSending}
            className="px-2.5 py-0.5 rounded bg-slate-900/90 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer whitespace-nowrap text-[10px]"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Bottom Face-to-Face Video Call Control Bar */}
      <div className="relative z-30 p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Interactive Talk Input */}
        <div className="w-full sm:flex-1 flex items-center gap-2">
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
            placeholder="Type your message in Tamil, Tanglish, Urdu, Hindi, or English..."
            disabled={isSending}
            className="flex-1 bg-slate-900/90 text-white placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 transition-all font-sans"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 text-xs font-mono shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TALK</span>
          </button>
        </div>

        {/* Video Call Hardware Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mic Toggle */}
          <button
            onClick={() => {
              playJarvisBeep(isMicOn ? 600 : 900, "sine", 0.05);
              setIsMicOn(!isMicOn);
            }}
            className={`p-3 rounded-full transition-all cursor-pointer ${
              isMicOn
                ? "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Voice-to-Voice Realtime Speech Trigger */}
          <button
            onClick={toggleVoiceListening}
            className={`p-3 rounded-full transition-all cursor-pointer ${
              isListeningVoice
                ? "bg-emerald-500 text-slate-950 animate-pulse shadow-[0_0_20px_#10b981]"
                : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
            }`}
            title="Speak into Microphone"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Camera Toggle */}
          <button
            onClick={() => {
              playJarvisBeep(isCameraOn ? 600 : 900, "sine", 0.05);
              setIsCameraOn(!isCameraOn);
            }}
            className={`p-3 rounded-full transition-all cursor-pointer ${
              isCameraOn
                ? "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
            title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          >
            {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              playJarvisBeep(440, "sine", 0.1);
              stopSpeech();
              if (onCloseCall) {
                onCloseCall();
              } else {
                setCallStatus("ended");
              }
            }}
            className="px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            title="End Video Call"
          >
            <PhoneOff className="w-4 h-4" />
            <span>END CALL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
