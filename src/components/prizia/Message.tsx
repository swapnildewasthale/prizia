"use client";

import { Message as MessageType } from "@/lib/prizia/types";

export default function Message({ message }: { message: MessageType }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-5 md:px-0 animate-fade-in`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] ${
          isUser
            ? "bg-[#0E0E13] text-white rounded-2xl rounded-br-md px-4 py-3"
            : "bg-white text-[#0E0E13] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[#D1D1D6]/40"
        }`}
      >
        <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-line">
          {message.content}
        </p>
      </div>
    </div>
  );
}
