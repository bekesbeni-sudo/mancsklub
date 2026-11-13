import "server-only";
import path from "node:path";
import postgres from "postgres";
import type { Db } from "./queries";

const globalForDb = globalThis as unknown as { mancsklubDb?: Promise<Db> };

const POOL = 4;

// Runs at most `limit` tasks at once; the others wait in order.
export function semaphore(limit: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return async function run<T>(task: () => Promise<T>): Promise<T> {
    if (active >= limit) await new Promise<void>((resolve) => waiting.push(resolve));
    else active += 1;
    try {
      return await task();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active -= 1;
    }
  };
}

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    // prepare: false is required by Supabase's transaction pooler. Idle connections are closed
    // before the pooler drops them, so a query never waits on a dead socket.
    const client = postgres(url, {
      prepare: false,
      max: POOL,
      idle_timeout: 20,
      max_lifetime: 60 * 10,
      connect_timeout: 10,
    });
    // postgres.js sends extra queries down a busy connection without waiting (pipelining). Supabase's
    // pooler mixes up or loses those answers, which hung live pages until Vercel's 300 s timeout. So at
    // most one query per connection is in flight: the rest wait here for a free one.
    const gate = semaphore(POOL);
    const wrap = (sql: Pick<postgres.Sql, "unsafe">, gated: boolean): Db => ({
      async query<T>(text: string, params: unknown[] = []) {
        const run = () => sql.unsafe(text, params as never[]) as unknown as Promise<T[]>;
        return gated ? gate(run) : run();
      },
      async transaction<T>(fn: (tx: Db) => Promise<T>) {
        // A transaction holds one connection, and its own queries run one after another on it.
        return gate(async () => (await client.begin((tx) => fn(wrap(tx, false)))) as T);
      },
    });
    return wrap(client, true);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is not set");
  }
  const { openLocalDb } = await import("./local-db");
  return openLocalDb(process.env.LOCAL_DB_DIR ?? path.join(process.cwd(), ".local-data", "pg"));
}

export function getDb(): Promise<Db> {
  globalForDb.mancsklubDb ??= connect();
  return globalForDb.mancsklubDb;
}
