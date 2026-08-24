"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Branch {
  id: string;
  label: string;
  angle: number;
}

type Phase = "input" | "entering" | "splitting" | "branches" | "exploring";

const categories = [
  "Question",
  "People",
  "Object",
  "Time",
  "Story",
  "Idea",
  "Problem",
  "Challenge",
  "Surprise Me",
];

const rayAngles = [-32, -14, 4, 20, 36];

const rayColors = ["#8B6CFF", "#4DD9D0", "#F5A623", "#8B6CFF", "#4DD9D0"];

export default function PrizmShell() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [exploration, setExploration] = useState("");
  const [isExploring, setIsExploring] = useState(false);
  const [originalInput, setOriginalInput] = useState("");
  const [error, setError] = useState("");
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "input") inputRef.current?.focus();
  }, [phase]);

  const handleSplit = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || phase !== "input") return;

      setError("");
      setOriginalInput(trimmed);
      setPhase("entering");

      await new Promise((r) => setTimeout(r, 900));
      setPhase("splitting");

      try {
        const res = await fetch("/api/prizm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "split", input: trimmed }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to split through PRIZM");
        }

        const data = await res.json();
        await new Promise((r) => setTimeout(r, 700));
        setBranches(data.branches);
        setPhase("branches");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Try again."
        );
        setPhase("input");
      }
    },
    [phase]
  );

  const handleExplore = useCallback(
    async (branch: Branch) => {
      setSelectedBranch(branch);
      setPhase("exploring");
      setIsExploring(true);
      setExploration("");

      try {
        const res = await fetch("/api/prizm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "explore",
            input: originalInput,
            branchLabel: branch.label,
          }),
        });

        if (!res.ok) throw new Error("Failed to explore this perspective");
        const data = await res.json();
        setExploration(data.text);
      } catch {
        setExploration("This perspective couldn't be explored right now. Try again.");
      } finally {
        setIsExploring(false);
      }
    },
    [originalInput]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSplit(input);
  };

  const surpriseIndexRef = useRef(0);
  const handleCategory = useCallback(
    (cat: string) => {
      if (cat === "Surprise Me") {
        const surprises = [
          "What if gravity was slightly stronger?",
          "Why do we find patterns in everything?",
          "What makes a sound satisfying?",
          "Why does time feel different as we age?",
        ];
        const pick = surprises[surpriseIndexRef.current % surprises.length];
        surpriseIndexRef.current += 1;
        setInput(pick);
        handleSplit(pick);
      } else {
        const value = `Tell me about ${cat.toLowerCase()}`;
        setInput(value);
        handleSplit(value);
      }
    },
    [handleSplit]
  );

  const handleReset = () => {
    setPhase("input");
    setBranches([]);
    setSelectedBranch(null);
    setExploration("");
    setOriginalInput("");
    setInput("");
    setError("");
    setHoveredBranch(null);
  };

  const handleBackToBranches = () => {
    setPhase("branches");
    setSelectedBranch(null);
    setExploration("");
  };

  const showPrism = phase !== "input";
  const showRays = phase === "branches" || phase === "exploring";

  const displayInput = phase === "input" ? input : originalInput;

  const parsedExploration = useMemo(() => {
    if (!exploration) return { main: [] as string[], related: [] as string[] };
    const parts = exploration.split("\n\n");
    const main: string[] = [];
    const related: string[] = [];

    for (const part of parts) {
      if (part.trim().startsWith("Related directions:")) {
        const lines = part.trim().split("\n").slice(1);
        for (const line of lines) {
          const cleaned = line.replace(/^-\s*/, "").trim();
          if (cleaned) related.push(cleaned);
        }
      } else {
        main.push(part);
      }
    }
    return { main, related };
  }, [exploration]);

  return (
    <div className="prizm-canvas fixed inset-0 z-50 overflow-hidden bg-[#0a0a0a] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB]">
      {/* Atmospheric background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B6CFF]/[0.03] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#4DD9D0]/[0.02] blur-[100px]" />
      </div>

      {/* ── TOP BAR ── */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-[family-name:var(--font-audiowide)] text-sm tracking-tight text-[#FFF2DB]/40 transition hover:text-[#FFF2DB]/70"
          >
            PRIZM
          </Link>
        </div>

        <h1 className="font-[family-name:var(--font-audiowide)] text-xs sm:text-sm tracking-[0.2em] uppercase">
          <span className="text-[#F5A623]/70">Put it through</span>{" "}
          <span className="text-[#8B6CFF]/70">the</span>{" "}
          <span className="text-[#4DD9D0]/70">Prism</span>
        </h1>

        <div className="flex items-center gap-4">
          {phase !== "input" && (
            <button
              onClick={handleReset}
              className="text-xs text-[#FFF2DB]/30 transition hover:text-[#FFF2DB]/60"
            >
              New PRIZM
            </button>
          )}
          <Link
            href="/"
            className="text-xs text-[#FFF2DB]/20 transition hover:text-[#FFF2DB]/50"
          >
            Exit
          </Link>
        </div>
      </header>

      {/* ── MAIN SCENE ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* ═══ INPUT STATE ═══ */}
        {phase === "input" && (
          <div className="relative flex w-full max-w-5xl flex-col items-center px-6">
            {/* Tagline */}
            <p className="mb-10 text-center text-lg font-medium text-[#FFF2DB]/50 sm:text-2xl">
              See one thing. Discover what&apos;s inside it.
            </p>

            {/* Categories */}
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className="rounded-full border border-[#FFF2DB]/10 bg-transparent px-4 py-2 text-xs font-medium text-[#FFF2DB]/40 transition hover:border-[#F5A623]/30 hover:text-[#F5A623] sm:text-sm"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Central prism — waiting for input */}
            <div className="relative mb-10" aria-hidden="true">
              <svg
                width="280"
                height="320"
                viewBox="0 0 280 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-30"
              >
                <defs>
                  <linearGradient id="prismIdle" x1="140" y1="0" x2="140" y2="320" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B6CFF" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#4DD9D0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <polygon
                  points="140,10 270,280 10,280"
                  fill="none"
                  stroke="url(#prismIdle)"
                  strokeWidth="1.5"
                />
                <polygon
                  points="140,10 270,280 10,280"
                  fill="url(#prismIdle)"
                  opacity="0.05"
                />
              </svg>
            </div>

            {/* Input — positioned below prism like reference */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="relative">
                <label htmlFor="prizm-input" className="sr-only">
                  Enter anything to put through the PRIZM
                </label>
                <input
                  ref={inputRef}
                  id="prizm-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter anything..."
                  className="prizia-input w-full bg-transparent py-3 text-center text-lg font-medium text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:outline-none sm:text-xl"
                />
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFF2DB]/20 to-transparent" />
              </div>
              {error && (
                <p className="mt-3 text-center text-sm text-red-400">{error}</p>
              )}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-full border border-[#FFF2DB]/15 bg-[#FFF2DB]/5 px-8 py-3 text-sm font-medium text-[#FFF2DB]/70 transition hover:border-[#F5A623]/30 hover:bg-[#F5A623]/10 hover:text-[#F5A623] disabled:cursor-not-allowed disabled:opacity-30 sm:text-base"
                >
                  Prizm It
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══ ENTERING / SPLITTING / BRANCHES / EXPLORING — THE PRISM SCENE ═══ */}
        {showPrism && (
          <div className="relative flex h-full w-full max-w-6xl items-center justify-center px-6">
            {/* THE PRISM — large, centered, always visible */}
            <div
              className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${
                phase === "entering"
                  ? "scale-100 opacity-100"
                  : phase === "splitting"
                    ? "scale-105 opacity-100"
                    : phase === "exploring"
                      ? "scale-75 opacity-40"
                      : "scale-100 opacity-100"
              }`}
            >
              <svg
                width="360"
                height="420"
                viewBox="0 0 280 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={
                  phase === "splitting" || phase === "branches"
                    ? "animate-prism-glow"
                    : ""
                }
              >
                <defs>
                  <linearGradient
                    id="prismActive"
                    x1="140"
                    y1="0"
                    x2="140"
                    y2="320"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#8B6CFF" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#4DD9D0" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity="0.7" />
                  </linearGradient>
                  <filter id="glowFilter">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Glow fill */}
                <polygon
                  points="140,10 270,280 10,280"
                  fill="url(#prismActive)"
                  opacity={phase === "splitting" || phase === "branches" ? "0.08" : "0.03"}
                  filter="url(#glowFilter)"
                />
                {/* Main outline */}
                <polygon
                  points="140,10 270,280 10,280"
                  fill="none"
                  stroke="url(#prismActive)"
                  strokeWidth={phase === "splitting" || phase === "branches" ? "2" : "1.5"}
                />
                {/* Inner triangle */}
                <polygon
                  points="140,40 245,260 35,260"
                  fill="none"
                  stroke="#FFF2DB"
                  strokeWidth="0.5"
                  opacity="0.08"
                />
              </svg>
            </div>

            {/* ── INPUT LABEL (left side, connected to prism) ── */}
            {(phase === "entering" || phase === "splitting" || phase === "branches") && (
              <div
                className={`absolute left-6 top-1/2 z-20 -translate-y-1/2 transition-all duration-700 ease-out sm:left-16 ${
                  phase === "entering"
                    ? "opacity-100"
                    : phase === "splitting"
                      ? "opacity-60"
                      : "opacity-40"
                }`}
              >
                <p className="max-w-[180px] text-sm font-medium text-[#FFF2DB]/70 sm:max-w-[240px] sm:text-base">
                  {displayInput.length > 50
                    ? displayInput.slice(0, 50) + "…"
                    : displayInput}
                </p>
                <div className="mt-2 h-px w-full max-w-[200px] bg-gradient-to-r from-[#FFF2DB]/30 to-transparent" />
              </div>
            )}

            {/* Input label for exploring state — top left */}
            {phase === "exploring" && selectedBranch && (
              <div className="absolute left-6 top-20 z-20 sm:left-16">
                <p className="max-w-[200px] text-xs text-[#FFF2DB]/30 sm:max-w-[280px]">
                  {displayInput.length > 60
                    ? displayInput.slice(0, 60) + "…"
                    : displayInput}
                </p>
              </div>
            )}

            {/* ── RAYS / PERSPECTIVES emerging from prism ── */}
            {showRays && (
              <div className="absolute left-1/2 top-1/2 z-20 -translate-y-1/2">
                {/* Ray lines and labels positioned from right edge of prism */}
                {branches.map((branch, i) => {
                  const angle = rayAngles[i] ?? (i - 2) * 18;
                  const color = rayColors[i] ?? "#FFF2DB";
                  const isSelected = selectedBranch?.id === branch.id;
                  const isHovered = hoveredBranch === branch.id;
                  const otherDimmed =
                    phase === "exploring" && !isSelected && !isHovered;

                  return (
                    <button
                      key={branch.id}
                      onClick={() => handleExplore(branch)}
                      onMouseEnter={() => setHoveredBranch(branch.id)}
                      onMouseLeave={() => setHoveredBranch(null)}
                      className={`group absolute z-20 animate-ray-extend ${
                        otherDimmed ? "opacity-20" : "opacity-100"
                      } transition-opacity duration-300`}
                      style={{
                        left: "180px",
                        top: "140px",
                        transformOrigin: "0 0",
                        transform: `rotate(${angle}deg)`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    >
                      {/* Ray line */}
                      <div
                        className="absolute top-0 left-0 h-px origin-left transition-all duration-300"
                        style={{
                          width: isSelected || isHovered ? "220px" : "180px",
                          background: `linear-gradient(90deg, ${color}40, ${color}${isSelected || isHovered ? "cc" : "60"})`,
                          transform: `rotate(0deg)`,
                        }}
                      />
                      {/* Label */}
                      <div
                        className="absolute top-[-8px] transition-all duration-300"
                        style={{
                          left: isSelected || isHovered ? "210px" : "170px",
                          transform: `rotate(${-angle}deg)`,
                          transformOrigin: "left center",
                        }}
                      >
                        <span
                          className={`whitespace-nowrap text-sm font-medium transition-all duration-300 sm:text-base ${
                            isSelected
                              ? "text-[#FFF2DB]"
                              : isHovered
                                ? "text-[#FFF2DB]/90"
                                : "text-[#FFF2DB]/50"
                          }`}
                          style={{
                            textShadow: isSelected || isHovered
                              ? `0 0 20px ${color}40`
                              : "none",
                          }}
                        >
                          {branch.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── ENTERING INPUT TRAVELING ── */}
            {phase === "entering" && (
              <div className="absolute left-6 top-1/2 z-30 -translate-y-1/2 animate-input-travel sm:left-16">
                <p className="max-w-[200px] text-sm font-medium text-[#FFF2DB]/80 sm:max-w-[280px] sm:text-base">
                  {originalInput.length > 50
                    ? originalInput.slice(0, 50) + "…"
                    : originalInput}
                </p>
                <div className="mt-2 h-px w-full bg-gradient-to-r from-[#FFF2DB]/40 to-transparent" />
              </div>
            )}

            {/* ── SPLITTING RAYS PREVIEW ── */}
            {phase === "splitting" && (
              <div className="absolute left-1/2 top-1/2 z-15 -translate-y-1/2">
                {rayAngles.map((angle, i) => (
                  <div
                    key={i}
                    className="absolute top-0 left-[180px] h-px origin-left animate-ray-extend"
                    style={{
                      width: "0px",
                      background: rayColors[i],
                      transform: `rotate(${angle}deg)`,
                      animationDelay: `${i * 0.12}s`,
                      opacity: 0.5,
                    }}
                  />
                ))}
              </div>
            )}

            {/* ── EXPLORATION PANEL ── */}
            {phase === "exploring" && selectedBranch && (
              <div className="absolute right-6 top-1/2 z-30 flex w-full max-w-md -translate-y-1/2 flex-col sm:right-16">
                {/* Selected perspective header */}
                <div className="mb-4 flex items-center gap-3">
                  <button
                    onClick={handleBackToBranches}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FFF2DB]/10 transition hover:border-[#FFF2DB]/20"
                    aria-label="Back to all branches"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#FFF2DB]/50" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <h2 className="font-[family-name:var(--font-audiowide)] text-base text-[#FFF2DB] sm:text-lg">
                    {selectedBranch.label}
                  </h2>
                </div>

                {/* Exploration content */}
                <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-[#FFF2DB]/5 bg-[#0d0d0d]/90 p-5 backdrop-blur-sm sm:p-6">
                  {isExploring ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                      <div className="flex gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8B6CFF] animate-prizia-pulse" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4DD9D0] animate-prizia-pulse" style={{ animationDelay: "0.2s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] animate-prizia-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                      <p className="text-xs text-[#FFF2DB]/30">Exploring...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {parsedExploration.main.map((paragraph, i) => (
                        <p key={i} className="text-sm leading-relaxed text-[#FFF2DB]/70">
                          {paragraph}
                        </p>
                      ))}
                      {parsedExploration.related.length > 0 && (
                        <div className="mt-4 border-t border-[#FFF2DB]/5 pt-4">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#F5A623]/50">
                            Related directions
                          </p>
                          <ul className="space-y-1.5">
                            {parsedExploration.related.map((rel, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-[#FFF2DB]/40">
                                <span className="mt-1 h-0.5 w-0.5 shrink-0 rounded-full bg-[#F5A623]/40" />
                                {rel}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Other perspectives — small visual list */}
                {!isExploring && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#FFF2DB]/20">
                      Other perspectives
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {branches
                        .filter((b) => b.id !== selectedBranch.id)
                        .map((branch) => (
                          <button
                            key={branch.id}
                            onClick={() => handleExplore(branch)}
                            className="rounded-full border border-[#FFF2DB]/8 bg-transparent px-3 py-1.5 text-xs text-[#FFF2DB]/40 transition hover:border-[#F5A623]/20 hover:text-[#F5A623]/70"
                          >
                            {branch.label}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
