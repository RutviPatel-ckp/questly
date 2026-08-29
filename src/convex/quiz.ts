import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// QUIZ ROOMS
// ============================================================================

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Create a new quiz room. Returns the room code.
 */
export const createRoom = mutation({
  args: {
    questionIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const code = generateRoomCode();

    await ctx.db.insert("quizRooms", {
      roomCode: code,
      hostUserId: userId,
      hostName: character?.name || "Player 1",
      guestUserId: undefined,
      guestName: undefined,
      status: "waiting",
      currentQuestion: 0,
      hostAnswers: [],
      guestAnswers: [],
      hostScore: 0,
      guestScore: 0,
      questions: args.questionIds,
      createdAt: Date.now(),
    });

    return code;
  },
});

/**
 * Join an existing quiz room by code.
 */
export const joinRoom = mutation({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const room = await ctx.db
      .query("quizRooms")
      .withIndex("by_code", (q) => q.eq("roomCode", args.roomCode))
      .first();

    if (!room) throw new Error("Room not found");
    if (room.status !== "waiting") throw new Error("Room is no longer available");
    if (room.hostUserId === userId) throw new Error("You can't join your own room");

    await ctx.db.patch(room._id, {
      guestUserId: userId,
      guestName: character?.name || "Player 2",
      status: "active",
      currentQuestion: 0,
    });

    return room._id;
  },
});

/**
 * Get room state for polling.
 */
export const getRoom = query({
  args: { roomCode: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("quizRooms")
      .withIndex("by_code", (q) => q.eq("roomCode", args.roomCode))
      .first();
    return room ?? null;
  },
});

/**
 * Submit an answer for the current question.
 */
export const submitAnswer = mutation({
  args: {
    roomCode: v.string(),
    questionIndex: v.number(),
    answerIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db
      .query("quizRooms")
      .withIndex("by_code", (q) => q.eq("roomCode", args.roomCode))
      .first();

    if (!room || room.status !== "active") throw new Error("Room not available");

    const isHost = room.hostUserId === userId;
    const isGuest = room.guestUserId === userId;
    if (!isHost && !isGuest) throw new Error("Not in this room");

    // Prevent double-answering
    const answers = isHost ? room.hostAnswers : room.guestAnswers;
    if (answers[args.questionIndex] !== undefined) return;

    // Record the answer
    const newAnswers = [...answers];
    newAnswers[args.questionIndex] = args.answerIndex;

    // Calculate score
    const { QUIZ_QUESTIONS } = await import("../lib/quiz-data");
    let score = 0;
    newAnswers.forEach((a, i) => {
      const q = QUIZ_QUESTIONS.find((q) => q.id === room.questions[i]);
      if (q && a === q.correctIndex) score++;
    });

    const update: Record<string, unknown> = {};
    if (isHost) {
      update.hostAnswers = newAnswers;
      update.hostScore = score;
    } else {
      update.guestAnswers = newAnswers;
      update.guestScore = score;
    }

    // Check if both players have answered this question
    const otherAnswers = isHost ? room.guestAnswers : room.hostAnswers;
    const bothAnswered =
      newAnswers[args.questionIndex] !== undefined &&
      otherAnswers[args.questionIndex] !== undefined;

    // Advance question if both answered
    if (bothAnswered) {
      const nextQ = args.questionIndex + 1;
      if (nextQ >= room.questions.length) {
        update.status = "finished";
      } else {
        update.currentQuestion = nextQ;
      }
    }

    await ctx.db.patch(room._id, update);
  },
});

// ============================================================================
// BOT BATTLE
// ============================================================================

/**
 * Create a bot battle room — instantly active with a simulated opponent.
 */
export const createBotRoom = mutation({
  args: {
    questionIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const code = generateRoomCode();

    // Pre-generate bot answers (65% accuracy)
    const { QUIZ_QUESTIONS } = await import("../lib/quiz-data");
    const botAnswers: number[] = [];
    let botScore = 0;
    for (const qid of args.questionIds) {
      const q = QUIZ_QUESTIONS.find((q) => q.id === qid);
      if (q && Math.random() < 0.65) {
        botAnswers.push(q.correctIndex);
        botScore++;
      } else {
        const wrongOptions = [0, 1, 2, 3].filter(
          (i) => i !== (q?.correctIndex ?? 0)
        );
        botAnswers.push(
          wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
        );
      }
    }

    await ctx.db.insert("quizRooms", {
      roomCode: code,
      hostUserId: userId,
      hostName: character?.name || "Player 1",
      guestUserId: "bot",
      guestName: "\ud83e\udd16 Training Bot",
      status: "active",
      currentQuestion: 0,
      hostAnswers: [],
      guestAnswers: botAnswers,
      hostScore: 0,
      guestScore: botScore,
      questions: args.questionIds,
      createdAt: Date.now(),
    });

    return code;
  },
});

// ============================================================================
// STREAK & STARS
// ============================================================================

/**
 * Record a daily active day and update streak.
 * Call this when a student completes a lesson or quiz.
 */
export const recordActivity = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) return;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    let newStreak = character.streak || 0;

    if (character.lastActiveDate === today) {
      // Already active today, no change
      return;
    } else if (character.lastActiveDate === yesterday) {
      // Consecutive day
      newStreak += 1;
    } else {
      // Streak broken or first day
      newStreak = 1;
    }

    await ctx.db.patch(character._id, {
      streak: newStreak,
      lastActiveDate: today,
    });
  },
});

/**
 * Award stars to the character.
 */
export const addStars = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) return;

    const currentStars = character.totalStars || 0;
    await ctx.db.patch(character._id, {
      totalStars: currentStars + args.amount,
    });

    return currentStars + args.amount;
  },
});

/**
 * Award coins for completing a lesson chapter.
 * Every 3 coins auto-convert to 1 star.
 */
export const addCoins = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) return { coins: 0, starsAdded: 0 };

    const currentCoins = character.coins || 0;
    const newCoins = currentCoins + args.amount;

    // Auto-convert every 3 coins to 1 star
    const starsToAdd = Math.floor(newCoins / 3);
    const remainingCoins = newCoins % 3;
    const currentStars = character.totalStars || 0;

    await ctx.db.patch(character._id, {
      coins: remainingCoins,
      totalStars: currentStars + starsToAdd,
    });

    return { coins: remainingCoins, starsAdded: starsToAdd };
  },
});

/**
 * Equip or unequip an accessory.
 */
export const toggleAccessory = mutation({
  args: { accessoryId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) return;

    const current = character.accessories || [];
    const updated = current.includes(args.accessoryId)
      ? current.filter((a) => a !== args.accessoryId)
      : [...current, args.accessoryId];

    await ctx.db.patch(character._id, { accessories: updated });
  },
});

/**
 * Award an achievement badge.
 */
export const awardAchievement = mutation({
  args: { achievementId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) return;

    const current = character.achievements || [];
    if (current.includes(args.achievementId)) return; // Already has it

    await ctx.db.patch(character._id, {
      achievements: [...current, args.achievementId],
    });
  },
});
