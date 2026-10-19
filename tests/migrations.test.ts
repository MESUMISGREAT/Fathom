/**
 * Migrations apply to a fresh database and upgrade an existing one: a
 * database at 0001 (with a student and an attempt in it) gains the points
 * tables and columns with the right defaults, without losing data.
 */
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

const MIGRATIONS = path.join(process.cwd(), 'drizzle');
const temp: string[] = [];
afterAll(async () => {
  await Promise.all(temp.map((d) => rm(d, { recursive: true, force: true })));
});

/** A copy of the migrations folder that stops after the first `count` migrations. */
async function migrationsUpTo(count: number): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'fathom-migrations-'));
  temp.push(dir);
  await cp(MIGRATIONS, dir, { recursive: true });
  const journalPath = path.join(dir, 'meta', '_journal.json');
  const journal = JSON.parse(await readFile(journalPath, 'utf8')) as { entries: unknown[] };
  journal.entries = journal.entries.slice(0, count);
  await writeFile(journalPath, JSON.stringify(journal));
  return dir;
}

async function columns(client: PGlite, table: string) {
  const res = await client.query<{ column_name: string; column_default: string | null; is_nullable: string }>(
    `select column_name, column_default, is_nullable from information_schema.columns where table_name = $1`,
    [table],
  );
  return new Map(res.rows.map((r) => [r.column_name, r]));
}

describe('migrations', () => {
  it('create the points tables on a fresh database', async () => {
    const client = new PGlite();
    await migrate(drizzle(client), { migrationsFolder: MIGRATIONS });
    const xp = await columns(client, 'xp_events');
    expect([...xp.keys()].sort()).toEqual(['amount', 'created_at', 'id', 'kind', 'local_day', 'source_id', 'user_id']);
    expect([...(await columns(client, 'user_badges')).keys()].sort()).toEqual(['badge_id', 'earned_at', 'user_id']);
    const indexes = await client.query<{ indexname: string; indexdef: string }>(`select indexname, indexdef from pg_indexes where tablename = 'xp_events'`);
    const uq = indexes.rows.find((r) => r.indexname === 'xp_events_source_uq');
    expect(uq?.indexdef).toMatch(/UNIQUE INDEX .*\(user_id, kind, source_id\)/);
    expect(indexes.rows.some((r) => r.indexname === 'xp_events_user_day_idx')).toBe(true);
    await client.close();
  });

  it('upgrade an existing database without losing data, and cascade deletes', async () => {
    const client = new PGlite();
    const db = drizzle(client);
    await migrate(db, { migrationsFolder: await migrationsUpTo(2) });
    expect((await columns(client, 'users')).has('daily_goal')).toBe(false);
    await client.exec(`
      insert into subjects (code, slug, name, short_name, description, position) values ('9709', 'maths', 'Mathematics', 'Maths', 'x', 0);
      insert into syllabus_versions (id, subject_code, label, exam_years, source_url, source_version, checked_at, wording)
        values ('v1', '9709', '2026', '{2026}', 'https://example.org', '1', '2026-10-01', 'paraphrased');
      insert into users (id, email, password_hash, age_confirmed_at)
        values ('00000000-0000-4000-8000-000000000001', 'old@example.org', 'scrypt$x', now());
    `);

    await migrate(db, { migrationsFolder: MIGRATIONS });
    const users = await client.query<{ daily_goal: number; time_zone: string; celebrations: boolean; sounds: boolean }>(
      `select daily_goal, time_zone, celebrations, sounds from users where email = 'old@example.org'`,
    );
    expect(users.rows).toEqual([{ daily_goal: 50, time_zone: 'UTC', celebrations: true, sounds: false }]);
    const attempts = await columns(client, 'attempts');
    expect(attempts.get('combo')).toMatchObject({ is_nullable: 'YES', column_default: null });

    const uid = '00000000-0000-4000-8000-000000000001';
    await client.query(`insert into xp_events (user_id, kind, amount, source_id, local_day) values ($1, 'answer', 10, 'l/q', '2026-10-19')`, [uid]);
    await expect(
      client.query(`insert into xp_events (user_id, kind, amount, source_id, local_day) values ($1, 'answer', 10, 'l/q', '2026-10-20')`, [uid]),
    ).rejects.toThrow(/unique/i);
    await client.query(`insert into user_badges (user_id, badge_id) values ($1, 'first-spark')`, [uid]);
    await client.query(`delete from users where id = $1`, [uid]);
    expect((await client.query(`select 1 from xp_events`)).rows).toHaveLength(0);
    expect((await client.query(`select 1 from user_badges`)).rows).toHaveLength(0);

    // Running the migrator again is a no-op.
    await migrate(db, { migrationsFolder: MIGRATIONS });
    await client.close();
  });
});
