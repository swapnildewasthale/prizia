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
            ? "bg-[#FFF2DB] text-[#000000] rounded-2xl rounded-br-md px-4 py-3"
            : "bg-[#0d0d0d] text-[#FFF2DB] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[#FFF2DB]/10"
        }`}
      >
        <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-line">
          {message.content}
        </p>
      </div>
    </div>
  );
}
