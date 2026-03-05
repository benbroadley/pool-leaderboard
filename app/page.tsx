"use client";

import { useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { MatchHistory } from "@/components/MatchHistory";
import { AddPlayerModal } from "@/components/AddPlayerModal";
import { RecordMatchModal } from "@/components/RecordMatchModal";
import { SiteNav } from "@/components/SiteNav";

export default function Home() {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showRecordMatch, setShowRecordMatch] = useState(false);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "history">("leaderboard");

  return (
    <main className="min-h-screen">
      <SiteNav
        onRecordMatch={() => setShowRecordMatch(true)}
        onAddPlayer={() => setShowAddPlayer(true)}
      />

      {/* Header */}
      <header className="border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-0">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl">🎱</span>
            <h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[var(--gold)] leading-none tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              POOL LEADERBOARD
            </h1>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-0 border-b border-[var(--border-subtle)]">
            {(["leaderboard", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm capitalize tracking-[0.15em] transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[var(--gold)] text-[var(--gold)]"
                    : "border-transparent text-[var(--chalk-faint)] hover:text-[var(--chalk-dim)]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tab === "leaderboard" ? "Standings" : "Match Log"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {activeTab === "leaderboard" ? (
          <Leaderboard onRecordMatch={() => setShowRecordMatch(true)} />
        ) : (
          <MatchHistory />
        )}
      </div>

      {/* Modals */}
      {showAddPlayer && (
        <AddPlayerModal onClose={() => setShowAddPlayer(false)} />
      )}
      {showRecordMatch && (
        <RecordMatchModal onClose={() => setShowRecordMatch(false)} />
      )}
    </main>
  );
}
