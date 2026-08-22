import { NextResponse } from "next/server";
import { publishDraft } from "@/lib/studio/storage";

export async function POST() {
  try {
    await publishDraft();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Studio] Publish error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
