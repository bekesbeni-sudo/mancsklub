import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// After signing up, the landing page may add the visitor's clinic to that signup. The page gets a
// signed, short-lived token for the new signup, so nobody can attach a clinic to someone else's row.
const HOURS = 24;

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET is missing or too short");
  return value;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(`signup:${payload}`).digest("base64url");

export function signupToken(signupId: string, now = Date.now()): string {
  const payload = `${signupId}.${now + HOURS * 3600 * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function readSignupToken(token: string | null, now = Date.now()): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, signature] = parts;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(`${id}.${exp}`));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return Number(exp) > now ? id : null;
}
