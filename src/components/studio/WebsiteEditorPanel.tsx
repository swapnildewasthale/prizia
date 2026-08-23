"use client";

import { useWebsiteEditor } from "./WebsiteEditorContext";

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

const FIELD_LABELS: Record<string, string> = {
  "site.name": "Site Name",
  "site.tagline": "Site Tagline",
  "site.description": "Site Description",
  "homepage.hero.headline": "Hero Headline",
  "homepage.hero.sub": "Hero Subtext",
  "homepage.priziaEntry.label": "Prizia Entry Label",
  "homepage.priziaEntry.placeholder": "Input Placeholder",
  "homepage.whatIs.heading": "What Is Heading",
  "homepage.galleryPreview.heading": "Gallery Preview Heading",
  "homepage.galleryPreview.description": "Gallery Preview Description",
  "homepage.priziaInvitation.heading": "Invitation Heading",
  "homepage.priziaInvitation.sub": "Invitation Subtext",
  "footer.tagline": "Footer Tagline",
  "footer.copyright": "Footer Copyright",
};

function getFieldLabel(path: string): string {
  if (FIELD_LABELS[path]) return FIELD_LABELS[path];

  const match = path.match(
    /^(homepage\.whatIs\.paragraphs)\[(\d+)\]$/,
  );
  if (match) return `Paragraph ${Number(match[2]) + 1}`;

  const valueMatch = path.match(
    /^(homepage\.values\[(\d+)\]\.(title|description))$/,
  );
  if (valueMatch) {
    const labels: Record<string, string> = {
      title: "Title",
      description: "Description",
    };
    return `Value ${Number(valueMatch[2]) + 1} ${labels[valueMatch[3]]}`;
  }

  const domainMatch = path.match(
    /^(homepage\.currentlyExploring\.domains\[(\d+)\]\.(name|description))$/,
  );
  if (domainMatch) {
    const labels: Record<string, string> = {
      name: "Name",
      description: "Description",
    };
    return `Domain ${Number(domainMatch[2]) + 1} ${labels[domainMatch[3]]}`;
  }

  const navMatch = path.match(/^nav\[(\d+)\]\.(label|href)$/);
  if (navMatch) {
    const labels: Record<string, string> = { label: "Label", href: "Link" };
    return `Nav ${Number(navMatch[2]) + 1} ${labels[navMatch[3]]}`;
  }

  const footerLinkMatch = path.match(
    /^footer\.links\[(\d+)\]\.(label|href)$/,
  );
  if (footerLinkMatch) {
    const labels: Record<string, string> = { label: "Label", href: "Link" };
    return `Footer Link ${Number(footerLinkMatch[2]) + 1} ${labels[footerLinkMatch[3]]}`;
  }

  return path;
}

export default function WebsiteEditorPanel({ onBack }: WebsiteEditorPanelProps) {
  const editor = useWebsiteEditor();
  if (!editor.editMode || !editor.activeField || !editor.draft) return null;

  const currentValue = getByPath(editor.draft, editor.activeField);
  const isMultiline =
    typeof currentValue === "string" && currentValue.length > 80;

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
          {getFieldLabel(editor.activeField)}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-[#FFF2DB]/30">
          {editor.activeField}
        </label>
        {isMultiline ? (
          <textarea
            value={typeof currentValue === "string" ? currentValue : ""}
            onChange={(e) =>
              editor.updateDraft(editor.activeField!, e.target.value)
            }
            className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
            rows={6}
          />
        ) : (
          <input
            type="text"
            value={typeof currentValue === "string" ? currentValue : ""}
            onChange={(e) =>
              editor.updateDraft(editor.activeField!, e.target.value)
            }
            className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
          />
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
