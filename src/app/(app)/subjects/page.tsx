import type { Metadata } from 'next';
import Link from 'next/link';
import { and, eq } from 'drizzle-orm';
import { getSessionUser } from '@/server/auth/session';
import { listSubjects } from '@/server/queries/catalog';
import { getDb } from '@/server/db';
import { enrollments } from '@/server/db/schema';
import { EnrollControl } from '@/components/study/EnrollControl';
import { PageHead } from '@/components/ui';
import { SubjectMotif } from '@/components/art/SubjectMotif';
import { ArrowRightIcon, InfoIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Subjects' };

export default async function SubjectsPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const [user, subjects, { welcome }] = await Promise.all([getSessionUser(), listSubjects(), searchParams]);
  const db = await getDb();
  const mine = user ? await db.select().from(enrollments).where(and(eq(enrollments.userId, user.id))) : [];

  return (
    <div className="container">
      <PageHead
        art="subjects"
        title={welcome ? 'Which subjects are you taking?' : 'Subjects'}
        lede={
          welcome
            ? 'Add the ones you study and choose whether you are aiming for AS or the full A Level. You can change this any time.'
            : 'Every subject follows its official Cambridge syllabus. Add the ones you study to get a study path and progress tracking.'
        }
      />
      <div className="subject-list">
        {subjects.map((s) => {
          const e = mine.find((m) => m.subjectCode === s.code);
          return (
            <article key={s.code} className="subject-item" data-subject={s.code} aria-labelledby={`s-${s.code}`}>
              <div className="subject-item-art" aria-hidden="true">
                <SubjectMotif code={s.code} />
              </div>
              <div className="stack stack-xs">
                <p className="subject-card-code">
                  {s.code} · syllabus for {s.version.label}
                </p>
                <h2 id={`s-${s.code}`} className="h2">
                  <Link href={`/subjects/${s.slug}`}>{s.name}</Link>
                </h2>
                <p className="small muted">{s.description}</p>
                <p className="tiny muted" style={{ marginTop: 2 }}>
                  {s.counts.topics} topics · {s.counts.objectives} objectives · {s.counts.lessons} lessons so far
                </p>
              </div>
              <div className="subject-item-actions">
                <EnrollControl subjectCode={s.code} subjectName={s.shortName} enrolledLevel={e?.targetLevel ?? null} signedIn={!!user} />
                <Link href={`/subjects/${s.slug}`} className="small row" style={{ ['--gap' as string]: '4px', fontWeight: 700, minHeight: 44 }}>
                  View syllabus <ArrowRightIcon width={16} height={16} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {welcome && (
        <div className="row" style={{ marginTop: 24, justifyContent: 'flex-end' }}>
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
