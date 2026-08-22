"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { PriziaConfig } from "@/lib/studio/types";
import { defaultConfig } from "@/lib/studio/defaults";

export type StudioSection =
  | "prizia-overview"
  | "prizia-foundation"
  | "prizia-behavior"
  | "prizia-communication"
  | "prizia-knowledge"
  | "prizia-test";

interface StudioContextValue {
  draft: PriziaConfig;
  hasChanges: boolean;
  saving: boolean;
  publishing: boolean;
  message: { type: "success" | "error"; text: string } | null;
  activeSection: StudioSection;
  setActiveSection: (s: StudioSection) => void;
  updateDraft: (updates: Partial<PriziaConfig>) => void;
  saveDraft: () => Promise<void>;
  publishDraft: () => Promise<void>;
  clearMessage: () => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PriziaConfig>({ ...defaultConfig });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<StudioSection>("prizia-overview");

  useEffect(() => {
    fetch("/api/studio/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.draft) setDraft(data.draft);
      })
      .catch(() => {});
  }, []);

  const updateDraft = useCallback((updates: Partial<PriziaConfig>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
    setMessage(null);
  }, []);

  const saveDraft = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/studio/config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        setHasChanges(false);
        setMessage({ type: "success", text: "Draft saved." });
      } else {
        setMessage({ type: "error", text: "Failed to save draft." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save draft." });
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const publishDraft = useCallback(async () => {
    setPublishing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/studio/publish", { method: "POST" });
      if (res.ok) {
        setMessage({ type: "success", text: "Published! Live Prizia now uses this configuration." });
        setHasChanges(false);
      } else {
        setMessage({ type: "error", text: "Failed to publish." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to publish." });
    } finally {
      setPublishing(false);
    }
  }, []);

  const clearMessage = useCallback(() => setMessage(null), []);

  return (
    <StudioContext.Provider
      value={{
        draft,
        hasChanges,
        saving,
        publishing,
        message,
        activeSection,
        setActiveSection,
        updateDraft,
        saveDraft,
        publishDraft,
        clearMessage,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}
