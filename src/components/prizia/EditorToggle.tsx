"use client";

import { useEditor } from "./EditorContext";

export default function EditorToggle() {
  const editor = useEditor();
  if (!editor?.authenticated) return null;

  return (
    <button
      onClick={editor.toggleEditMode}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-2.5 text-xs font-medium text-[#FFF2DB] shadow-lg transition hover:border-[#F5A623]/30 hover:bg-[#111]"
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
  );
}
