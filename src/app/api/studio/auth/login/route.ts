import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/studio/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body as { password: string };

  const correctPassword = process.env.STUDIO_PASSWORD;
  if (!correctPassword) {
    return NextResponse.json(
      { error: "Studio password not configured." },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const cookie = await createSessionCookie();
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", cookie);
  return response;
}
