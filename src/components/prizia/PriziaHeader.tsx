import ActiveDomains from "./ActiveDomains";
import { Domain } from "@/lib/prizia/types";

interface PriziaHeaderProps {
  domains: Domain[];
}

export default function PriziaHeader({ domains }: PriziaHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 py-4 md:px-8 flex items-center justify-between bg-[#F7F7F9]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <img
          src="/prizia-icon.png"
          alt="Prizia logo"
          className="w-8 h-8 md:w-9 md:h-9 object-contain"
        />
        <div>
          <h1 className="text-sm md:text-base font-semibold text-[#0E0E13] tracking-tight leading-tight">
            PRIZIA
          </h1>
          <p className="text-[11px] md:text-xs text-[#6B6B78] leading-tight">
            The intelligence of Prizmistic
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs md:text-sm">
        <ActiveDomains domains={domains} compact />
        <span className="flex items-center gap-1.5 text-[#6B6B78]">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Online
        </span>
      </div>
    </header>
  );
}
