import { NextResponse } from "next/server";
import { verifySession } from "@/lib/studio/auth";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const authenticated = await verifySession(cookieHeader);
  return NextResponse.json({ authenticated });
}
