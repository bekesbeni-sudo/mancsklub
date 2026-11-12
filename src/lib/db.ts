import "server-only";
import path from "node:path";
import postgres from "postgres";
import type { Db } from "./queries";

const globalForDb = globalThis as unknown as { mancsklubDb?: Promise<Db> };

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    // prepare: false is required by Supabase's connection pooler.
    const client = postgres(url, { prepare: false, max: 1 });
    const wrap = (sql: Pick<postgres.Sql, "unsafe">): Db => ({
      async query<T>(text: string, params: unknown[] = []) {
        const rows = await sql.unsafe(text, params as never[]);
        return rows as unknown as T[];
      },
      async transaction<T>(fn: (tx: Db) => Promise<T>) {
        const result = await client.begin((tx) => fn(wrap(tx)));
        return result as T;
      },
    });
    return wrap(client);
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
