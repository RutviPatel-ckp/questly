/**
 * Character type definitions for Questly companions.
 * Each character has a distinct visual identity, personality, and theme color.
 */

export type CharacterType = "dragon" | "fairy" | "knight" | "owl" | "griffin";

export interface CharacterTypeDef {
  id: CharacterType;
  name: string;
  description: string;
  themeColor: string;
  /** Image paths in /public/characters/ */
  images: {
    idle: string;
    talking: string;
  };
  /** SVG fallback color palette */
  palette: {
    body: string;
    bodyLight: string;
    bodyDark: string;
    accent: string;
    eyes: string;
  };
  /** Default voice tone if Groq analysis fails */
  defaultVoiceTone: "energetic" | "calm" | "silly" | "wise" | "sassy";
  defaultPitch: "higher" | "lower";
}

export const CHARACTER_TYPES: Record<CharacterType, CharacterTypeDef> = {
  dragon: {
    id: "dragon",
    name: "Wise Old Dragon",
    description: "A scholarly dragon with glasses and a quill, keeper of ancient knowledge",
    themeColor: "#4a9e7a",
    images: {
      idle: "/characters/dragon-idle.png",
      talking: "/characters/dragon-talking.png",
    },
    palette: {
      body: "#4a9e7a",
      bodyLight: "#6bc29a",
      bodyDark: "#3a7e62",
      accent: "#8b6914",
      eyes: "#1a1a2e",
    },
    defaultVoiceTone: "wise",
    defaultPitch: "lower",
  },
  fairy: {
    id: "fairy",
    name: "Enchanted Fairy",
    description: "A curious fairy with iridescent wings, master of potions and experiments",
    themeColor: "#7c5cbf",
    images: {
      idle: "/characters/fairy-idle.png",
      talking: "/characters/fairy-talking.png",
    },
    palette: {
      body: "#7c5cbf",
      bodyLight: "#a78bfa",
      bodyDark: "#5b3d9e",
      accent: "#e879f9",
      eyes: "#1a1a2e",
    },
    defaultVoiceTone: "silly",
    defaultPitch: "higher",
  },
  knight: {
    id: "knight",
    name: "Quest Knight",
    description: "A brave adventurer with mechanical armor, explorer of distant realms",
    themeColor: "#6b8fa3",
    images: {
      idle: "/characters/knight-idle.png",
      talking: "/characters/knight-talking.png",
    },
    palette: {
      body: "#6b8fa3",
      bodyLight: "#94b8cc",
      bodyDark: "#4e7289",
      accent: "#c9a84c",
      eyes: "#1a1a2e",
    },
    defaultVoiceTone: "energetic",
    defaultPitch: "lower",
  },
  owl: {
    id: "owl",
    name: "Starlight Owl",
    description: "A crowned owl with constellation markings, guardian of wisdom",
    themeColor: "#c4883a",
    images: {
      idle: "/characters/owl-idle.png",
      talking: "/characters/owl-talking.png",
    },
    palette: {
      body: "#c4883a",
      bodyLight: "#daa964",
      bodyDark: "#9e6d2c",
      accent: "#5ce1e6",
      eyes: "#1a1a2e",
    },
    defaultVoiceTone: "calm",
    defaultPitch: "higher",
  },
  griffin: {
    id: "griffin",
    name: "Royal Griffin",
    description: "A playful baby griffin with a crown, full of mischief and wonder",
    themeColor: "#9e8c7a",
    images: {
      idle: "/characters/griffin-idle.png",
      talking: "/characters/griffin-talking.png",
    },
    palette: {
      body: "#9e8c7a",
      bodyLight: "#c4b5a5",
      bodyDark: "#7a6b5c",
      accent: "#f59e0b",
      eyes: "#1a1a2e",
    },
    defaultVoiceTone: "sassy",
    defaultPitch: "higher",
  },
};

/** Get character type by ID, with fallback to dragon */
export function getCharacterType(id?: string | null): CharacterTypeDef {
  if (id && id in CHARACTER_TYPES) return CHARACTER_TYPES[id as CharacterType];
  return CHARACTER_TYPES.dragon;
}

/** Get all character types as an array */
export function getAllCharacterTypes(): CharacterTypeDef[] {
  return Object.values(CHARACTER_TYPES);
}

/** Map old color theme names to character types for migration */
export const THEME_TO_CHARACTER: Record<string, CharacterType> = {
  Sunset: "knight",
  Ocean: "knight",
  Forest: "fairy",
  Lavender: "fairy",
  Berry: "fairy",
  Honey: "dragon",
  Mint: "owl",
  Coral: "griffin",
};
