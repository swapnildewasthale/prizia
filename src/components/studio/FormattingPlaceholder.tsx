"use client";

export function FormattingPlaceholder() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
      <div className="space-y-6">
        <div>
          <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
            Global Formatting
          </h2>
          <p className="text-sm text-[#FFF2DB]/40 mt-1">
            Site-wide typography, colors, and layout controls.
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
                d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-sm font-medium text-[#FFF2DB]/50 mb-1">
              Formatting Controls
            </h3>
            <p className="text-xs text-[#FFF2DB]/25">
              Global typography, spacing, and color settings. Coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
