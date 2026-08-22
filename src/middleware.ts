import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/studio/:path*"],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/studio/login")) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie");
  const cookies = Object.fromEntries(
    (cookieHeader || "")
      .split(";")
      .filter(Boolean)
      .map((c) => {
        const [key, ...val] = c.trim().split("=");
        return [key, val.join("=")];
      })
  );

  const token = cookies["prizia-studio-auth"];
  if (!token) {
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }

  try {
    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(
      process.env.STUDIO_SECRET || "prizia-studio-fallback-secret-change-me"
    );
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }
}
