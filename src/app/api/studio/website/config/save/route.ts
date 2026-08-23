import { NextRequest, NextResponse } from "next/server";
import { saveWebsiteDraft } from "@/lib/website/storage";
import { WebsiteConfig } from "@/lib/website/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { draft } = body as { draft: WebsiteConfig };
    if (!draft || typeof draft !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid draft in request body." },
        { status: 400 },
      );
    }
    await saveWebsiteDraft(draft);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Website] Save draft error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
