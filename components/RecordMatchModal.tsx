"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { calculateEloChanges } from "@/lib/elo";
import { PlayerSelect } from "@/components/PlayerSelect";

interface RecordMatchModalProps {
  onClose: () => void;
  initialPlayer1Id?: string;
  initialPlayer2Id?: string;
}

export function RecordMatchModal({ onClose, initialPlayer1Id, initialPlayer2Id }: RecordMatchModalProps) {
  const allPlayers = useQuery(api.players.list);
  const players = allPlayers?.filter((p) => p.isActive !== false);
  const recordMatch = useMutation(api.matches.recordMatch);

  const [player1Id, setPlayer1Id] = useState<string>(initialPlayer1Id ?? "");
  const [player2Id, setPlayer2Id] = useState<string>(initialPlayer2Id ?? "");
  const [winnerId, setWinnerId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const player1 = players?.find((p) => p._id === player1Id);
  const player2 = players?.find((p) => p._id === player2Id);

  const eloPreview =
    player1 && player2 && winnerId
      ? (() => {
          const p1Won = winnerId === player1Id;
          const { player1Change, player2Change } = calculateEloChanges(
            player1.elo,
            player2.elo,
            p1Won
          );
          return { player1Change, player2Change };
        })()
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player1Id || !player2Id || !winnerId) {
      setError("Select both players and a winner");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await recordMatch({
        player1Id: player1Id as Id<"players">,
        player2Id: player2Id as Id<"players">,
        winnerId: winnerId as Id<"players">,
      });
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record match";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />

      <div
        className="relative w-full max-w-md card p-6 md:p-8 animate-slide-up"
        style={{ borderColor: "var(--border-gold)" }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--gold)] opacity-60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--gold)] opacity-60" />

        {success ? (
          <div className="text-center py-8 animate-score-pop">
            <div className="text-5xl mb-4">✓</div>
            <h2
              className="text-3xl text-[var(--gold)]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
            >
              Match Recorded
            </h2>
            <p
              className="text-[var(--chalk-faint)] text-sm mt-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Rankings updated
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2
                className="text-3xl text-[var(--gold)] tracking-wider"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Record Match
              </h2>
            </div>

            {allPlayers === undefined ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[var(--gold-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
              </div>
            ) : (players?.length ?? 0) < 2 ? (
              <p
                className="text-center text-[var(--chalk-faint)] py-6 text-sm"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Need at least 2 players to record a match
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* VS layout */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
                  {/* Player 1 */}
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[var(--chalk-faint)] mb-2"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Player 1
                    </label>
                    <PlayerSelect
                      players={players ?? []}
                      value={player1Id}
                      onChange={(id) => { setPlayer1Id(id); setWinnerId(""); setError(""); }}
                      disabledId={player2Id}
                      placeholder="Select..."
                    />
                  </div>

                  {/* VS */}
                  <div
                    className="text-[var(--chalk-faint)] text-xl pt-7 text-center"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
                  >
                    VS
                  </div>

                  {/* Player 2 */}
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[var(--chalk-faint)] mb-2"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Player 2
                    </label>
                    <PlayerSelect
                      players={players ?? []}
                      value={player2Id}
                      onChange={(id) => { setPlayer2Id(id); setWinnerId(""); setError(""); }}
                      disabledId={player1Id}
                      placeholder="Select..."
                    />
                  </div>
                </div>

                {/* Winner selection */}
                {player1Id && player2Id && (
                  <div className="animate-fade-in">
                    <label
                      className="block text-xs uppercase tracking-widest text-[var(--chalk-faint)] mb-3"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Winner
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[player1, player2].map((player, idx) => {
                        if (!player) return null;
                        const isSelected = winnerId === player._id;
                        const change = eloPreview
                          ? idx === 0
                            ? eloPreview.player1Change
                            : eloPreview.player2Change
                          : null;

                        return (
                          <button
                            key={player._id}
                            type="button"
                            onClick={() => setWinnerId(player._id)}
                            className={`p-3 rounded-sm border text-center transition-all ${
                              isSelected
                                ? "border-[var(--gold)] bg-[var(--gold-dim)]"
                                : "border-[var(--border-subtle)] hover:border-[var(--chalk-faint)]"
                            }`}
                          >
                            <div
                              className="font-medium text-sm truncate"
                              style={{
                                fontFamily: "var(--font-body)",
                                color: isSelected ? "var(--gold)" : "var(--chalk-dim)",
                              }}
                            >
                              {isSelected && "🏆 "}
                              {player.name}
                            </div>
                            {change !== null && (
                              <div
                                className="text-xs mt-1 tabular-nums"
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  color: change > 0 ? "#4a9e78" : "#c87878",
                                }}
                              >
                                {change > 0 ? "+" : ""}{change} ELO
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {error && (
                  <p
                    className="text-red-400 text-xs text-center"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 border border-[var(--border-subtle)] hover:border-[var(--chalk-faint)] text-[var(--chalk-faint)] hover:text-[var(--chalk-dim)] rounded-sm text-base tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !player1Id || !player2Id || !winnerId}
                    className="flex-1 py-2.5 bg-[var(--green-felt)] hover:bg-[var(--green-bright)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--chalk)] rounded-sm text-base tracking-wider transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Confirm Result"
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
