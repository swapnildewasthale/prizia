"use client";

import { useStudio } from "./StudioContext";

export function ActionBar() {
  const { saving, publishing, hasChanges, message, saveDraft, publishDraft, clearMessage } =
    useStudio();

  const showActions =
    useStudio().activeSection !== "prizia-overview";

  if (!showActions) return null;

  return (
    <>
      {/* Toast notification */}
      {message && (
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-xl px-5 py-3 text-sm shadow-lg max-w-[90vw] text-center ${
            message.type === "success"
              ? "bg-green-900/90 text-green-200 border border-green-500/20"
              : "bg-red-900/90 text-red-200 border border-red-500/20"
          }`}
          onClick={clearMessage}
        >
          {message.text}
        </div>
      )}

      {/* Desktop: right-aligned in workspace */}
      <div className="hidden lg:flex items-center justify-end gap-3 py-4 border-b border-[#FFF2DB]/5">
        <button
          onClick={saveDraft}
          disabled={saving || !hasChanges}
          className="rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-5 py-2.5 text-sm font-medium text-[#FFF2DB]/70 transition hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={publishDraft}
          disabled={publishing}
          className="rounded-xl bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-[#000000] transition hover:bg-[#F5A623]/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
      </div>

      {/* Mobile: sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#FFF2DB]/5 bg-[#000000]/95 backdrop-blur safe-area-bottom">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={saveDraft}
            disabled={saving || !hasChanges}
            className="flex-1 rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] py-3 text-sm font-medium text-[#FFF2DB]/70 transition active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={publishDraft}
            disabled={publishing}
            className="flex-1 rounded-xl bg-[#F5A623] py-3 text-sm font-semibold text-[#000000] transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </>
  );
}
