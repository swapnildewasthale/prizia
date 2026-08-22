"use client";

import { useStudio, StudioSection } from "./StudioContext";

export function PriziaOverview() {
  const { draft, hasChanges, setActiveSection } = useStudio();

  const knowledgeCount = draft.knowledge.length;
  const activeKnowledgeCount = draft.knowledge.filter((k) => k.active).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
          Prizia Overview
        </h2>
        <p className="text-sm text-[#FFF2DB]/40 mt-1">
          Current configuration status and quick actions.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-5">
          <div className="text-xs text-[#FFF2DB]/30 uppercase tracking-wider mb-2">
            Identity
          </div>
          <div className="text-sm text-[#FFF2DB] font-medium">
            {draft.identity.name}
          </div>
          <div className="text-xs text-[#FFF2DB]/40 mt-1">
            {draft.identity.role}
          </div>
        </div>

        <div className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-5">
          <div className="text-xs text-[#FFF2DB]/30 uppercase tracking-wider mb-2">
            Knowledge Entries
          </div>
          <div className="text-sm text-[#FFF2DB] font-medium">
            {knowledgeCount} total
          </div>
          <div className="text-xs text-[#FFF2DB]/40 mt-1">
            {activeKnowledgeCount} active
          </div>
        </div>

        <div className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-5">
          <div className="text-xs text-[#FFF2DB]/30 uppercase tracking-wider mb-2">
            Draft Status
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                hasChanges ? "bg-[#F5A623]" : "bg-green-400"
              }`}
            />
            <span className="text-sm text-[#FFF2DB]">
              {hasChanges ? "Unsaved changes" : "Saved"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-5">
          <div className="text-xs text-[#FFF2DB]/30 uppercase tracking-wider mb-2">
            Published
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            <span className="text-sm text-[#FFF2DB]">Active</span>
          </div>
          <div className="text-xs text-[#FFF2DB]/40 mt-1">
            Live Prizia uses published config
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#FFF2DB]/50">Quick Actions</h3>

        <button
          onClick={() => setActiveSection("prizia-test" as StudioSection)}
          className="w-full rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-4 text-left transition hover:border-[#F5A623]/20 hover:bg-[#111111]/80 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#FFF2DB] font-medium">
                Test Prizia
              </div>
              <div className="text-xs text-[#FFF2DB]/30 mt-0.5">
                Chat with Prizia using Draft configuration
              </div>
            </div>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-[#FFF2DB]/20 group-hover:text-[#F5A623]/50 transition"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>

        <button
          onClick={() => setActiveSection("prizia-knowledge" as StudioSection)}
          className="w-full rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-4 text-left transition hover:border-[#F5A623]/20 hover:bg-[#111111]/80 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#FFF2DB] font-medium">
                Manage Knowledge
              </div>
              <div className="text-xs text-[#FFF2DB]/30 mt-0.5">
                {knowledgeCount} entries ({activeKnowledgeCount} active)
              </div>
            </div>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-[#FFF2DB]/20 group-hover:text-[#F5A623]/50 transition"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
