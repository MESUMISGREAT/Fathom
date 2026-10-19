import type { Metadata } from 'next';
import Link from 'next/link';
import { search, type ResultKind, type SearchFilters } from '@/server/queries/search';
import { listSubjects } from '@/server/queries/catalog';
import { LevelBadge, PageHead } from '@/components/ui';
import { BookIcon, ListIcon, SearchIcon, TargetIcon, LayersIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Search' };

const KINDS: Array<{ key: ResultKind | ''; label: string }> = [
  { key: '', label: 'Everything' },
  { key: 'objective', label: 'Syllabus' },
  { key: 'topic', label: 'Topics' },
  { key: 'lesson', label: 'Lessons' },
  { key: 'question', label: 'Questions' },
];
const FORMATS = [
  ['mcq', 'Multiple choice'],
  ['numeric', 'Calculate'],
  ['expression', 'Expression'],
  ['text', 'Short answer'],
  ['cloze', 'Fill in the blanks'],
  ['spot-error', 'Spot the error'],
  ['explain', 'In your own words'],
] as const;
const ICON: Record<ResultKind, typeof BookIcon> = { topic: LayersIcon, objective: ListIcon, lesson: BookIcon, question: TargetIcon };
const KIND_LABEL: Record<ResultKind, string> = { topic: 'Topic', objective: 'Syllabus objective', lesson: 'Lesson', question: 'Question' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q ?? '').slice(0, 100);
  const filters: SearchFilters = {
    subject: sp.subject && /^\d{4}$/.test(sp.subject) ? sp.subject : undefined,
    kind: KINDS.some((k) => k.key === sp.kind && k.key) ? (sp.kind as ResultKind) : undefined,
    level: sp.level === 'AS' || sp.level === 'A' ? sp.level : undefined,
    difficulty: ['1', '2', '3'].includes(sp.difficulty ?? '') ? Number(sp.difficulty) : undefined,
    format: FORMATS.some(([k]) => k === sp.format) ? sp.format : undefined,
  };
  const [subjects, results] = await Promise.all([listSubjects(), q ? search(q, filters) : Promise.resolve([])]);
  const questionFilters = filters.kind === 'question';

  return (
    <div className="container-narrow">
      <PageHead title="Search" lede="Search the syllabus, topics, lessons and questions. Try a code like 1.1.2 or 9702 1.3, or a word like discriminant." />
      <form className="stack" role="search" action="/search">
        <div className="search-box">
          <SearchIcon />
          <input className="input" type="search" name="q" defaultValue={q} placeholder="Search…" aria-label="Search" autoFocus={!q} />
        </div>
        <div className="row" style={{ ['--gap' as string]: '10px' }}>
          <select className="select" name="subject" defaultValue={filters.subject ?? ''} aria-label="Subject" style={{ width: 'auto' }}>
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
          <select className="select" name="kind" defaultValue={filters.kind ?? ''} aria-label="Type of result" style={{ width: 'auto' }}>
            {KINDS.map((k) => (
              <option key={k.key} value={k.key}>
                {k.label}
              </option>
            ))}
          </select>
          <select className="select" name="level" defaultValue={filters.level ?? ''} aria-label="Level" style={{ width: 'auto' }}>
            <option value="">AS and A Level</option>
            <option value="AS">AS Level</option>
            <option value="A">A Level only</option>
          </select>
          {questionFilters && (
            <>
              <select className="select" name="difficulty" defaultValue={sp.difficulty ?? ''} aria-label="Difficulty" style={{ width: 'auto' }}>
                <option value="">Any difficulty</option>
                <option value="1">Recall</option>
                <option value="2">Apply</option>
                <option value="3">Stretch</option>
              </select>
              <select className="select" name="format" defaultValue={filters.format ?? ''} aria-label="Question type" style={{ width: 'auto' }}>
                <option value="">Any question type</option>
                {FORMATS.map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </>
          )}
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
        {!questionFilters && <p className="tiny faint">Choose &ldquo;Questions&rdquo; to filter by difficulty and question type.</p>}
      </form>

      <section aria-live="polite" style={{ marginTop: 28 }}>
        {q && (
          <p className="small muted" style={{ marginBottom: 12 }}>
            {results.length === 0 ? `No results for “${q}”.` : `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”`}
          </p>
        )}
        {results.length > 0 && (
          <ul className="list card" style={{ overflow: 'hidden' }}>
            {results.map((r) => {
              const Icon = ICON[r.kind];
              return (
                <li key={`${r.kind}:${r.id}`} style={{ borderTop: '1px solid var(--border)' }}>
                  <Link href={r.href} className="list-row" style={{ padding: '14px 16px', alignItems: 'flex-start' }}>
                    <Icon width={18} height={18} style={{ color: 'var(--text-3)', marginTop: 3, flex: 'none' }} />
                    <span className="grow stack stack-xs">
                      <span style={{ fontWeight: 600 }}>{r.title}</span>
                      <span className="small muted">{r.snippet}</span>
                      <span className="row tiny faint" style={{ ['--gap' as string]: '8px' }}>
                        {KIND_LABEL[r.kind]} · {r.subject.name}
                        {r.code && r.kind !== 'objective' ? ` · ${r.code}` : ''}
                        <LevelBadge level={r.level} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
