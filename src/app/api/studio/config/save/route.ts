import { NextRequest, NextResponse } from "next/server";
import { saveDraft } from "@/lib/studio/storage";
import { PriziaConfig } from "@/lib/studio/types";

export async function POST(request: NextRequest) {
  try {
    const config = (await request.json()) as PriziaConfig;
    await saveDraft(config);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Studio] Save draft error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
