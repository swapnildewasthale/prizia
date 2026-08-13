import { Domain } from "@/lib/prizia/types";

interface ActiveDomainsProps {
  domains: Domain[];
  compact?: boolean;
}

export default function ActiveDomains({ domains, compact = false }: ActiveDomainsProps) {
  const active = domains.filter((d) => d.active);
  if (active.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${compact ? "" : ""}`}>
      <span className={`${compact ? "text-xs" : "text-sm"} text-[#FFF2DB]/30`}>
        Currently exploring ·
      </span>
      <span className={`${compact ? "text-xs" : "text-sm"} font-medium text-[#FFF2DB]/60`}>
        {active.map((d) => d.name).join(" · ")}
      </span>
    </div>
  );
}
