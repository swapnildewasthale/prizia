import { NextResponse } from "next/server";
import { getStudioData } from "@/lib/studio/storage";

export async function GET() {
  try {
    const data = await getStudioData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Studio] Load config error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
