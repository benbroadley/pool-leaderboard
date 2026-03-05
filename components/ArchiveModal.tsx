"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { eloRank } from "@/lib/elo";

interface ArchiveModalProps {
  onClose: () => void;
}

export function ArchiveModal({ onClose }: ArchiveModalProps) {
  const players = useQuery(api.players.list);
  const createArchive = useMutation(api.archives.create);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const active = players?.filter((p) => p.isActive !== false) ?? [];
  const totalMatches = active.reduce((s, p) => s + p.wins + p.losses, 0) / 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Enter a name for this archive"); return; }
    setLoading(true);
    setError("");
    try {
      await createArchive({ name });
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save archive");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md card p-6 md:p-8"
        style={{ borderColor: "var(--border-gold)" }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--gold)] opacity-60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--gold)] opacity-60" />

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📋</div>
            <h2
              className="text-3xl text-[var(--gold)]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
            >
              Archived
            </h2>
            <p className="text-[var(--chalk-faint)] text-sm mt-2" style={{ fontFamily: "var(--font-mono)" }}>
              Standings saved · Ratings reset
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2
                className="text-3xl text-[var(--gold)] tracking-wider"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Archive & Reset
              </h2>
              <p className="text-xs text-[var(--chalk-faint)] mt-2 leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
                Saves a snapshot of the current standings, then resets all ratings and match history to start a new season.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name input */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest text-[var(--chalk-faint)] mb-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Archive Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="e.g. Season 1, March Tournament…"
                  maxLength={60}
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-sm border text-sm"
                  style={{
                    background: "var(--bg-raised)",
                    borderColor: "var(--border-subtle)",
                    fontFamily: "var(--font-body)",
                    color: "var(--chalk)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                />
              </div>

              {/* Preview */}
              {players === undefined ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-[var(--gold-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
                </div>
              ) : active.length === 0 ? (
                <p className="text-xs text-[var(--chalk-faint)] text-center py-2" style={{ fontFamily: "var(--font-mono)" }}>
                  No active players to archive
                </p>
              ) : (
                <div
                  className="rounded-sm border overflow-hidden"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <div
                    className="px-3 py-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)", background: "var(--bg-raised)" }}
                  >
                    <span>Snapshot preview</span>
                    <span>{active.length} players · {Math.round(totalMatches)} matches</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                    {active.slice(0, 5).map((p, i) => {
                      const rankInfo = eloRank(p.elo);
                      return (
                        <div key={p._id} className="flex items-center gap-3 px-3 py-2">
                          <span
                            className="w-5 text-center text-xs tabular-nums flex-shrink-0"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)" }}
                          >
                            {i + 1}
                          </span>
                          <span
                            className="flex-1 text-sm min-w-0"
                            style={{ fontFamily: "var(--font-body)", color: "var(--chalk)" }}
                          >
                            {p.name}
                          </span>
                          <span
                            className="text-xs tabular-nums flex-shrink-0"
                            style={{ fontFamily: "var(--font-mono)", color: rankInfo.color }}
                          >
                            {p.elo}
                          </span>
                        </div>
                      );
                    })}
                    {active.length > 5 && (
                      <div
                        className="px-3 py-1.5 text-xs text-center"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)" }}
                      >
                        +{active.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-xs text-center" style={{ fontFamily: "var(--font-mono)" }}>
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-[var(--border-subtle)] hover:border-[var(--chalk-faint)] text-[var(--chalk-faint)] hover:text-[var(--chalk-dim)] rounded-sm text-base tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim() || active.length === 0}
                  className="flex-1 py-2.5 bg-[var(--green-felt)] hover:bg-[var(--green-bright)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--chalk)] rounded-sm text-base tracking-wider transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    "Archive & Reset"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
