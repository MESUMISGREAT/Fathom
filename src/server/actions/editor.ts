'use server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/server/db';
import { contentReports } from '@/server/db/schema';
import { getSessionUser } from '@/server/auth/session';

const Schema = z.object({ id: z.uuid(), status: z.enum(['open', 'fixed', 'dismissed']) });

/** Editors and admins triage content reports. */
export async function setReportStatus(input: z.input<typeof Schema>): Promise<{ ok: boolean }> {
  const user = await getSessionUser();
  const parsed = Schema.safeParse(input);
  if (!user || (user.role !== 'editor' && user.role !== 'admin') || !parsed.success) return { ok: false };
  const db = await getDb();
  await db.update(contentReports).set({ status: parsed.data.status }).where(eq(contentReports.id, parsed.data.id));
  revalidatePath('/reports');
  return { ok: true };
}
