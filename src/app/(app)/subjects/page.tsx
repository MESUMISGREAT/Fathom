import type { Metadata } from 'next';
import Link from 'next/link';
import { and, eq } from 'drizzle-orm';
import { getSessionUser } from '@/server/auth/session';
import { listSubjects } from '@/server/queries/catalog';
import { getDb } from '@/server/db';
import { enrollments } from '@/server/db/schema';
import { EnrollControl } from '@/components/study/EnrollControl';
import { PageHead, SubjectTile } from '@/components/ui';
import { ArrowRightIcon, InfoIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Subjects' };

export default async function SubjectsPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const [user, subjects, { welcome }] = await Promise.all([getSessionUser(), listSubjects(), searchParams]);
  const db = await getDb();
  const mine = user ? await db.select().from(enrollments).where(and(eq(enrollments.userId, user.id))) : [];

  return (
    <div className="container">
      <PageHead
        title={welcome ? 'Which subjects are you taking?' : 'Subjects'}
        lede={
          welcome
            ? 'Add the ones you study and choose whether you are aiming for AS or the full A Level. You can change this any time.'
            : 'Every subject follows its official Cambridge syllabus. Add the ones you study to get a study path and progress tracking.'
        }
      />
      <div className="stack">
        {subjects.map((s) => {
          const e = mine.find((m) => m.subjectCode === s.code);
          return (
            <article key={s.code} className="card card-pad subject-card subject-row" data-subject={s.code}>
              <div className="subject-row-main">
                <SubjectTile code={s.code} size="xl" />
                <div className="stack stack-xs grow">
                  <h2 className="h2">
                    <Link href={`/subjects/${s.slug}`} style={{ color: 'inherit' }}>
                      {s.name}
                    </Link>
                  </h2>
                  <p className="small faint">
                    Cambridge International AS &amp; A Level {s.name} ({s.code}) · syllabus for {s.version.label}
                  </p>
                  <p className="small muted" style={{ marginTop: 4 }}>
                    {s.description}
                  </p>
                  <div className="row" style={{ ['--gap' as string]: '6px', marginTop: 8 }}>
                    <span className="chip">{s.counts.topics} topics</span>
                    <span className="chip">{s.counts.objectives} objectives</span>
                    <span className="chip">{s.counts.lessons} lessons so far</span>
                  </div>
                </div>
              </div>
              <div className="subject-row-side">
                <EnrollControl subjectCode={s.code} subjectName={s.shortName} enrolledLevel={e?.targetLevel ?? null} signedIn={!!user} />
                <Link href={`/subjects/${s.slug}`} className="small row hue-text" style={{ ['--gap' as string]: '4px' }}>
                  View syllabus <ArrowRightIcon width={16} height={16} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {welcome && (
        <div className="continue-bar" style={{ justifyContent: 'flex-end' }}>
          <Link href="/" className="btn btn-primary btn-lg">
            Done, take me to my dashboard
          </Link>
        </div>
      )}
      <p className="notice small" style={{ marginTop: 28 }}>
        <InfoIcon />
        <span>
          Taking a different subject? More Cambridge subjects are planned, starting with the most requested.
        </span>
      </p>
    </div>
  );
}
