"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/domains", label: "Domains" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#101015]/90 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-12">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/Prizia icon light.png"
            alt="Prizia logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-[family-name:var(--font-audiowide)] text-lg font-normal text-[#fff2dc] tracking-tight">
            PRIZIA
          </span>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#a49ba0] transition hover:text-[#fff2dc]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d] sm:hidden"
        >
          <span className="flex w-6 flex-col gap-1">
            <span className={`h-0.5 w-6 rounded-full bg-[#e9e9e9] transition-transform ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 rounded-full bg-[#e9e9e9] transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 rounded-full bg-[#e9e9e9] transition-transform ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/5 px-6 py-4 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-[#a49ba0] transition hover:text-[#fff2dc]"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
