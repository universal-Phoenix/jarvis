// Web Audio API Synthesizer for N.O.V.A. interface sounds & voice management

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

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
    // Audio context may require initial user gesture
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
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Ignore
  }
};

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

// Client-side Web Speech Synthesis for N.O.V.A. voice
export const speakWithJarvisVoice = (
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null => {
  if (!("speechSynthesis" in window)) {
    return null;
  }

  window.speechSynthesis.cancel();

  // Strip complex markdown artifacts for speech
  const cleanText = text
    .replace(/[*#_`]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\{\}\[\]]/g, "")
    .trim();

  if (!cleanText) return null;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Look for British or calm articulate voice for NOVA persona
  const voices = window.speechSynthesis.getVoices();
  const novaVoice =
    voices.find(v => v.lang.includes("en-GB") && (v.name.includes("Male") || v.name.includes("George") || v.name.includes("Daniel") || v.name.includes("Oliver"))) ||
    voices.find(v => v.lang.includes("en-GB")) ||
    voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Guy") || v.name.includes("Male") || v.name.includes("Sonia") || v.name.includes("Aria"))) ||
    voices[0];

  if (novaVoice) {
    utterance.voice = novaVoice;
  }

  utterance.pitch = 0.95; // calm, authoritative timbre
  utterance.rate = 1.02; // crisp, articulate cadence

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const speakWithNovaVoice = speakWithJarvisVoice;

export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

