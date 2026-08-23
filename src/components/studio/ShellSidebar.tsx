"use client";

import { StudioSection } from "@/app/studio/components/StudioContext";

export type StudioWorkspace = "prizia" | "website" | "uploads" | "global-formatting" | null;

interface ShellSidebarProps {
  activeWorkspace: StudioWorkspace;
  onSelectWorkspace: (workspace: StudioWorkspace) => void;
  onNavigate?: () => void;
  priziaSection?: StudioSection;
  onSelectPriziaSection?: (section: StudioSection) => void;
}

const WORKSPACES = [
  {
    id: "prizia" as StudioWorkspace,
    label: "Prizia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "website" as StudioWorkspace,
    label: "Website",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "uploads" as StudioWorkspace,
    label: "Uploads",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "global-formatting" as StudioWorkspace,
    label: "Global Formatting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const PRIZIA_SECTIONS: { id: StudioSection; label: string }[] = [
  { id: "prizia-overview", label: "Overview" },
  { id: "prizia-foundation", label: "Foundation" },
  { id: "prizia-behavior", label: "Behaviour" },
  { id: "prizia-communication", label: "Communication" },
  { id: "prizia-knowledge", label: "Knowledge" },
  { id: "prizia-test", label: "Test" },
];

export function ShellSidebar({
  activeWorkspace,
  onSelectWorkspace,
  onNavigate,
  priziaSection,
  onSelectPriziaSection,
}: ShellSidebarProps) {
  const showPriziaMenu = activeWorkspace === "prizia";

  return (
    <nav className="flex flex-col h-full py-6 px-4 overflow-y-auto">
      <div className="mb-8 px-2">
        <span className="font-[family-name:var(--font-audiowide)] text-xs tracking-widest text-[#FFF2DB]/40">
          STUDIO
        </span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {showPriziaMenu ? (
          <PriziaSubMenu
            activeSection={priziaSection}
            onSelectSection={onSelectPriziaSection}
            onBack={() => onSelectWorkspace(null)}
            onNavigate={onNavigate}
          />
        ) : (
          WORKSPACES.map((ws) => {
            const isActive = activeWorkspace === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => {
                  onSelectWorkspace(ws.id);
                  onNavigate?.();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
                  isActive
                    ? "bg-[#F5A623]/10 text-[#F5A623]"
                    : "text-[#FFF2DB]/45 hover:text-[#FFF2DB]/70 hover:bg-[#FFF2DB]/5"
                }`}
              >
                {ws.icon}
                {ws.label}
              </button>
            );
          })
        )}
      </div>
    </nav>
  );
}

function PriziaSubMenu({
  activeSection,
  onSelectSection,
  onBack,
  onNavigate,
}: {
  activeSection?: StudioSection;
  onSelectSection?: (section: StudioSection) => void;
  onBack: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={() => {
          onBack();
          onNavigate?.();
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left text-[#FFF2DB]/45 hover:text-[#FFF2DB]/70 hover:bg-[#FFF2DB]/5 transition"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      <div className="px-2 pt-2 pb-1">
        <span className="text-[10px] font-semibold tracking-widest text-[#FFF2DB]/25 uppercase">
          PRIZIA
        </span>
      </div>

      {PRIZIA_SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => {
              onSelectSection?.(section.id);
              onNavigate?.();
            }}
            className={`px-3 py-2 rounded-lg text-sm text-left transition ${
              isActive
                ? "bg-[#F5A623]/10 text-[#F5A623]"
                : "text-[#FFF2DB]/45 hover:text-[#FFF2DB]/70 hover:bg-[#FFF2DB]/5"
            }`}
          >
            {section.label}
          </button>
        );
      })}
    </div>
  );
}
