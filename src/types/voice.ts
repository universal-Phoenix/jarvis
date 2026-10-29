export interface VoicePersona {
  id: string;
  title: string;
  description: string;
  iconType: "triangle" | "dotted-circle" | "burst" | "sphere" | "vinyl" | "spark" | "beaker" | "mic" | "plus";
  stylePrompt: string;
  baseVoice: "Fenrir" | "Charon" | "Kore" | "Puck" | "Zephyr";
  previewSample: string;
  isCustom?: boolean;
}

export const OFFICIAL_VOICE_PERSONAS: VoicePersona[] = [
  {
    id: "grizzled-detective",
    title: "The Grizzled Detective",
    description: "Low, gravelly, world-weary noir narration.",
    iconType: "triangle",
    stylePrompt: "Low, gravelly, world-weary noir detective narration, cynical tone, deliberate pacing, cigarette smoke baritone",
    baseVoice: "Charon",
    previewSample: "The city never sleeps. It just waits in the neon shadows for someone like me to clean up the mess.",
  },
  {
    id: "meditation-guide",
    title: "The Meditation Guide",
    description: "Airy, hushed, endlessly patient.",
    iconType: "dotted-circle",
    stylePrompt: "Airy, hushed, endlessly patient, gentle whispering cadence, deeply calming, rhythmic breathing",
    baseVoice: "Kore",
    previewSample: "Take a deep breath in... let the tension dissolve into stillness. You are centered, calm, and present.",
  },
  {
    id: "hype-announcer",
    title: "The Hype Announcer",
    description: "Booming, rapid, arena-sized energy.",
    iconType: "burst",
    stylePrompt: "Booming, rapid, arena-sized stadium announcer energy, thrilling crescendo, explosive excitement, sports stadium mic",
    baseVoice: "Puck",
    previewSample: "LADIES AND GENTLEMEN! Get ready for the most earth-shattering technological launch in history! LET'S GO!",
  },
  {
    id: "regal-monarch",
    title: "The Regal Monarch",
    description: "Measured, precise, quietly commanding.",
    iconType: "sphere",
    stylePrompt: "Measured, precise, quietly commanding aristocratic royalty, dignified majesty, sovereign authority",
    baseVoice: "Fenrir",
    previewSample: "By royal sovereign decree, our kingdom charts a new epoch of uncompromising excellence and eternal honor.",
  },
  {
    id: "late-night-dj",
    title: "The Late-Night DJ",
    description: "Smooth, velvety, two-in-the-morning warm.",
    iconType: "vinyl",
    stylePrompt: "Smooth, velvety, two-in-the-morning warm FM radio host, intimate close-mic resonance, relaxed jazz club cadence",
    baseVoice: "Zephyr",
    previewSample: "It's 2 AM on the midnight frequency. Relax your mind, lean back, and let the smooth frequencies wash over you.",
  },
  {
    id: "cheeky-sidekick",
    title: "The Cheeky Sidekick",
    description: "Bright, quick, mischief barely contained.",
    iconType: "spark",
    stylePrompt: "Bright, quick, mischief barely contained, playful smirk, energetic comic companion, fast witty banter",
    baseVoice: "Puck",
    previewSample: "Hey chief! You didn't really think we could pull that off without breaking a few rules, did you? Buckle up!",
  },
  {
    id: "mad-scientist",
    title: "The Mad Scientist",
    description: "Erratic, nasal, gleefully unhinged.",
    iconType: "beaker",
    stylePrompt: "Erratic, nasal, gleefully unhinged genius, maniacal giggle bursts, chaotic feverish scientific brilliance",
    baseVoice: "Charon",
    previewSample: "Eureka! They called me mad! But when the quantum containment lattice surges... THE UNIVERSE WILL BOW TO SCIENCE!",
  },
];

export type CelestialTheme = "cycle" | "universe" | "nebula" | "sun" | "moon" | "eclipse";

export interface PiAgentTask {
  id: string;
  name: string;
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
  outputLog: string[];
  targetDevice: "Raspberry Pi 5" | "Huawei Pura 70";
}
