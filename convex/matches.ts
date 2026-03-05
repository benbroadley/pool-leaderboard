import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { calculateEloChanges } from "../lib/elo";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    const matches = await ctx.db
      .query("matches")
      .order("desc")
      .take(limit);

    // Hydrate player names
    const hydrated = await Promise.all(
      matches.map(async (match) => {
        const player1 = await ctx.db.get(match.player1Id);
        const player2 = await ctx.db.get(match.player2Id);
        return {
          ...match,
          player1Name: player1?.name ?? "Unknown",
          player2Name: player2?.name ?? "Unknown",
          winnerName:
            match.winnerId === match.player1Id
              ? player1?.name ?? "Unknown"
              : player2?.name ?? "Unknown",
        };
      })
    );

    return hydrated;
  },
});

export const matchupStats = query({
  args: {},
  handler: async (ctx) => {
    const matches = await ctx.db.query("matches").collect();
    const rawPlayers = await ctx.db
      .query("players")
      .withIndex("by_elo")
      .order("desc")
      .collect();

    const players = await Promise.all(
      rawPlayers.map(async (p) => ({
        ...p,
        avatarUrl: p.avatarStorageId ? await ctx.storage.getUrl(p.avatarStorageId) : null,
      }))
    );

    const stats: Record<
      string,
      { p1Id: string; p2Id: string; total: number; wins: Record<string, number> }
    > = {};

    for (const m of matches) {
      const ids = [m.player1Id, m.player2Id].sort();
      const key = `${ids[0]}__${ids[1]}`;
      if (!stats[key])
        stats[key] = { p1Id: ids[0], p2Id: ids[1], total: 0, wins: {} };
      stats[key].total++;
      stats[key].wins[m.winnerId] = (stats[key].wins[m.winnerId] ?? 0) + 1;
    }

    return { players, matchups: Object.values(stats) };
  },
});

export const recordMatch = mutation({
  args: {
    player1Id: v.id("players"),
    player2Id: v.id("players"),
    winnerId: v.id("players"),
  },
  handler: async (ctx, { player1Id, player2Id, winnerId }) => {
    const player1 = await ctx.db.get(player1Id);
    const player2 = await ctx.db.get(player2Id);

    if (!player1 || !player2) throw new Error("Player not found");
    if (player1.isActive === false || player2.isActive === false) {
      throw new Error("Cannot record a match with an inactive player");
    }
    if (player1Id === player2Id) throw new Error("Players must be different");
    if (winnerId !== player1Id && winnerId !== player2Id) {
      throw new Error("Winner must be one of the players");
    }

    const player1Won = winnerId === player1Id;
    const loserId = player1Won ? player2Id : player1Id;

    const { player1NewElo, player2NewElo, player1Change, player2Change } =
      calculateEloChanges(player1.elo, player2.elo, player1Won);

    // Update player 1
    const p1NewStreak = player1Won
      ? Math.max(player1.streak, 0) + 1
      : Math.min(player1.streak, 0) - 1;

    await ctx.db.patch(player1Id, {
      elo: player1NewElo,
      wins: player1.wins + (player1Won ? 1 : 0),
      losses: player1.losses + (player1Won ? 0 : 1),
      streak: p1NewStreak,
    });

    // Update player 2
    const p2Won = !player1Won;
    const p2NewStreak = p2Won
      ? Math.max(player2.streak, 0) + 1
      : Math.min(player2.streak, 0) - 1;

    await ctx.db.patch(player2Id, {
      elo: player2NewElo,
      wins: player2.wins + (p2Won ? 1 : 0),
      losses: player2.losses + (p2Won ? 0 : 1),
      streak: p2NewStreak,
    });

    // Record match
    await ctx.db.insert("matches", {
      player1Id,
      player2Id,
      winnerId,
      loserId,
      player1EloChange: player1Change,
      player2EloChange: player2Change,
      player1EloBefore: player1.elo,
      player2EloBefore: player2.elo,
    });
  },
});
