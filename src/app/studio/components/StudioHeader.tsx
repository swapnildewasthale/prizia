"use client";

import { useRouter } from "next/navigation";
import { useStudio } from "./StudioContext";

interface StudioHeaderProps {
  onMenuClick: () => void;
}

export function StudioHeader({ onMenuClick }: StudioHeaderProps) {
  const router = useRouter();
  const { hasChanges } = useStudio();

  async function handleLogout() {
    await fetch("/api/studio/auth/logout", { method: "POST" });
    router.push("/studio/login");
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-[#FFF2DB]/5 bg-[#000000] shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-[#FFF2DB]/50 hover:text-[#FFF2DB]/80 transition lg:hidden"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Desktop logo */}
        <span className="font-[family-name:var(--font-audiowide)] text-xs tracking-widest text-[#FFF2DB]/50 hidden lg:block">
          PRIZMISTIC STUDIO
        </span>

        {/* Mobile: show unsaved indicator inline */}
        {hasChanges && (
          <span className="text-[10px] text-[#F5A623]/50 lg:hidden">Unsaved</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {hasChanges && (
          <span className="text-xs text-[#F5A623]/50 hidden lg:block">Unsaved changes</span>
        )}
        <button
          onClick={handleLogout}
          className="text-xs text-[#FFF2DB]/30 transition hover:text-[#FFF2DB]/60"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
