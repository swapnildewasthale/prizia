"use client";

import { useState } from "react";
import { useStudio } from "./components/StudioContext";
import { StudioHeader } from "./components/StudioHeader";
import { Sidebar } from "./components/Sidebar";
import { MobileDrawer } from "./components/MobileDrawer";
import { ActionBar } from "./components/ActionBar";
import { PriziaOverview } from "./components/PriziaOverview";
import { IdentitySection } from "./components/IdentitySection";
import { BehaviorSection } from "./components/BehaviorSection";
import { CommunicationSection } from "./components/CommunicationSection";
import { KnowledgeSection } from "./components/KnowledgeSection";
import { TestSection } from "./components/TestSection";

export default function StudioPage() {
  const { activeSection, draft, updateDraft } = useStudio();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function renderContent() {
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
    <div className="h-screen flex flex-col bg-[#000000] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB] overflow-hidden">
      {/* Header */}
      <StudioHeader onMenuClick={() => setDrawerOpen(true)} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 border-r border-[#FFF2DB]/5 bg-[#000000] overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* Main workspace */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
              {renderContent()}
            </div>
          </div>

          {/* Action bar (renders itself conditionally) */}
          <ActionBar />
        </main>
      </div>
    </div>
  );
}
