'use client';
import { useState, useTransition } from 'react';
import { reportProblem } from '@/server/actions/study';
import { FlagIcon } from '@/components/icons';

/** "Report a problem" link that opens a small inline form. */
export function ReportProblem({ kind, targetId }: { kind: 'lesson' | 'question'; targetId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<'wrong-answer' | 'error-in-content' | 'unclear' | 'other'>(kind === 'question' ? 'wrong-answer' : 'error-in-content');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<{ ok?: boolean; error?: string }>({});
  const [pending, start] = useTransition();

  if (state.ok) {
    return (
      <p className="tiny" role="status" style={{ color: 'var(--good)' }}>
        Thanks. We&rsquo;ll check it, and fix it if it&rsquo;s wrong.
      </p>
    );
  }
  if (!open) {
    return (
      <button type="button" className="link-btn tiny row" style={{ ['--gap' as string]: '4px', color: 'var(--text-3)' }} onClick={() => setOpen(true)}>
        <FlagIcon width={14} height={14} /> Report a problem
      </button>
    );
  }
  return (
    <form
      className="stack stack-sm"
      style={{ marginTop: 8 }}
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => setState(await reportProblem({ kind, targetId, reason, message })));
      }}
    >
      <label className="field">
        <span className="label small">What&rsquo;s wrong?</span>
        <select className="select" value={reason} onChange={(e) => setReason(e.target.value as typeof reason)}>
          {kind === 'question' && <option value="wrong-answer">The marked answer looks wrong</option>}
          <option value="error-in-content">There&rsquo;s a mistake in the content</option>
          <option value="unclear">It&rsquo;s confusing or unclear</option>
          <option value="other">Something else</option>
        </select>
      </label>
      <label className="field">
        <span className="label small">Details</span>
        <textarea className="textarea" rows={3} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What did you expect, and what did you see?" />
      </label>
      {state.error && (
        <p className="tiny" role="alert" style={{ color: 'var(--bad)' }}>
          {state.error}
        </p>
      )}
      <div className="row" style={{ ['--gap' as string]: '8px' }}>
        <button type="submit" className="btn btn-sm" disabled={pending}>
          {pending ? 'Sending…' : 'Send report'}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
