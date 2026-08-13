"use client";

import { PriziaState } from "@/lib/prizia/types";

const stateColors: Record<PriziaState, { from: string; to: string; glow: string }> = {
  idle: { from: "#8B6CFF", to: "#4DD9D0", glow: "rgba(139, 108, 255, 0.15)" },
  listening: { from: "#8B6CFF", to: "#8B6CFF", glow: "rgba(139, 108, 255, 0.3)" },
  thinking: { from: "#8B6CFF", to: "#F5A623", glow: "rgba(139, 108, 255, 0.45)" },
  responding: { from: "#4DD9D0", to: "#8B6CFF", glow: "rgba(77, 217, 208, 0.35)" },
};

interface PriziaPresenceProps {
  state?: PriziaState;
  size?: "sm" | "md" | "lg";
}

export default function PriziaPresence({ state = "idle", size = "lg" }: PriziaPresenceProps) {
  const colors = stateColors[state];
  const sizeMap = { sm: 48, md: 64, lg: 96 };
  const px = sizeMap[size];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
      aria-label={`Prizia is ${state}`}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          animation: state === "thinking" ? "prizia-pulse 2s ease-in-out infinite" : undefined,
        }}
      />

      {/* Prism orb */}
      <div
        className="absolute rounded-full transition-all duration-700"
        style={{
          width: px * 0.7,
          height: px * 0.7,
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
          boxShadow: `0 0 ${state === "idle" ? "20" : "35"}px ${colors.glow}, inset 0 -2px 6px rgba(0,0,0,0.1)`,
          animation:
            state === "thinking"
              ? "prizia-think 1.8s ease-in-out infinite"
              : state === "listening"
              ? "prizia-listen 2.5s ease-in-out infinite"
              : state === "responding"
              ? "prizia-respond 1.2s ease-in-out infinite"
              : "prizia-idle 4s ease-in-out infinite",
        }}
      />

      {/* Inner highlight */}
      <div
        className="absolute rounded-full bg-white/40 transition-all duration-500"
        style={{
          width: px * 0.25,
          height: px * 0.25,
          top: px * 0.18,
          left: px * 0.22,
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}
