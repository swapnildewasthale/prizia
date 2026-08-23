"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UploadedFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  name: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UploadsManager() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/studio/uploads");
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/studio/uploads");
        const data = await res.json();
        if (!cancelled && res.ok) {
          setFiles(data.files || []);
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/studio/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Upload failed." });
        return;
      }

      setMessage({ type: "success", text: "File uploaded." });
      await fetchFiles();
    } catch {
      setMessage({ type: "error", text: "Network error: upload failed." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDelete(file: UploadedFile) {
    setDeleting(file.pathname);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/studio/uploads?pathname=${encodeURIComponent(file.pathname)}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Delete failed." });
        return;
      }

      setMessage({ type: "success", text: "File deleted." });
      await fetchFiles();
    } catch {
      setMessage({ type: "error", text: "Network error: delete failed." });
    } finally {
      setDeleting(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setMessage({ type: "success", text: "URL copied to clipboard." });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleUpload}
        className="hidden"
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
            Uploads
          </h2>
          <p className="text-sm text-[#FFF2DB]/40 mt-1">
            {files.length} {files.length === 1 ? "file" : "files"} in media
            library
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-xl bg-[#F5A623] px-4 py-2 text-xs font-semibold text-[#000000] transition hover:bg-[#F5A623]/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5 animate-spin"
              >
                <path
                  d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M12 4.5v15m7.5-7.5h-15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Upload New
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 text-[#FFF2DB]/30 animate-spin"
          >
            <path
              d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-12">
          <div className="text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-10 w-10 text-[#FFF2DB]/15 mx-auto mb-4"
            >
              <path
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-sm font-medium text-[#FFF2DB]/50 mb-1">
              No files yet
            </h3>
            <p className="text-xs text-[#FFF2DB]/25">
              Click &quot;Upload New&quot; to add images to your media library.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.pathname}
              className="group relative rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] overflow-hidden"
            >
              <div className="aspect-square bg-[#111111] flex items-center justify-center overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3">
                <p className="text-xs text-[#FFF2DB]/60 truncate">{file.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-[#FFF2DB]/25">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-[10px] text-[#FFF2DB]/25">
                    {formatDate(file.uploadedAt)}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="rounded-lg bg-[#FFF2DB]/10 px-3 py-1.5 text-xs text-[#FFF2DB]/80 hover:bg-[#FFF2DB]/20 transition"
                  title="Copy URL"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  disabled={deleting === file.pathname}
                  className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition disabled:opacity-40"
                  title="Delete"
                >
                  {deleting === file.pathname ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5 animate-spin"
                    >
                      <path
                        d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
