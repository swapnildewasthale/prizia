"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/prizmistic/site";
import { useFormModal } from "./FormModalContext";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openForm } = useFormModal();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#101015]/90 backdrop-blur-md border-b border-white/5">
      {/* ── Desktop: 3-column grid for genuine centering ── */}
      <div className="mx-auto hidden max-w-7xl grid-cols-3 items-center px-6 py-4 sm:grid sm:px-12">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-audiowide)] text-lg font-normal text-[#fff2dc] tracking-tight">
              PRIZMISTIC
            </span>
          </Link>
        </div>

        {/* Center: Navigation links (genuinely centered via grid) */}
        <div className="flex justify-center gap-8">
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#a49ba0] transition hover:text-[#fff2dc]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={openForm}
            className="rounded-full bg-[#d5842d] px-4 py-2 text-xs font-semibold text-[#101015] transition hover:bg-[#ffad0d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101015] sm:text-sm"
          >
            Book Free AI Experience
          </button>
          <Link
            href="/prizia"
            className="rounded-full border border-[#d5842d]/30 bg-[#d5842d]/10 px-4 py-2 text-xs font-medium text-[#d5842d] transition hover:bg-[#d5842d]/20 hover:text-[#ffad0d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101015] sm:text-sm"
          >
            Talk to Prizia
          </Link>
        </div>
      </div>

      {/* ── Mobile: Logo + Hamburger ── */}
      <div className="flex items-center justify-between px-6 py-4 sm:hidden">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-audiowide)] text-lg font-normal text-[#fff2dc] tracking-tight">
            PRIZMISTIC
          </span>
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d]"
        >
          <span className="flex w-6 flex-col gap-1">
            <span className={`h-0.5 w-6 rounded-full bg-[#e9e9e9] transition-transform ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 rounded-full bg-[#e9e9e9] transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 rounded-full bg-[#e9e9e9] transition-transform ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="border-t border-white/5 px-6 py-4 sm:hidden">
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-[#a49ba0] transition hover:text-[#fff2dc]"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile CTAs */}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                openForm();
              }}
              className="w-full rounded-full bg-[#d5842d] px-5 py-2.5 text-sm font-semibold text-[#101015] transition hover:bg-[#ffad0d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d]"
            >
              Book Free AI Experience
            </button>
            <Link
              href="/prizia"
              className="w-full rounded-full border border-[#d5842d]/30 bg-[#d5842d]/10 px-5 py-2.5 text-center text-sm font-medium text-[#d5842d] transition hover:bg-[#d5842d]/20 hover:text-[#ffad0d]"
              onClick={() => setIsMenuOpen(false)}
            >
              Talk to Prizia
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
