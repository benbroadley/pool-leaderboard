"use client";

interface PlayerAvatarProps {
  name: string;
  color: string;
  avatarUrl?: string | null;
  size?: number;
}

export function PlayerAvatar({ name, color, avatarUrl, size = 40 }: PlayerAvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (avatarUrl) {
    return (
      <div
        className="rounded-full flex-shrink-0 overflow-hidden"
        style={{
          width: size,
          height: size,
          border: `1.5px solid ${color}55`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: color + "22",
        border: `1.5px solid ${color}55`,
        color,
        fontSize: size * 0.35,
        fontFamily: "var(--font-mono)",
      }}
    >
      {initials}
    </div>
  );
}
