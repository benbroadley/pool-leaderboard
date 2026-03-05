"use client";

import { useState, useRef, useEffect } from "react";
import { PlayerAvatar } from "@/components/PlayerAvatar";

interface Player {
  _id: string;
  name: string;
  elo: number;
  avatarColor: string;
  avatarUrl?: string | null;
}

interface PlayerSelectProps {
  players: Player[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  disabledId?: string;
}

export function PlayerSelect({
  players,
  value,
  onChange,
  placeholder = "Search player...",
  disabledId,
}: PlayerSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = players.find((p) => p._id === value);

  const filtered = players.filter(
    (p) =>
      p._id !== disabledId &&
      p.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(id: string) {
    onChange(id);
    setOpen(false);
    setQuery("");
  }

  function handleOpen() {
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={open ? () => { setOpen(false); setQuery(""); } : handleOpen}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm border transition-all text-left min-w-0"
        style={{
          background: "var(--bg-raised)",
          borderColor: open ? "var(--gold)" : "var(--border-subtle)",
          boxShadow: open ? "0 0 0 1px rgba(201,168,76,0.2)" : "none",
        }}
      >
        {selected ? (
          <>
            <div className="flex-shrink-0">
              <PlayerAvatar name={selected.name} color={selected.avatarColor} avatarUrl={selected.avatarUrl} size={28} />
            </div>
            {/* Name stacked above ELO — no truncation */}
            <div className="flex-1 min-w-0">
              <div className="text-sm leading-snug" style={{ fontFamily: "var(--font-body)", color: "var(--chalk)", wordBreak: "break-word" }}>
                {selected.name}
              </div>
              <div className="text-xs tabular-nums mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "var(--gold)" }}>
                {selected.elo}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-full flex-shrink-0 border border-dashed border-[var(--chalk-faint)] opacity-40" />
            <span className="flex-1 text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--chalk-faint)" }}>
              {placeholder}
            </span>
          </>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="flex-shrink-0 transition-transform duration-200 ml-1"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "var(--chalk-faint)" }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-sm border overflow-hidden"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-gold)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)",
          }}
        >
          {/* Search input */}
          <div className="p-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center gap-2 px-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "var(--chalk-faint)", flexShrink: 0 }}>
                <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter players..."
                className="flex-1 text-sm py-1 bg-transparent"
                style={{ fontFamily: "var(--font-body)", color: "var(--chalk)" }}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} style={{ color: "var(--chalk-faint)" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div
                className="px-4 py-3 text-sm text-center"
                style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)" }}
              >
                No players found
              </div>
            ) : (
              filtered.map((player) => {
                const isSelected = player._id === value;
                return (
                  <button
                    key={player._id}
                    type="button"
                    onClick={() => handleSelect(player._id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors text-left min-w-0"
                    style={{
                      background: isSelected ? "var(--gold-dim)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--bg-raised)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <div className="flex-shrink-0">
                      <PlayerAvatar name={player.name} color={player.avatarColor} avatarUrl={player.avatarUrl} size={28} />
                    </div>
                    {/* Name stacked above ELO — no truncation */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm leading-snug"
                        style={{ fontFamily: "var(--font-body)", color: isSelected ? "var(--gold)" : "var(--chalk)", wordBreak: "break-word" }}
                      >
                        {player.name}
                      </div>
                      <div
                        className="text-xs tabular-nums mt-0.5"
                        style={{ fontFamily: "var(--font-mono)", color: isSelected ? "var(--gold)" : "var(--chalk-faint)", opacity: isSelected ? 0.8 : 1 }}
                      >
                        {player.elo}
                      </div>
                    </div>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "var(--gold)", flexShrink: 0 }}>
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
