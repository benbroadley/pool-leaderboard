"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { eloRank } from "@/lib/elo";
import { PlayerAvatar } from "@/components/PlayerAvatar";

interface LeaderboardProps {
  onRecordMatch: () => void;
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;
  const isWin = streak > 0;
  const count = Math.abs(streak);
  if (count < 2) return null;

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-sm font-medium"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        backgroundColor: isWin ? "rgba(45,106,79,0.3)" : "rgba(200,76,76,0.2)",
        color: isWin ? "#4a9e78" : "#c87878",
        border: `1px solid ${isWin ? "rgba(45,106,79,0.4)" : "rgba(200,76,76,0.3)"}`,
      }}
    >
      {isWin ? "▲" : "▼"} {count}
    </span>
  );
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg leading-none" title="1st">🥇</span>;
  if (rank === 2) return <span className="text-lg leading-none" title="2nd">🥈</span>;
  if (rank === 3) return <span className="text-lg leading-none" title="3rd">🥉</span>;
  return (
    <span
      className="w-7 text-center tabular-nums"
      style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--chalk-faint)" }}
    >
      {rank}
    </span>
  );
}

export function Leaderboard({ onRecordMatch }: LeaderboardProps) {
  const players = useQuery(api.players.list);

  if (players === undefined) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-[var(--chalk-faint)]">
        <div className="w-5 h-5 border-2 border-[var(--gold-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>Loading standings...</span>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4 opacity-40">🎱</div>
        <h2
          className="text-3xl text-[var(--chalk-dim)] mb-3"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
        >
          No Players Yet
        </h2>
        <p className="text-[var(--chalk-faint)] text-sm mb-6" style={{ fontFamily: "var(--font-mono)" }}>
          Add players to start tracking rankings
        </p>
      </div>
    );
  }

  const totalMatches = players.reduce((s, p) => s + p.wins + p.losses, 0) / 2;

  return (
    <div>
      {/* Stats bar */}
      <div className="flex gap-6 mb-8 text-center">
        {[
          { label: "Players", value: players.length },
          { label: "Matches", value: Math.round(totalMatches) },
          { label: "Top ELO", value: players[0]?.elo ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 card px-4 py-3">
            <div
              className="text-2xl md:text-3xl text-[var(--gold)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}
            >
              {stat.value.toLocaleString()}
            </div>
            <div
              className="text-[var(--chalk-faint)] text-xs uppercase tracking-widest mt-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Column headers */}
      <div
        className="grid items-center gap-3 px-4 py-2 mb-2 text-[var(--chalk-faint)] text-xs uppercase tracking-widest"
        style={{
          fontFamily: "var(--font-mono)",
          gridTemplateColumns: "2.5rem 1fr 5rem 4rem 4rem 5.5rem",
        }}
      >
        <span>#</span>
        <span>Player</span>
        <span className="text-right">ELO</span>
        <span className="text-right">W</span>
        <span className="text-right">L</span>
        <span className="text-right hidden sm:block">Win %</span>
      </div>

      <div className="divider-gold mb-3" />

      {/* Player rows */}
      <div className="flex flex-col gap-1">
        {players.map((player, index) => {
          const rank = index + 1;
          const rankInfo = eloRank(player.elo);
          const totalGames = player.wins + player.losses;
          const winPct = totalGames > 0 ? Math.round((player.wins / totalGames) * 100) : 0;
          const isTop3 = rank <= 3;
          const isInactive = player.isActive === false;

          return (
            <div
              key={player._id}
              className={`group grid items-center gap-3 px-4 py-3 md:py-4 rounded-sm transition-all duration-200 cursor-default
                animate-slide-up opacity-0
                stagger-${Math.min(rank, 8)}
                ${isTop3 ? "card hover:border-[var(--border-gold)]" : "hover:bg-[var(--bg-raised)]"}
              `}
              style={{
                gridTemplateColumns: "2.5rem 1fr 5rem 4rem 4rem 5.5rem",
                animationFillMode: "forwards",
                borderLeft: isTop3 ? `2px solid ${rankInfo.color}33` : undefined,
                opacity: isInactive ? 0.45 : undefined,
              }}
            >
              {/* Rank */}
              <div className="flex items-center justify-center">
                <RankMedal rank={rank} />
              </div>

              {/* Player info */}
              <div className="flex items-center gap-3 min-w-0">
                <PlayerAvatar name={player.name} color={player.avatarColor} avatarUrl={player.avatarUrl} size={36} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-medium truncate text-[var(--chalk)]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {player.name}
                    </span>
                    <StreakBadge streak={player.streak} />
                    {isInactive && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-sm"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6rem",
                          backgroundColor: "rgba(120,120,120,0.15)",
                          color: "var(--chalk-faint)",
                          border: "1px solid rgba(120,120,120,0.2)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <span
                    className="text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: rankInfo.color, opacity: 0.8 }}
                  >
                    {rankInfo.label}
                  </span>
                </div>
              </div>

              {/* ELO */}
              <div className="text-right">
                <span
                  className="text-lg md:text-xl tabular-nums font-semibold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isTop3 ? rankInfo.color : "var(--chalk)",
                  }}
                >
                  {player.elo}
                </span>
              </div>

              {/* Wins */}
              <div
                className="text-right tabular-nums text-sm"
                style={{ fontFamily: "var(--font-mono)", color: "#4a9e78" }}
              >
                {player.wins}
              </div>

              {/* Losses */}
              <div
                className="text-right tabular-nums text-sm"
                style={{ fontFamily: "var(--font-mono)", color: "#c87878" }}
              >
                {player.losses}
              </div>

              {/* Win % */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-12 h-1 rounded-full bg-[var(--bg-raised)] overflow-hidden hidden md:block">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${winPct}%`,
                        backgroundColor: winPct >= 60 ? "#4a9e78" : winPct >= 40 ? "var(--gold)" : "#c87878",
                      }}
                    />
                  </div>
                  <span
                    className="tabular-nums text-sm"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: winPct >= 60 ? "#4a9e78" : winPct >= 40 ? "var(--chalk-dim)" : "#c87878",
                    }}
                  >
                    {totalGames > 0 ? `${winPct}%` : "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {players.length > 0 && (
        <div className="mt-10 text-center">
          <button
            onClick={onRecordMatch}
            className="inline-flex items-center gap-2 text-[var(--chalk-faint)] hover:text-[var(--gold)] text-sm transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>Record a match to update rankings</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
