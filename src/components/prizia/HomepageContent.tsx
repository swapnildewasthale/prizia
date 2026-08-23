"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import NavBar from "@/components/prizia/NavBar";
import RegistrationSection from "@/components/prizia/RegistrationSection";
import { WebsiteConfig } from "@/lib/website/types";

const valueIcons: Record<string, React.ReactNode> = {
  learn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  make: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 3v18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  experiment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3.215 3.215 0 01-4.06 0 3.215 3.215 0 00-4.06 0 3.215 3.215 0 01-4.06 0 3.215 3.215 0 00-4.06 0 3.215 3.215 0 01-4.06 0L5 14.5m14 0V6.82a2.25 2.25 0 00-.659-1.591L13.5 3.104" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  explore: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
      <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm2.25 5.25l-4.5 2.25L7.5 6.75 5.25 9l2.25 4.5L5.25 18l2.25-2.25 2.25 4.5 2.25-4.5 2.25 2.25 2.25-4.5-2.25-4.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

interface HomepageContentProps {
  config: WebsiteConfig;
}

export default function HomepageContent({ config }: HomepageContentProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { homepage } = config;

  const redirectToChat = (text: string) => {
    const value = text.trim();
    if (!value) return;
    router.push(`/prizia?q=${encodeURIComponent(value)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    redirectToChat(message);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#000000] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB]">
      <NavBar nav={config.nav} />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-5 pt-20 sm:px-10">
        {/* atmospheric glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#8B6CFF]/[0.08] blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[#4DD9D0]/[0.06] blur-[100px]" />
          <div className="absolute top-1/3 right-0 h-[300px] w-[300px] rounded-full bg-[#F5A623]/[0.04] blur-[80px]" />
        </div>

        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
          <h1 className="font-[family-name:var(--font-audiowide)] text-4xl font-normal leading-tight tracking-[-0.04em] text-[#FFF2DB] sm:text-6xl sm:leading-tight">
            {homepage.hero.headline.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-[#FFF2DB]/70 sm:text-xl">
            {homepage.hero.sub}
          </p>
        </div>
      </section>

      {/* ── Prizia Entry ── */}
      <section className="relative px-5 py-20 sm:px-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#F5A623]">
            {homepage.priziaEntry.label}
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center rounded-[1.35rem] border border-[#FFF2DB]/10 bg-[#0a0a0a] p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.5)]"
          >
            <label htmlFor="prizia-home" className="sr-only">
              Ask Prizia a question
            </label>
            <input
              id="prizia-home"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={homepage.priziaEntry.placeholder}
              className="prizia-input min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-medium text-[#FFF2DB] placeholder:text-[#FFF2DB]/30 focus:outline-none sm:px-5"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#F5A623] via-[#F5A623] to-[#F5A623] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#000000]" aria-hidden="true">
                <path d="M4.5 4.2 20 11.1a1 1 0 0 1 0 1.8L4.5 19.8l2.3-6.1a1 1 0 0 0 0-.7L4.5 4.2Zm3.3 3.2 1 3.1h6.3L7.8 7.4Zm0 9.2 7.3-3.1H8.8l-1 3.1Z" />
              </svg>
            </button>
          </form>
          <Link
            href="/prizia"
            className="mt-4 text-sm text-[#FFF2DB]/30 transition hover:text-[#FFF2DB]/60"
          >
            Ya seedha Prizia se baat karo →
          </Link>
        </div>
      </section>

      {/* ── What is Prizmistic? ── */}
      <section className="relative px-5 py-20 sm:px-10">
        {/* subtle violet atmosphere */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B6CFF]/[0.05] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-audiowide)] text-2xl font-normal tracking-[-0.03em] text-[#FFF2DB] sm:text-3xl">
            {homepage.whatIs.heading}
          </h2>
          <div className="mt-8 space-y-5">
            {homepage.whatIs.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-[#FFF2DB]/60 sm:text-lg">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Free AI Experience / Registration ── */}
      <RegistrationSection />

      {/* ── Values: Learn / Make / Experiment / Explore ── */}
      <section className="relative px-5 py-20 sm:px-10">
        {/* warm orange atmosphere */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 h-[400px] w-[500px] rounded-full bg-[#F5A623]/[0.04] blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-[#8B6CFF]/[0.03] blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {homepage.values.map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl border border-[#FFF2DB]/5 bg-[#0a0a0a]/80 p-6 backdrop-blur-sm transition hover:border-[#F5A623]/20 hover:bg-[#111111]/80"
            >
              <div className="mb-4 text-[#F5A623] transition group-hover:text-[#F5A623]">
                {valueIcons[v.icon]}
              </div>
              <h3 className="font-[family-name:var(--font-audiowide)] text-base font-normal text-[#FFF2DB]">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#FFF2DB]/50">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Currently Exploring ── */}
      <section className="relative px-5 py-20 sm:px-10">
        {/* violet-to-cyan transition atmosphere */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-0 h-[500px] w-[600px] -translate-y-1/2 rounded-full bg-[#8B6CFF]/[0.06] blur-[120px]" />
          <div className="absolute top-1/2 right-0 h-[400px] w-[500px] -translate-y-1/2 rounded-full bg-[#4DD9D0]/[0.05] blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#FFF2DB]/30">
            {homepage.currentlyExploring.heading}
          </p>
          {homepage.currentlyExploring.domains.map((d) => (
            <Link
              key={d.id}
              href={d.href}
              className="group block rounded-2xl border border-[#FFF2DB]/5 bg-[#0a0a0a]/80 p-6 backdrop-blur-sm transition hover:border-[#4DD9D0]/20 hover:bg-[#111111]/80 sm:p-8"
            >
              <h3 className="font-[family-name:var(--font-audiowide)] text-xl font-normal text-[#FFF2DB] sm:text-2xl">
                {d.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#FFF2DB]/50 sm:text-base">
                {d.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-[#4DD9D0] transition group-hover:text-[#4DD9D0]">
                Explore AI →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      <section className="relative px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-audiowide)] text-2xl font-normal tracking-[-0.03em] text-[#FFF2DB] sm:text-3xl">
            {homepage.galleryPreview.heading}
          </h2>
          <p className="mt-4 max-w-xl text-base text-[#FFF2DB]/50 sm:text-lg">
            {homepage.galleryPreview.description}
          </p>

          {/* empty state — abstract visual with subtle color */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="aspect-[4/3] rounded-xl border border-[#8B6CFF]/10 bg-gradient-to-br from-[#8B6CFF]/[0.06] to-transparent transition group-hover:border-[#8B6CFF]/20" />
            <div className="aspect-[4/3] rounded-xl border border-[#4DD9D0]/10 bg-gradient-to-br from-[#4DD9D0]/[0.06] to-transparent transition group-hover:border-[#4DD9D0]/20" />
            <div className="aspect-[4/3] rounded-xl border border-[#F5A623]/10 bg-gradient-to-br from-[#F5A623]/[0.06] to-transparent transition group-hover:border-[#F5A623]/20" />
          </div>

          <Link
            href={homepage.galleryPreview.href}
            className="mt-6 inline-block text-sm font-medium text-[#F5A623] transition hover:text-[#F5A623]"
          >
            Gallery →
          </Link>
        </div>
      </section>

      {/* ── Prizia Invitation ── */}
      <section className="relative px-5 py-24 sm:px-10">
        {/* warm closing atmosphere */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#F5A623]/[0.06] blur-[120px]" />
          <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-[#8B6CFF]/[0.04] blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-[family-name:var(--font-audiowide)] text-2xl font-normal tracking-[-0.03em] text-[#FFF2DB] sm:text-3xl">
            {homepage.priziaInvitation.heading}
          </h2>
          <p className="mt-3 text-base text-[#FFF2DB]/50 sm:text-lg">
            {homepage.priziaInvitation.sub}
          </p>
          <Link
            href="/prizia"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 px-6 py-3 text-sm font-medium text-[#F5A623] transition hover:bg-[#F5A623]/20 hover:text-[#F5A623]"
          >
            Prizia se baat karo
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
