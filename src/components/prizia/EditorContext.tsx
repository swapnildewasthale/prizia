"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WebsiteConfig } from "@/lib/website/types";

interface EditorContextValue {
  authenticated: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  logout: () => Promise<void>;
  draft: WebsiteConfig | null;
  activeField: string | null;
  setActiveField: (path: string | null) => void;
  updateDraft: (path: string, value: string) => void;
  saveDraft: () => Promise<void>;
  publishDraft: () => Promise<void>;
  saving: boolean;
  publishing: boolean;
  toast: string | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor() {
  return useContext(EditorContext);
}

function setByPath(obj: unknown, path: string, value: unknown): unknown {
  const keys = path.split(/[\.\[\]]+/).filter(Boolean);
  if (keys.length === 0) return value;

  const [head, ...rest] = keys;
  const isArrayIndex = /^\d+$/.test(head);

  if (rest.length === 0) {
    if (isArrayIndex) {
      const arr = Array.isArray(obj) ? [...obj] : [];
      arr[Number(head)] = value;
      return arr;
    }
    return { ...(obj as Record<string, unknown>), [head]: value };
  }

  if (isArrayIndex) {
    const arr = Array.isArray(obj) ? [...obj] : [];
    arr[Number(head)] = setByPath(arr[Number(head)], rest.join("."), value);
    return arr;
  }

  return {
    ...(obj as Record<string, unknown>),
    [head]: setByPath(
      (obj as Record<string, unknown>)[head],
      rest.join("."),
      value,
    ),
  };
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<WebsiteConfig | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const urlChecked = useRef(false);

  useEffect(() => {
    fetch("/api/studio/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.authenticated && !urlChecked.current) {
          urlChecked.current = true;
          const params = new URLSearchParams(window.location.search);
          if (params.get("edit") === "true") {
            setEditMode(true);
          }
        }
      })
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    if (editMode && !draft) {
      fetch("/api/studio/website/config")
        .then((r) => r.json())
        .then((data) => {
          if (data.draft) setDraft(data.draft);
        })
        .catch(() => {});
    }
  }, [authenticated, editMode, draft]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      if (prev) setActiveField(null);
      return !prev;
    });
  }, []);

  const updateDraft = useCallback(
    (path: string, value: string) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return setByPath(prev, path, value) as WebsiteConfig;
      });
    },
    [],
  );

  const saveDraft = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch("/api/studio/website/config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast("Draft saved");
    } catch {
      setToast("Failed to save draft");
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const publishDraft = useCallback(async () => {
    if (!draft) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/studio/website/config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      if (!res.ok) throw new Error("Save before publish failed");

      const pubRes = await fetch("/api/studio/website/publish", {
        method: "POST",
      });
      if (!pubRes.ok) throw new Error("Publish failed");
      setToast("Published!");
    } catch {
      setToast("Failed to publish");
    } finally {
      setPublishing(false);
    }
  }, [draft]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/studio/auth/logout", { method: "POST" });
    } finally {
      setAuthenticated(false);
      setEditMode(false);
      setDraft(null);
      setActiveField(null);
    }
  }, []);

  const value = useMemo<EditorContextValue>(
    () => ({
      authenticated,
      editMode,
      toggleEditMode,
      logout,
      draft,
      activeField,
      setActiveField,
      updateDraft,
      saveDraft,
      publishDraft,
      saving,
      publishing,
      toast,
    }),
    [
      authenticated,
      editMode,
      toggleEditMode,
      logout,
      draft,
      activeField,
      updateDraft,
      saveDraft,
      publishDraft,
      saving,
      publishing,
      toast,
    ],
  );

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}
