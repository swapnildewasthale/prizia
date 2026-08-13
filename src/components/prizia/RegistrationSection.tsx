"use client";

import { useFormModal } from "./FormModalContext";

const PHONE_NUMBER = "+919039202637";
const PHONE_display = "+91 90392 02637";

export default function RegistrationSection() {
  const { openForm } = useFormModal();

  return (
    <section className="relative px-5 py-20 sm:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#F5A623]">
          Free AI Experience
        </p>

        <h2 className="font-[family-name:var(--font-audiowide)] text-2xl font-normal tracking-[-0.03em] text-[#FFF2DB] sm:text-3xl">
          AI को बनाइए अपना Personal Assistant
        </h2>

        <p className="mt-4 text-base text-[#FFF2DB]/50 sm:text-lg">
          Study &nbsp;|&nbsp; Job &nbsp;|&nbsp; Business &nbsp;|&nbsp; Life
        </p>

        <button
          onClick={openForm}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F5A623] px-7 py-3.5 text-sm font-semibold text-[#000000] transition hover:bg-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
        >
          Book Your Free Experience
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Help banner */}
        <p className="mt-6 text-sm text-[#FFF2DB]/25">
          Need help registering?{" "}
          <span className="text-[#FFF2DB]/50">Call us</span>{" "}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="font-medium text-[#F5A623] transition hover:text-[#F5A623]"
          >
            {PHONE_display}
          </a>
        </p>
      </div>
    </section>
  );
}
