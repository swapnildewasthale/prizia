"use client";

import { useState, useRef, useEffect } from "react";
import { Message, PriziaState, Domain } from "@/lib/prizia/types";
import { getPriziaResponse } from "@/lib/prizia/mockResponses";
import MessageComponent from "./Message";
import SuggestedPrompts from "./SuggestedPrompts";
import ThinkingIndicator from "./ThinkingIndicator";
import ConversationInput from "./ConversationInput";

interface ConversationProps {
  domains: Domain[];
}

export default function Conversation({ domains }: ConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [priziaState, setPriziaState] = useState<PriziaState>("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, priziaState]);

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setSuggestions([]);
    setPriziaState("thinking");

    // FUTURE: Replace mock engine with real AI API call
    const delay = 700 + Math.random() * 500;
    setTimeout(() => {
      const response = getPriziaResponse(text, messages, domains);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text,
        mode: response.mode,
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setPriziaState("responding");

      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }

      setTimeout(() => setPriziaState("idle"), 1500);
    }, delay);
  };

  const handleSuggestion = (text: string) => {
    handleSend(text);
  };

  // --- Welcome State ---
  if (!hasConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen pt-20 pb-32">
        <div className="flex flex-col items-center text-center max-w-lg px-5">
          <img
            src="/prizia-icon.png"
            alt="Prizia logo"
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
          />
          <h2 className="mt-8 text-3xl md:text-[40px] font-semibold text-[#FFF2DB] tracking-tight">
            Hi, I&apos;m Prizia.
          </h2>
          <p className="mt-3 text-base md:text-lg text-[#FFF2DB]/50 leading-relaxed">
            I know what&apos;s happening at Prizmistic.
            <br />
            What are you curious about?
          </p>

          <div className="mt-8">
            <SuggestedPrompts
              suggestions={["Explore AI", "What's happening here?", "Tell me about Prizmistic"]}
              onSelect={handleSuggestion}
            />
          </div>

          <div className="w-full max-w-xl mt-10">
            <ConversationInput priziaState={priziaState} onSend={handleSend} />
          </div>

          <p className="mt-6 text-xs text-[#FFF2DB]/30">
            Currently exploring · <span className="font-medium text-[#FFF2DB]/60">AI</span>
          </p>
        </div>
      </div>
    );
  }

  // --- Conversation State ---
  return (
    <div className="flex-1 flex flex-col min-h-screen pt-20 pb-32">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 md:px-8 max-w-3xl mx-auto w-full py-6 space-y-4"
      >
        {messages.map((msg) => (
          <MessageComponent key={msg.id} message={msg} />
        ))}
        <ThinkingIndicator state={priziaState} />

        {suggestions.length > 0 && priziaState === "idle" && (
          <div className="py-2">
            <SuggestedPrompts suggestions={suggestions} onSelect={handleSuggestion} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#000000]/90 backdrop-blur-sm py-4">
        <ConversationInput priziaState={priziaState} onSend={handleSend} />
        <div className="text-center mt-2">
          <p className="text-[11px] text-[#FFF2DB]/25">
            Currently exploring · <span className="font-medium text-[#FFF2DB]/50">AI</span>
          </p>
        </div>
      </div>
    </div>
  );
}
