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
    const raw =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : JSON.stringify(error);
    const errorMessage = raw ?? "Unknown error";
    console.error("[Prizia API Error] message:", errorMessage);
    console.error("[Prizia API Error] full error:", JSON.stringify(error, Object.getOwnPropertyNames(error as object)));
    console.error("[Prizia API Error] env:", {
      keySet: !!process.env.GEMINI_API_KEY,
      keyLength: process.env.GEMINI_API_KEY?.length ?? 0,
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash (default)",
    });

    if (errorMessage.includes("GEMINI_API_KEY") || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          mode: "CHAT",
          text: "I'm not configured properly yet. Please check the GEMINI_API_KEY environment variable.",
          suggestions: [],
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        mode: "CHAT",
        text: "Something went wrong while I was thinking. Try asking me again.",
        suggestions: [],
      },
      { status: 500 }
    );
  }
}
