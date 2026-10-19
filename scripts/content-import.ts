/**
 * Validates /content and imports it. With PGlite (no DATABASE_URL), stop the
 * dev server first: the embedded database allows one process at a time.
 * Usage: npm run content:import [-- --force]
 */
import { closeDb, getDb } from '@/server/db';
import { ContentInvalidError, importFromDisk } from '@/server/db/content-sync';

process.env.CONTENT_SYNC = '0';
const db = await getDb();
try {
  const r = await importFromDisk(db, { force: process.argv.includes('--force') });
  console.log(`Imported ${r.lessons} lessons and ${r.questions} questions (${r.warnings} warnings; run content:check to see them).`);
  for (const c of r.coverage) console.log(`  ${c.code}: ${c.withLesson}/${c.objectives} objectives taught`);
} catch (e) {
  if (e instanceof ContentInvalidError) {
    for (const i of e.issues) console.error(`ERROR ${i.file}: ${i.message}`);
    console.error('Nothing was imported.');
    process.exitCode = 1;
  } else throw e;
} finally {
  await closeDb();
}
