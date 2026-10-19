import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { requireUser } from '@/server/auth/session';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';
import { lessonLocations } from '@/server/queries/catalog';
import { EmptyState, PageHead } from '@/components/ui';
import { BookIcon, CheckCircleIcon, ClockIcon, TargetIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'History' };

type Item = { at: Date; kind: 'opened' | 'completed' | 'answered'; lessonId: string; answered?: number; correct?: number };

const dayLabel = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const timeLabel = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

export default async function HistoryPage() {
  const user = await requireUser('/history');
  const db = await getDb();
  const [progress, attempts] = await Promise.all([
    db.select().from(t.lessonProgress).where(eq(t.lessonProgress.userId, user.id)).orderBy(desc(t.lessonProgress.lastViewedAt)).limit(200),
    db
      .select({ at: t.attempts.createdAt, score: t.attempts.score, lessonId: t.questions.lessonId })
      .from(t.attempts)
      .innerJoin(t.questions, eq(t.questions.id, t.attempts.questionId))
      .where(eq(t.attempts.userId, user.id))
      .orderBy(desc(t.attempts.createdAt))
      .limit(1000),
  ]);

  const items: Item[] = [];
  for (const p of progress) {
    items.push({ at: p.openedAt, kind: 'opened', lessonId: p.lessonId });
    if (p.completedAt) items.push({ at: p.completedAt, kind: 'completed', lessonId: p.lessonId });
  }
  // Group answers by lesson and day.
  const groups = new Map<string, Item>();
  for (const a of attempts) {
    const key = `${a.lessonId}|${a.at.toISOString().slice(0, 10)}`;
    const g = groups.get(key) ?? { at: a.at, kind: 'answered' as const, lessonId: a.lessonId, answered: 0, correct: 0 };
    g.answered!++;
    if (a.score >= 0.99) g.correct!++;
    groups.set(key, g);
  }
  items.push(...groups.values());
  items.sort((a, b) => b.at.getTime() - a.at.getTime());
  const locs = await lessonLocations([...new Set(items.map((i) => i.lessonId))]);
  const byDay = new Map<string, Item[]>();
  for (const i of items) {
    if (!locs.has(i.lessonId)) continue;
    const k = dayLabel(i.at);
    byDay.set(k, [...(byDay.get(k) ?? []), i]);
  }

  return (
    <div className="container-narrow">
      <PageHead title="History" lede="What you've studied, most recent first. Times are shown in UTC." />
      {byDay.size === 0 ? (
        <EmptyState icon={<ClockIcon />} title="No study history yet">
          <p>Open a lesson and it&rsquo;ll appear here.</p>
        </EmptyState>
      ) : (
        [...byDay.entries()].slice(0, 30).map(([day, list]) => (
          <section key={day} className="timeline-day" aria-label={day}>
            <h2 className="h3" style={{ marginBottom: 8 }}>
              {day}
            </h2>
            <div className="card card-pad" style={{ paddingBlock: 6 }}>
              {list.map((i, n) => {
                const loc = locs.get(i.lessonId)!;
                const Icon = i.kind === 'completed' ? CheckCircleIcon : i.kind === 'answered' ? TargetIcon : BookIcon;
                return (
                  <div key={n} className="timeline-item">
                    <span className="timeline-icon">
                      <Icon />
                    </span>
                    <span className="stack stack-xs">
                      <span className="small">
                        {i.kind === 'opened' ? 'Started' : i.kind === 'completed' ? 'Finished' : `Answered ${i.answered} question${i.answered === 1 ? '' : 's'} in`}{' '}
                        <Link href={loc.href}>{loc.title}</Link>
                      </span>
                      <span className="tiny faint">
                        {loc.subjectName} · {loc.topicCode} {loc.topicTitle}
                      </span>
                    </span>
                    <span className="tiny faint tabular">
                      {i.kind === 'answered' ? `${i.correct}/${i.answered} correct` : timeLabel(i.at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
