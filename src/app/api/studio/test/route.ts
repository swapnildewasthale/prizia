import { NextRequest, NextResponse } from "next/server";
import { generatePriziaResponseWithConfig } from "@/lib/prizia/ai";
import { Message } from "@/lib/prizia/types";
import { PriziaConfig } from "@/lib/studio/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory, config } = body as {
      message: string;
      conversationHistory: Message[];
      config: PriziaConfig;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { error: "Draft config is required for testing." },
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

    const response = await generatePriziaResponseWithConfig(
      message.trim(),
      history,
      config
    );

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("[Studio Test API] Error:", message);

    return NextResponse.json(
      { mode: "CHAT", text: "Something went wrong while testing. Try again.", suggestions: [] },
      { status: 500 }
    );
  }
}
