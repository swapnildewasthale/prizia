"use client";

import { useFormModal } from "./FormModalContext";
import Editable from "@/components/prizia/Editable";
import { WebsiteRegistration } from "@/lib/website/types";

interface RegistrationSectionProps {
  config: WebsiteRegistration;
}

export default function RegistrationSection({ config }: RegistrationSectionProps) {
  const { openForm } = useFormModal();

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B6CFF]/[0.08] via-[#4DD9D0]/[0.06] to-[#8B6CFF]/[0.08]" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B6CFF]/[0.10] blur-[150px]" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[#4DD9D0]/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-[#8B6CFF]/[0.07] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5A623]/[0.06] blur-[80px]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#000000] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#000000] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <Editable path="homepage.registration.label" label="Registration Label">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#4DD9D0]">
            {config.label}
          </p>
        </Editable>

        <Editable path="homepage.registration.heading" label="Registration Heading">
          <h2 className="font-[family-name:var(--font-audiowide)] text-2xl font-normal tracking-[-0.03em] text-[#FFF2DB] sm:text-3xl">
            {config.heading}
          </h2>
        </Editable>

        <Editable path="homepage.registration.subtitle" label="Registration Subtitle">
          <p className="mt-4 text-base text-[#FFF2DB]/60 sm:text-lg">
            {config.subtitle}
          </p>
        </Editable>

        <Editable
          path="homepage.registration.ctaText"
          label="Registration CTA"
          supports={["content", "visible", "bgColor"]}
        >
          <button
            onClick={openForm}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
            style={{
              backgroundColor: config.ctaStyle?.bgColor ?? "#F5A623",
              color: config.ctaStyle?.textColor ?? "#000000",
            }}
          >
            {config.ctaText}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Editable>

        <Editable path="homepage.registration.helpText" label="Help Text">
          <p className="mt-6 text-sm text-[#FFF2DB]/30">
            {config.helpText}{" "}
            <span className="text-[#FFF2DB]/50">Call us</span>{" "}
            <a
              href={config.phoneLink}
              className="font-medium text-[#F5A623] transition hover:text-[#F5A623]"
            >
              {config.phoneDisplay}
            </a>
          </p>
        </Editable>
      </div>
    </section>
  );
}
