"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2
        className="text-2xl md:text-3xl text-[var(--gold)] tracking-wider"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="card p-5 md:p-6 space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
      {children}
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: "var(--gold-dim)",
          border: "1px solid var(--border-gold)",
          fontFamily: "var(--font-mono)",
          color: "var(--gold)",
          fontSize: "0.75rem",
          fontWeight: 600,
        }}
      >
        {n}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--chalk)]" style={{ fontFamily: "var(--font-body)" }}>
          {title}
        </p>
        <p className="text-sm text-[var(--chalk-faint)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
          {body}
        </p>
      </div>
    </div>
  );
}

const RANKS = [
  { label: "Rookie", range: "Below 1150", color: "#8a9e8a", desc: "Just getting started." },
  { label: "Regular", range: "1150 – 1299", color: "#b8a898", desc: "Knows the table." },
  { label: "Hustler", range: "1300 – 1449", color: "#c9a84c", desc: "Dangerous to play for money." },
  { label: "Pro", range: "1450 – 1599", color: "#a8c0d8", desc: "Consistent and calculating." },
  { label: "Shark", range: "1600+", color: "#e8c96b", desc: "Runs the table, takes your lunch." },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen">
      <SiteNav />

      {/* Header */}
      <header className="border-b border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">🎱</span>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl text-[var(--gold)] leading-none tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              HOW TO PLAY
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-10">

        {/* Quick start */}
        <Section title="Getting Started">
          <Card>
            <p className="text-sm text-[var(--chalk-dim)]" style={{ fontFamily: "var(--font-body)" }}>
              Three steps to your first match on the board:
            </p>
            <div className="space-y-4 pt-1">
              <Step
                n={1}
                title="Add your players"
                body='Open the Players page and hit "Add Player". Give them a name — optionally upload a photo. Each player starts with an ELO rating of 1200.'
              />
              <Step
                n={2}
                title="Record a match"
                body={"Hit \"Record Match\" in the nav, pick both players, and tap the winner. The result is saved instantly and both players' ratings update in real time."}
              />
              <Step
                n={3}
                title="Watch the standings"
                body="The leaderboard re-ranks automatically after every match. Check Matchups to see who still needs to face who."
              />
            </div>
          </Card>
        </Section>

        {/* ELO */}
        <Section title="The ELO System">
          <Card>
            <p className="text-sm text-[var(--chalk-dim)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              ELO is a method for calculating relative skill levels. Every player starts at{" "}
              <span className="text-[var(--gold)]" style={{ fontFamily: "var(--font-mono)" }}>1200</span>.
              After each match, points transfer from the loser to the winner — but how many depends on
              how surprising the result was.
            </p>
            <div className="divider-gold" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <div>
                <p className="text-[var(--chalk-faint)] text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                  Upset win
                </p>
                <p className="text-[var(--chalk-dim)]">
                  If a lower-rated player beats a higher-rated one, they gain more points — the upset
                  was unlikely, so it carries more weight.
                </p>
              </div>
              <div>
                <p className="text-[var(--chalk-faint)] text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                  Expected win
                </p>
                <p className="text-[var(--chalk-dim)]">
                  A heavy favourite beating a newcomer earns fewer points. The system expected it,
                  so little information is gained.
                </p>
              </div>
            </div>
            <div className="divider-gold" />
            <p className="text-xs text-[var(--chalk-faint)]" style={{ fontFamily: "var(--font-mono)" }}>
              K-factor: 32 · Starting rating: 1200 · No draws
            </p>
          </Card>
        </Section>

        {/* Ranks */}
        <Section title="Rank Tiers">
          <Card>
            <div className="space-y-3">
              {RANKS.map(({ label, range, color, desc }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  <div className="flex items-baseline gap-3 flex-1 min-w-0">
                    <span
                      className="text-sm font-semibold flex-shrink-0"
                      style={{ fontFamily: "var(--font-body)", color }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs tabular-nums text-[var(--chalk-faint)] flex-shrink-0"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {range}
                    </span>
                    <span
                      className="text-xs text-[var(--chalk-faint)] truncate"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* Streaks */}
        <Section title="Streaks">
          <Card>
            <p className="text-sm text-[var(--chalk-dim)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Win or lose consecutive matches and a streak badge appears next to your name on the
              leaderboard. Streaks kick in at 2 in a row and display how many you've chained.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <div
                className="px-2.5 py-1 rounded-sm text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(74,158,120,0.15)",
                  border: "1px solid rgba(74,158,120,0.3)",
                  color: "#4a9e78",
                }}
              >
                🔥 W3
              </div>
              <p className="text-sm text-[var(--chalk-faint)] self-center" style={{ fontFamily: "var(--font-body)" }}>
                3-game win streak
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div
                className="px-2.5 py-1 rounded-sm text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(200,120,120,0.15)",
                  border: "1px solid rgba(200,120,120,0.3)",
                  color: "#c87878",
                }}
              >
                💀 L2
              </div>
              <p className="text-sm text-[var(--chalk-faint)] self-center" style={{ fontFamily: "var(--font-body)" }}>
                2-game losing streak
              </p>
            </div>
          </Card>
        </Section>

        {/* Matchups page */}
        <Section title="Head-to-Head Matchups">
          <Card>
            <p className="text-sm text-[var(--chalk-dim)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              The <Link href="/matchups" className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">Matchups page</Link> shows
              every possible pairing between active players in a grid.
            </p>
            <div className="space-y-2.5 pt-1">
              {[
                { color: "rgba(74,158,120,0.25)", bg: "rgba(74,158,120,0.12)", border: "solid", label: "Green cell", desc: "Row player leads the head-to-head record." },
                { color: "rgba(200,120,120,0.2)", bg: "rgba(200,120,120,0.1)", border: "solid", label: "Red cell", desc: "Row player trails the head-to-head record." },
                { color: "var(--border-subtle)", bg: "rgba(255,255,255,0.04)", border: "solid", label: "Neutral cell", desc: "They're tied in head-to-head games." },
                { color: "rgba(201,168,76,0.3)", bg: "rgba(201,168,76,0.06)", border: "dashed", label: "Gold dashed cell", desc: "These two have never played. Click to record their first match." },
              ].map(({ color, bg, border, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="w-8 h-5 rounded-sm flex-shrink-0 mt-0.5"
                    style={{ background: bg, border: `1px ${border} ${color}` }}
                  />
                  <div>
                    <span className="text-xs text-[var(--chalk-dim)]" style={{ fontFamily: "var(--font-body)" }}>
                      <strong>{label}</strong> — {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="divider-gold" />
            <p className="text-xs text-[var(--chalk-faint)]" style={{ fontFamily: "var(--font-body)" }}>
              Click any cell (except the diagonal) to open a pre-filled Record Match dialog for that pair.
              The numbers show total games played; the sub-line shows the row player&apos;s W–L in that matchup.
            </p>
          </Card>
        </Section>

        {/* Managing players */}
        <Section title="Managing Players">
          <Card>
            <div className="space-y-4 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <div>
                <p className="font-semibold text-[var(--chalk)] mb-1">Editing a name</p>
                <p className="text-[var(--chalk-faint)] leading-relaxed">
                  Hover over any player name on the Players page and click the pencil icon. Type
                  a new name and press Enter (or click the checkmark) to save.
                </p>
              </div>
              <div className="divider-gold" />
              <div>
                <p className="font-semibold text-[var(--chalk)] mb-1">Uploading a photo</p>
                <p className="text-[var(--chalk-faint)] leading-relaxed">
                  Click the avatar on the Players page to upload a photo. Supported formats: JPG,
                  PNG, WebP. If no photo is set, initials are shown in the player&apos;s assigned colour.
                </p>
              </div>
              <div className="divider-gold" />
              <div>
                <p className="font-semibold text-[var(--chalk)] mb-1">Deactivating a player</p>
                <p className="text-[var(--chalk-faint)] leading-relaxed">
                  Use the Active/Inactive toggle on a player&apos;s card to remove them from the standings
                  and matchup matrix without deleting their history. Reactivate at any time.
                  Inactive players cannot be selected when recording new matches.
                </p>
              </div>
            </div>
          </Card>
        </Section>

        {/* Footer cta */}
        <div className="flex flex-wrap gap-3 pt-2 pb-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--border-subtle)] text-[var(--chalk-dim)] hover:border-[var(--border-gold)] hover:text-[var(--chalk)] rounded-sm transition-colors"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", fontSize: "0.75rem" }}
          >
            ← Back to Standings
          </Link>
          <Link
            href="/matchups"
            className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--border-subtle)] text-[var(--chalk-dim)] hover:border-[var(--border-gold)] hover:text-[var(--chalk)] rounded-sm transition-colors"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", fontSize: "0.75rem" }}
          >
            View Matchups →
          </Link>
        </div>

      </div>
    </main>
  );
}
