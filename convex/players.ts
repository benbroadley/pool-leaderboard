import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { STARTING_ELO } from "../lib/elo";

const AVATAR_COLORS = [
  "#c9a84c", "#2d6a4f", "#6b4fad", "#c84c4c",
  "#4c8bc8", "#c87d4c", "#4cc8a0", "#c84c8b",
];

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_elo")
      .order("desc")
      .collect();

    return await Promise.all(
      players.map(async (player) => ({
        ...player,
        avatarUrl: player.avatarStorageId
          ? await ctx.storage.getUrl(player.avatarStorageId)
          : null,
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("players") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { name, avatarStorageId }) => {
    const existing = await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();

    if (existing) {
      throw new Error(`Player "${name}" already exists`);
    }

    const colorIndex = Math.floor(Math.random() * AVATAR_COLORS.length);

    return await ctx.db.insert("players", {
      name: name.trim(),
      elo: STARTING_ELO,
      wins: 0,
      losses: 0,
      streak: 0,
      avatarColor: AVATAR_COLORS[colorIndex],
      avatarStorageId,
      isActive: true,
    });
  },
});

export const updatePlayer = mutation({
  args: {
    id: v.id("players"),
    name: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, name, avatarStorageId }) => {
    const patch: Record<string, unknown> = {};
    if (name !== undefined) patch.name = name.trim();
    if (avatarStorageId !== undefined) patch.avatarStorageId = avatarStorageId;
    await ctx.db.patch(id, patch);
  },
});

export const setActive = mutation({
  args: {
    id: v.id("players"),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, isActive }) => {
    await ctx.db.patch(id, { isActive });
  },
});

export const remove = mutation({
  args: { id: v.id("players") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
