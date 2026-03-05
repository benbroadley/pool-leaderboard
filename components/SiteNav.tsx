"use client";

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

  return (
    <nav
      className="sticky top-0 z-40"
      style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div className="max-w-5xl mx-auto px-4 h-11 flex items-center gap-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group"
          style={{ textDecoration: "none" }}
        >
          <span className="text-base leading-none">🎱</span>
          <span
            className="text-sm text-[var(--gold)] tracking-[0.2em] group-hover:text-[var(--gold-light)] transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            POOL
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-3.5 bg-[var(--border-subtle)] mx-0.5 flex-shrink-0" />

        {/* Nav links */}
        <div className="flex items-center flex-1 min-w-0">
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

        {/* Action buttons */}
        {(onAddPlayer || onRecordMatch) && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {onAddPlayer && (
              <button
                onClick={onAddPlayer}
                className="flex items-center gap-1.5 px-3 py-1 text-[11px] tracking-[0.1em] border border-[var(--border-gold)] text-[var(--gold)] hover:bg-[var(--gold-dim)] rounded-sm transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M4.5 1v7M1 4.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span className="hidden sm:inline">Add Player</span>
                <span className="sm:hidden">Player</span>
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
                <span className="hidden sm:inline">Record Match</span>
                <span className="sm:hidden">Match</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
