// Web Audio API Synthesizer & Multi-Lingual Emotional Speech Engine for N.O.V.A.
// Supports Local Tamil, Tanglish, Urdu, Hindi, English with realistic physiological vocal artifacts:
// - Moochi kathu (audible breath intake / sigh)
// - Ilaipparurathu (relaxed resting cadence & pause)
// - Irumal (subtle throat clearing / cough)
// - Smily (warm smiling chuckle / inflection)

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Electronic Interface Beeps
export const playJarvisBeep = (freq = 880, type: OscillatorType = "sine", duration = 0.12) => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context may require user gesture
  }
};

export const playNovaBeep = playJarvisBeep;

export const playArcCharge = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationSec(0.35));
  } catch (e) {
    // Ignore
  }
};

const durationSec = (s: number) => s;

export const playSuccessChime = () => {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + idx * 0.08;
      const duration = 0.25;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    // Ignore
  }
};

// 2. Physiological Human Vocal Artifacts (Moochi Kathu, Irumal, Smily, Ilaipparurathu)

// Moochi Kathu / Sigh / Ilaipparurathu (Breath sound generator using bandpass-filtered noise)
export const playBreathSound = (isDeep = false, duration = 0.65) => {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink-like soft noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.1444310;
      b2 = 0.57000 * b2 + white * 0.4429950;
      data[i] = (b0 + b1 + b2) * 0.12;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Resonant bandpass filter mimicking trachea / nasal airway
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(isDeep ? 420 : 680, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Dynamic gain envelope: smooth inhalation or exhalation curve
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(isDeep ? 0.09 : 0.05, now + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  } catch (e) {
    // AudioContext permission
  }
};

// Irumal (Subtle throat clearing / soft cough impulse)
export const playThroatClearSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Dual micro-bursts characteristic of a polite throat-clear
    [0, 0.16].forEach((offset) => {
      const t = now + offset;
      const bufferSize = Math.floor(ctx.sampleRate * 0.11);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.025));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(750, t);
      filter.Q.setValueAtTime(3.2, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t);
      noise.stop(t + 0.11);
    });
  } catch (e) {
    // Ignore
  }
};

// Smily / Chuckle (Warm smiling inflection / laughing vocalization)
export const playSmileChuckleSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic chirp burst for a warm chuckle
    [0, 0.14, 0.28].forEach((offset, idx) => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      const baseFreq = 220 + idx * 25;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, t + 0.09);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    });
  } catch (e) {
    // Ignore
  }
};

// 3. Multi-Lingual Speech Synthesis with Emotion & Audio Parsing
export interface SpeakOptions {
  speed?: number; // 0.7 = slow, 1.0 = normal, 1.25 = rapid
  pitch?: number; // 0.8 to 1.2
  language?: "tamil" | "tanglish" | "english" | "urdu" | "hindi" | "auto";
  onStart?: () => void;
  onEnd?: () => void;
}

export const speakWithEmotionalCadence = (
  text: string,
  options: SpeakOptions = {}
): SpeechSynthesisUtterance | null => {
  if (!("speechSynthesis" in window)) {
    return null;
  }

  window.speechSynthesis.cancel();

  // Detect and trigger physiological audio artifacts before/during speech
  const hasBreath = /[*_]?(மூச்சு|பெருமூச்சு|breath|sigh|ilaippar|இளைப்பாறி)[*_]?/i.test(text);
  const hasThroatClear = /[*_]?(கனைப்பு|irumal|cough|throat|தொண்டை)[*_]?/i.test(text);
  const hasSmile = /[*_]?(சிரித்து|புன்னகை|smile|chuckle|giggle|smily)[*_]?/i.test(text);

  if (hasThroatClear) {
    playThroatClearSound();
  } else if (hasBreath) {
    playBreathSound(true);
  } else if (hasSmile) {
    playSmileChuckleSound();
  }

  // Strip acoustic token markers for clean speech synthesis
  const cleanText = text
    .replace(/\*([^*]+)\*/g, " ") // removes bracketed actions like *chuckles* or *மூச்சு வாங்குதல்*
    .replace(/[#_`]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\{\}\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanText) return null;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Auto-detect script language
  const hasTamilScript = /[\u0B80-\u0BFF]/.test(cleanText);
  const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);

  const voices = window.speechSynthesis.getVoices();
  let matchedVoice: SpeechSynthesisVoice | undefined;

  if (hasTamilScript || options.language === "tamil") {
    matchedVoice = voices.find(v => v.lang.startsWith("ta"));
  } else if (hasDevanagari || options.language === "hindi") {
    matchedVoice = voices.find(v => v.lang.startsWith("hi"));
  } else if (options.language === "urdu") {
    matchedVoice = voices.find(v => v.lang.startsWith("ur") || v.lang.startsWith("hi"));
  }

  // Fallback to high quality English
  if (!matchedVoice) {
    matchedVoice =
      voices.find(v => v.lang.includes("en-IN")) ||
      voices.find(v => v.lang.includes("en-GB") && (v.name.includes("Male") || v.name.includes("Natural") || v.name.includes("George"))) ||
      voices.find(v => v.lang.includes("en-US") && v.name.includes("Natural")) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0];
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  // Apply speed & cadence (supports slow, emotional, or colloquial speed)
  utterance.rate = options.speed ?? (hasTamilScript ? 0.92 : 1.0);
  utterance.pitch = options.pitch ?? (hasSmile ? 1.05 : 0.96);

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }

  // Small delay if physiological sound played first
  const delay = (hasBreath || hasThroatClear) ? 450 : 50;
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, delay);

  return utterance;
};

export const speakWithNovaVoice = (
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null => {
  return speakWithEmotionalCadence(text, { onStart, onEnd });
};

export const speakWithJarvisVoice = speakWithNovaVoice;

export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
