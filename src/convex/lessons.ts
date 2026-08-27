import { getAuthUserId } from "@convex-dev/auth/server";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save student profile (grade, subject, region, topic) to their character.
 * Resets currentPart to 1 when topic changes.
 */
export const saveProfile = mutation({
  args: {
    grade: v.string(),
    subject: v.string(),
    region: v.string(),
    topic: v.string(),
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
      grade: args.grade,
      subject: args.subject,
      region: args.region,
      topic: args.topic,
      currentPart: 1,
    });

    return character._id;
  },
});

/**
 * Get a cached lesson by key (including part). Returns null if not cached.
 */
export const getCachedLesson = query({
  args: {
    grade: v.string(),
    subject: v.string(),
    region: v.string(),
    topic: v.string(),
    part: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const lesson = await ctx.db
      .query("lessons")
      .withIndex("by_key", (q) =>
        q
          .eq("userId", userId)
          .eq("grade", args.grade)
          .eq("subject", args.subject)
          .eq("region", args.region)
          .eq("topic", args.topic)
          .eq("part", args.part)
      )
      .first();

    return lesson ?? null;
  },
});

/**
 * Cache a generated lesson (per part).
 */
export const cacheLesson = mutation({
  args: {
    grade: v.string(),
    subject: v.string(),
    region: v.string(),
    topic: v.string(),
    part: v.number(),
    content: v.string(),
    characterName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("lessons")
      .withIndex("by_key", (q) =>
        q
          .eq("userId", userId)
          .eq("grade", args.grade)
          .eq("subject", args.subject)
          .eq("region", args.region)
          .eq("topic", args.topic)
          .eq("part", args.part)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content });
      return existing._id;
    }

    return await ctx.db.insert("lessons", {
      userId,
      grade: args.grade,
      subject: args.subject,
      region: args.region,
      topic: args.topic,
      part: args.part,
      content: args.content,
      characterName: args.characterName,
    });
  },
});

/**
 * Advance to the next part after passing the short test.
 * Returns the new currentPart.
 */
export const advancePart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) throw new Error("No character found");

    const current = character.currentPart || 1;
    const newPart = current + 1;

    await ctx.db.patch(character._id, {
      currentPart: newPart,
      totalPartsCompleted: (character.totalPartsCompleted || 0) + 1,
    });

    return { currentPart: newPart };
  },
});

/**
 * Reset back to part 1 of the current topic (for replaying).
 */
export const resetToPart1 = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) throw new Error("No character found");

    await ctx.db.patch(character._id, { currentPart: 1 });
  },
});

/**
 * Generate a lesson via Groq API. Scoped to a specific part of a topic.
 * Falls back to a pre-written lesson on timeout or error.
 */
export const generateLesson = action({
  args: {
    grade: v.string(),
    subject: v.string(),
    region: v.string(),
    topic: v.string(),
    part: v.number(),
    totalParts: v.number(),
    partTitle: v.string(),
    companionName: v.string(),
    companionDescription: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ content: string; fromCache: boolean }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Build the region note
    const regionNote =
      args.region === "Other (General/Global)"
        ? "Keep it globally relevant."
        : args.subject === "History" || args.subject === "General Knowledge"
          ? `Make it specifically relevant to ${args.region} — include real, age-appropriate facts about that country/region.`
          : `Where relevant, include examples or context that a student in ${args.region} would relate to.`;

    // Build a part-scoped prompt
    const scopeNote =
      args.totalParts > 1
        ? `This is ${args.partTitle} (Part ${args.part} of ${args.totalParts} on this topic). Focus ONLY on this specific sub-topic. Do NOT cover content from other parts — the student will learn those in separate lessons.`
        : "";

    const prompt = `You are ${args.companionName}, a ${args.companionDescription}. Teach a ${args.grade}-level student a fun, engaging lesson about "${args.topic}" in ${args.subject}. ${scopeNote} ${regionNote} Keep your personality consistent and playful throughout. Break the lesson into short, punchy paragraphs, not a lecture. End with one simple question in your character's voice to check understanding. Do NOT use markdown formatting. Write in plain text with natural paragraph breaks. Keep the lesson focused and concise — about 200-300 words.`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("TIMEOUT");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

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
                content:
                  "You are a fun, educational AI tutor for students. Write engaging, age-appropriate lessons. Keep each lesson focused on a specific sub-topic.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.8,
            max_tokens: 1500,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from Groq API");
      }

      // Cache the lesson (part-specific)
      await ctx.runMutation("lessons:cacheLesson" as never, {
        grade: args.grade,
        subject: args.subject,
        region: args.region,
        topic: args.topic,
        part: args.part,
        content,
        characterName: args.companionName,
      } as never);

      return { content, fromCache: false };
    } catch (error) {
      const isAbort =
        error instanceof DOMException && error.name === "AbortError";
      throw new Error(
        isAbort
          ? "TIMEOUT"
          : `GENERATION_FAILED: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
});
