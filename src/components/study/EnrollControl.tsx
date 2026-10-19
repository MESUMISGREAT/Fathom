'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { enroll, unenroll } from '@/server/actions/study';
import { CheckIcon } from '@/components/icons';

export function EnrollControl({
  subjectCode,
  subjectName,
  enrolledLevel,
  signedIn,
}: {
  subjectCode: string;
  subjectName: string;
  enrolledLevel: 'AS' | 'A' | null;
  signedIn: boolean;
}) {
  const [level, setLevel] = useState<'AS' | 'A'>(enrolledLevel ?? 'A');
  const [enrolled, setEnrolled] = useState(enrolledLevel !== null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (!signedIn) {
    return (
      <Link href="/signup" className="btn btn-sm">
        Sign up to track {subjectName}
      </Link>
    );
  }

  const choose = (l: 'AS' | 'A') => {
    setLevel(l);
    if (enrolled) start(async () => setError((await enroll({ subjectCode, targetLevel: l })).error ?? null));
  };

  return (
    <div className="stack stack-sm" style={{ alignItems: 'flex-start' }}>
      <div className="row" style={{ ['--gap' as string]: '8px' }}>
        <div className="segmented" role="group" aria-label={`Level you are aiming for in ${subjectName}`}>
          {(['AS', 'A'] as const).map((l) => (
            <button key={l} type="button" aria-pressed={level === l} onClick={() => choose(l)} disabled={pending}>
              {l === 'AS' ? 'AS Level' : 'A Level'}
            </button>
          ))}
        </div>
        {enrolled ? (
          <>
            <span className="badge badge-good">
              <CheckIcon width={14} height={14} /> Added
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const r = await unenroll({ subjectCode });
                  if (r.ok) setEnrolled(false);
                })
              }
            >
              Remove
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await enroll({ subjectCode, targetLevel: level });
                setError(r.error ?? null);
                if (r.ok) setEnrolled(true);
              })
            }
          >
            {pending ? 'Adding…' : `Add ${subjectName}`}
          </button>
        )}
      </div>
      {error && (
        <p className="tiny" style={{ color: 'var(--bad)' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
