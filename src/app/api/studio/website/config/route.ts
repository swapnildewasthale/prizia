import { NextResponse } from "next/server";
import { getWebsiteData } from "@/lib/website/storage";

export async function GET() {
  try {
    const data = await getWebsiteData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Website] Config read error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
