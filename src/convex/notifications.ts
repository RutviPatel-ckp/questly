import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Subscribe to push notifications
export const subscribe = mutation({
  args: {
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) throw new Error("Not authenticated");

    // Upsert — don't duplicate subscriptions
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Check if this endpoint already exists
    const duplicate = existing.find((s) => s.endpoint === args.endpoint);
    if (duplicate) {
      if (!duplicate.enabled) {
        await ctx.db.patch(duplicate._id, { enabled: true });
      }
      return duplicate._id;
    }

    // Disable old subscriptions for this user
    for (const old of existing) {
      await ctx.db.patch(old._id, { enabled: false });
    }

    return await ctx.db.insert("pushSubscriptions", {
      userId,
      endpoint: args.endpoint,
      p256dh: args.p256dh,
      auth: args.auth,
      enabled: true,
      createdAt: Date.now(),
    });
  },
});

// Unsubscribe from push notifications
export const unsubscribe = mutation({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) throw new Error("Not authenticated");

    const subs = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const sub of subs) {
      await ctx.db.patch(sub._id, { enabled: false });
    }
  },
});

// Check if user has notifications enabled
export const getSubscriptionStatus = query({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) return { subscribed: false };

    const subs = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      subscribed: subs.some((s) => s.enabled),
    };
  },
});

// Record daily activity for streak tracking
export const recordDailyActivity = mutation({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) throw new Error("Not authenticated");

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const characters = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const character = characters[0];
    if (!character) return;

    if (character.lastActiveDate === today) return; // Already recorded today

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    const newStreak =
      character.lastActiveDate === yesterday
        ? (character.streak || 0) + 1
        : 1;

    await ctx.db.patch(character._id, {
      streak: newStreak,
      lastActiveDate: today,
    });
  },
});
