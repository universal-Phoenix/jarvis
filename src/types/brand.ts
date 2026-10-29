export interface ColorItem {
  name: string;
  hex: string;
  rgb: string;
  role: string;
  usageNotes: string;
  suggestedApplications: string;
}

export interface FontInfo {
  name: string;
  category: string;
  googleFontFamily: string;
  weights: string;
  rationale: string;
}

export interface TypographyHierarchy {
  h1: string;
  h2: string;
  body: string;
  caption: string;
}

export interface SecondaryMark {
  name: string;
  type: string;
  description: string;
  useCase: string;
  symbolText: string;
  imageUrl?: string;
}

export interface BrandBible {
  brandName: string;
  tagline: string;
  missionStatement: string;
  visionStatement: string;
  jarvisBriefing: string;
  valuePillars: Array<{ title: string; description: string }>;
  brandVoice: {
    archetype: string;
    toneKeywords: string[];
    doRules: string[];
    dontRules: string[];
  };
  palette: ColorItem[];
  typography: {
    headingFont: FontInfo;
    bodyFont: FontInfo;
    pairingRationale: string;
    hierarchyNotes: TypographyHierarchy;
  };
  logoDesign: {
    primaryConcept: {
      title: string;
      symbolism: string;
      imagePrompt: string;
    };
    secondaryMarks: SecondaryMark[];
  };
  primaryLogoUrl?: string;
  logoResolution?: "1K" | "2K" | "4K";
  secondaryLogoUrls?: Record<string, string>;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  modelUsed?: string;
  audioUrl?: string;
}
