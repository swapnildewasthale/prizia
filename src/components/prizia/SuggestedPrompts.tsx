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
          className="px-4 py-2 text-sm text-[#33333D] bg-white border border-[#D1D1D6] rounded-full hover:border-[#6E47EB] hover:text-[#6E47EB] transition-colors duration-200 cursor-pointer"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
