"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

interface MissingContext {
  id: string;
  label: string;
  reason: string;
}

interface ContextItem {
  id: string;
  label: string;
  value: string;
}

interface ClarityResult {
  status: "guiding" | "ready";
  intent: string;
  missingContext: MissingContext[];
  readiness: number;
  improvedRequest: string;
}

type Phase = "empty" | "analyzing" | "guiding" | "ready";

export default function ClarityShell() {
  const [input, setInput] = useState("");
  const [thought, setThought] = useState("");
  const [phase, setPhase] = useState<Phase>("empty");
  const [result, setResult] = useState<ClarityResult | null>(null);
  const [context, setContext] = useState<ContextItem[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [nudgeQuestion, setNudgeQuestion] = useState<string | null>(null);
  const [nudgeTarget, setNudgeTarget] = useState<MissingContext | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (phase === "empty" || phase === "guiding") {
      inputRef.current?.focus();
    }
  }, [phase]);

  const analyze = useCallback(
    async (currentThought: string, currentContext: ContextItem[]) => {
      setError("");
      setPhase("analyzing");

      try {
        const res = await fetch("/api/clarity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thought: currentThought,
            existingContext: currentContext,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to analyze thought");
        }

        const data: ClarityResult = await res.json();
        setResult(data);

        if (data.status === "ready") {
          setPhase("ready");
        } else {
          setPhase("guiding");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Try again."
        );
        setPhase("guiding");
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;

      if (nudgeTarget) {
        const newContext = [
          ...context,
          { id: nudgeTarget.id, label: nudgeTarget.label, value: trimmed },
        ];
        setContext(newContext);
        const newThought = thought + ". " + trimmed;
        setThought(newThought);
        setInput("");
        setNudgeQuestion(null);
        setNudgeTarget(null);
        await analyze(newThought, newContext);
      } else {
        setThought(trimmed);
        setInput("");
        await analyze(trimmed, context);
      }
    },
    [input, context, thought, nudgeTarget, analyze]
  );

  const handleSuggestionClick = useCallback(
    (item: MissingContext) => {
      const question = generateNudgeQuestion(item);
      setNudgeQuestion(question);
      setNudgeTarget(item);
      setInput("");
      inputRef.current?.focus();
    },
    []
  );

  const handleIgnoreSuggestions = useCallback(async () => {
    if (result?.improvedRequest) {
      setPhase("ready");
    }
  }, [result]);

  const handleContinueImproving = useCallback(() => {
    setPhase("guiding");
    setNudgeQuestion(null);
    setNudgeTarget(null);
    setInput("");
    inputRef.current?.focus();
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result?.improvedRequest) return;
    try {
      await navigator.clipboard.writeText(result.improvedRequest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = result.improvedRequest;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
    },
    [handleSubmit]
  );

  const handleReset = useCallback(() => {
    setThought("");
    setInput("");
    setResult(null);
    setContext([]);
    setNudgeQuestion(null);
    setNudgeTarget(null);
    setPhase("empty");
    setError("");
  }, []);

  return (
    <div className="clarity-canvas fixed inset-0 z-50 flex flex-col items-center bg-[#000000] overflow-y-auto">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#8B6CFF]/[0.04] blur-[120px]" />

      {/* Top bar */}
      <nav className="relative z-10 flex w-full items-center justify-between px-6 py-4 sm:px-10">
        <button
          onClick={handleReset}
          className="text-sm font-medium tracking-wide text-[#FFF2DB]/40 transition-colors hover:text-[#FFF2DB]/70"
        >
          Clarity
        </button>
        <button
          onClick={handleReset}
          className="text-xs text-[#FFF2DB]/25 transition-colors hover:text-[#FFF2DB]/50"
        >
          Start over
        </button>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex w-full max-w-2xl flex-1 flex-col items-center px-6 pb-20 pt-8 sm:px-10">

        {/* Empty state */}
        {phase === "empty" && (
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <h1 className="mb-10 text-center font-[family-name:var(--font-audiowide)] text-2xl font-normal tracking-wide text-[#FFF2DB] sm:text-3xl">
              What do you want to do?
            </h1>
            <form onSubmit={handleSubmit} className="w-full">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="I want to plan a birthday for my son..."
                rows={3}
                className="clarity-input w-full resize-none rounded-2xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-6 py-5 text-base leading-relaxed text-[#FFF2DB] placeholder:text-[#FFF2DB]/25 focus:border-[#FFF2DB]/20 focus:outline-none sm:text-lg"
              />
              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-full bg-[#F5A623] px-6 py-2.5 text-sm font-semibold text-[#000000] transition-all hover:bg-[#F5A623]/90 disabled:opacity-30 disabled:hover:bg-[#F5A623]"
                >
                  Think with me
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Analyzing state */}
        {phase === "analyzing" && (
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <p className="animate-pulse text-sm text-[#FFF2DB]/40">
              Understanding your thought...
            </p>
          </div>
        )}

        {/* Guiding state */}
        {phase === "guiding" && result && (
          <div className="flex w-full flex-col items-center">
            {/* The thought */}
            <div className="mb-10 w-full text-center">
              <p className="text-lg leading-relaxed text-[#FFF2DB]/80 sm:text-xl">
                {thought}
              </p>
            </div>

            {/* Nudge question */}
            {nudgeQuestion && nudgeTarget && (
              <div className="mb-8 w-full animate-fade-in text-center">
                <p className="mb-4 text-sm text-[#FFF2DB]/40">
                  {nudgeQuestion}
                </p>
                <form onSubmit={handleSubmit} className="w-full">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type naturally..."
                    rows={2}
                    className="clarity-input mx-auto w-full max-w-md resize-none rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-5 py-4 text-base leading-relaxed text-[#FFF2DB] placeholder:text-[#FFF2DB]/25 focus:border-[#FFF2DB]/20 focus:outline-none"
                  />
                  <div className="mt-3 flex justify-center gap-3">
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="rounded-full bg-[#F5A623] px-5 py-2 text-sm font-semibold text-[#000000] transition-all hover:bg-[#F5A623]/90 disabled:opacity-30"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNudgeQuestion(null);
                        setNudgeTarget(null);
                        setInput("");
                      }}
                      className="rounded-full border border-[#FFF2DB]/10 px-5 py-2 text-sm text-[#FFF2DB]/40 transition-colors hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB]/60"
                    >
                      Skip
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Suggestion pills */}
            {!nudgeQuestion && result.missingContext.length > 0 && (
              <div className="mb-8 w-full animate-fade-in text-center">
                <p className="mb-4 text-xs uppercase tracking-widest text-[#FFF2DB]/25">
                  You might want to add
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {result.missingContext.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item)}
                      className="group rounded-full border border-[#FFF2DB]/10 bg-[#FFF2DB]/[0.03] px-4 py-2 text-sm text-[#FFF2DB]/50 transition-all hover:border-[#F5A623]/30 hover:bg-[#F5A623]/[0.06] hover:text-[#F5A623]/80"
                      title={item.reason}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Continue typing */}
            {!nudgeQuestion && (
              <div className="mt-4 w-full">
                <form onSubmit={handleSubmit} className="w-full">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add more detail..."
                    rows={2}
                    className="clarity-input w-full resize-none rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-5 py-4 text-base leading-relaxed text-[#FFF2DB] placeholder:text-[#FFF2DB]/25 focus:border-[#FFF2DB]/20 focus:outline-none"
                  />
                  <div className="mt-3 flex justify-center gap-3">
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="rounded-full bg-[#F5A623] px-5 py-2 text-sm font-semibold text-[#000000] transition-all hover:bg-[#F5A623]/90 disabled:opacity-30"
                    >
                      Add
                    </button>
                    {result.improvedRequest && (
                      <button
                        type="button"
                        onClick={handleIgnoreSuggestions}
                        className="rounded-full border border-[#FFF2DB]/10 px-5 py-2 text-sm text-[#FFF2DB]/40 transition-colors hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB]/60"
                      >
                        Use as-is
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Context so far */}
            {context.length > 0 && (
              <div className="mt-10 w-full border-t border-[#FFF2DB]/5 pt-6">
                <p className="mb-3 text-center text-xs uppercase tracking-widest text-[#FFF2DB]/20">
                  What we know so far
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {context.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full bg-[#FFF2DB]/[0.04] px-3 py-1 text-xs text-[#FFF2DB]/35"
                    >
                      {c.label}: {c.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="mt-6 text-center text-sm text-red-400/70">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Ready state */}
        {phase === "ready" && result && (
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            {/* The original thought */}
            <div className="mb-6 w-full text-center">
              <p className="text-base text-[#FFF2DB]/40 line-through decoration-[#FFF2DB]/10">
                {thought}
              </p>
            </div>

            {/* Arrow */}
            <div className="mb-6 text-[#FFF2DB]/15">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="animate-fade-in"
              >
                <path
                  d="M10 3v14M10 17l-4-4M10 17l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Status message */}
            <p className="mb-6 animate-fade-in text-xs uppercase tracking-widest text-[#F5A623]/60">
              Your request is taking shape
            </p>

            {/* The refined request */}
            <div className="mb-8 w-full animate-fade-in rounded-2xl border border-[#F5A623]/15 bg-[#F5A623]/[0.04] px-6 py-5 sm:px-8">
              <p className="text-base leading-relaxed text-[#FFF2DB]/85 sm:text-lg">
                {result.improvedRequest}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleContinueImproving}
                className="rounded-full border border-[#FFF2DB]/10 px-5 py-2.5 text-sm text-[#FFF2DB]/40 transition-colors hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB]/60"
              >
                Continue improving
              </button>
              <button
                onClick={handleCopy}
                className="rounded-full bg-[#F5A623] px-6 py-2.5 text-sm font-semibold text-[#000000] transition-all hover:bg-[#F5A623]/90"
              >
                {copied ? "Copied!" : "Copy request"}
              </button>
            </div>

            {/* Context summary */}
            {context.length > 0 && (
              <div className="mt-10 w-full border-t border-[#FFF2DB]/5 pt-6">
                <p className="mb-3 text-center text-xs uppercase tracking-widest text-[#FFF2DB]/20">
                  Context added
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {context.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full bg-[#FFF2DB]/[0.04] px-3 py-1 text-xs text-[#FFF2DB]/35"
                    >
                      {c.label}: {c.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function generateNudgeQuestion(item: MissingContext): string {
  const label = item.label.toLowerCase();

  if (label.includes("budget") || label.includes("cost") || label.includes("price")) {
    return "What's your budget?";
  }
  if (label.includes("when") || label.includes("date") || label.includes("time")) {
    return "When do you need this done?";
  }
  if (label.includes("where") || label.includes("location") || label.includes("city") || label.includes("venue")) {
    return "Where are you thinking?";
  }
  if (label.includes("who") || label.includes("guest") || label.includes("people") || label.includes("attendee")) {
    return "Who is this for / how many people?";
  }
  if (label.includes("how many") || label.includes("number") || label.includes("size")) {
    return "Roughly how many / how much?";
  }
  if (label.includes("style") || label.includes("tone") || label.includes("vibe")) {
    return "What style or tone are you going for?";
  }
  if (label.includes("purpose") || label.includes("goal") || label.includes("outcome")) {
    return "What's the goal or desired outcome?";
  }
  if (label.includes("age") || label.includes("old")) {
    return "How old are they?";
  }
  if (label.includes("theme") || label.includes("interest") || label.includes("hobby")) {
    return "Any theme or interests to include?";
  }
  if (label.includes("skill") || label.includes("experience")) {
    return "What's your experience level with this?";
  }
  if (label.includes("daily") || label.includes("time") || label.includes("available")) {
    return "How much time can you dedicate to this?";
  }
  if (label.includes("starting") || label.includes("from") || label.includes("origin")) {
    return "Where are you starting from?";
  }
  if (label.includes("number of days") || label.includes("duration") || label.includes("long")) {
    return "How long are you thinking?";
  }

  return `Tell me more about: ${item.label}`;
}
