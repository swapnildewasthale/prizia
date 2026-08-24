"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { WebsiteConfig } from "@/lib/website/types";
import { EditableProperty } from "@/lib/website/editableTypes";

interface WebsiteEditorContextValue {
  authenticated: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  draft: WebsiteConfig | null;
  activeField: string | null;
  activeFieldLabel: string | null;
  activeFieldSupports: EditableProperty[];
  setActiveField: (
    path: string | null,
    label?: string | null,
    supports?: EditableProperty[],
  ) => void;
  updateDraft: (path: string, value: unknown) => void;
  saveDraft: () => Promise<void>;
  publishDraft: () => Promise<void>;
  saving: boolean;
  publishing: boolean;
  hasChanges: boolean;
  message: { type: "success" | "error"; text: string } | null;
  clearMessage: () => void;
  logout: () => Promise<void>;
  showLogoutConfirm: boolean;
  setShowLogoutConfirm: (show: boolean) => void;
}

const WebsiteEditorContext = createContext<WebsiteEditorContextValue | null>(
  null,
);

export function useWebsiteEditor() {
  const ctx = useContext(WebsiteEditorContext);
  if (!ctx)
    throw new Error(
      "useWebsiteEditor must be used within WebsiteEditorProvider",
    );
  return ctx;
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

export function WebsiteEditorProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<WebsiteConfig | null>(null);
  const [activeField, setActiveFieldState] = useState<string | null>(null);
  const [activeFieldLabel, setActiveFieldLabel] = useState<string | null>(null);
  const [activeFieldSupports, setActiveFieldSupports] = useState<
    EditableProperty[]
  >(["content"]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/studio/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        setEditMode(data.authenticated);
      })
      .catch(() => {
        setAuthenticated(false);
        setEditMode(false);
      });
  }, []);

  useEffect(() => {
    if (authenticated && !draft) {
      fetch("/api/studio/website/config")
        .then((r) => r.json())
        .then((data) => {
          if (data.draft) setDraft(data.draft);
        })
        .catch(() => {});
    }
  }, [authenticated, draft]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      if (prev) {
        setActiveFieldState(null);
        setActiveFieldLabel(null);
        setActiveFieldSupports(["content"]);
      }
      return !prev;
    });
  }, []);

  const setActiveField = useCallback(
    (
      path: string | null,
      label: string | null = null,
      supports: EditableProperty[] = ["content"],
    ) => {
      setActiveFieldState(path);
      setActiveFieldLabel(label);
      setActiveFieldSupports(supports);
    },
    [],
  );

  const updateDraft = useCallback((path: string, value: unknown) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return setByPath(prev, path, value) as WebsiteConfig;
    });
    setHasChanges(true);
    setMessage(null);
  }, []);

  const saveDraft = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/studio/website/config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      setHasChanges(false);
      setMessage({ type: "success", text: "Draft saved." });
    } catch {
      setMessage({ type: "error", text: "Failed to save draft." });
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const publishDraft = useCallback(async () => {
    if (!draft) return;
    setPublishing(true);
    setMessage(null);
    try {
      const saveRes = await fetch("/api/studio/website/config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      if (!saveRes.ok) throw new Error("Save before publish failed");

      const pubRes = await fetch("/api/studio/website/publish", {
        method: "POST",
      });
      if (!pubRes.ok) throw new Error("Publish failed");

      setHasChanges(false);
      setMessage({ type: "success", text: "Published!" });
    } catch {
      setMessage({ type: "error", text: "Failed to publish." });
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
      setActiveFieldState(null);
      setActiveFieldLabel(null);
      setActiveFieldSupports(["content"]);
      setHasChanges(false);
      setShowLogoutConfirm(false);
    }
  }, []);

  const value = useMemo<WebsiteEditorContextValue>(
    () => ({
      authenticated,
      editMode,
      toggleEditMode,
      draft,
      activeField,
      activeFieldLabel,
      activeFieldSupports,
      setActiveField,
      updateDraft,
      saveDraft,
      publishDraft,
      saving,
      publishing,
      hasChanges,
      message,
      clearMessage: () => setMessage(null),
      logout,
      showLogoutConfirm,
      setShowLogoutConfirm,
    }),
    [
      authenticated,
      editMode,
      toggleEditMode,
      draft,
      activeField,
      activeFieldLabel,
      activeFieldSupports,
      setActiveField,
      updateDraft,
      saveDraft,
      publishDraft,
      saving,
      publishing,
      hasChanges,
      message,
      logout,
      showLogoutConfirm,
    ],
  );

  return (
    <WebsiteEditorContext.Provider value={value}>
      {children}
    </WebsiteEditorContext.Provider>
  );
}
