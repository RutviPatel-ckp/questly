import { getAuthUserId } from "@convex-dev/auth/server";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Analyze a character description via Groq to determine voice tone and pitch.
 * Returns { voiceTone, pitchPreference } and saves to the character.
 */
export const analyzeAndSaveVoice = action({
  args: {},
  handler: async (ctx): Promise<{ voiceTone: string; pitchPreference: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the character via query
    const character = await ctx.runQuery("characters:getCharacter" as never, {} as never) as { name: string; description: string } | null;
    if (!character) throw new Error("No character found");

    const apiKey = process.env.GROQ_API_KEY;

    let voiceTone = "energetic";
    let pitchPreference = "higher";

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const prompt = `Analyze this character description and determine the best text-to-speech voice settings.

Character name: "${character.name}"
Character description: "${character.description}"

Return ONLY a JSON object with exactly these two fields:
- "voiceTone": one of "energetic", "calm", "silly", "wise", "sassy"
- "pitchPreference": one of "higher", "lower"

Rules:
- "energetic": upbeat, active, enthusiastic characters → faster, higher pitch
- "calm": relaxed, gentle, peaceful characters → slower, neutral pitch
- "silly": funny, goofy, quirky characters → higher pitch, playful
- "wise": old, scholarly, thoughtful characters → slower, lower pitch
- "sassy": confident, witty, bold characters → normal rate, varied pitch
- "higher" pitch for characters that feel youthful, small, cute, or feminine-leaning
- "lower" pitch for characters that feel mature, large, serious, or masculine-leaning
- If unsure, default to "energetic" and "higher"

Respond with ONLY the JSON object, no other text.`;

        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: "You are a voice classification assistant. Respond only with valid JSON.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.2,
              max_tokens: 100,
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            // Extract JSON from response (may be wrapped in markdown)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              const validTones = ["energetic", "calm", "silly", "wise", "sassy"];
              const validPitches = ["higher", "lower"];

              if (validTones.includes(parsed.voiceTone)) {
                voiceTone = parsed.voiceTone;
              }
              if (validPitches.includes(parsed.pitchPreference)) {
                pitchPreference = parsed.pitchPreference;
              }
            }
          }
        }
      } catch {
        // Fall through to defaults
      }
    }

    // Save to character
    await ctx.runMutation("voice:saveVoiceProfile" as never, {
      voiceTone,
      pitchPreference,
    } as never);

    return { voiceTone, pitchPreference };
  },
});

/**
 * Save voice profile to character.
 */
export const saveVoiceProfile = mutation({
  args: {
    voiceTone: v.string(),
    pitchPreference: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) throw new Error("No character found");

    await ctx.db.patch(character._id, {
      voiceTone: args.voiceTone,
      pitchPreference: args.pitchPreference,
    });

    return character._id;
  },
});
