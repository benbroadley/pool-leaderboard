import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { STARTING_ELO } from "../lib/elo";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Archive name cannot be empty");

    const players = await ctx.db
      .query("players")
      .withIndex("by_elo")
      .order("desc")
      .collect();

    const active = players.filter((p) => p.isActive !== false);

    const matches = await ctx.db.query("matches").collect();

    const entries = active.map((p, i) => ({
      rank: i + 1,
      name: p.name,
      elo: p.elo,
      wins: p.wins,
      losses: p.losses,
      avatarColor: p.avatarColor,
    }));

    await ctx.db.insert("archives", {
      name: trimmed,
      matchCount: matches.length,
      entries,
    });

    // Reset all players to starting ELO with no record
    for (const player of players) {
      await ctx.db.patch(player._id, {
        elo: STARTING_ELO,
        wins: 0,
        losses: 0,
        streak: 0,
      });
    }

    // Delete all match history
    for (const match of matches) {
      await ctx.db.delete(match._id);
    }
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("archives").order("desc").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("archives") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
