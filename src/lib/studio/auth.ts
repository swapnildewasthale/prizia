import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.STUDIO_SECRET || "prizia-studio-fallback-secret-change-me"
);
const COOKIE_NAME = "prizia-studio-auth";
const EXPIRY = "24h";

export async function createSessionCookie(): Promise<string> {
  const token = await new SignJWT({ studio: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);

  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}`;
}

export async function verifySession(cookieHeader: string | null): Promise<boolean> {
  if (!cookieHeader) return false;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );

  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export function getLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
