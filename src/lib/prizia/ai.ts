import { Message, PriziaResponse } from "./types";
import { PriziaConfig } from "@/lib/studio/types";
import { getPriziaSystemInstructionAsync, buildSystemInstructionFromConfig, getRelevantKnowledge } from "./serverKnowledge";

const CONCENTRATE_API_URL = "https://api.concentrate.ai/v1/chat/completions";
const MODEL = process.env.PRIZIA_MODEL || "deepseek-v4-pro";
const FALLBACK_MODEL = "deepseek-v4-flash";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionChoice {
  message: {
    role: string;
    content: string;
  };
}

interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
  error?: {
    message: string;
    code?: string;
  };
}

function buildMessages(
  message: string,
  conversationHistory: Message[],
  systemInstruction: string
): ChatMessage[] {
  const messages: ChatMessage[] = [
    { role: "system", content: systemInstruction },
  ];

  for (const msg of conversationHistory) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  messages.push({ role: "user", content: message });

  return messages;
}

async function callConcentrate(
  model: string,
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.CONCENTRATEAI_API_KEY;
  if (!apiKey) {
    throw new Error("CONCENTRATEAI_API_KEY is not set in environment variables.");
  }

  const res = await fetch(CONCENTRATE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Concentrate API error (${res.status}): ${errorBody}`);
  }

  const data: ChatCompletionResponse = await res.json();

  if (data.error) {
    throw new Error(`Concentrate API: ${data.error.message}`);
  }

  return data.choices?.[0]?.message?.content ?? "";
}

export async function generatePriziaResponse(
  message: string,
  conversationHistory: Message[]
): Promise<PriziaResponse> {
  const systemInstruction = await getPriziaSystemInstructionAsync();
  const messages = buildMessages(message, conversationHistory, systemInstruction);

  console.log(`[Prizia AI] Model: ${MODEL}`);
  console.log(`[Prizia AI] Conversation turns: ${messages.length}`);

  try {
    const text = await callConcentrate(MODEL, messages);
    console.log(`[Prizia AI] Response length: ${text.length} chars`);

    return {
      mode: "CHAT",
      text: text || "I'm not sure how to respond to that. Could you try rephrasing?",
      suggestions: [],
    };
  } catch (err) {
    console.error(`[Prizia AI] ${MODEL} error:`, err);

    if (MODEL !== FALLBACK_MODEL) {
      console.log(`[Prizia AI] Retrying with ${FALLBACK_MODEL}...`);
      try {
        const text = await callConcentrate(FALLBACK_MODEL, messages);
        return {
          mode: "CHAT",
          text: text || "I'm not sure how to respond to that. Could you try rephrasing?",
          suggestions: [],
        };
      } catch (fallbackErr) {
        console.error("[Prizia AI] Fallback also failed:", fallbackErr);
      }
    }

    throw err;
  }
}

export async function generatePriziaResponseWithConfig(
  message: string,
  conversationHistory: Message[],
  config: PriziaConfig
): Promise<PriziaResponse> {
  const knowledge = getRelevantKnowledge(message);
  const systemInstruction = buildSystemInstructionFromConfig(config, knowledge);
  const messages = buildMessages(message, conversationHistory, systemInstruction);

  console.log(`[Prizia AI Test] Model: ${MODEL}`);
  console.log(`[Prizia AI Test] Conversation turns: ${messages.length}`);

  try {
    const text = await callConcentrate(MODEL, messages);
    console.log(`[Prizia AI Test] Response length: ${text.length} chars`);

    return {
      mode: "CHAT",
      text: text || "I'm not sure how to respond to that. Could you try rephrasing?",
      suggestions: [],
    };
  } catch (err) {
    console.error(`[Prizia AI Test] ${MODEL} error:`, err);

    if (MODEL !== FALLBACK_MODEL) {
      console.log(`[Prizia AI Test] Retrying with ${FALLBACK_MODEL}...`);
      try {
        const text = await callConcentrate(FALLBACK_MODEL, messages);
        return {
          mode: "CHAT",
          text: text || "I'm not sure how to respond to that. Could you try rephrasing?",
          suggestions: [],
        };
      } catch (fallbackErr) {
        console.error("[Prizia AI Test] Fallback also failed:", fallbackErr);
      }
    }

    throw err;
  }
}
