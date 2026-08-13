import Link from "next/link";
import { site } from "@/content/prizmistic/site";

export default function Footer() {
  const { footer } = site;

  return (
    <footer className="relative border-t border-[#FFF2DB]/5 bg-[#000000]">
      {/* subtle top gradient transition */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B6CFF]/20 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-12">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <span className="font-[family-name:var(--font-audiowide)] text-base font-normal text-[#FFF2DB] tracking-tight">
            PRIZMISTIC
          </span>
          <span className="text-sm text-[#FFF2DB]/30">{footer.tagline}</span>
        </div>

        <div className="flex flex-col items-center gap-4 sm:items-end">
          <div className="flex gap-6">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#FFF2DB]/50 transition hover:text-[#FFF2DB]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <span className="text-xs text-[#FFF2DB]/25">{footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
