import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite, type Transaction } from "@electric-sql/pglite";
import type { Db } from "./queries";

function wrap(pg: PGlite | Transaction): Db {
  return {
    async query<T>(text: string, params: unknown[] = []) {
      const result = await pg.query<T>(text, params);
      return result.rows;
    },
    async transaction<T>(fn: (tx: Db) => Promise<T>) {
      // Already inside a transaction: join it.
      if (!("transaction" in pg)) return fn(wrap(pg));
      return (await pg.transaction((tx) => fn(wrap(tx)))) as T;
    },
  };
}

// A small Postgres for development and tests. It runs the same migrations as Supabase.
export async function openLocalDb(dataDir?: string): Promise<Db> {
  if (dataDir) await mkdir(dataDir, { recursive: true });
  const pg = await PGlite.create(dataDir);

  await pg.exec(`
    create table if not exists local_migrations (name text primary key);
    do $$ begin
      if not exists (select from pg_roles where rolname = 'anon') then create role anon nologin; end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
    end $$;
  `);

  const dir = path.join(process.cwd(), "supabase", "migrations");
  const files = (await readdir(dir)).sort();
  const applied = new Set(
    (await pg.query<{ name: string }>("select name from local_migrations")).rows.map((r) => r.name),
  );
  // Databases made before this table existed already hold the first two migrations.
  const legacy = (await pg.query<{ found: string | null }>("select to_regclass('public.packages') as found")).rows[0].found;
  for (const file of files) {
    if (applied.has(file)) continue;
    if (!(legacy && applied.size === 0 && file < "20261106000200")) {
      await pg.exec(await readFile(path.join(dir, file), "utf8"));
    }
    await pg.query("insert into local_migrations (name) values ($1)", [file]);
  }

  return wrap(pg);
}
