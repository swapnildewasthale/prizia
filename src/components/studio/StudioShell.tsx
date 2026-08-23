"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  WebsiteEditorProvider,
  useWebsiteEditor,
} from "./WebsiteEditorContext";
import { ShellHeader } from "./ShellHeader";
import { ShellSidebar, StudioWorkspace } from "./ShellSidebar";
import WebsiteEditorPanel from "./WebsiteEditorPanel";
import { FormattingPlaceholder } from "./FormattingPlaceholder";
import {
  StudioProvider,
  useStudio,
} from "@/app/studio/components/StudioContext";
import { PriziaOverview } from "@/app/studio/components/PriziaOverview";
import { IdentitySection } from "@/app/studio/components/IdentitySection";
import { BehaviorSection } from "@/app/studio/components/BehaviorSection";
import { CommunicationSection } from "@/app/studio/components/CommunicationSection";
import { KnowledgeSection } from "@/app/studio/components/KnowledgeSection";
import { TestSection } from "@/app/studio/components/TestSection";

const WEBSITE_ROUTES = ["/", "/about", "/explore", "/gallery"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    authenticated,
    activeField,
    setActiveField,
    editMode,
  } = useWebsiteEditor();
  const {
    activeSection: priziaSection,
    setActiveSection: setPriziaSection,
  } = useStudio();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<StudioWorkspace>(null);

  const isWebsiteRoute = WEBSITE_ROUTES.includes(pathname);
  const isStudioRoute = pathname.startsWith("/studio");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (authenticated && !isStudioRoute) {
      document.body.setAttribute("data-shell", "true");
      return () => {
        document.body.removeAttribute("data-shell");
      };
    }
  }, [authenticated, isStudioRoute]);

  if (isStudioRoute) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return <>{children}</>;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-audiowide)] text-xl text-[#FFF2DB] mb-4">
            Website Editing Requires Desktop
          </h1>
          <p className="text-sm text-[#FFF2DB]/50">
            Please use a desktop browser to edit website content.
          </p>
        </div>
      </div>
    );
  }

  const showEditingPanel = isWebsiteRoute && editMode && activeField;

  const sidebarContent = showEditingPanel ? (
    <WebsiteEditorPanel onBack={() => setActiveField(null)} />
  ) : (
    <ShellSidebar
      activeWorkspace={activeWorkspace}
      onSelectWorkspace={setActiveWorkspace}
      onNavigate={() => setDrawerOpen(false)}
      priziaSection={priziaSection}
      onSelectPriziaSection={setPriziaSection}
    />
  );

  return (
    <div className="h-screen flex flex-col bg-[#000000] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB] overflow-hidden">
      <ShellHeader onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:block w-60 shrink-0 border-r border-[#FFF2DB]/5 bg-[#000000] overflow-y-auto">
          {sidebarContent}
        </aside>

        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-[70] w-72 bg-[#0a0a0a] border-r border-[#FFF2DB]/5 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#FFF2DB]/5">
                <span className="font-[family-name:var(--font-audiowide)] text-xs tracking-widest text-[#FFF2DB]/60">
                  PRIZMISTIC STUDIO
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 -mr-2 text-[#FFF2DB]/40 hover:text-[#FFF2DB]/70 transition"
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sidebarContent}
              </div>
            </div>
          </>
        )}

        <main className="flex-1 overflow-y-auto">
          {activeWorkspace === "prizia" ? (
            <PriziaWorkspace />
          ) : activeWorkspace === "website" ? (
            <div className="h-full">{children}</div>
          ) : activeWorkspace === "global-formatting" ? (
            <FormattingPlaceholder />
          ) : (
            <WelcomePlaceholder />
          )}
        </main>
      </div>
    </div>
  );
}

function PriziaWorkspace() {
  const { activeSection, draft, updateDraft } = useStudio();

  function renderSection() {
    switch (activeSection) {
      case "prizia-overview":
        return <PriziaOverview />;
      case "prizia-foundation":
        return (
          <IdentitySection
            identity={draft.identity}
            onChange={(identity) => updateDraft({ identity })}
          />
        );
      case "prizia-behavior":
        return (
          <BehaviorSection
            behavior={draft.behavior}
            onChange={(behavior) => updateDraft({ behavior })}
          />
        );
      case "prizia-communication":
        return (
          <CommunicationSection
            communication={draft.communication}
            onChange={(communication) => updateDraft({ communication })}
          />
        );
      case "prizia-knowledge":
        return (
          <KnowledgeSection
            knowledge={draft.knowledge}
            onChange={(knowledge) => updateDraft({ knowledge })}
          />
        );
      case "prizia-test":
        return <TestSection config={draft} />;
      default:
        return <PriziaOverview />;
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
      {renderSection()}
    </div>
  );
}

function WelcomePlaceholder() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]/60 mb-2">
          PRIZMISTIC STUDIO
        </h2>
        <p className="text-sm text-[#FFF2DB]/30">
          Select a workspace from the sidebar to get started.
        </p>
      </div>
    </div>
  );
}

export default function StudioShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <WebsiteEditorProvider>
      <StudioProvider>
        <ShellInner>{children}</ShellInner>
      </StudioProvider>
    </WebsiteEditorProvider>
  );
}
