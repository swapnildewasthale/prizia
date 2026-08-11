import Link from "next/link";
import { site } from "@/content/prizmistic/site";

export default function Footer() {
  const { footer } = site;

  return (
    <footer className="border-t border-white/5 bg-[#0c0c10]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-12">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <span className="font-[family-name:var(--font-audiowide)] text-base font-normal text-[#fff2dc] tracking-tight">
            PRIZMISTIC
          </span>
          <span className="text-sm text-[#6b6b78]">{footer.tagline}</span>
        </div>

        <div className="flex flex-col items-center gap-4 sm:items-end">
          <div className="flex gap-6">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#a49ba0] transition hover:text-[#fff2dc]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <span className="text-xs text-[#6b6b78]">{footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
