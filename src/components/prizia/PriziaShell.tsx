"use client";

import { useState } from "react";

const prompts = ["Explore AI", "What’s happening here?", "Tell me about Prizmistic"];

export default function PriziaShell() {
  const [message, setMessage] = useState("");

  const choosePrompt = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#101015] text-[#fff5e3]">
      <header className="flex items-center justify-between px-6 py-8 sm:px-12 sm:py-12">
        <button
          aria-label="Open menu"
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d]"
        >
          <span className="flex w-6 flex-col gap-1">
            <span className="h-0.5 w-6 rounded-full bg-[#e9e9e9]" />
            <span className="h-0.5 w-6 rounded-full bg-[#e9e9e9]" />
            <span className="h-0.5 w-6 rounded-full bg-[#e9e9e9]" />
          </span>
        </button>

        <p className="hidden items-center gap-4 text-sm tracking-wide sm:flex">
          <span className="text-[#66636a]">Currently exploring</span>
          <span className="text-[#f8eedc]">AI · Photography · Music</span>
        </p>
      </header>

      <main className="flex min-h-[calc(100vh-112px)] items-center justify-center px-5 pb-24 sm:px-10">
        <section className="flex w-full max-w-3xl flex-col items-center text-center">
          <div aria-hidden="true" className="mb-5 flex h-28 items-center justify-center sm:mb-7">
            <svg className="h-28 w-28" viewBox="0 0 120 120" fill="none">
              <path d="M56 15c9-9 23-9 32 0l10 10c9 9 9 23 0 32L71 84l19 19H67L47 83l-9 9H16l20-20-17-17c-9-9-9-23 0-32l10-10c9-9 23-9 32 0l17 17-13 13-17-17c-4-4-10-4-14 0L29 29c-4 4-4 10 0 14l31 31 27-27c4-4 4-10 0-14l-10-10c-4-4-10-4-14 0L42 44 29 31 56 15Z" fill="#fff2dc" />
              <path d="M96 83 106 103H86l10-20Z" fill="#d88024" />
            </svg>
          </div>

          <h1 className="font-[family-name:var(--font-inter)] text-4xl font-medium tracking-[-0.06em] text-[#fff2dc] sm:text-6xl">
            Hi, I’m Prizia.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#fbf1df] sm:text-2xl">
            I know what’s happening at Prizmistic.
            <br />
            What are you curious about?
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-2.5 sm:mt-20">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => choosePrompt(prompt)}
                className="rounded-full border border-[#343238] bg-[#202023] px-4 py-2.5 text-sm text-[#d5842d] transition hover:border-[#d5842d]/60 hover:bg-[#292629] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="mt-8 flex w-full max-w-3xl items-center rounded-[1.35rem] border border-[#e8e0d4] bg-[#222225] p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.22)]"
          >
            <label htmlFor="prizia-message" className="sr-only">Ask Prizia a question</label>
            <input
              id="prizia-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask Prizia anything about what we’re exploring..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-[#fff2dc] placeholder:text-[#817c80] focus:outline-none sm:px-5"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ffd519] via-[#ffb411] to-[#f28e0c] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#221b11]" aria-hidden="true">
                <path d="M4.5 4.2 20 11.1a1 1 0 0 1 0 1.8L4.5 19.8l2.3-6.1a1 1 0 0 0 0-.7L4.5 4.2Zm3.3 3.2 1 3.1h6.3L7.8 7.4Zm0 9.2 7.3-3.1H8.8l-1 3.1Z" />
              </svg>
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
