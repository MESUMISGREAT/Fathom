/**
 * Database access. With DATABASE_URL set, connects to PostgreSQL; otherwise
 * uses an embedded PostgreSQL (PGlite) in ./data/pglite, so local
 * development needs no database server. Migrations run on first use, then
 * content is synced from /content if it changed (see content-sync.ts).
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import * as schema from './schema';

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

interface DbState {
  db: Db;
  close: () => Promise<void>;
}

const MIGRATIONS = path.join(process.cwd(), 'drizzle');

const isVercelPreview = () => !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

async function connect(): Promise<DbState> {
  // POSTGRES_URL is what Vercel's database integrations may set.
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (url && url !== 'memory') {
    const { Pool } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { migrate } = await import('drizzle-orm/node-postgres/migrator');
    const pool = new Pool({ connectionString: url, max: Number(process.env.DATABASE_POOL_SIZE ?? (process.env.VERCEL ? 3 : 10)) });
    const db = drizzle(pool, { schema });
    // Vercel preview deployments share the production database: never let them migrate it.
    if (process.env.AUTO_MIGRATE !== '0' && !isVercelPreview()) await migrate(db, { migrationsFolder: MIGRATIONS });
    return { db: db as unknown as Db, close: () => pool.end() };
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  let client: InstanceType<typeof PGlite>;
  if (url === 'memory') client = new PGlite();
  else {
    const dir = path.resolve(/*turbopackIgnore: true*/ process.env.PGLITE_DIR ?? path.join(process.cwd(), 'data', 'pglite'));
    await mkdir(path.dirname(dir), { recursive: true }); // PGlite creates only the last segment
    client = new PGlite(dir);
  }
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS });
  return { db: db as unknown as Db, close: () => client.close() };
}

const g = globalThis as unknown as { __fathomDb?: Promise<DbState> };

export function getDb(): Promise<Db> {
  g.__fathomDb ??= (async () => {
    const state = await connect();
    // ...or replace its lessons with a branch's content.
    if (process.env.CONTENT_SYNC !== '0' && !isVercelPreview()) {
      const { syncContentIfChanged } = await import('./content-sync');
      await syncContentIfChanged(state.db);
    }
    return state;
  })().catch((e) => {
    g.__fathomDb = undefined; // allow a retry after a failed start
    throw e;
  });
  return g.__fathomDb.then((s) => s.db);
}

export async function closeDb(): Promise<void> {
  const state = await g.__fathomDb;
  g.__fathomDb = undefined;
  await state?.close();
}

export { schema };
