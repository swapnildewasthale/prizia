import { GoogleGenAI } from "@google/genai";
import { Message, PriziaResponse } from "./types";
import { getPriziaSystemInstruction } from "./serverKnowledge";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

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

  console.log(`[Prizia AI] Model: ${GEMINI_MODEL}`);
  console.log(`[Prizia AI] System instruction: ${systemInstruction.length} chars`);
  console.log(`[Prizia AI] Conversation turns: ${contents.length}`);

  try {
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
    console.log(`[Prizia AI] Response length: ${text.length} chars`);

    return {
      mode: "CHAT",
      text: text || "I'm not sure how to respond to that. Could you try rephrasing?",
      suggestions: [],
    };
  } catch (err) {
    console.error("[Prizia AI] Gemini error:", err);

    // If the model fails, try a fallback model
    if (GEMINI_MODEL !== "gemini-2.0-flash") {
      console.log("[Prizia AI] Retrying with gemini-2.0-flash...");
      try {
        const fallbackResponse = await client.models.generateContent({
          model: "gemini-2.0-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });
        const fallbackText = fallbackResponse.text ?? "";
        return {
          mode: "CHAT",
          text: fallbackText || "I'm not sure how to respond to that. Could you try rephrasing?",
          suggestions: [],
        };
      } catch (fallbackErr) {
        console.error("[Prizia AI] Fallback also failed:", fallbackErr);
      }
    }

    throw err;
  }
}
