"use client";

export function TextField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#FFF2DB]/60">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-3 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:outline-none focus:border-[#F5A623]/40 resize-y min-h-[120px]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-3 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:outline-none focus:border-[#F5A623]/40"
        />
      )}
    </div>
  );
}
