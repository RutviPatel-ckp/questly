/**
 * Voice settings utility for character-personalized speech synthesis.
 *
 * Each character type has a distinct voice personality:
 * - Dragon: old man voice (slow, deep, wise)
 * - Fairy: young boy voice (slightly higher, playful)
 * - Knight: adult male voice (normal, confident)
 * - Owl: cartoon soft voice (gentle, slightly high)
 * - Griffin: cartoon soft voice (playful, medium)
 */

export type VoiceTone = "energetic" | "calm" | "silly" | "wise" | "sassy";
export type PitchPreference = "higher" | "lower";

export interface VoiceSettings {
  rate: number;
  pitch: number;
  voice: SpeechSynthesisVoice | null;
}

/**
 * Character-type-specific voice parameters.
 * These override the generic tone system for consistent character voices.
 */
const CHARACTER_VOICE_PARAMS: Record<string, { rate: number; pitch: number }> = {
  // Dragon — old man: slow, deep, wise
  dragon: { rate: 0.82, pitch: 0.7 },
  // Fairy — young boy: slightly faster, higher pitch, playful
  fairy: { rate: 1.08, pitch: 1.35 },
  // Knight — adult male: normal rate, lower pitch, confident
  knight: { rate: 0.95, pitch: 0.85 },
  // Owl — cartoon soft: gentle, slightly elevated pitch
  owl: { rate: 0.9, pitch: 1.15 },
  // Griffin — cartoon playful: medium rate, medium-high pitch
  griffin: { rate: 1.0, pitch: 1.2 },
};

/**
 * Tone → speech parameter ranges (fallback when character type is unknown).
 */
const TONE_PARAMS: Record<VoiceTone, { rate: number; pitch: number }> = {
  energetic: { rate: 1.1, pitch: 1.1 },
  calm:      { rate: 0.88, pitch: 0.95 },
  silly:     { rate: 1.08, pitch: 1.3 },
  wise:      { rate: 0.82, pitch: 0.75 },
  sassy:     { rate: 1.0,  pitch: 1.1 },
};

/**
 * Keywords that suggest a "higher" pitch preference (youthful, small, cute).
 */
const HIGHER_KEYWORDS = [
  "girl", "woman", "she", "her", "princess", "fairy", "bunny", "kitten",
  "puppy", "bird", "star", "sparkle", "glitter", "cute", "tiny", "little",
  "baby", "young", "child", "kid", "robot", "alien", "pixie", "sprite",
  "mango", "berry", "flower", "butterfly", "unicorn",
];

/**
 * Keywords that suggest a "lower" pitch preference (mature, large, serious).
 */
const LOWER_KEYWORDS = [
  "old", "wise", "king", "queen", "giant", "dragon", "bear", "owl",
  "professor", "doctor", "sage", "monk", "wizard", "tree", "mountain",
  "ocean", "thunder", "rock", "steel", "iron", "castle", "knight",
  "he", "his", "him", "man", "boy", "father", "grandpa", "grandfather",
];

/**
 * Voice name patterns for selecting male voices (for knight, dragon).
 */
const MALE_VOICE_PATTERNS = [
  /male/i, /daniel/i, /david/i, /james/i, /mark/i, /thomas/i, /george/i,
  /google.*male/i, /google.*uk.*male/i, /google.*us.*male/i,
  /diego/i, /carlos/i, /nicolas/i, /matthew/i, /alex/i,
];

/**
 * Voice name patterns for selecting young/boy voices (for fairy).
 */
const BOY_VOICE_PATTERNS = [
  /boy/i, /child/i, /young/i, /kid/i,
  /google.*us.*female/i, /google.*uk.*female/i,
  /samantha/i, /zira/i, /hazel/i,
];

/**
 * Voice name patterns for cartoon/soft voices (for owl, griffin).
 */
const CARTOON_VOICE_PATTERNS = [
  /google.*female/i, /google.*us.*female/i, /google.*uk.*female/i,
  /samantha/i, /zira/i, /hazel/i, /karen/i,
];

/**
 * Voice name patterns for old/deep voices (for dragon).
 */
const OLD_VOICE_PATTERNS = [
  /male/i, /daniel/i, /david/i, /james/i, /thomas/i,
  /google.*male/i, /google.*uk.*male/i,
  /matthew/i,
];

