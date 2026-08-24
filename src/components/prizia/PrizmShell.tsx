"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";

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

export default function PrizmShell() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [exploration, setExploration] = useState("");
  const [isExploring, setIsExploring] = useState(false);
  const [originalInput, setOriginalInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const exploringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (phase === "exploring" && exploringRef.current) {
      exploringRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [phase, exploration]);

  const handleSplit = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || phase !== "input") return;

      setError("");
      setOriginalInput(trimmed);
      setPhase("entering");

      // Phase 1: input travels toward prism
      await new Promise((r) => setTimeout(r, 800));
      setPhase("splitting");

      // Phase 2: prism splits
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

        // Small delay for visual effect after branches are computed
        await new Promise((r) => setTimeout(r, 600));
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

        if (!res.ok) {
          throw new Error("Failed to explore this perspective");
        }

        const data = await res.json();
        setExploration(data.text);
      } catch {
        setExploration(
          "This perspective couldn't be explored right now. Try again."
        );
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
  };

  const handleBackToBranches = () => {
    setPhase("branches");
    setSelectedBranch(null);
    setExploration("");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#000000] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB]">
      <NavBar />

      <main className="relative flex min-h-[calc(100vh-112px)] items-center justify-center px-5 pb-24 pt-28 sm:px-10">
        {/* Atmospheric glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B6CFF]/[0.06] blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 h-[300px] w-[300px] rounded-full bg-[#4DD9D0]/[0.04] blur-[80px]" />
          <div className="absolute top-1/2 left-1/4 h-[200px] w-[250px] rounded-full bg-[#F5A623]/[0.03] blur-[90px]" />
        </div>

        {/* ── INPUT PHASE ── */}
        {phase === "input" && (
          <section className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
            <h1 className="font-[family-name:var(--font-audiowide)] text-5xl font-normal tracking-[-0.055em] text-[#FFF2DB] sm:text-7xl">
              PRIZM
            </h1>

            {/* Prism SVG */}
            <div className="my-8 sm:my-10" aria-hidden="true">
              <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="prismGrad" x1="60" y1="0" x2="60" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B6CFF" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#4DD9D0" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="prismGlow">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Glow layer */}
                <polygon
                  points="60,8 108,110 12,110"
                  fill="url(#prismGrad)"
                  opacity="0.3"
                  filter="url(#prismGlow)"
                />
                {/* Main prism */}
                <polygon
                  points="60,8 108,110 12,110"
                  fill="none"
                  stroke="url(#prismGrad)"
                  strokeWidth="2"
                />
                <polygon
                  points="60,8 108,110 12,110"
                  fill="url(#prismGrad)"
                  opacity="0.1"
                />
                {/* Inner highlight */}
                <polygon
                  points="60,22 96,104 24,104"
                  fill="none"
                  stroke="#FFF2DB"
                  strokeWidth="0.5"
                  opacity="0.15"
                />
              </svg>
            </div>

            <p className="mb-8 max-w-md text-lg font-medium leading-relaxed text-[#FFF2DB]/60 sm:text-xl">
              See one thing. Discover what&apos;s inside it.
            </p>

            {/* Input */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="flex items-center rounded-[1.35rem] border border-[#FFF2DB]/10 bg-[#111111] p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.4)]">
                <label htmlFor="prizm-input" className="sr-only">
                  Enter anything to put through the PRIZM
                </label>
                <input
                  ref={inputRef}
                  id="prizm-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter anything..."
                  className="prizia-input min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-medium text-[#FFF2DB] placeholder:text-[#FFF2DB]/25 focus:outline-none sm:px-5"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="shrink-0 rounded-full bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-[#000000] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
                >
                  Prizm It
                </button>
              </div>
            </form>

            {error && (
              <p className="mt-4 text-sm text-red-400">{error}</p>
            )}

            {/* Categories */}
            <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:mt-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className="rounded-full border border-[#FFF2DB]/10 bg-[#0d0d0d] px-4 py-2.5 text-sm font-normal text-[#FFF2DB]/60 transition hover:border-[#F5A623]/40 hover:bg-[#111111] hover:text-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── ENTERING / SPLITTING PHASE ── */}
        {(phase === "entering" || phase === "splitting") && (
          <section className="relative z-10 flex flex-col items-center text-center">
            {/* Prism with animation */}
            <div className="relative">
              <div
                className={`transition-all duration-700 ease-in-out ${
                  phase === "entering"
                    ? "scale-110 opacity-100"
                    : "scale-125 opacity-100"
                }`}
              >
                <svg width="160" height="186" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-prism-pulse">
                  <defs>
                    <linearGradient id="prismGradActive" x1="60" y1="0" x2="60" y2="140" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#8B6CFF" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#4DD9D0" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#F5A623" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="prismGlowActive">
                      <feGaussianBlur stdDeviation="12" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <polygon points="60,8 108,110 12,110" fill="url(#prismGradActive)" opacity="0.4" filter="url(#prismGlowActive)" />
                  <polygon points="60,8 108,110 12,110" fill="none" stroke="url(#prismGradActive)" strokeWidth="2.5" />
                  <polygon points="60,8 108,110 12,110" fill="url(#prismGradActive)" opacity="0.15" />
                  <polygon points="60,22 96,104 24,104" fill="none" stroke="#FFF2DB" strokeWidth="0.5" opacity="0.25" />
                </svg>
              </div>

              {/* Traveling input text */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FFF2DB] px-4 py-1.5 text-sm font-semibold text-[#000000] shadow-lg transition-all duration-700 ease-in-out ${
                  phase === "entering"
                    ? "-top-8 opacity-100"
                    : "top-1/2 -translate-y-1/2 scale-0 opacity-0"
                }`}
              >
                {originalInput.length > 40
                  ? originalInput.slice(0, 40) + "…"
                  : originalInput}
              </div>

              {/* Splitting rays */}
              {phase === "splitting" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-16 origin-left rounded-full animate-prism-ray"
                      style={{
                        background: ["#8B6CFF", "#4DD9D0", "#F5A623", "#8B6CFF", "#4DD9D0"][i],
                        transform: `rotate(${(i - 2) * 25}deg)`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <p className="mt-8 text-sm text-[#FFF2DB]/40">
              {phase === "entering"
                ? "Putting it through the PRIZM..."
                : "Splitting into perspectives..."}
            </p>
          </section>
        )}

        {/* ── BRANCHES PHASE ── */}
        {phase === "branches" && (
          <section className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
            {/* Prism small at center */}
            <div className="mb-2" aria-hidden="true">
              <svg width="60" height="70" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="prismGradSmall" x1="60" y1="0" x2="60" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B6CFF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <polygon points="60,8 108,110 12,110" fill="url(#prismGradSmall)" opacity="0.15" />
                <polygon points="60,8 108,110 12,110" fill="none" stroke="url(#prismGradSmall)" strokeWidth="1.5" />
              </svg>
            </div>

            <p className="mb-1 max-w-lg text-sm text-[#FFF2DB]/40">
              &ldquo;{originalInput.length > 80 ? originalInput.slice(0, 80) + "…" : originalInput}&rdquo;
            </p>
            <h2 className="mb-8 font-[family-name:var(--font-audiowide)] text-xl font-normal tracking-[-0.03em] text-[#FFF2DB] sm:text-2xl">
              {branches.length} perspectives emerged
            </h2>

            {/* Branches radiating from center */}
            <div className="flex flex-col gap-3 w-full max-w-lg sm:max-w-xl">
              {branches.map((branch, i) => (
                <button
                  key={branch.id}
                  onClick={() => handleExplore(branch)}
                  className="group flex items-center gap-4 rounded-2xl border border-[#FFF2DB]/8 bg-[#0d0d0d]/80 px-5 py-4 text-left transition hover:border-[#F5A623]/30 hover:bg-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] animate-branch-appear"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#000000]"
                    style={{
                      background: ["#8B6CFF", "#4DD9D0", "#F5A623", "#8B6CFF", "#4DD9D0"][i],
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="text-base font-medium text-[#FFF2DB] transition group-hover:text-[#F5A623]">
                      {branch.label}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-[#FFF2DB]/20 transition group-hover:text-[#F5A623]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Start over */}
            <button
              onClick={handleReset}
              className="mt-8 rounded-full border border-[#FFF2DB]/10 bg-transparent px-5 py-2.5 text-sm font-medium text-[#FFF2DB]/50 transition hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
            >
              ← Start a new PRIZM
            </button>
          </section>
        )}

        {/* ── EXPLORING PHASE ── */}
        {phase === "exploring" && selectedBranch && (
          <section ref={exploringRef} className="relative z-10 flex w-full max-w-3xl flex-col">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={handleBackToBranches}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFF2DB]/10 transition hover:border-[#FFF2DB]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
                aria-label="Back to all branches"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#FFF2DB]/60" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-[#FFF2DB]/30">
                  &ldquo;{originalInput.length > 60 ? originalInput.slice(0, 60) + "…" : originalInput}&rdquo;
                </p>
                <h2 className="truncate font-[family-name:var(--font-audiowide)] text-lg font-normal text-[#FFF2DB] sm:text-xl">
                  {selectedBranch.label}
                </h2>
              </div>
              <button
                onClick={handleReset}
                className="shrink-0 rounded-full border border-[#FFF2DB]/10 bg-transparent px-4 py-2 text-xs font-medium text-[#FFF2DB]/50 transition hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
              >
                New PRIZM
              </button>
            </div>

            {/* Exploration content */}
            <div className="rounded-2xl border border-[#FFF2DB]/5 bg-[#0d0d0d]/80 p-6 sm:p-8">
              {isExploring ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#8B6CFF] animate-prizia-pulse" style={{ animationDelay: "0s" }} />
                    <span className="h-2 w-2 rounded-full bg-[#4DD9D0] animate-prizia-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="h-2 w-2 rounded-full bg-[#F5A623] animate-prizia-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <p className="text-sm text-[#FFF2DB]/30">Exploring this perspective...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exploration.split("\n\n").map((paragraph, i) => {
                    if (paragraph.trim().startsWith("Related directions:")) {
                      const lines = paragraph.trim().split("\n").slice(1);
                      return (
                        <div key={i} className="mt-6 border-t border-[#FFF2DB]/5 pt-5">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#F5A623]/70">
                            Related directions
                          </p>
                          <ul className="space-y-2">
                            {lines.map((line, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-[#FFF2DB]/60">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#F5A623]/50" />
                                {line.replace(/^-\s*/, "")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return (
                      <p key={i} className="text-sm font-medium leading-relaxed text-[#FFF2DB]/80 sm:text-base">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Branch list below exploration */}
            {!isExploring && (
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FFF2DB]/30">
                  Other perspectives
                </p>
                <div className="flex flex-wrap gap-2">
                  {branches
                    .filter((b) => b.id !== selectedBranch.id)
                    .map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => handleExplore(branch)}
                        className="rounded-full border border-[#FFF2DB]/8 bg-[#0d0d0d] px-4 py-2 text-sm text-[#FFF2DB]/50 transition hover:border-[#F5A623]/30 hover:text-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
                      >
                        {branch.label}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
