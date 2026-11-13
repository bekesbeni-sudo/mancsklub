import { createHmac, timingSafeEqual } from "node:crypto";

export type Session =
  // adminId is missing for the shared fallback login.
  | { role: "admin"; adminId?: string; exp: number }
  | { role: "clinic"; userId: string; exp: number }
  | { role: "owner"; ownerId: string; exp: number };

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export function encodeSession(session: Session, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function decodeSession(token: string, secret: string, now = Date.now()): Session | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload, secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    return session.exp > now ? session : null;
  } catch {
    return null;
  }
}
