import type { Metadata } from 'next';
import Link from 'next/link';
import { listSubjects } from '@/server/queries/catalog';
import { MASTERY_RULES } from '@/domain/mastery';
import { BOX_INTERVAL_DAYS } from '@/domain/schedule';
import { PageHead, StatusPill } from '@/components/ui';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = { title: 'How it works' };

const ROADMAP: Array<{ phase: string; title: string; status: 'Available' | 'Planned'; items: string[] }> = [
  {
    phase: 'Phase 1',
    title: 'Core learning',
    status: 'Available',
    items: [
      'Accounts, subjects and AS/A Level targets',
      'Full syllabus structure for 9709, 9618, 9702 and 9701 from the official documents',
      'Bite-sized lessons with worked examples, diagrams and common mistakes (first topics in each subject)',
      'Instant-feedback recall questions in seven formats',
      'Progress by objective and topic, spaced review, search, saved items and history',
    ],
  },
  { phase: 'Phase 2', title: 'Exam practice', status: 'Planned', items: ['Cambridge-style question bank with mark schemes', 'Multi-part questions and subject-specific diagrams', 'Timed practice and topic analytics'] },
  { phase: 'Phase 3', title: 'AI tutor and marking', status: 'Planned', items: ['Photo uploads of your working', 'Estimated marks with reasons, never presented as official', 'Hints and step-by-step help'] },
  { phase: 'Phase 4', title: 'Grade estimates', status: 'Planned', items: ['Full-paper tracking', 'Estimated grade ranges with clear uncertainty', 'Trends and revision suggestions'] },
  { phase: 'Phase 5', title: 'More subjects and polish', status: 'Planned', items: ['More Cambridge subjects and syllabus versions', 'Content review tools for teachers', 'Advanced analytics'] },
];

export default async function AboutPage() {
  const subjects = await listSubjects();
  return (
    <div className="container-narrow stack stack-xl">
      <PageHead title={`How ${BRAND} works`} lede="What's in here, where it comes from, and how we decide what to show you." />

      <section id="content" className="stack" aria-labelledby="h-content">
        <h2 id="h-content">Where the content comes from</h2>
        <div className="prose">
          <p>
            <strong>Syllabus.</strong> Each subject&rsquo;s structure (sections, topics and learning objectives) was transcribed from Cambridge&rsquo;s
            official syllabus document and then checked against it line by line in a separate pass. Objectives are written in our own words,
            keeping every technical term and condition; the official document is always the final word.
          </p>
        </div>
        <div className="table-wrap card">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Syllabus</th>
                <th>Checked</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.code}>
                  <td>
                    {s.name} ({s.code})
                  </td>
                  <td>
                    <a href={s.version.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {s.version.label}
                    </a>{' '}
                    <span className="faint">· {s.version.sourceVersion}</span>
                  </td>
                  <td className="tabular">{s.version.checkedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose">
          <p>
            <strong>Lessons and questions.</strong> The current lessons were drafted with AI from the official syllabus, then fact-checked and
            reviewed by separate, independent AI passes that re-derived every answer. Every lesson is also checked automatically: the maths must
            render, every question must be placed straight after what it tests, and every answer key must pass our own marking code. All
            questions are original; we don&rsquo;t copy Cambridge past papers.
          </p>
          <p>Each lesson shows how it was checked:</p>
          <ul>
            <li>
              <strong>AI-drafted, independently checked · not yet teacher-reviewed</strong>: everything above, but no qualified teacher has
              signed it off yet.
            </li>
            <li>
              <strong>Teacher-reviewed</strong>: checked by a named, qualified teacher. Nothing carries this label yet.
            </li>
            <li>
              <strong>Draft</strong>: not checked. Drafts aren&rsquo;t meant to reach students; if you see one, treat it with care.
            </li>
          </ul>
          <p>
            You can see which syllabus objectives have lessons on each subject&rsquo;s coverage page, for example{' '}
            {subjects[0] && <Link href={`/subjects/${subjects[0].slug}/coverage`}>{subjects[0].name} coverage</Link>}.
          </p>
        </div>
      </section>

      <section id="checking" className="stack" aria-labelledby="h-checking">
        <h2 id="h-checking">How answers are checked</h2>
        <div className="prose">
          <p>Quick-check answers are marked by ordinary code on our server, not by AI, so the same answer always gets the same result.</p>
          <ul>
            <li>
              <strong>Numbers</strong> are compared with a tolerance. Fractions and exact forms like 7/2 or 2√5 count, significant figures are
              checked when a question asks for them, and units are checked by what they mean, so m/s, m s⁻¹ and ms^-1 are the same, and 50 cm is
              accepted for 0.5 m.
            </li>
            <li>
              <strong>Algebra</strong> is checked by evaluating your expression at many points, so any equivalent form is accepted.
            </li>
            <li>
              <strong>Short answers</strong> ignore capitals, spacing and punctuation but not spelling, because near-misses are often different
              answers (alkane and alkene). If your words don&rsquo;t match, you compare with the model answer and mark yourself.
            </li>
            <li>
              <strong>Explain-in-your-own-words</strong> questions are self-marked against key points. Self-marked answers count for half when we
              work out your progress.
            </li>
          </ul>
        </div>
      </section>

      <section id="progress" className="stack" aria-labelledby="h-progress">
        <h2 id="h-progress">How progress is decided</h2>
        <p className="muted">Every syllabus objective has a status, worked out from your answers. One correct answer is never enough to be secure.</p>
        <div className="card card-pad stack">
          {MASTERY_RULES.map((r) => (
            <div key={r.state} className="row row-nowrap" style={{ alignItems: 'flex-start', ['--gap' as string]: '14px' }}>
              <div style={{ minWidth: 150 }}>
                <StatusPill state={r.state} />
              </div>
              <p className="small">{r.rule}</p>
            </div>
          ))}
        </div>
        <p className="small muted">
          Review questions come back after {BOX_INTERVAL_DAYS.join(', ')} days as you keep getting them right, and tomorrow if you miss one. There are
          no streaks, points or reminders designed to make you feel guilty.
        </p>
      </section>

      <section id="roadmap" className="stack" aria-labelledby="h-roadmap">
        <h2 id="h-roadmap">What&rsquo;s built and what&rsquo;s next</h2>
        <div className="stack stack-md">
          {ROADMAP.map((p) => (
            <div key={p.phase} className="card card-pad">
              <div className="row row-between" style={{ marginBottom: 8 }}>
                <h3>
                  {p.phase}: {p.title}
                </h3>
                <span className={`badge ${p.status === 'Available' ? 'badge-good' : ''}`}>{p.status}</span>
              </div>
              <ul className="small muted" style={{ margin: 0, paddingLeft: '1.2em' }}>
                {p.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
