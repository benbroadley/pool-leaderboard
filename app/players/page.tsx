"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { eloRank } from "@/lib/elo";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { AddPlayerModal } from "@/components/AddPlayerModal";
import { SiteNav } from "@/components/SiteNav";

// ── Inline name editor ────────────────────────────────────────────────────────

function NameEditor({
  playerId,
  currentName,
}: {
  playerId: Id<"players">;
  currentName: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const updatePlayer = useMutation(api.players.updatePlayer);

  async function save() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === currentName) {
      setEditing(false);
      setValue(currentName);
      return;
    }
    setSaving(true);
    try {
      await updatePlayer({ id: playerId, name: trimmed });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2 group/name">
        <span
          className="font-medium text-[var(--chalk)] truncate"
          style={{ fontFamily: "var(--font-body)", fontSize: "1rem" }}
        >
          {currentName}
        </span>
        <button
          type="button"
          onClick={() => { setValue(currentName); setEditing(true); }}
          className="opacity-0 group-hover/name:opacity-60 hover:!opacity-100 transition-opacity flex-shrink-0"
          title="Edit name"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: "var(--chalk-faint)" }}>
            <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") { setEditing(false); setValue(currentName); }
        }}
        autoFocus
        maxLength={40}
        className="flex-1 min-w-0 px-2 py-1 rounded-sm border border-[var(--gold)] text-[var(--chalk)] text-sm"
        style={{ background: "var(--bg-raised)", fontFamily: "var(--font-body)" }}
      />
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="text-[var(--gold)] hover:text-[var(--chalk)] disabled:opacity-40 flex-shrink-0 transition-colors"
        title="Save"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => { setEditing(false); setValue(currentName); }}
        className="text-[var(--chalk-faint)] hover:text-[var(--chalk)] flex-shrink-0 transition-colors"
        title="Cancel"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ── Avatar upload button ──────────────────────────────────────────────────────

function AvatarUpload({
  playerId,
  name,
  color,
  avatarUrl,
}: {
  playerId: Id<"players">;
  name: string;
  color: string;
  avatarUrl?: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.players.generateUploadUrl);
  const updatePlayer = useMutation(api.players.updatePlayer);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => setLocalPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed");
      const { storageId } = await response.json();
      await updatePlayer({ id: playerId, avatarStorageId: storageId as Id<"_storage"> });
    } catch (_err) {
      setLocalPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const displayUrl = localPreview ?? avatarUrl;

  return (
    <div className="relative group/avatar flex-shrink-0">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative rounded-full overflow-hidden transition-all"
        title="Change photo"
        disabled={uploading}
      >
        <PlayerAvatar name={name} color={color} avatarUrl={displayUrl} size={64} />
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "white" }}>
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ── Player card ───────────────────────────────────────────────────────────────

function PlayerCard({
  player,
}: {
  player: {
    _id: Id<"players">;
    name: string;
    elo: number;
    wins: number;
    losses: number;
    avatarColor: string;
    avatarUrl?: string | null;
    isActive: boolean;
  };
}) {
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [toggling, setToggling] = useState(false);
  const setActive = useMutation(api.players.setActive);

  const totalGames = player.wins + player.losses;
  const winPct = totalGames > 0 ? Math.round((player.wins / totalGames) * 100) : null;
  const rankInfo = eloRank(player.elo);
  const isActive = player.isActive !== false;

  async function handleToggle() {
    if (!confirmToggle) {
      setConfirmToggle(true);
      return;
    }
    setToggling(true);
    try {
      await setActive({ id: player._id, isActive: !isActive });
      setConfirmToggle(false);
    } finally {
      setToggling(false);
    }
  }

  return (
    <div
      className="card p-4 flex flex-col gap-3 transition-all duration-200"
      style={{
        opacity: isActive ? undefined : 0.6,
        borderColor: isActive ? undefined : "var(--border-subtle)",
      }}
    >
      {/* Top: avatar + info */}
      <div className="flex items-start gap-3">
        <AvatarUpload
          playerId={player._id}
          name={player.name}
          color={player.avatarColor}
          avatarUrl={player.avatarUrl}
        />

        <div className="flex-1 min-w-0">
          <NameEditor playerId={player._id} currentName={player.name} />

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className="tabular-nums text-sm font-semibold"
              style={{ fontFamily: "var(--font-mono)", color: rankInfo.color }}
            >
              {player.elo}
            </span>
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-mono)", color: rankInfo.color, opacity: 0.7 }}
            >
              {rankInfo.label}
            </span>
          </div>

          <div
            className="text-xs mt-1 flex gap-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)" }}
          >
            <span style={{ color: "#4a9e78" }}>{player.wins}W</span>
            <span style={{ color: "#c87878" }}>{player.losses}L</span>
            {winPct !== null && <span>{winPct}%</span>}
          </div>
        </div>
      </div>

      {/* Bottom: active toggle */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
        {confirmToggle ? (
          <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="text-[var(--chalk-faint)]">
              {isActive ? "Deactivate?" : "Reactivate?"}
            </span>
            <button
              onClick={handleToggle}
              disabled={toggling}
              className="px-2 py-0.5 rounded-sm text-[var(--chalk)] disabled:opacity-40 transition-colors"
              style={{
                background: isActive ? "rgba(200,76,76,0.2)" : "rgba(45,106,79,0.2)",
                border: `1px solid ${isActive ? "rgba(200,76,76,0.3)" : "rgba(45,106,79,0.3)"}`,
              }}
            >
              {toggling ? "..." : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmToggle(false)}
              className="text-[var(--chalk-faint)] hover:text-[var(--chalk)] transition-colors px-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleToggle}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-all"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.05em",
                background: isActive ? "rgba(45,106,79,0.15)" : "rgba(120,120,120,0.1)",
                border: `1px solid ${isActive ? "rgba(45,106,79,0.35)" : "rgba(120,120,120,0.2)"}`,
                color: isActive ? "#4a9e78" : "var(--chalk-faint)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: isActive ? "#4a9e78" : "var(--chalk-faint)" }}
              />
              {isActive ? "Active" : "Inactive"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PlayersPage() {
  const allPlayers = useQuery(api.players.list);
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const sorted = allPlayers
    ? [...allPlayers].sort((a, b) => {
        const aActive = a.isActive !== false;
        const bActive = b.isActive !== false;
        if (aActive !== bActive) return aActive ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
    : undefined;

  return (
    <main className="min-h-screen">
      <SiteNav onAddPlayer={() => setShowAddPlayer(true)} />

      {/* Header */}
      <header className="border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">🎱</span>
            <h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[var(--gold)] leading-none tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PLAYERS
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {sorted === undefined ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[var(--chalk-faint)]">
            <div className="w-5 h-5 border-2 border-[var(--gold-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>Loading players...</span>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-40">🎱</div>
            <h2
              className="text-3xl text-[var(--chalk-dim)] mb-3"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
            >
              No Players Yet
            </h2>
            <p className="text-[var(--chalk-faint)] text-sm mb-6" style={{ fontFamily: "var(--font-mono)" }}>
              Add your first player to get started
            </p>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="px-5 py-2.5 bg-[var(--green-felt)] hover:bg-[var(--green-bright)] text-[var(--chalk)] rounded-sm transition-all"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
            >
              Add First Player
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sorted.map((player) => (
              <PlayerCard key={player._id} player={{ ...player, isActive: player.isActive !== false }} />
            ))}
          </div>
        )}
      </div>

      {showAddPlayer && <AddPlayerModal onClose={() => setShowAddPlayer(false)} />}
    </main>
  );
}
