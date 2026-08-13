"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdH9qUJZrmCgMbo1_CRXuUNIjHjWsG2jFKHr_Gz9leG7gGrLQ/viewform?embedded=true";

interface FormModalContextValue {
  openForm: () => void;
}

const FormModalContext = createContext<FormModalContextValue>({
  openForm: () => {},
});

export function useFormModal() {
  return useContext(FormModalContext);
}

export function FormModalProvider({ children }: { children: React.ReactNode }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openForm = useCallback(() => setIsFormOpen(true), []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isFormOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeForm();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFormOpen, closeForm]);

  return (
    <FormModalContext.Provider value={{ openForm }}>
      {children}

      {/* ── Shared Google Form Modal ── */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Registration form"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={closeForm}
            aria-hidden="true"
          />

          {/* Modal content */}
          <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a24] shadow-2xl animate-fade-in sm:max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-6">
              <h3 className="font-[family-name:var(--font-audiowide)] text-sm font-normal text-[#fff2dc] sm:text-base">
                Prizmistic AI Experience
              </h3>
              <button
                ref={triggerRef}
                onClick={closeForm}
                aria-label="Close registration form"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#a49ba0] transition hover:bg-white/10 hover:text-[#fff2dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad0d]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Iframe */}
            <div className="relative flex-1 overflow-hidden">
              <iframe
                src={FORM_EMBED_URL}
                className="h-[65vh] w-full border-0 sm:h-[70vh]"
                title="Prizmistic AI Experience Registration Form"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      )}
    </FormModalContext.Provider>
  );
}
