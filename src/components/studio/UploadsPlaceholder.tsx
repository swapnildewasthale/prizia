"use client";

export function UploadsPlaceholder() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
      <div className="space-y-6">
        <div>
          <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
            Uploads
          </h2>
          <p className="text-sm text-[#FFF2DB]/40 mt-1">
            Central media library for managing images and assets.
          </p>
        </div>

        <div className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-8">
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
              Media Library
            </h3>
            <p className="text-xs text-[#FFF2DB]/25">
              Upload and manage images, documents, and other assets. Coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
