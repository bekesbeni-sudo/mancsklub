import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

let tokens: typeof import("@/lib/signup-token");

beforeAll(async () => {
  process.env.SESSION_SECRET = "teszt-titok-ami-legalabb-harminckét-karakter";
  tokens = await import("@/lib/signup-token");
});

describe("signup token", () => {
  const id = "6f1c2a52-0c51-4a3a-9a77-1b6a3c1c0d11";

  it("gives back the signup it was made for", () => {
    expect(tokens.readSignupToken(tokens.signupToken(id))).toBe(id);
  });

  it("refuses a changed id, a changed expiry, an old token and rubbish", () => {
    const token = tokens.signupToken(id, 0);
    const [, exp, signature] = token.split(".");
    expect(tokens.readSignupToken(`${id.replace("6", "7")}.${exp}.${signature}`, 0)).toBeNull();
    expect(tokens.readSignupToken(`${id}.${Number(exp) + 1}.${signature}`, 0)).toBeNull();
    expect(tokens.readSignupToken(token, 25 * 3600 * 1000)).toBeNull();
    expect(tokens.readSignupToken("nem.jo")).toBeNull();
    expect(tokens.readSignupToken(null)).toBeNull();
  });
});
