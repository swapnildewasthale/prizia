"use client";

import { useState, useRef, useEffect } from "react";
import { PriziaState } from "@/lib/prizia/types";

interface ConversationInputProps {
  priziaState: PriziaState;
  onSend: (message: string) => void;
}

export default function ConversationInput({ priziaState, onSend }: ConversationInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isThinking = priziaState === "thinking";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isThinking) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-5 md:px-0">
      <div className="flex items-end gap-2 bg-[#111111] border border-[#FFF2DB]/10 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#8B6CFF]/30 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Prizia anything about what we're exploring..."
          rows={1}
          disabled={isThinking}
          className="flex-1 resize-none bg-transparent text-sm md:text-[15px] text-[#FFF2DB] placeholder:text-[#FFF2DB]/25 outline-none leading-relaxed disabled:opacity-50"
          aria-label="Ask Prizia a question"
        />
        {/* Mic placeholder — visual only, not functional yet */}
        <button
          type="button"
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[#FFF2DB]/30 hover:text-[#FFF2DB]/60 hover:bg-[#FFF2DB]/5 transition-colors"
          aria-label="Voice input (coming soon)"
          title="Voice input coming soon"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={isThinking || !value.trim()}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5A623] text-[#000000] hover:bg-[#F5A623] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
