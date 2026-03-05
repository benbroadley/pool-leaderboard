import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    name: v.string(),
    elo: v.number(),
    wins: v.number(),
    losses: v.number(),
    streak: v.number(), // positive = win streak, negative = loss streak
    avatarColor: v.string(), // hex color for fallback avatar
    avatarStorageId: v.optional(v.id("_storage")),
    isActive: v.optional(v.boolean()),
  })
    .index("by_elo", ["elo"])
    .index("by_name", ["name"]),

  matches: defineTable({
    player1Id: v.id("players"),
    player2Id: v.id("players"),
    winnerId: v.id("players"),
    loserId: v.id("players"),
    player1EloChange: v.number(),
    player2EloChange: v.number(),
    player1EloBefore: v.number(),
    player2EloBefore: v.number(),
  }),
});
