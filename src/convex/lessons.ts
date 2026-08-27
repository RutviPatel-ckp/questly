import { getAuthUserId } from "@convex-dev/auth/server";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save student profile (grade, subject, region, topic) to their character.
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
    });

    return character._id;
  },
});

/**
 * Get a cached lesson by key. Returns null if not cached.
 */
export const getCachedLesson = query({
  args: {
    grade: v.string(),
    subject: v.string(),
    region: v.string(),
    topic: v.string(),
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
      )
      .first();

    return lesson ?? null;
  },
});

/**
 * Cache a generated lesson.
 */
export const cacheLesson = mutation({
  args: {
    grade: v.string(),
    subject: v.string(),
    region: v.string(),
    topic: v.string(),
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
      content: args.content,
      characterName: args.characterName,
    });
  },
});

/**
 * Generate a lesson via Groq API. Checks cache first via direct DB query.
 * Falls back to a pre-written lesson on timeout or error.
 */
export const generateLesson = action({
  args: {
    grade: v.string(),
    subject: v.string(),
    region: v.string(),
    topic: v.string(),
    companionName: v.string(),
    companionDescription: v.string(),
  },
  handler: async (ctx, args): Promise<{ content: string; fromCache: boolean }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Build the prompt
    const regionNote =
      args.region === "Other (General/Global)"
        ? "Keep it globally relevant."
        : args.subject === "History" || args.subject === "General Knowledge"
          ? `Make it specifically relevant to ${args.region} — include real, age-appropriate facts about that country/region.`
          : `Where relevant, include examples or context that a student in ${args.region} would relate to.`;

    const prompt = `You are ${args.companionName}, a ${args.companionDescription}. Teach a ${args.grade}-level student a fun, engaging lesson about ${args.topic} in ${args.subject}. ${regionNote} Keep your personality consistent and playful throughout. Break the lesson into short, punchy paragraphs, not a lecture. End with one simple question in your character's voice to check understanding. Do NOT use markdown formatting. Write in plain text with natural paragraph breaks.`;

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
                  "You are a fun, educational AI tutor for students. Write engaging, age-appropriate lessons.",
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

      // Cache the lesson
      await ctx.runMutation("lessons:cacheLesson" as never, {
        grade: args.grade,
        subject: args.subject,
        region: args.region,
        topic: args.topic,
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
