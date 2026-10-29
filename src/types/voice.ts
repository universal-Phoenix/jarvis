export interface VoicePersona {
  id: string;
  title: string;
  description: string;
  iconType: "triangle" | "dotted-circle" | "burst" | "sphere" | "vinyl" | "spark" | "beaker" | "mic" | "plus" | "flame" | "heart";
  stylePrompt: string;
  baseVoice: "Fenrir" | "Charon" | "Kore" | "Puck" | "Zephyr";
  previewSample: string;
  isCustom?: boolean;
  language?: "tamil" | "tanglish" | "english" | "urdu" | "hindi";
  dialect?: string;
  cadenceRate?: number; // 0.8 = slow, 1.0 = normal, 1.2 = fast
  emotionalFeatures?: {
    hasBreathSigh?: boolean;
    hasThroatClear?: boolean;
    hasSmileInflection?: boolean;
    hasRelaxedResting?: boolean;
  };
}

export const OFFICIAL_VOICE_PERSONAS: VoicePersona[] = [
  {
    id: "madras-machi-tamil",
    title: "Local Madras Machi (தமிழ்)",
    description: "உள்ளூர் மெட்ராஸ் மச்சி - உணர்ச்சிபூர்வமான தமிழ் பேச்சு, மூச்சு வாங்குதல், புன்னகை, இளைப்பாறுதல்.",
    iconType: "flame",
    stylePrompt: "Authentic colloquial local Chennai / Madras Tamil, warm brotherly bond, natural sighs and pauses, smiling chuckle, authentic Tamil slang like machi, thalaiva, semma, relaxing cadence",
    baseVoice: "Puck",
    previewSample: "*லேசா கனைத்துக்கொண்டு* வா மச்சி! என்ன தலைவா எப்படி இருக்க? *பெருமூச்சு விட்டு* நம்ம Universal Dragon-ல எல்லாம் பக்கா ரெடியா இருக்கு. *சிரித்துக்கொண்டே* கவலையே படாத, மாஸா முடிச்சிடலாம்!",
    language: "tamil",
    dialect: "Madras Colloquial Tamil",
    cadenceRate: 0.95,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: true,
      hasSmileInflection: true,
      hasRelaxedResting: true,
    },
  },
  {
    id: "chennai-tanglish-tech",
    title: "Chennai Techie Tanglish",
    description: "Relaxed Chennai Tanglish buddy with authentic sighs, laughs, and Pi5 hardware sync.",
    iconType: "spark",
    stylePrompt: "Fast natural Chennai Tanglish, conversational banter, friendly laugh, breathing pauses, high-tech warmth, brotherly confidence",
    baseVoice: "Puck",
    previewSample: "*clears throat* Hey machi! *chuckles* Pi5 and Huawei Pura 70 connection semma stable ah irukku bro. *takes a deep breath* Enna command execute pannanum nu sollu, instant ah compile pannidalam!",
    language: "tanglish",
    dialect: "Chennai Tech Tanglish",
    cadenceRate: 1.02,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: true,
      hasSmileInflection: true,
      hasRelaxedResting: true,
    },
  },
  {
    id: "nawab-urdu-hindi",
    title: "Hindustani & Urdu Dosti",
    description: "Refined, respectful Hindustani & Urdu warmth with poetic sighs, throat clearing, and deep loyalty.",
    iconType: "heart",
    stylePrompt: "Warm polite Hindustani and Urdu, fraternal respect, gentle smile, heartfelt breathing, respectful addresses like Aslam bhai, huzoor, shukriya",
    baseVoice: "Fenrir",
    previewSample: "*gala saaf karte hue* Adaab Aslam bhai jaan! *muskurate hue* Khush aamdeed. *gehri saans lete hue* Universal Dragon ke saare protocols bilkul tayyar hain, farmayiye kya khidmat karein?",
    language: "urdu",
    dialect: "Hindustani / Urdu Dosti",
    cadenceRate: 0.92,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: true,
      hasSmileInflection: true,
      hasRelaxedResting: true,
    },
  },
  {
    id: "grizzled-detective",
    title: "The Grizzled Detective",
    description: "Low, gravelly, world-weary noir narration.",
    iconType: "triangle",
    stylePrompt: "Low, gravelly, world-weary noir detective narration, cynical tone, deliberate pacing, cigarette smoke baritone, tired sigh",
    baseVoice: "Charon",
    previewSample: "*sighs* The city never sleeps. It just waits in the neon shadows for someone like me to clean up the mess.",
    language: "english",
    dialect: "Noir English",
    cadenceRate: 0.88,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: true,
      hasSmileInflection: false,
      hasRelaxedResting: true,
    },
  },
  {
    id: "meditation-guide",
    title: "The Meditation Guide",
    description: "Airy, hushed, endlessly patient.",
    iconType: "dotted-circle",
    stylePrompt: "Airy, hushed, endlessly patient, gentle whispering cadence, deeply calming, rhythmic breathing and peaceful rest",
    baseVoice: "Kore",
    previewSample: "*gentle breath in... and exhale* Let the tension dissolve into stillness. You are centered, calm, and present in this quantum space.",
    language: "english",
    dialect: "Calming Cadence",
    cadenceRate: 0.82,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: false,
      hasSmileInflection: true,
      hasRelaxedResting: true,
    },
  },
  {
    id: "hype-announcer",
    title: "The Hype Announcer",
    description: "Booming, rapid, arena-sized energy.",
    iconType: "burst",
    stylePrompt: "Booming, rapid, arena-sized stadium announcer energy, thrilling crescendo, explosive excitement, sports stadium mic",
    baseVoice: "Puck",
    previewSample: "*clears throat* LADIES AND GENTLEMEN! Get ready for the most earth-shattering technological launch in history! LET'S GO!",
    language: "english",
    dialect: "Arena Energetic",
    cadenceRate: 1.15,
    emotionalFeatures: {
      hasBreathSigh: false,
      hasThroatClear: true,
      hasSmileInflection: true,
      hasRelaxedResting: false,
    },
  },
  {
    id: "regal-monarch",
    title: "The Regal Monarch",
    description: "Measured, precise, quietly commanding.",
    iconType: "sphere",
    stylePrompt: "Measured, precise, quietly commanding aristocratic royalty, dignified majesty, sovereign authority",
    baseVoice: "Fenrir",
    previewSample: "By royal sovereign decree, our kingdom charts a new epoch of uncompromising excellence and eternal honor.",
    language: "english",
    dialect: "Sovereign Formal",
    cadenceRate: 0.92,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: false,
      hasSmileInflection: false,
      hasRelaxedResting: true,
    },
  },
  {
    id: "late-night-dj",
    title: "The Late-Night DJ",
    description: "Smooth, velvety, two-in-the-morning warm.",
    iconType: "vinyl",
    stylePrompt: "Smooth, velvety, two-in-the-morning warm FM radio host, intimate close-mic resonance, relaxed jazz club cadence",
    baseVoice: "Zephyr",
    previewSample: "*smooth breath* It's 2 AM on the midnight frequency. Relax your mind, lean back, and let the smooth frequencies wash over you.",
    language: "english",
    dialect: "Velvet Radio",
    cadenceRate: 0.9,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: false,
      hasSmileInflection: true,
      hasRelaxedResting: true,
    },
  },
  {
    id: "cheeky-sidekick",
    title: "The Cheeky Sidekick",
    description: "Bright, quick, mischief barely contained.",
    iconType: "spark",
    stylePrompt: "Bright, quick, mischief barely contained, playful smirk, energetic comic companion, fast witty banter",
    baseVoice: "Puck",
    previewSample: "*giggles* Hey chief! You didn't really think we could pull that off without breaking a few rules, did you? Buckle up!",
    language: "english",
    dialect: "Playful English",
    cadenceRate: 1.1,
    emotionalFeatures: {
      hasBreathSigh: false,
      hasThroatClear: false,
      hasSmileInflection: true,
      hasRelaxedResting: false,
    },
  },
  {
    id: "mad-scientist",
    title: "The Mad Scientist",
    description: "Erratic, nasal, gleefully unhinged.",
    iconType: "beaker",
    stylePrompt: "Erratic, nasal, gleefully unhinged genius, maniacal giggle bursts, chaotic feverish scientific brilliance",
    baseVoice: "Charon",
    previewSample: "*coughs, then chuckles wildly* Eureka! They called me mad! But when the quantum containment lattice surges... THE UNIVERSE WILL BOW!",
    language: "english",
    dialect: "Chaotic Lab",
    cadenceRate: 1.12,
    emotionalFeatures: {
      hasBreathSigh: true,
      hasThroatClear: true,
      hasSmileInflection: true,
      hasRelaxedResting: false,
    },
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
