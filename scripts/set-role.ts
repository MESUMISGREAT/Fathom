/**
 * Give an account the editor or admin role (or take it away).
 * Usage: npm run user:role -- someone@example.org editor|admin|student
 */
import { eq } from 'drizzle-orm';
import { closeDb, getDb } from '@/server/db';
import { users } from '@/server/db/schema';

process.env.CONTENT_SYNC = '0';
const [email, role] = process.argv.slice(2);
if (!email || !role || !['student', 'editor', 'admin'].includes(role)) {
  console.error('Usage: npm run user:role -- <email> <student|editor|admin>');
  process.exit(1);
}
const db = await getDb();
const rows = await db.update(users).set({ role: role as 'student' }).where(eq(users.email, email.toLowerCase())).returning({ id: users.id });
console.log(rows.length ? `${email} is now ${role}.` : `No account for ${email}.`);
await closeDb();
