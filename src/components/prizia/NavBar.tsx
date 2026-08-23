"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/prizmistic/site";
import { WebsiteConfig } from "@/lib/website/types";
import { useFormModal } from "./FormModalContext";

interface NavBarProps {
  nav?: WebsiteConfig["nav"];
}

export default function NavBar({ nav }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openForm } = useFormModal();
  const links = nav ?? site.nav;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#FFF2DB]/5">
      {/* ── Desktop: 3-column grid for genuine centering ── */}
      <div className="mx-auto hidden max-w-7xl grid-cols-3 items-center px-6 py-4 sm:grid sm:px-12">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-audiowide)] text-lg font-normal text-[#FFF2DB] tracking-tight">
              PRIZMISTIC
            </span>
          </Link>
        </div>

        {/* Center: Navigation links (genuinely centered via grid) */}
        <div className="flex justify-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#FFF2DB]/50 transition hover:text-[#FFF2DB]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={openForm}
            className="rounded-full bg-[#F5A623] px-4 py-2 text-xs font-semibold text-[#000000] transition hover:bg-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000] sm:text-sm"
          >
            Book Free AI Experience
          </button>
          <Link
            href="/prizia"
            className="rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-2 text-xs font-medium text-[#F5A623] transition hover:bg-[#F5A623]/20 hover:text-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000] sm:text-sm"
          >
            Talk to Prizia
          </Link>
        </div>
      </div>

      {/* ── Mobile: Logo + Hamburger ── */}
      <div className="flex items-center justify-between px-6 py-4 sm:hidden">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-audiowide)] text-lg font-normal text-[#FFF2DB] tracking-tight">
            PRIZMISTIC
          </span>
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#FFF2DB]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
        >
          <span className="flex w-6 flex-col gap-1">
            <span className={`h-0.5 w-6 rounded-full bg-[#FFF2DB] transition-transform ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 rounded-full bg-[#FFF2DB] transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 rounded-full bg-[#FFF2DB] transition-transform ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="border-t border-[#FFF2DB]/5 px-6 py-4 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-[#FFF2DB]/50 transition hover:text-[#FFF2DB]"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile CTAs */}
          <div className="mt-3 flex flex-col gap-2 border-t border-[#FFF2DB]/5 pt-3">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                openForm();
              }}
              className="w-full rounded-full bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-[#000000] transition hover:bg-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
            >
              Book Free AI Experience
            </button>
            <Link
              href="/prizia"
              className="w-full rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 px-5 py-2.5 text-center text-sm font-medium text-[#F5A623] transition hover:bg-[#F5A623]/20 hover:text-[#F5A623]"
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
