"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SiteNav } from "@/components/SiteNav";
import { eloRank } from "@/lib/elo";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function ArchiveCard({
  archive,
}: {
  archive: {
    _id: Id<"archives">;
    _creationTime: number;
    name: string;
    matchCount: number;
    entries: { rank: number; name: string; elo: number; wins: number; losses: number; avatarColor: string }[];
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const removeArchive = useMutation(api.archives.remove);

  async function handleDelete() {
    setDeleting(true);
    await removeArchive({ id: archive._id });
  }

  return (
    <div className="card overflow-hidden" style={{ borderColor: "var(--border-subtle)" }}>
      {/* Header row */}
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg text-[var(--gold)] tracking-wide leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {archive.name}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span
              className="text-xs text-[var(--chalk-faint)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {timeAgo(archive._creationTime)}
            </span>
            <span
              className="text-xs text-[var(--chalk-faint)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {archive.entries.length} players
            </span>
            <span
              className="text-xs text-[var(--chalk-faint)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {archive.matchCount} matches
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Delete */}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--chalk-faint)]" style={{ fontFamily: "var(--font-mono)" }}>
                Delete?
              </span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs px-2 py-1 rounded-sm transition-colors disabled:opacity-40"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(200,76,76,0.15)",
                  border: "1px solid rgba(200,76,76,0.3)",
                  color: "#c87878",
                }}
              >
                {deleting ? "…" : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[var(--chalk-faint)] hover:text-[var(--chalk)] transition-colors px-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 text-[var(--chalk-faint)] hover:text-[#c87878] transition-colors rounded-sm hover:bg-[rgba(200,76,76,0.08)]"
              title="Delete archive"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M5.5 3.5V2.5h3V3.5M5 3.5l.5 8M9 3.5l-.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Expand/collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-sm transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              borderColor: expanded ? "var(--border-gold)" : "var(--border-subtle)",
              color: expanded ? "var(--gold)" : "var(--chalk-faint)",
              background: expanded ? "var(--gold-dim)" : "transparent",
            }}
          >
            {expanded ? "Hide" : "View"}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded standings */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {/* Column headers */}
          <div
            className="grid items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--chalk-faint)]"
            style={{
              fontFamily: "var(--font-mono)",
              gridTemplateColumns: "1.5rem 1fr 4rem 2.5rem 2.5rem",
              background: "var(--bg-raised)",
            }}
          >
            <span>#</span>
            <span>Player</span>
            <span className="text-right">ELO</span>
            <span className="text-right">W</span>
            <span className="text-right">L</span>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {archive.entries.map((entry) => {
              const rankInfo = eloRank(entry.elo);
              const totalGames = entry.wins + entry.losses;
              const winPct = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : null;

              return (
                <div
                  key={entry.rank}
                  className="grid items-center gap-2 px-4 py-2.5"
                  style={{ gridTemplateColumns: "1.5rem 1fr 4rem 2.5rem 2.5rem" }}
                >
                  <span
                    className="text-center text-xs tabular-nums"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)" }}
                  >
                    {entry.rank}
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-sm"
                      style={{ fontFamily: "var(--font-body)", color: "var(--chalk)" }}
                    >
                      {entry.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs"
                        style={{ fontFamily: "var(--font-mono)", color: rankInfo.color, opacity: 0.8 }}
                      >
                        {rankInfo.label}
                      </span>
                      {winPct !== null && (
                        <span
                          className="text-[10px] tabular-nums"
                          style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)" }}
                        >
                          {winPct}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="text-right tabular-nums text-sm font-semibold"
                    style={{ fontFamily: "var(--font-mono)", color: rankInfo.color }}
                  >
                    {entry.elo}
                  </div>
                  <div
                    className="text-right tabular-nums text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: "#4a9e78" }}
                  >
                    {entry.wins}
                  </div>
                  <div
                    className="text-right tabular-nums text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: "#c87878" }}
                  >
                    {entry.losses}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArchivesPage() {
  const archives = useQuery(api.archives.list);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">🎱</span>
            <h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[var(--gold)] leading-none tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ARCHIVES
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {archives === undefined ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[var(--chalk-faint)]">
            <div className="w-5 h-5 border-2 border-[var(--gold-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>Loading archives…</span>
          </div>
        ) : archives.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-30">📋</div>
            <h2
              className="text-3xl text-[var(--chalk-dim)] mb-3"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
            >
              No Archives Yet
            </h2>
            <p
              className="text-[var(--chalk-faint)] text-sm"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Use the Archive button on the standings page to save a snapshot.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {archives.map((archive) => (
              <ArchiveCard key={archive._id} archive={archive} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
