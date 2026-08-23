"use client";

import { useEditor } from "./EditorContext";

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
    const labels: Record<string, string> = { title: "Title", description: "Description" };
    return `Value ${Number(valueMatch[2]) + 1} ${labels[valueMatch[3]]}`;
  }

  const domainMatch = path.match(
    /^(homepage\.currentlyExploring\.domains\[(\d+)\]\.(name|description))$/,
  );
  if (domainMatch) {
    const labels: Record<string, string> = { name: "Name", description: "Description" };
    return `Domain ${Number(domainMatch[2]) + 1} ${labels[domainMatch[3]]}`;
  }

  const navMatch = path.match(/^nav\[(\d+)\]\.(label|href)$/);
  if (navMatch) {
    const labels: Record<string, string> = { label: "Label", href: "Link" };
    return `Nav ${Number(navMatch[2]) + 1} ${labels[navMatch[3]]}`;
  }

  const footerLinkMatch = path.match(/^footer\.links\[(\d+)\]\.(label|href)$/);
  if (footerLinkMatch) {
    const labels: Record<string, string> = { label: "Label", href: "Link" };
    return `Footer Link ${Number(footerLinkMatch[2]) + 1} ${labels[footerLinkMatch[3]]}`;
  }

  return path;
}

export default function EditorPanel() {
  const editor = useEditor();
  if (!editor?.editMode || !editor.activeField || !editor.draft) return null;

  const currentValue = getByPath(editor.draft, editor.activeField);
  const isMultiline =
    typeof currentValue === "string" && currentValue.length > 80;

  return (
    <div
      className="fixed top-0 right-0 z-50 flex h-full w-80 flex-col border-l border-[#FFF2DB]/10 bg-[#0a0a0a] shadow-2xl sm:w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-[#FFF2DB]/5 px-4 py-3">
        <h3 className="font-[family-name:var(--font-audiowide)] text-xs text-[#FFF2DB]">
          {getFieldLabel(editor.activeField)}
        </h3>
        <button
          onClick={() => editor.setActiveField(null)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#FFF2DB]/50 transition hover:bg-[#FFF2DB]/10 hover:text-[#FFF2DB]"
          aria-label="Close editor"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-[#FFF2DB]/30">
          {editor.activeField}
        </label>
        {isMultiline ? (
          <textarea
            value={typeof currentValue === "string" ? currentValue : ""}
            onChange={(e) => editor.updateDraft(editor.activeField!, e.target.value)}
            className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
            rows={6}
          />
        ) : (
          <input
            type="text"
            value={typeof currentValue === "string" ? currentValue : ""}
            onChange={(e) => editor.updateDraft(editor.activeField!, e.target.value)}
            className="w-full rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:border-[#F5A623]/50 focus:outline-none"
          />
        )}
      </div>

      <div className="border-t border-[#FFF2DB]/5 px-4 py-3 flex gap-2">
        <button
          onClick={editor.saveDraft}
          disabled={editor.saving}
          className="flex-1 rounded-lg border border-[#FFF2DB]/10 bg-[#111] px-3 py-2 text-xs font-medium text-[#FFF2DB] transition hover:bg-[#222] disabled:opacity-50"
        >
          {editor.saving ? "Saving…" : "Save Draft"}
        </button>
        <button
          onClick={editor.publishDraft}
          disabled={editor.publishing}
          className="flex-1 rounded-lg bg-[#F5A623] px-3 py-2 text-xs font-medium text-black transition hover:bg-[#F5A623]/90 disabled:opacity-50"
        >
          {editor.publishing ? "Publishing…" : "Publish"}
        </button>
      </div>

      {editor.toast && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <div className="rounded-lg bg-[#F5A623] px-3 py-1.5 text-xs font-medium text-black shadow-lg">
            {editor.toast}
          </div>
        </div>
      )}
    </div>
  );
}
