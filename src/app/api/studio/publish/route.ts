import { NextResponse } from "next/server";
import { publishDraft } from "@/lib/studio/storage";

export async function POST() {
  try {
    await publishDraft();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Studio] Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish." },
      { status: 500 }
    );
  }
}
