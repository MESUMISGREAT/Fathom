'use client';
import { useTransition } from 'react';
import { setReportStatus } from '@/server/actions/editor';

export function ReportStatus({ id, status }: { id: string; status: 'open' | 'fixed' | 'dismissed' }) {
  const [pending, start] = useTransition();
  return (
    <div className="segmented" role="group" aria-label="Report status">
      {(['open', 'fixed', 'dismissed'] as const).map((s) => (
        <button key={s} type="button" aria-pressed={status === s} disabled={pending} onClick={() => start(async () => void (await setReportStatus({ id, status: s })))}>
          {s[0]!.toUpperCase() + s.slice(1)}
        </button>
      ))}
    </div>
  );
}
