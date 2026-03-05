"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function MatchHistory() {
  const matches = useQuery(api.matches.list, { limit: 50 });

  if (matches === undefined) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-[var(--chalk-faint)]">
        <div className="w-5 h-5 border-2 border-[var(--gold-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>Loading history...</span>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4 opacity-40">📋</div>
        <h2
          className="text-3xl text-[var(--chalk-dim)] mb-3"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
        >
          No Matches Yet
        </h2>
        <p className="text-[var(--chalk-faint)] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          Record a match to see the history
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl text-[var(--chalk-dim)] tracking-wider"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recent Matches
        </h2>
        <span
          className="text-xs text-[var(--chalk-faint)] px-2 py-1 border border-[var(--border-subtle)] rounded-sm"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {matches.length} matches
        </span>
      </div>

      <div className="space-y-2">
        {matches.map((match, i) => {
          const p1Won = match.winnerId === match.player1Id;

          return (
            <div
              key={match._id}
              className="card px-4 py-3 md:py-4 animate-slide-up opacity-0"
              style={{
                animationDelay: `${Math.min(i, 10) * 0.04}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Match result layout */}
                <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  {/* Player 1 */}
                  <div className={`flex items-center gap-2 ${p1Won ? "" : "opacity-50"}`}>
                    <div className="min-w-0">
                      <div
                        className="font-medium text-sm truncate"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: p1Won ? "var(--chalk)" : "var(--chalk-dim)",
                        }}
                      >
                        {p1Won && (
                          <span className="text-[var(--gold)] mr-1.5">🏆</span>
                        )}
                        {match.player1Name}
                      </div>
                      <div
                        className="text-xs tabular-nums mt-0.5"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: match.player1EloChange > 0 ? "#4a9e78" : "#c87878",
                        }}
                      >
                        {match.player1EloBefore}
                        {" "}
                        <span className="opacity-60">→</span>
                        {" "}
                        {match.player1EloBefore + match.player1EloChange}
                        {" "}
                        <span>
                          ({match.player1EloChange > 0 ? "+" : ""}{match.player1EloChange})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* VS divider */}
                  <div className="text-center px-2">
                    <div
                      className="text-[var(--chalk-faint)] text-xs tracking-widest"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      vs
                    </div>
                  </div>

                  {/* Player 2 */}
                  <div className={`flex items-center gap-2 justify-end ${!p1Won ? "" : "opacity-50"}`}>
                    <div className="min-w-0 text-right">
                      <div
                        className="font-medium text-sm truncate"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: !p1Won ? "var(--chalk)" : "var(--chalk-dim)",
                        }}
                      >
                        {match.player2Name}
                        {!p1Won && (
                          <span className="text-[var(--gold)] ml-1.5">🏆</span>
                        )}
                      </div>
                      <div
                        className="text-xs tabular-nums mt-0.5"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: match.player2EloChange > 0 ? "#4a9e78" : "#c87878",
                        }}
                      >
                        <span>
                          ({match.player2EloChange > 0 ? "+" : ""}{match.player2EloChange})
                        </span>
                        {" "}
                        <span className="opacity-60">←</span>
                        {" "}
                        {match.player2EloBefore}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div
                  className="text-xs text-[var(--chalk-faint)] text-right flex-shrink-0 w-14"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {timeAgo(match._creationTime)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
