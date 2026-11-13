import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("database gate", () => {
  it("never runs more tasks at once than allowed, and runs them all", async () => {
    const { semaphore } = await import("@/lib/db");
    const gate = semaphore(2);
    let running = 0;
    let peak = 0;
    const task = (ms: number) => async () => {
      running += 1;
      peak = Math.max(peak, running);
      await new Promise((resolve) => setTimeout(resolve, ms));
      running -= 1;
      return ms;
    };
    const results = await Promise.all([5, 1, 3, 2, 4].map((ms) => gate(task(ms))));
    expect(results).toEqual([5, 1, 3, 2, 4]);
    expect(peak).toBe(2);
  });

  it("frees the slot when a task fails", async () => {
    const { semaphore } = await import("@/lib/db");
    const gate = semaphore(1);
    await expect(gate(async () => { throw new Error("x"); })).rejects.toThrow("x");
    await expect(gate(async () => "ok")).resolves.toBe("ok");
  });
});
