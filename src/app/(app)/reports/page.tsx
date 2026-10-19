import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { requireUser } from '@/server/auth/session';
import { getDb } from '@/server/db';
import { contentReports, questions } from '@/server/db/schema';
import { lessonLocations } from '@/server/queries/catalog';
import { ReportStatus } from '@/components/study/ReportStatus';
import { EmptyState, PageHead } from '@/components/ui';
import { FlagIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Content reports' };

const REASON: Record<string, string> = {
  'wrong-answer': 'Marked answer looks wrong',
  'error-in-content': 'Mistake in the content',
  unclear: 'Confusing or unclear',
  other: 'Something else',
};

/** Editors only: problems students have reported with lessons and questions. */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const user = await requireUser('/reports');
  if (user.role !== 'editor' && user.role !== 'admin') notFound();
  const { status: s } = await searchParams;
  const status = s === 'fixed' || s === 'dismissed' ? s : 'open';
  const db = await getDb();
  const rows = await db
    .select({ r: contentReports, lessonId: questions.lessonId })
    .from(contentReports)
    .leftJoin(questions, eq(questions.id, contentReports.targetId))
    .where(eq(contentReports.status, status))
    .orderBy(desc(contentReports.createdAt))
    .limit(200);
  const locs = await lessonLocations([...new Set(rows.map((x) => (x.r.kind === 'lesson' ? x.r.targetId : x.lessonId)).filter((v): v is string => !!v))]);

  return (
    <div className="container-narrow">
      <PageHead title="Content reports" lede="Problems students have flagged. Fix the YAML in /content, then mark the report as fixed." />
      <nav className="segmented" aria-label="Filter reports" style={{ marginBottom: 20 }}>
        {(['open', 'fixed', 'dismissed'] as const).map((k) => (
          <Link key={k} href={k === 'open' ? '/reports' : `/reports?status=${k}`} aria-current={status === k ? 'page' : undefined}>
            {k[0]!.toUpperCase() + k.slice(1)}
          </Link>
        ))}
      </nav>
      {rows.length === 0 ? (
        <EmptyState icon={<FlagIcon />} title={`No ${status} reports`} />
      ) : (
        <div className="stack">
          {rows.map(({ r, lessonId }) => {
            const loc = locs.get(r.kind === 'lesson' ? r.targetId : (lessonId ?? ''));
            const href = loc ? (r.kind === 'question' ? `${loc.href}#q-${r.targetId.replace(/[^a-z0-9-]/gi, '-')}` : loc.href) : undefined;
            return (
              <article key={r.id} className="card card-pad stack stack-sm">
                <div className="row row-between">
                  <span className="badge">{REASON[r.reason]}</span>
                  <span className="tiny faint">{r.createdAt.toISOString().slice(0, 16).replace('T', ' ')} UTC</span>
                </div>
                <p className="small">
                  {r.kind === 'question' ? 'Question ' : 'Lesson '}
                  {href ? <Link href={href}>{r.targetId}</Link> : <span className="mono">{r.targetId}</span>}
                  {loc ? <span className="faint"> · {loc.subjectName}</span> : null}
                </p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{r.message}</p>
                <ReportStatus id={r.id} status={r.status} />
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
