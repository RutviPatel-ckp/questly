import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    characters: defineTable({
      userId: v.string(),
      name: v.string(),
      description: v.string(),
      colorTheme: v.string(),
      grade: v.optional(v.string()),
      subject: v.optional(v.string()),
      region: v.optional(v.string()),
      topic: v.optional(v.string()),
      totalStars: v.optional(v.number()),
      coins: v.optional(v.number()),
      streak: v.optional(v.number()),
      lastActiveDate: v.optional(v.string()),
      accessories: v.optional(v.array(v.string())),
      achievements: v.optional(v.array(v.string())),
      voiceTone: v.optional(v.string()),
      pitchPreference: v.optional(v.string()),
      characterType: v.optional(v.string()),
      currentPart: v.optional(v.number()),
      totalPartsCompleted: v.optional(v.number()),
      companionUserId: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    quizRooms: defineTable({
      roomCode: v.string(),
      hostUserId: v.string(),
      hostName: v.string(),
      guestUserId: v.optional(v.string()),
      guestName: v.optional(v.string()),
      status: v.union(
        v.literal("waiting"),
        v.literal("active"),
        v.literal("finished")
      ),
      currentQuestion: v.number(),
      hostAnswers: v.array(v.number()),
      guestAnswers: v.array(v.number()),
      hostScore: v.number(),
      guestScore: v.number(),
      questions: v.array(v.string()),
      createdAt: v.number(),
    }).index("by_code", ["roomCode"]),

    pushSubscriptions: defineTable({
      userId: v.string(),
      endpoint: v.string(),
      p256dh: v.string(),
      auth: v.string(),
      enabled: v.boolean(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    lessons: defineTable({
      userId: v.string(),
      grade: v.string(),
      subject: v.string(),
      region: v.string(),
      topic: v.string(),
      part: v.number(),
      content: v.string(),
      characterName: v.string(),
    }).index("by_key", ["userId", "grade", "subject", "region", "topic", "part"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
