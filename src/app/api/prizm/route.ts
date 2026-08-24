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

interface PrizmBranch {
  id: string;
  label: string;
  angle: number;
}

interface PrizmResult {
  input: string;
  branches: PrizmBranch[];
}

const BRANCH_SYSTEM_PROMPT = `You are PRIZM — a perspective-splitting engine. Your job is to take a single input (a question, idea, object, person, moment, or anything) and split it into exactly 5 genuinely different, intriguing directions to explore it.

RULES:
- Each branch must represent a genuinely DIFFERENT angle, perspective, or direction. NOT just subject labels.
- Do NOT return generic categories like "Science, Psychology, Philosophy, History" for every input.
- Each branch should feel like an intriguing path or question that makes someone curious to explore it.
- Branch labels should be short (2-5 words), evocative, and specific to the input.
- Think like a curious mind, not a textbook.
- Some branches should be unexpected — surprising angles that make someone think "oh, I hadn't considered that."
- Avoid clichés. If the input is about love, don't just say "chemistry" — say something that makes someone want to click.

OUTPUT FORMAT (strict JSON, no markdown):
{
  "branches": [
    { "label": "Branch Label" },
    { "label": "Branch Label" },
    { "label": "Branch Label" },
    { "label": "Branch Label" },
    { "label": "Branch Label" }
  ]
}

Return ONLY the JSON object. No explanation, no markdown fence, no extra text.`;

const EXPLORE_SYSTEM_PROMPT = `You are PRIZM — a perspective exploration engine. You are exploring a specific branch/perspective that emerged from splitting a topic through a prism.

The user will give you:
1. The original input that was put through the PRIZM
2. The specific branch/perspective being explored

Your job:
- Write a thoughtful, engaging exploration of this perspective (3-5 paragraphs).
- Be specific, insightful, and genuinely interesting. Not generic.
- Include concrete examples, anecdotes, or thought experiments where appropriate.
- End with 2-3 related questions or sub-directions that naturally extend this exploration.
- Write in a conversational but intelligent tone.
- Do NOT use headers or bullet points for the main text — write in flowing prose.
- After the exploration text, add a blank line, then write "Related directions:" followed by the related questions, one per line starting with "- ".

OUTPUT: Plain text only. No JSON, no markdown formatting.`;

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
      temperature: 0.85,
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

function parseBranches(raw: string): PrizmBranch[] {
  let cleaned = raw.trim();
  // Strip markdown fence if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleaned);
  const branches = Array.isArray(parsed.branches) ? parsed.branches : Array.isArray(parsed) ? parsed : [];

  return branches.slice(0, 5).map((b: { label: string }, i: number) => ({
    id: `branch-${i}`,
    label: b.label,
    angle: (i - 2) * 25, // -50, -25, 0, 25, 50 degrees spread
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body as { action: string };

    if (action === "split") {
      const { input } = body as { input: string };
      if (!input?.trim()) {
        return NextResponse.json({ error: "Input is required." }, { status: 400 });
      }

      const messages: ChatMessage[] = [
        { role: "system", content: BRANCH_SYSTEM_PROMPT },
        { role: "user", content: `Split this through the PRIZM:\n\n"${input.trim()}"` },
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

      const branches = parseBranches(raw);
      const result: PrizmResult = { input: input.trim(), branches };
      return NextResponse.json(result);
    }

    if (action === "explore") {
      const { input, branchLabel } = body as { input: string; branchLabel: string };
      if (!input?.trim() || !branchLabel?.trim()) {
        return NextResponse.json({ error: "Input and branchLabel are required." }, { status: 400 });
      }

      const messages: ChatMessage[] = [
        { role: "system", content: EXPLORE_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Original input put through the PRIZM:\n"${input.trim()}"\n\nBranch/perspective to explore:\n"${branchLabel.trim()}"\n\nExplore this perspective.`,
        },
      ];

      let text: string;
      try {
        text = await callConcentrate(MODEL, messages);
      } catch {
        if (MODEL !== FALLBACK_MODEL) {
          text = await callConcentrate(FALLBACK_MODEL, messages);
        } else {
          throw new Error("Both models failed");
        }
      }

      return NextResponse.json({ text });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("[PRIZM API] Error:", message);

    if (message.includes("CONCENTRATEAI_API_KEY") || !process.env.CONCENTRATEAI_API_KEY) {
      return NextResponse.json(
        { error: "PRIZM is not configured yet. Missing API key." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while splitting through the PRIZM. Try again." },
      { status: 500 }
    );
  }
}
