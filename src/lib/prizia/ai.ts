import { GoogleGenAI } from "@google/genai";
import { Message, PriziaResponse } from "./types";
import { getPriziaSystemInstruction } from "./serverKnowledge";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function buildContents(
  message: string,
  conversationHistory: Message[]
): { role: string; parts: { text: string }[] }[] {
  const contents: { role: string; parts: { text: string }[] }[] = [];

  for (const msg of conversationHistory) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  return contents;
}

export async function generatePriziaResponse(
  message: string,
  conversationHistory: Message[]
): Promise<PriziaResponse> {
  const client = getClient();
  const systemInstruction = getPriziaSystemInstruction();
  const contents = buildContents(message, conversationHistory);

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  const text = response.text ?? "";

  return {
    mode: "CHAT",
    text: text || "I'm not sure how to respond to that. Could you try rephrasing?",
    suggestions: [],
  };
}
