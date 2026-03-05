"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SiteNavProps {
  onRecordMatch?: () => void;
  onAddPlayer?: () => void;
}

const NAV_LINKS = [
  { href: "/", label: "Standings" },
  { href: "/players", label: "Players" },
  { href: "/matchups", label: "Matchups" },
  { href: "/help", label: "Help" },
];

export function SiteNav({ onRecordMatch, onAddPlayer }: SiteNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeLabel = NAV_LINKS.find(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  )?.label ?? "";

  return (
    <>
      <nav
        className="sticky top-0 z-40"
        style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            style={{ textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-base leading-none">🎱</span>
            <span
              className="text-sm text-[var(--gold)] tracking-[0.2em] group-hover:text-[var(--gold-light)] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              POOL
            </span>
          </Link>

          {/* Divider — desktop */}
          <div className="hidden sm:block w-px h-3.5 bg-[var(--border-subtle)] mx-0.5 flex-shrink-0" />

          {/* Nav links — desktop */}
          <div className="hidden sm:flex items-center flex-1 min-w-0">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-2.5 py-1 text-[11px] tracking-[0.12em] transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-[var(--gold)]"
                      : "text-[var(--chalk-faint)] hover:text-[var(--chalk-dim)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2.5 right-2.5 h-px"
                      style={{ background: "var(--gold)", opacity: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Current page label — mobile */}
          <div className="flex-1 sm:hidden">
            <span
              className="text-[11px] tracking-[0.12em] text-[var(--chalk-faint)]"
              style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
            >
              {activeLabel}
            </span>
          </div>

          {/* Action buttons — desktop */}
          {(onAddPlayer || onRecordMatch) && (
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              {onAddPlayer && (
                <button
                  onClick={onAddPlayer}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] tracking-[0.1em] border border-[var(--border-gold)] text-[var(--gold)] hover:bg-[var(--gold-dim)] rounded-sm transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M4.5 1v7M1 4.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Add Player
                </button>
              )}
              {onRecordMatch && (
                <button
                  onClick={onRecordMatch}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] tracking-[0.1em] bg-[var(--green-felt)] hover:bg-[var(--green-bright)] text-[var(--chalk)] rounded-sm transition-colors border border-[rgba(45,106,79,0.6)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <circle cx="4.5" cy="4.5" r="4" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4.5 2.5v4M2.5 4.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Record Match
                </button>
              )}
            </div>
          )}

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center -mr-1 text-[var(--chalk-faint)] hover:text-[var(--chalk)] transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="sm:hidden fixed inset-0 z-20"
            style={{ top: "48px" }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu panel */}
          <div
            className="sm:hidden fixed inset-x-0 top-12 z-30 border-b border-[var(--border-subtle)]"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="px-3 pt-2 pb-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-3.5 rounded-sm transition-colors ${
                      isActive
                        ? "text-[var(--gold)]"
                        : "text-[var(--chalk-dim)] hover:text-[var(--chalk)] hover:bg-[var(--bg-raised)]"
                    }`}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {(onAddPlayer || onRecordMatch) && (
              <div
                className="px-3 py-3 flex gap-2"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                {onAddPlayer && (
                  <button
                    onClick={() => { setMenuOpen(false); onAddPlayer(); }}
                    className="flex-1 py-3 text-xs border border-[var(--border-gold)] text-[var(--gold)] hover:bg-[var(--gold-dim)] rounded-sm transition-colors"
                    style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
                  >
                    + Add Player
                  </button>
                )}
                {onRecordMatch && (
                  <button
                    onClick={() => { setMenuOpen(false); onRecordMatch(); }}
                    className="flex-1 py-3 text-xs bg-[var(--green-felt)] hover:bg-[var(--green-bright)] text-[var(--chalk)] rounded-sm border border-[rgba(45,106,79,0.6)] transition-colors"
                    style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
                  >
                    + Record Match
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
