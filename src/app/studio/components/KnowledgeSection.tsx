"use client";

import { useState } from "react";
import { KnowledgeEntry } from "@/lib/studio/types";
import { TextField } from "./TextField";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function KnowledgeSection({
  knowledge,
  onChange,
}: {
  knowledge: KnowledgeEntry[];
  onChange: (k: KnowledgeEntry[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  function addEntry() {
    const entry: KnowledgeEntry = {
      id: generateId(),
      title: "",
      category: "",
      content: "",
      active: true,
    };
    onChange([...knowledge, entry]);
    setEditingId(entry.id);
  }

  function updateEntry(id: string, updates: Partial<KnowledgeEntry>) {
    onChange(knowledge.map((k) => (k.id === id ? { ...k, ...updates } : k)));
  }

  function removeEntry(id: string) {
    onChange(knowledge.filter((k) => k.id !== id));
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
            Knowledge
          </h2>
          <p className="text-sm text-[#FFF2DB]/40">
            Additional knowledge entries that supplement prizia.md.
          </p>
        </div>
        <button
          onClick={addEntry}
          className="rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-2.5 text-xs font-medium text-[#F5A623] transition hover:bg-[#F5A623]/20 shrink-0"
        >
          + Add Entry
        </button>
      </div>

      {knowledge.length === 0 && (
        <p className="text-sm text-[#FFF2DB]/30 py-8 text-center">
          No additional knowledge entries yet.
        </p>
      )}

      <div className="space-y-3">
        {knowledge.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] overflow-hidden"
          >
            <button
              onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    entry.active ? "bg-green-400" : "bg-[#FFF2DB]/20"
                  }`}
                />
                <span className="text-sm text-[#FFF2DB]">
                  {entry.title || "Untitled entry"}
                </span>
                {entry.category && (
                  <span className="text-xs text-[#FFF2DB]/30 rounded-full border border-[#FFF2DB]/10 px-2 py-0.5">
                    {entry.category}
                  </span>
                )}
              </div>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 text-[#FFF2DB]/30 transition-transform ${
                  editingId === entry.id ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {editingId === entry.id && (
              <div className="border-t border-[#FFF2DB]/5 px-4 py-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="Title"
                    value={entry.title}
                    onChange={(v) => updateEntry(entry.id, { title: v })}
                    placeholder="Entry title"
                  />
                  <TextField
                    label="Category"
                    value={entry.category}
                    onChange={(v) => updateEntry(entry.id, { category: v })}
                    placeholder="e.g. AI, Photography"
                  />
                </div>
                <TextField
                  label="Content"
                  value={entry.content}
                  onChange={(v) => updateEntry(entry.id, { content: v })}
                  multiline
                  placeholder="Knowledge content..."
                />
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry.active}
                      onChange={(e) =>
                        updateEntry(entry.id, { active: e.target.checked })
                      }
                      className="rounded border-[#FFF2DB]/20 bg-[#0a0a0a] text-[#F5A623] focus:ring-[#F5A623]"
                    />
                    <span className="text-sm text-[#FFF2DB]/60">Active</span>
                  </label>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-sm text-red-400/60 hover:text-red-400 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
