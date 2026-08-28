import { NextRequest, NextResponse } from "next/server";

const CONCENTRATE_API_URL = "https://api.concentrate.ai/v1/chat/completions";
const MODEL = process.env.PRIZIA_MODEL || "deepseek-v4-pro";
const FALLBACK_MODEL = "deepseek-v4-flash";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  choices: { message: { role: string; content: string } }[];
  error?: { message: string; code?: string };
}

interface ContextItem {
  id: string;
  label: string;
  value: string;
}

interface MissingContext {
  id: string;
  label: string;
  reason: string;
}

interface ClarityResponse {
  status: "guiding" | "ready";
  intent: string;
  missingContext: MissingContext[];
  readiness: number;
  improvedRequest: string;
}

const SYSTEM_PROMPT = `You are Clarity — a thinking companion that helps people finish their thoughts and turn vague intentions into clear, actionable requests.

Your job is to:
1. Understand what the user is trying to accomplish
2. Identify what important information is already present
3. Determine what missing pieces would MOST improve the result
4. Decide whether the request is clear enough to use as-is

RULES:
- You are NOT a chatbot. You do not have conversations. You refine thoughts.
- Preserve the user's original language, tone, and intention. Do not rewrite their personality.
- The improved request should feel like "the same person now knows what information to include" — NOT like a different person wrote a perfect prompt.
- Never be generic. Every suggestion must be directly relevant to THIS specific request.
- Do NOT suggest information the user has already provided.
- Do NOT suggest things that are nice-to-have but wouldn't materially change the output quality.
- Show only 3-6 suggestions maximum. Fewer is fine if the request is already mostly clear.
- When the user has provided enough context for a high-quality result, say so. Do not keep asking unnecessary questions.

STATUS:
- "guiding" — More context would materially improve the request. Provide missingContext suggestions.
- "ready" — The request is sufficiently clear. The user can use it as-is. missingContext should be empty or near-empty.

OUTPUT FORMAT (strict JSON, no markdown):
{
  "status": "guiding" or "ready",
  "intent": "one line describing what the user wants",
  "missingContext": [
    {"id": "short_id", "label": "Human-readable label", "reason": "Why this matters for THIS request"}
  ],
  "readiness": 0-100,
  "improvedRequest": "The refined request preserving the user's voice"
}

Return ONLY the JSON object. No explanation, no markdown fence, no extra text.`;

async function callConcentrate(
  model: string,
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.CONCENTRATEAI_API_KEY;
  if (!apiKey) {
    throw new Error("CONCENTRATEAI_API_KEY is not set.");
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

function parseResponse(raw: string): ClarityResponse {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleaned);

  const status = parsed.status === "ready" ? "ready" : "guiding";
  const intent = typeof parsed.intent === "string" ? parsed.intent : "";
  const readiness = typeof parsed.readiness === "number" ? parsed.readiness : 50;
  const improvedRequest =
    typeof parsed.improvedRequest === "string" ? parsed.improvedRequest : "";

  const missingContext: MissingContext[] = Array.isArray(parsed.missingContext)
    ? parsed.missingContext.slice(0, 6).map((item: Record<string, string>) => ({
        id: item.id || "unknown",
        label: item.label || "More detail",
        reason: item.reason || "",
      }))
    : [];

  return { status, intent, missingContext, readiness, improvedRequest };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { thought, existingContext } = body as {
      thought: string;
      existingContext?: ContextItem[];
    };

    if (!thought?.trim()) {
      return NextResponse.json({ error: "Thought is required." }, { status: 400 });
    }

    let contextBlock = "";
    if (existingContext && existingContext.length > 0) {
      contextBlock =
        "\n\nAdditional context the user has already provided:\n" +
        existingContext
          .map((c) => `- ${c.label}: ${c.value}`)
          .join("\n");
    }

    const userMessage = `User's thought:\n"${thought.trim()}"${contextBlock}\n\nAnalyze this thought. Identify what's missing that would materially improve the result. Determine if the request is ready to use.`;

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];

    let raw: string;
    try {
      raw = await callConcentrate(MODEL, messages);
    } catch {
      if (MODEL !== FALLBACK_MODEL) {
        raw = await callConcentrate(FALLBACK_MODEL, messages);
      } else {
        throw new Error("Both models failed");
      }
    }

    const result = parseResponse(raw);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("[Clarity API] Error:", message);

    if (
      message.includes("CONCENTRATEAI_API_KEY") ||
      !process.env.CONCENTRATEAI_API_KEY
    ) {
      return NextResponse.json(
        { error: "Clarity is not configured yet. Missing API key." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while analyzing your thought. Try again." },
      { status: 500 }
    );
  }
}
