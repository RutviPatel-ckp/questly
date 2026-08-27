/**
 * Voice settings utility for character-personalized speech synthesis.
 *
 * Maps voice tone + pitch preference → speechSynthesis settings (rate, pitch, voice).
 * All characters sound like themselves, consistently across lesson narration,
 * study buddy chat, and celebratory reactions.
 */

export type VoiceTone = "energetic" | "calm" | "silly" | "wise" | "sassy";
export type PitchPreference = "higher" | "lower";

export interface VoiceSettings {
  rate: number;
  pitch: number;
  voice: SpeechSynthesisVoice | null;
}

/**
 * Tone → speech parameter ranges.
 * Each tone defines a rate and pitch that characterizes the voice personality.
 */
const TONE_PARAMS: Record<VoiceTone, { rate: number; pitch: number }> = {
  energetic: { rate: 1.15, pitch: 1.15 },
  calm:      { rate: 0.88, pitch: 1.0 },
  silly:     { rate: 1.08, pitch: 1.3 },
  wise:      { rate: 0.85, pitch: 0.85 },
  sassy:     { rate: 1.0,  pitch: 1.1 },
};

/**
 * Keywords that suggest a "higher" pitch preference (youthful, small, cute).
 */
const HIGHER_KEYWORDS = [
  "girl", "woman", "she", "her", "princess", "fairy", "bunny", "kitten",
  "puppy", "bird", "star", "sparkle", "glitter", "cute", "tiny", "little",
  "baby", "young", "child", "kid", "robot", "alien", "pixie", "sprite",
  "pencil", "eraser", "mango", "berry", "flower", "butterfly", "unicorn",
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
 * Voice name patterns that suggest a higher-pitched voice.
 */
const HIGH_VOICE_PATTERNS = [
  /female/i, /samantha/i, /victoria/i, /zira/i, /hazel/i,
  /karen/i, /moira/i, /tessa/i, /fiona/i, /google.*female/i,
  /google.*uk.*female/i, /google.*us.*female/i,
  /alice/i, /paulina/i, /monica/i, /pilar/i, /melina/i,
];

/**
 * Voice name patterns that suggest a lower-pitched voice.
 */
const LOW_VOICE_PATTERNS = [
  /male/i, /daniel/i, /david/i, /james/i, /mark/i,
  /google.*male/i, /google.*uk.*male/i, /google.*us.*male/i,
  /thomas/i, /george/i, /diego/i, /carlos/i, /nicolas/i,
  /matthew/i, /alex/i,
];

/**
 * Detect pitch preference from a character description using keyword matching.
 * Used as a fallback when the Groq analysis isn't available.
 */
export function detectPitchFromDescription(description: string): PitchPreference {
  const lower = description.toLowerCase();
  const highScore = HIGHER_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const lowScore = LOWER_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  return lowScore > highScore ? "lower" : "higher";
}

/**
 * Detect voice tone from a character description using keyword matching.
 * Fallback when Groq analysis isn't available.
 */
export function detectToneFromDescription(description: string): VoiceTone {
  const lower = description.toLowerCase();

  if (/silly|funny|goofy|wacky|crazy|joke|laugh|comedy|humor|clown/i.test(lower)) {
    return "silly";
  }
  if (/wise|old|ancient|sage|scholar|professor|teacher|learned|philosoph/i.test(lower)) {
    return "wise";
  }
  if (/calm|gentle|peace|quiet|shy|soft|sleepy|zen|meditat|relax|serene/i.test(lower)) {
    return "calm";
  }
  if (/sassy|bold|fierce|confident|witty|sass|attitude|boss|queen|diva|spicy/i.test(lower)) {
    return "sassy";
  }
  // Default: energetic
  return "energetic";
}

/**
 * Select the best available system voice matching the pitch preference.
 * Prefers English voices, with a sensible fallback to whatever is available.
 */
function selectVoice(pitchPref: PitchPreference): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Filter to English voices first
  const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  // Patterns to match for this pitch preference
  const patterns = pitchPref === "higher" ? HIGH_VOICE_PATTERNS : LOW_VOICE_PATTERNS;

  // Try to find a voice matching the preferred pitch
  for (const pattern of patterns) {
    const match = pool.find((v) => pattern.test(v.name));
    if (match) return match;
  }

  // Fallback: prefer Google voices (they tend to be clearer)
  const googleVoice = pool.find((v) => /google/i.test(v.name));
  if (googleVoice) return googleVoice;

  // Final fallback: first English voice, or first voice overall
  return pool[0] || null;
}

/**
 * Get complete voice settings for a character.
 * Combines tone-based parameters with pitch-matched voice selection.
 *
 * @param voiceTone - The character's tone category (from Groq analysis or detection)
 * @param pitchPreference - "higher" or "lower" (from Groq analysis or detection)
 * @param description - The character's raw description (used as fallback for detection)
 * @returns VoiceSettings with rate, pitch, and selected voice
 */
export function getCharacterVoiceSettings(
  voiceTone: string | undefined,
  pitchPreference: string | undefined,
  description: string
): VoiceSettings {
  // Determine tone (use stored, or detect from description)
  const tone: VoiceTone = voiceTone && voiceTone in TONE_PARAMS
    ? (voiceTone as VoiceTone)
    : detectToneFromDescription(description);

  // Determine pitch preference (use stored, or detect from description)
  const pitch: PitchPreference = pitchPreference === "higher" || pitchPreference === "lower"
    ? pitchPreference
    : detectPitchFromDescription(description);

  const params = TONE_PARAMS[tone];
  const voice = selectVoice(pitch);

  return {
    rate: params.rate,
    pitch: params.pitch,
    voice,
  };
}

/**
 * Apply voice settings to a SpeechSynthesisUtterance.
 * Call this after creating the utterance and before speaking.
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
