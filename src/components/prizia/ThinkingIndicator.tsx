"use client";

import { PriziaState } from "@/lib/prizia/types";

interface ThinkingIndicatorProps {
  state: PriziaState;
}

export default function ThinkingIndicator({ state }: ThinkingIndicatorProps) {
  if (state !== "thinking") return null;

  return (
    <div className="flex items-start gap-3 px-5 md:px-0 py-3 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B6CFF] to-[#4DD9D0] flex-shrink-0 mt-0.5" />
      <div className="flex items-center gap-2 text-sm text-[#FFF2DB]/40">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] animate-bounce [animation-delay:300ms]" />
        </div>
        <span>Thinking</span>
      </div>
    </div>
  );
}
