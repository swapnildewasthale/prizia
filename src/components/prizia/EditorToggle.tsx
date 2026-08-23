"use client";

import { useEditor } from "./EditorContext";

export default function EditorToggle() {
  const editor = useEditor();
  if (!editor?.authenticated) return null;

  return (
    <>
      {/* Left side: Edit/Exit Edit + Logout */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
        <button
          onClick={editor.toggleEditMode}
          className="flex items-center gap-2 rounded-full border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-2.5 text-xs font-medium text-[#FFF2DB] shadow-lg transition hover:border-[#F5A623]/30 hover:bg-[#111]"
          title={editor.editMode ? "Exit edit mode" : "Enter edit mode"}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
          >
            <path
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {editor.editMode ? "Exit Edit" : "Edit"}
        </button>
        <button
          onClick={editor.logout}
          className="flex items-center gap-2 rounded-full border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-2.5 text-xs font-medium text-[#FFF2DB]/70 shadow-lg transition hover:border-red-500/30 hover:bg-[#111] hover:text-[#FFF2DB]"
          title="Logout"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
          >
            <path
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Logout
        </button>
      </div>

      {/* Right side: Go to Studio */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.open("/studio", "_blank")}
          className="flex items-center gap-2 rounded-full border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-2.5 text-xs font-medium text-[#FFF2DB]/70 shadow-lg transition hover:border-[#4DD9D0]/30 hover:bg-[#111] hover:text-[#FFF2DB]"
          title="Go to Studio"
        >
          Go to Studio
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
          >
            <path
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
