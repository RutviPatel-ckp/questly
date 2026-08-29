import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Search for users by name or email prefix (for adding companions).
 * Returns matching characters with basic info.
 */
export const searchCompanion = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const searchLower = args.query.toLowerCase().trim();
    if (searchLower.length < 2) return [];

    // Search by name
    const allCharacters = await ctx.db.query("characters").collect();
    const results = allCharacters
      .filter(
        (c) =>
          c.userId !== userId &&
          (c.name.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower))
      )
      .slice(0, 8)
      .map((c) => ({
        userId: c.userId,
        name: c.name,
        description: c.description,
        characterType: c.characterType,
        totalStars: c.totalStars || 0,
      }));

    return results;
  },
});

/**
 * Get current user's companion (friend) info if set.
 */
export const getCompanion = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character?.companionUserId) return null;

    const companion = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", character.companionUserId!))
      .first();

    if (!companion) return null;

    return {
      userId: companion.userId,
      name: companion.name,
      description: companion.description,
      characterType: companion.characterType,
      totalStars: companion.totalStars || 0,
    };
  },
});

/**
 * Set a companion for the current user.
 */
export const setCompanion = mutation({
  args: { companionUserId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) throw new Error("No character found");

    await ctx.db.patch(character._id, {
      companionUserId: args.companionUserId,
    });

    return true;
  },
});

/**
 * Remove the current user's companion.
 */
export const removeCompanion = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) throw new Error("No character found");

    await ctx.db.patch(character._id, {
      companionUserId: undefined,
    });

    return true;
  },
});