/**
 * Voice name patterns for male adult voices (for knight).
 */
const MALE_ADULT_PATTERNS = [
  /male/i, /daniel/i, /david/i, /james/i, /mark/i, /thomas/i,
  /google.*male/i, /google.*uk.*male/i, /google.*us.*male/i,
  /diego/i, /matthew/i, /alex/i,
];

/** Detect pitch preference from description (fallback). */
export function detectPitchFromDescription(description: string): PitchPreference {
  const lower = description.toLowerCase();
  const highScore = HIGHER_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const lowScore = LOWER_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  return lowScore > highScore ? "lower" : "higher";
}

/** Detect voice tone from description (fallback). */
export function detectToneFromDescription(description: string): VoiceTone {
  const lower = description.toLowerCase();
  if (/silly|funny|goofy|wacky|crazy|joke|laugh|comedy|humor|clown/i.test(lower)) return "silly";
  if (/wise|old|ancient|sage|scholar|professor|teacher|learned|philosoph/i.test(lower)) return "wise";
  if (/calm|gentle|peace|quiet|shy|soft|sleepy|zen|meditat|relax|serene/i.test(lower)) return "calm";
  if (/sassy|bold|fierce|confident|witty|sass|attitude|boss|queen|diva|spicy/i.test(lower)) return "sassy";
  return "energetic";
}

/**
 * Select the best available system voice for a character type.
 */
function selectVoiceForCharacterType(characterType: string | undefined): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  let patterns: RegExp[] = [];

  switch (characterType) {
    case "dragon":
      patterns = OLD_VOICE_PATTERNS;
      break;
    case "fairy":
      patterns = BOY_VOICE_PATTERNS;
      break;
    case "knight":
      patterns = MALE_ADULT_PATTERNS;
      break;
    case "owl":
    case "griffin":
      patterns = CARTOON_VOICE_PATTERNS;
      break;
    default:
      patterns = MALE_VOICE_PATTERNS;
      break;
  }

  // Try to find a voice matching the character type
  for (const pattern of patterns) {
    const match = pool.find((v) => pattern.test(v.name));
    if (match) return match;
  }

  // Fallback: prefer Google voices
  const googleVoice = pool.find((v) => /google/i.test(v.name));
  if (googleVoice) return googleVoice;

  return pool[0] || null;
}

/**
 * Get complete voice settings for a character.
 * Uses character-type-specific parameters for consistent voice personality.
 *
 * @param voiceTone - The character's tone category (from Groq analysis)
 * @param pitchPreference - "higher" or "lower" (from Groq analysis)
 * @param description - The character's raw description (fallback)
 * @param characterType - The character type ID ("dragon", "fairy", etc.)
 * @returns VoiceSettings with rate, pitch, and selected voice
 */
export function getCharacterVoiceSettings(
  voiceTone: string | undefined,
  pitchPreference: string | undefined,
  description: string,
  characterType?: string | null,
): VoiceSettings {
  // Use character-type-specific params if available
  const charParams = characterType ? CHARACTER_VOICE_PARAMS[characterType] : null;

  if (charParams) {
    const voice = selectVoiceForCharacterType(characterType ?? undefined);
    return {
      rate: charParams.rate,
      pitch: charParams.pitch,
      voice,
    };
  }

  // Fallback to generic tone system
  const tone: VoiceTone = voiceTone && voiceTone in TONE_PARAMS
    ? (voiceTone as VoiceTone)
    : detectToneFromDescription(description);

  const pitch: PitchPreference = pitchPreference === "higher" || pitchPreference === "lower"
    ? pitchPreference
    : detectPitchFromDescription(description);

  const params = TONE_PARAMS[tone];
  const voice = selectVoiceForCharacterType(undefined);

  return {
    rate: params.rate,
    pitch: params.pitch,
    voice,
  };
}

/**
 * Apply voice settings to a SpeechSynthesisUtterance.
 */
export function applyVoiceToUtterance(
  utterance: SpeechSynthesisUtterance,
  settings: VoiceSettings
): void {
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  if (settings.voice) {
    utterance.voice = settings.voice;
  }
}
