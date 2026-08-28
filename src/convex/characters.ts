import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current user's character. Returns null if none exists.
 */
export const getCharacter = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return character ?? null;
  },
});

/**
 * Create or update the current user's character.
 * Each user gets exactly one character for V1.
 */
export const saveCharacter = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    colorTheme: v.string(),
    characterType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        description: args.description,
        colorTheme: args.colorTheme,
        ...(args.characterType ? { characterType: args.characterType } : {}),
      });
      return existing._id;
    }

    return await ctx.db.insert("characters", {
      userId,
      name: args.name,
      description: args.description,
      colorTheme: args.colorTheme,
      ...(args.characterType ? { characterType: args.characterType } : {}),
    });
  },
});
