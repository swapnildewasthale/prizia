"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Message, PriziaResponse } from "@/lib/prizia/types";
import NavBar from "./NavBar";

const prompts = ["Explore AI", "What's happening here?", "Tell me about Prizmistic"];

function getInitialMessages(searchParams: ReturnType<typeof useSearchParams>): Message[] {
  const q = searchParams.get("q");
  if (!q?.trim()) return [];
  return [
    {
      id: crypto.randomUUID(),
      role: "user",
      content: q.trim(),
    },
  ];
}

async function fetchPriziaResponse(
  message: string,
  conversationHistory: Message[]
): Promise<PriziaResponse> {
  const res = await fetch("/api/prizia/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationHistory }),
  });

  if (!res.ok) {
    return {
      mode: "CHAT",
      text: "Something went wrong while I was thinking. Try asking me again.",
      suggestions: [],
    };
  }

  return res.json();
}

export default function PriziaShell() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(searchParams));
  const [isThinking, setIsThinking] = useState(() => !!searchParams.get("q")?.trim());
  const historyRef = useRef<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (messages.length !== 1 || messages[0].role !== "user" || isThinking === false) return;
    const text = messages[0].content;

    let cancelled = false;
    fetchPriziaResponse(text, []).then((response) => {
      if (cancelled) return;
      setMessages((prev) => [
        prev[0],
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.text,
          mode: response.mode,
        },
      ]);
      setIsThinking(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const value = text.trim();
      if (!value || isThinking) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: value,
      };

      setMessages((currentMessages) => [...currentMessages, userMessage]);
      setMessage("");
      setIsThinking(true);

      try {
        const response = await fetchPriziaResponse(value, historyRef.current);

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response.text,
            mode: response.mode,
          },
        ]);
      } catch {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Something went wrong while I was thinking. Try asking me again.",
            mode: "CHAT",
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(message);
  };

  const input = (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center rounded-[1.35rem] border border-[#FFF2DB]/10 bg-[#111111] p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.4)]"
    >
      <label htmlFor="prizia-message" className="sr-only">
        Ask Prizia a question
      </label>
      <input
        id="prizia-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Ask Prizia anything about what we're exploring..."
        className="prizia-input min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-medium text-[#FFF2DB] placeholder:text-[#FFF2DB]/25 focus:outline-none sm:px-5"
      />
      <button
        type="submit"
        disabled={!message.trim() || isThinking}
        aria-label="Send message"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#F5A623] via-[#F5A623] to-[#F5A623] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#000000]" aria-hidden="true">
          <path d="M4.5 4.2 20 11.1a1 1 0 0 1 0 1.8L4.5 19.8l2.3-6.1a1 1 0 0 0 0-.7L4.5 4.2Zm3.3 3.2 1 3.1h6.3L7.8 7.4Zm0 9.2 7.3-3.1H8.8l-1 3.1Z" />
        </svg>
      </button>
    </form>
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#000000] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB]">
      <NavBar />

      {messages.length === 0 ? (
        <main className="flex min-h-[calc(100vh-112px)] items-center justify-center px-5 pb-24 pt-28 sm:px-10">
          <section className="flex w-full max-w-3xl flex-col items-center text-center">
            <div aria-hidden="true" className="mb-5 flex h-28 items-center justify-center sm:mb-7">
              <Image src="/Prizia icon light.png" alt="" width={112} height={112} priority className="h-28 w-28 object-contain" />
            </div>
            <h1 className="font-[family-name:var(--font-audiowide)] text-3xl font-normal tracking-[-0.055em] text-[#FFF2DB] sm:text-5xl">
              Hi, I&apos;m Prizia.
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-[#FFF2DB]/70 sm:text-2xl">
              I know what&apos;s happening at Prizmistic.
              <br />
              What are you curious about?
            </p>

            <div className="mt-16 flex flex-wrap justify-center gap-2.5 sm:mt-20">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-[#FFF2DB]/10 bg-[#0d0d0d] px-4 py-2.5 text-sm font-normal text-[#F5A623] transition hover:border-[#F5A623]/40 hover:bg-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-8 w-full max-w-3xl">{input}</div>
          </section>
        </main>
      ) : (
        <main className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-3xl flex-col px-5 pb-32 pt-20 sm:px-10">
          <div className="flex flex-1 flex-col gap-5">
            {messages.map((chatMessage) => (
              <article
                key={chatMessage.id}
                className={chatMessage.role === "user" ? "self-end max-w-[76%] rounded-2xl rounded-br-sm bg-[#FFF2DB] px-5 py-3.5 text-[#000000] shadow-[0_8px_22px_rgba(0,0,0,0.3)]" : "max-w-[82%] rounded-2xl rounded-bl-sm border border-[#FFF2DB]/10 bg-[#0d0d0d] px-5 py-4 text-[#FFF2DB] shadow-[0_8px_22px_rgba(0,0,0,0.25)]"}
              >
                <p className="text-sm font-medium leading-relaxed sm:text-base">{chatMessage.content}</p>
              </article>
            ))}
            {isThinking && <p className="text-sm text-[#FFF2DB]/40">Prizia is thinking…</p>}
            <div ref={messagesEndRef} />
          </div>
          <div className="fixed inset-x-0 bottom-0 border-t border-[#FFF2DB]/5 bg-[#000000]/95 px-5 py-5 backdrop-blur sm:px-10">
            <div className="mx-auto w-full max-w-3xl">{input}</div>
          </div>
        </main>
      )}
    </div>
  );
}
