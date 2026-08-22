import { NextResponse } from "next/server";
import { getLogoutCookie } from "@/lib/studio/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", getLogoutCookie());
  return response;
}
