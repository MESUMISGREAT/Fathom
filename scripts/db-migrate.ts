/** Applies migrations (and syncs content) by opening the database once. */
import { closeDb, getDb } from '@/server/db';

process.env.CONTENT_SYNC ??= '0';
await getDb();
await closeDb();
console.log('Database is up to date.');
