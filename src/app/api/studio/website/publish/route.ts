import { NextResponse } from "next/server";
import { publishWebsiteDraft } from "@/lib/website/storage";

export async function POST() {
  try {
    await publishWebsiteDraft();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Website] Publish error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
