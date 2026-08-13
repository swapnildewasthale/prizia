"use client";

interface SuggestedPromptProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function SuggestedPrompts({ suggestions, onSelect }: SuggestedPromptProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 px-5 md:px-0 animate-fade-in">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="px-4 py-2 text-sm text-[#FFF2DB]/60 bg-[#0d0d0d] border border-[#FFF2DB]/10 rounded-full hover:border-[#8B6CFF]/40 hover:text-[#8B6CFF] transition-colors duration-200 cursor-pointer"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
