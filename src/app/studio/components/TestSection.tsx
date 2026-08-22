"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Message, PriziaResponse } from "@/lib/prizia/types";
import { PriziaConfig } from "@/lib/studio/types";

async function fetchTestResponse(
  message: string,
  conversationHistory: Message[],
  config: PriziaConfig
): Promise<PriziaResponse> {
  const res = await fetch("/api/studio/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationHistory, config }),
  });

  if (!res.ok) {
    return {
      mode: "CHAT",
      text: "Something went wrong while testing. Try again.",
      suggestions: [],
    };
  }

  return res.json();
}

export function TestSection({ config }: { config: PriziaConfig }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const historyRef = useRef<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = useCallback(
    async (text: string) => {
      const value = text.trim();
      if (!value || isThinking) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: value,
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setIsThinking(true);

      try {
        const response = await fetchTestResponse(
          value,
          historyRef.current,
          config
        );

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response.text,
            mode: response.mode,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Something went wrong while testing. Try again.",
            mode: "CHAT",
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking, config]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
          Test Prizia
        </h2>
        <p className="text-sm text-[#FFF2DB]/40">
          Chat with Prizia using your current Draft configuration.
          Changes here do not affect the live public Prizia.
        </p>
      </div>

      <div className="rounded-xl border border-[#F5A623]/20 bg-[#F5A623]/5 px-4 py-2.5 text-xs text-[#F5A623]">
        Testing Draft Configuration
      </div>

      <div className="rounded-xl border border-[#FFF2DB]/5 bg-[#0a0a0a] p-3 sm:p-4 min-h-[250px] sm:min-h-[300px] max-h-[50vh] sm:max-h-[500px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-[#FFF2DB]/20 text-center py-12">
            Start a conversation to test your draft configuration.
          </p>
        )}

        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "user"
                  ? "text-right"
                  : "text-left"
              }
            >
              <div
                className={`inline-block max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-[#FFF2DB] text-[#000000]"
                    : "border border-[#FFF2DB]/10 bg-[#111111] text-[#FFF2DB]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isThinking && (
            <p className="text-sm text-[#FFF2DB]/30">Prizia is thinking...</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 sticky bottom-0 bg-[#000000] py-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:relative">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Prizia anything..."
          disabled={isThinking}
          className="flex-1 rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-3 text-sm text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:outline-none focus:border-[#F5A623]/40 disabled:opacity-50 min-h-[44px]"
        />
        <button
          type="submit"
          disabled={!message.trim() || isThinking}
          className="rounded-xl bg-[#F5A623] px-5 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#F5A623]/90 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] min-w-[60px]"
        >
          Send
        </button>
      </form>
    </div>
  );
}
