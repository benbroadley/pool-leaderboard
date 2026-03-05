"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface AddPlayerModalProps {
  onClose: () => void;
}

export function AddPlayerModal({ onClose }: AddPlayerModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPlayer = useMutation(api.players.create);
  const generateUploadUrl = useMutation(api.players.generateUploadUrl);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a player name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let avatarStorageId: Id<"_storage"> | undefined;

      if (imageFile) {
        const uploadUrl = await generateUploadUrl({});
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        if (!response.ok) throw new Error("Image upload failed");
        const { storageId } = await response.json();
        avatarStorageId = storageId;
      }

      await createPlayer({ name: trimmed, avatarStorageId });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create player";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm card p-6 md:p-8 animate-slide-up"
        style={{ borderColor: "var(--border-gold)" }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--gold)] opacity-60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--gold)] opacity-60" />

        <div className="text-center mb-6">
          {/* Avatar upload */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center transition-all"
                style={{
                  background: imagePreview ? "transparent" : "var(--bg-raised)",
                  border: "2px dashed var(--border-gold)",
                }}
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "var(--chalk-faint)" }}>
                      <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 17c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--chalk-faint)" }}>
                      Photo
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                {imagePreview && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "white" }}>
                      <path d="M13 2l3 3-9 9H4v-3L13 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Clear button */}
              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "var(--bg-raised)", border: "1px solid var(--border-gold)" }}
                  title="Remove photo"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ color: "var(--chalk-faint)" }}>
                    <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <h2
            className="text-3xl text-[var(--gold)] tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            New Challenger
          </h2>
          <p
            className="text-[var(--chalk-faint)] text-xs mt-1 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Starting ELO: 1200
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs uppercase tracking-widest text-[var(--chalk-faint)] mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder='e.g. John "Cue Ball" Smith'
              maxLength={40}
              autoFocus
              className="w-full px-4 py-3 border border-[var(--border-subtle)] focus:border-[var(--gold)] rounded-sm text-[var(--chalk)] text-base"
              style={{ background: "var(--bg-raised)" }}
            />
            {error && (
              <p
                className="text-red-400 text-xs mt-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[var(--border-subtle)] hover:border-[var(--chalk-faint)] text-[var(--chalk-faint)] hover:text-[var(--chalk-dim)] rounded-sm text-base tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-2.5 bg-[var(--green-felt)] hover:bg-[var(--green-bright)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--chalk)] rounded-sm text-base tracking-wider transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {imageFile ? "Uploading..." : "Adding..."}
                </span>
              ) : (
                "Rack Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
