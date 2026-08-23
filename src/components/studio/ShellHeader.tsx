"use client";

import { useRouter } from "next/navigation";
import { useWebsiteEditor } from "./WebsiteEditorContext";

interface ShellHeaderProps {
  onMenuClick: () => void;
}

export function ShellHeader({ onMenuClick }: ShellHeaderProps) {
  const router = useRouter();
  const {
    hasChanges,
    saving,
    publishing,
    saveDraft,
    publishDraft,
    showLogoutConfirm,
    setShowLogoutConfirm,
    logout,
    editMode,
    toggleEditMode,
  } = useWebsiteEditor();

  async function handleLogoutClick() {
    if (hasChanges) {
      setShowLogoutConfirm(true);
    } else {
      await logout();
      router.push("/");
    }
  }

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-[#FFF2DB]/5 bg-[#000000] shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-[#FFF2DB]/50 hover:text-[#FFF2DB]/80 transition lg:hidden"
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className="font-[family-name:var(--font-audiowide)] text-xs tracking-widest text-[#FFF2DB]/50 hidden lg:block">
            PRIZMISTIC STUDIO
          </span>

          <button
            onClick={toggleEditMode}
            className={`hidden lg:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              editMode
                ? "bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20"
                : "text-[#FFF2DB]/40 hover:text-[#FFF2DB]/60 border border-[#FFF2DB]/10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
            >
              <path
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {editMode ? "Editing" : "View Mode"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-xs text-[#F5A623]/50 hidden lg:block">
              Unsaved changes
            </span>
          )}

          <button
            onClick={saveDraft}
            disabled={saving || !hasChanges}
            className="hidden lg:flex rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-2 text-xs font-medium text-[#FFF2DB]/70 transition hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            onClick={publishDraft}
            disabled={publishing}
            className="hidden lg:flex rounded-xl bg-[#F5A623] px-4 py-2 text-xs font-semibold text-[#000000] transition hover:bg-[#F5A623]/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>

          <button
            onClick={handleLogoutClick}
            className="text-xs text-[#FFF2DB]/30 transition hover:text-[#FFF2DB]/60"
          >
            Logout
          </button>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0a0a0a] border border-[#FFF2DB]/10 rounded-xl p-6 max-w-sm mx-4">
            <h3 className="font-[family-name:var(--font-audiowide)] text-sm text-[#FFF2DB] mb-2">
              Unsaved Changes
            </h3>
            <p className="text-sm text-[#FFF2DB]/50 mb-6">
              You have unsaved changes. What would you like to do?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  await saveDraft();
                  await logout();
                  router.push("/");
                }}
                className="w-full rounded-xl bg-[#F5A623] px-4 py-2.5 text-sm font-semibold text-[#000000] transition hover:bg-[#F5A623]/90"
              >
                Save Draft & Logout
              </button>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                Discard & Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full rounded-xl border border-[#FFF2DB]/10 px-4 py-2.5 text-sm font-medium text-[#FFF2DB]/50 transition hover:text-[#FFF2DB]/70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
