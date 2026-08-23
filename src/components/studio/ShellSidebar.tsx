"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ShellSidebarProps {
  onNavigate?: () => void;
}

const WEBSITE_PAGES = [
  { href: "/", label: "Homepage" },
  { href: "/about", label: "About" },
  { href: "/explore", label: "Explore" },
  { href: "/gallery", label: "Gallery" },
];

export function ShellSidebar({ onNavigate }: ShellSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full py-6 px-4 overflow-y-auto">
      <div className="mb-8 px-2">
        <span className="font-[family-name:var(--font-audiowide)] text-xs tracking-widest text-[#FFF2DB]/40">
          STUDIO
        </span>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <div>
          <div className="px-2 mb-2">
            <span className="text-[10px] font-semibold tracking-widest text-[#FFF2DB]/25 uppercase">
              PRIZIA
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <Link
              href="/studio"
              onClick={onNavigate}
              className="px-3 py-2 rounded-lg text-sm text-left transition text-[#FFF2DB]/45 hover:text-[#FFF2DB]/70 hover:bg-[#FFF2DB]/5"
            >
              Open Studio
            </Link>
          </div>
        </div>

        <div>
          <div className="px-2 mb-2">
            <span className="text-[10px] font-semibold tracking-widest text-[#FFF2DB]/25 uppercase">
              WEBSITE
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {WEBSITE_PAGES.map((page) => {
              const isActive = pathname === page.href;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={onNavigate}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition ${
                    isActive
                      ? "bg-[#F5A623]/10 text-[#F5A623]"
                      : "text-[#FFF2DB]/45 hover:text-[#FFF2DB]/70 hover:bg-[#FFF2DB]/5"
                  }`}
                >
                  {page.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
