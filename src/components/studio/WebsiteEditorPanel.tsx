"use client";

import { useWebsiteEditor } from "./WebsiteEditorContext";
import {
  COLOR_PRESETS,
  ALIGNMENT_OPTIONS,
} from "@/lib/website/editableTypes";
import type { Alignment } from "@/lib/website/types";

interface WebsiteEditorPanelProps {
  onBack: () => void;
}

function getByPath(obj: unknown, path: string): unknown {
  return path
    .split(/[\.\[\]]+/)
    .filter(Boolean)
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    );
}

function getStylePath(fieldPath: string, styleKey: string): string {
  const parts = fieldPath.split(/[\.\[\]]+/).filter(Boolean);
  const last = parts.pop()!;
  const parent = parts.join(".");
  return parent ? `${parent}.${last}Style.${styleKey}` : `${last}Style.${styleKey}`;
}

function getButtonCtaPath(fieldPath: string): string {
  return fieldPath.replace(/\.heading$/, ".cta").replace(/\.sub$/, ".cta");
}

export default function WebsiteEditorPanel({ onBack }: WebsiteEditorPanelProps) {
  const editor = useWebsiteEditor();
  if (!editor.editMode || !editor.activeField || !editor.draft) return null;

  const currentValue = getByPath(editor.draft, editor.activeField);
  const isMultiline =
    typeof currentValue === "string" && currentValue.length > 80;
  const supports = editor.activeFieldSupports;

  function updateValue(value: unknown) {
    editor.updateDraft(editor.activeField!, value);
  }

  function updateStyle(key: string, value: unknown) {
    const stylePath = getStylePath(editor.activeField!, key);
    const current = getByPath(editor.draft, stylePath);
    if (current === value) return;
    editor.updateDraft(stylePath, value);
  }

  function getStyleValue(key: string): unknown {
    const stylePath = getStylePath(editor.activeField!, key);
    return getByPath(editor.draft, stylePath);
  }

  // For button elements: check if there's a sibling cta object
  const isButton = supports.includes("link") && supports.includes("bgColor");
  let ctaPath = "";
  let ctaObj: Record<string, unknown> | null = null;
  if (isButton) {
    ctaPath = getButtonCtaPath(editor.activeField);
    const found = getByPath(editor.draft, ctaPath);
    if (found && typeof found === "object") {
      ctaObj = found as Record<string, unknown>;
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-[#FFF2DB]/5 px-4 py-3">
        <button
          onClick={onBack}
          className="p-1 text-[#FFF2DB]/50 hover:text-[#FFF2DB]/80 transition"
          aria-label="Back to navigation"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h3 className="font-[family-name:var(--font-audiowide)] text-xs text-[#FFF2DB]">
          {editor.activeFieldLabel}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Content */}
        {supports.includes("content") && (
          <FieldGroup label="Content">
            {isButton && ctaObj ? (
              <input
                type="text"
                value={typeof ctaObj.text === "string" ? ctaObj.text : ""}
                onChange={(e) =>
                  editor.updateDraft(`${ctaPath}.text`, e.target.value)
                }
                className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
              />
            ) : isMultiline ? (
              <textarea
                value={typeof currentValue === "string" ? currentValue : ""}
                onChange={(e) => updateValue(e.target.value)}
                className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
                rows={6}
              />
            ) : (
              <input
                type="text"
                value={typeof currentValue === "string" ? currentValue : ""}
                onChange={(e) => updateValue(e.target.value)}
                className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
              />
            )}
          </FieldGroup>
        )}

        {/* Link */}
        {supports.includes("link") && (
          <FieldGroup label="Link">
            {isButton && ctaObj ? (
              <input
                type="text"
                value={typeof ctaObj.href === "string" ? ctaObj.href : ""}
                onChange={(e) =>
                  editor.updateDraft(`${ctaPath}.href`, e.target.value)
                }
                placeholder="/page or https://..."
                className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
              />
            ) : (
              <input
                type="text"
                value={typeof currentValue === "string" ? currentValue : ""}
                onChange={(e) => updateValue(e.target.value)}
                placeholder="/page or https://..."
                className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
              />
            )}
          </FieldGroup>
        )}

        {/* Visibility */}
        {supports.includes("visible") && (
          <FieldGroup label="Visibility">
            <ToggleControl
              value={isButton && ctaObj ? (ctaObj.visible !== false) : (currentValue !== false)}
              onChange={(val) => {
                if (isButton && ctaObj) {
                  editor.updateDraft(`${ctaPath}.visible`, val);
                } else {
                  updateValue(val);
                }
              }}
            />
          </FieldGroup>
        )}

        {/* Alignment */}
        {supports.includes("alignment") && (
          <FieldGroup label="Alignment">
            <AlignmentControl
              value={(getStyleValue("alignment") as Alignment) ?? "center"}
              onChange={(val) => updateStyle("alignment", val)}
            />
          </FieldGroup>
        )}

        {/* Text Color */}
        {supports.includes("textColor") && (
          <FieldGroup label="Text Color">
            <ColorPresets
              presets={COLOR_PRESETS.text}
              value={(getStyleValue("color") as string | null) ?? null}
              onChange={(val) => updateStyle("color", val)}
            />
          </FieldGroup>
        )}

        {/* Background Color (buttons) */}
        {supports.includes("bgColor") && (
          <FieldGroup label="Background">
            <ColorPresets
              presets={COLOR_PRESETS.buttonBg}
              value={
                (isButton
                  ? ((ctaObj?.style as Record<string, unknown>)?.bgColor as string | null)
                  : (getStyleValue("bgColor") as string | null)) ?? null
              }
              onChange={(val) => {
                if (isButton) {
                  editor.updateDraft(`${ctaPath}.style.bgColor`, val);
                } else {
                  updateStyle("bgColor", val);
                }
              }}
            />
          </FieldGroup>
        )}
      </div>

      <div className="border-t border-[#FFF2DB]/5 px-4 py-3">
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-2.5 text-xs font-medium text-[#FFF2DB]/70 transition hover:border-[#FFF2DB]/20 hover:text-[#FFF2DB]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-[#FFF2DB]/30">
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleControl({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center gap-3"
    >
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? "bg-[#F5A623]" : "bg-[#FFF2DB]/10"
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-xs text-[#FFF2DB]/60">
        {value ? "Visible" : "Hidden"}
      </span>
    </button>
  );
}

function AlignmentControl({
  value,
  onChange,
}: {
  value: Alignment;
  onChange: (val: Alignment) => void;
}) {
  return (
    <div className="flex gap-1">
      {ALIGNMENT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            value === opt.value
              ? "bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20"
              : "bg-[#FFF2DB]/5 text-[#FFF2DB]/40 border border-[#FFF2DB]/5 hover:text-[#FFF2DB]/60"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ColorPresets({
  presets,
  value,
  onChange,
}: {
  presets: readonly { label: string; value: string | null }[];
  value: string | null;
  onChange: (val: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {presets.map((preset) => (
        <button
          key={preset.label}
          onClick={() => onChange(preset.value)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition border ${
            value === preset.value
              ? "border-[#F5A623]/30 bg-[#F5A623]/10 text-[#F5A623]"
              : "border-[#FFF2DB]/5 bg-[#FFF2DB]/5 text-[#FFF2DB]/40 hover:text-[#FFF2DB]/60"
          }`}
        >
          {preset.value && (
            <span
              className="h-2.5 w-2.5 rounded-full border border-[#FFF2DB]/10"
              style={{ backgroundColor: preset.value }}
            />
          )}
          {preset.label}
        </button>
      ))}
    </div>
  );
}
