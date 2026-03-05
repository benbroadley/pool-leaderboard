"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RecordMatchModal } from "@/components/RecordMatchModal";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { SiteNav } from "@/components/SiteNav";

export default function MatchupsPage() {
  const data = useQuery(api.matches.matchupStats);
  const [modalPlayers, setModalPlayers] = useState<{ p1: string; p2: string } | null>(null);

  const activePlayers = data?.players.filter((p) => p.isActive !== false) ?? [];
  const matchups = data?.matchups ?? [];

  // Build a lookup: "smallerId__largerId" -> matchup
  const matchupMap = new Map<
    string,
    { p1Id: string; p2Id: string; total: number; wins: Record<string, number> }
  >();
  for (const m of matchups) {
    const key = `${m.p1Id}__${m.p2Id}`;
    matchupMap.set(key, m);
  }

  function getMatchup(aId: string, bId: string) {
    const ids = [aId, bId].sort();
    return matchupMap.get(`${ids[0]}__${ids[1]}`);
  }

  const totalPossiblePairs =
    activePlayers.length > 1
      ? (activePlayers.length * (activePlayers.length - 1)) / 2
      : 0;

  const playedPairs = matchups.filter((m) => {
    const ids = [m.p1Id, m.p2Id];
    return (
      activePlayers.some((p) => p._id === ids[0]) &&
      activePlayers.some((p) => p._id === ids[1])
    );
  });

  const unplayedCount = totalPossiblePairs - playedPairs.length;

  // Collect all unplayed active pairs
  const unplayedPairs: { p1: (typeof activePlayers)[0]; p2: (typeof activePlayers)[0] }[] = [];
  for (let i = 0; i < activePlayers.length; i++) {
    for (let j = i + 1; j < activePlayers.length; j++) {
      const m = getMatchup(activePlayers[i]._id, activePlayers[j]._id);
      if (!m) {
        unplayedPairs.push({ p1: activePlayers[i], p2: activePlayers[j] });
      }
    }
  }

  if (data === undefined) {
    return (
      <main className="min-h-screen">
        <SiteNav onRecordMatch={() => setModalPlayers({ p1: "", p2: "" })} />
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-[var(--gold-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <SiteNav onRecordMatch={() => setModalPlayers({ p1: "", p2: "" })} />

      {/* Header */}
      <header className="border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">🎱</span>
            <h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[var(--gold)] leading-none tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MATCHUPS
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-10">

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Players", value: activePlayers.length },
            { label: "Pairings Played", value: playedPairs.length },
            { label: "Unplayed", value: unplayedCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="card p-4 text-center"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div
                className="text-3xl md:text-4xl tabular-nums text-[var(--gold)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {value}
              </div>
              <div
                className="text-xs uppercase tracking-widest text-[var(--chalk-faint)] mt-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {activePlayers.length < 2 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">🎱</div>
            <p className="text-[var(--chalk-faint)] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              Need at least 2 active players to show matchups
            </p>
          </div>
        ) : (
          <>
            {/* Matrix */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xs uppercase tracking-widest text-[var(--chalk-faint)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Head-to-Head Matrix
                </h2>
                <span
                  className="sm:hidden text-[10px] text-[var(--chalk-faint)] flex items-center gap-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  scroll
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="border-collapse" style={{ minWidth: "max-content" }}>
                  <thead>
                    <tr>
                      {/* Empty corner */}
                      <th className="p-0" style={{ minWidth: "100px" }} />
                      {activePlayers.map((col) => (
                        <th
                          key={col._id}
                          className="pb-2 px-0.5 text-center"
                          style={{ minWidth: "60px", maxWidth: "60px" }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <PlayerAvatar
                              name={col.name}
                              color={col.avatarColor}
                              avatarUrl={col.avatarUrl}
                              size={28}
                            />
                            <span
                              className="text-[10px] text-[var(--chalk-faint)] truncate w-full text-center block"
                              style={{ fontFamily: "var(--font-mono)", maxWidth: "56px" }}
                              title={col.name}
                            >
                              {col.name.length > 7 ? col.name.slice(0, 6) + "…" : col.name}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activePlayers.map((row) => (
                      <tr key={row._id}>
                        {/* Row header */}
                        <td className="pr-2 py-0.5">
                          <div className="flex items-center gap-1.5" style={{ minWidth: "100px" }}>
                            <PlayerAvatar
                              name={row.name}
                              color={row.avatarColor}
                              avatarUrl={row.avatarUrl}
                              size={20}
                            />
                            <span
                              className="text-xs text-[var(--chalk-dim)] truncate"
                              style={{ fontFamily: "var(--font-body)", maxWidth: "72px" }}
                              title={row.name}
                            >
                              {row.name}
                            </span>
                          </div>
                        </td>

                        {/* Matrix cells */}
                        {activePlayers.map((col) => {
                          if (row._id === col._id) {
                            // Diagonal
                            return (
                              <td key={col._id} className="p-0.5 text-center">
                                <div
                                  className="w-full h-12 flex items-center justify-center rounded-sm"
                                  style={{ background: "rgba(255,255,255,0.02)" }}
                                >
                                  <span
                                    className="text-sm"
                                    style={{ color: "var(--border-subtle)", fontFamily: "var(--font-mono)" }}
                                  >
                                    ×
                                  </span>
                                </div>
                              </td>
                            );
                          }

                          const m = getMatchup(row._id, col._id);

                          if (!m) {
                            // Unplayed
                            return (
                              <td key={col._id} className="p-0.5 text-center">
                                <button
                                  onClick={() => setModalPlayers({ p1: row._id, p2: col._id })}
                                  className="w-full h-12 flex items-center justify-center rounded-sm transition-all hover:scale-[1.04] active:scale-[0.97] group"
                                  style={{
                                    background: "rgba(201,168,76,0.06)",
                                    border: "1px dashed rgba(201,168,76,0.3)",
                                  }}
                                  title={`${row.name} vs ${col.name} — never played`}
                                >
                                  <span
                                    className="text-sm group-hover:text-[var(--gold)] transition-colors"
                                    style={{
                                      color: "rgba(201,168,76,0.45)",
                                      fontFamily: "var(--font-mono)",
                                    }}
                                  >
                                    —
                                  </span>
                                </button>
                              </td>
                            );
                          }

                          // Played
                          const rowWins = m.wins[row._id] ?? 0;
                          const colWins = m.wins[col._id] ?? 0;
                          const rowLosses = m.total - rowWins;
                          const isAhead = rowWins > colWins;
                          const isBehind = rowWins < colWins;

                          return (
                            <td key={col._id} className="p-0.5 text-center">
                              <button
                                onClick={() => setModalPlayers({ p1: row._id, p2: col._id })}
                                className="w-full h-12 flex flex-col items-center justify-center rounded-sm transition-all hover:scale-[1.04] active:scale-[0.97] group"
                                style={{
                                  background: isAhead
                                    ? "rgba(74,158,120,0.12)"
                                    : isBehind
                                    ? "rgba(200,120,120,0.1)"
                                    : "rgba(255,255,255,0.04)",
                                  border: `1px solid ${
                                    isAhead
                                      ? "rgba(74,158,120,0.25)"
                                      : isBehind
                                      ? "rgba(200,120,120,0.2)"
                                      : "var(--border-subtle)"
                                  }`,
                                }}
                                title={`${row.name} ${rowWins}–${rowLosses} ${col.name}`}
                              >
                                <span
                                  className="text-base tabular-nums leading-none"
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--chalk)",
                                    fontWeight: 600,
                                  }}
                                >
                                  {m.total}
                                </span>
                                <span
                                  className="text-xs tabular-nums mt-0.5 leading-none"
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    color: isAhead ? "#4a9e78" : isBehind ? "#c87878" : "var(--chalk-faint)",
                                  }}
                                >
                                  {rowWins}–{rowLosses}
                                </span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  { color: "rgba(74,158,120,0.25)", bg: "rgba(74,158,120,0.12)", label: "Row player leads" },
                  { color: "rgba(200,120,120,0.2)", bg: "rgba(200,120,120,0.1)", label: "Row player trails" },
                  { color: "var(--border-subtle)", bg: "rgba(255,255,255,0.04)", label: "Even" },
                  { color: "rgba(201,168,76,0.3)", bg: "rgba(201,168,76,0.06)", label: "Never played", dashed: true },
                ].map(({ color, bg, label, dashed }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="w-5 h-3 rounded-sm flex-shrink-0"
                      style={{
                        background: bg,
                        border: `1px ${dashed ? "dashed" : "solid"} ${color}`,
                      }}
                    />
                    <span
                      className="text-xs text-[var(--chalk-faint)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unplayed pairs */}
            {unplayedPairs.length > 0 && (
              <div>
                <h2
                  className="text-xs uppercase tracking-widest text-[var(--chalk-faint)] mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Never Played ({unplayedPairs.length})
                </h2>
                <div className="space-y-2">
                  {unplayedPairs.map(({ p1, p2 }) => (
                    <button
                      key={`${p1._id}-${p2._id}`}
                      onClick={() => setModalPlayers({ p1: p1._id, p2: p2._id })}
                      className="w-full card p-3 flex items-center justify-between group transition-all hover:border-[var(--gold)] hover:bg-[var(--gold-dim)]"
                      style={{ borderColor: "rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.04)" }}
                    >
                      <div className="flex items-center gap-3">
                        <PlayerAvatar name={p1.name} color={p1.avatarColor} avatarUrl={p1.avatarUrl} size={28} />
                        <span className="text-sm text-[var(--chalk-dim)]" style={{ fontFamily: "var(--font-body)" }}>
                          {p1.name}
                        </span>
                        <span className="text-xs text-[var(--chalk-faint)]" style={{ fontFamily: "var(--font-mono)" }}>
                          vs
                        </span>
                        <PlayerAvatar name={p2.name} color={p2.avatarColor} avatarUrl={p2.avatarUrl} size={28} />
                        <span className="text-sm text-[var(--chalk-dim)]" style={{ fontFamily: "var(--font-body)" }}>
                          {p2.name}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 text-xs text-[var(--gold)] opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Record
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {modalPlayers !== null && (
        <RecordMatchModal
          onClose={() => setModalPlayers(null)}
          initialPlayer1Id={modalPlayers.p1 || undefined}
          initialPlayer2Id={modalPlayers.p2 || undefined}
        />
      )}
    </main>
  );
}
