import { NextResponse } from "next/server";
import { getStudioData } from "@/lib/studio/storage";

export async function GET() {
  const data = await getStudioData();
  return NextResponse.json(data);
}
