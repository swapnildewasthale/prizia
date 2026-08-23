"use client";

import { useWebsiteEditor } from "@/components/studio/WebsiteEditorContext";
import { EditableProperty } from "@/lib/website/editableTypes";

interface EditableProps {
  path: string;
  label: string;
  children: React.ReactNode;
  supports?: EditableProperty[];
}

export default function Editable({
  path,
  label,
  children,
  supports = ["content"],
}: EditableProps) {
  const editor = useWebsiteEditor();

  if (!editor?.editMode) {
    return <>{children}</>;
  }

  const isActive = editor.activeField === path;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isActive) {
      editor.setActiveField(null);
    } else {
      editor.setActiveField(path, label, supports);
    }
  }

  return (
    <span
      data-editable={path}
      onClick={handleClick}
      className="relative cursor-pointer rounded-sm transition"
      style={{
        outline: isActive
          ? "2px solid #F5A623"
          : "1px dashed rgba(245,166,35,0.3)",
        outlineOffset: "2px",
        display: "inline",
      }}
      title={`Edit: ${label}`}
    >
      {children}
      {isActive && (
        <span
          className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap rounded bg-[#F5A623] px-1.5 py-0.5 text-xs font-medium text-black"
          style={{ fontSize: "10px" }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
