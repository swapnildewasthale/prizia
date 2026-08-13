import { NextRequest, NextResponse } from "next/server";
import { generatePriziaResponse } from "@/lib/prizia/ai";
import { Message } from "@/lib/prizia/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body as {
      message: string;
      conversationHistory: Message[];
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const history: Message[] = Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (m): m is Message =>
            m &&
            typeof m === "object" &&
            typeof m.id === "string" &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string"
        )
      : [];

    const response = await generatePriziaResponse(message.trim(), history);

    return NextResponse.json(response);
  } catch (error: unknown) {
    const errRecord = error as Record<string, unknown> | undefined;
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error";

    const status = errRecord?.status ?? errRecord?.code ?? "n/a";
    const name = errRecord?.name ?? (error instanceof Error ? error.name : "Unknown");
    const statusText = errRecord?.statusText ?? "n/a";

    console.error("[Prizia API] Error:", message, "| name:", name, "| status:", status, "| statusText:", statusText);

    if (error instanceof Error && error.cause) {
      console.error("[Prizia API] Cause:", String(error.cause));
    }

    if (message.includes("CONCENTRATEAI_API_KEY") || !process.env.CONCENTRATEAI_API_KEY) {
      return NextResponse.json(
        { mode: "CHAT", text: "I'm not configured properly yet. Please check the CONCENTRATEAI_API_KEY environment variable.", suggestions: [] },
        { status: 500 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";
    const userMessage = isDev
      ? `Something went wrong: ${message}`
      : "Something went wrong while I was thinking. Try asking me again.";

    return NextResponse.json(
      { mode: "CHAT", text: userMessage, suggestions: [] },
      { status: 500 }
    );
  }
}
