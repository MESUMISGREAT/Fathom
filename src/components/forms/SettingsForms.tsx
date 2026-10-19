'use client';
import { useActionState, useState, useTransition } from 'react';
import { changePassword, deleteAccount, updatePreferences, updateProfile, type FormState } from '@/server/actions/settings';

export function ProfileForm({ displayName, email }: { displayName: string | null; email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfile, {});
  return (
    <form action={action} className="stack">
      <div className="field">
        <label className="label" htmlFor="displayName">
          First name
        </label>
        <input className="input" id="displayName" name="displayName" defaultValue={displayName ?? ''} maxLength={40} autoComplete="given-name" />
        <p className="help">Optional. Only used to greet you.</p>
      </div>
      <div className="field">
        <span className="label">Email</span>
        <p className="muted">{email}</p>
      </div>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.ok && <p className="form-ok" role="status">{state.message}</p>}
      <div>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export function AppearanceForm({ theme, lessonMode }: { theme: 'system' | 'light' | 'dark'; lessonMode: 'steps' | 'full' }) {
  const [t, setT] = useState(theme);
  const [m, setM] = useState(lessonMode);
  const [pending, start] = useTransition();
  const save = (patch: { theme?: typeof t; lessonMode?: typeof m }) =>
    start(async () => {
      await updatePreferences(patch);
      if (patch.theme) {
        // Apply immediately without waiting for navigation.
        if (patch.theme === 'system') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', patch.theme);
      }
    });
  return (
    <div className="stack">
      <div className="field">
        <span className="label" id="theme-label">
          Theme
        </span>
        <div className="segmented" role="group" aria-labelledby="theme-label">
          {(['system', 'light', 'dark'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={t === v}
              disabled={pending}
              onClick={() => {
                setT(v);
                save({ theme: v });
              }}
            >
              {v === 'system' ? 'Match device' : v === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <span className="label" id="mode-label">
          Lessons
        </span>
        <div className="segmented" role="group" aria-labelledby="mode-label">
          <button type="button" aria-pressed={m === 'steps'} disabled={pending} onClick={() => (setM('steps'), save({ lessonMode: 'steps' }))}>
            One step at a time
          </button>
          <button type="button" aria-pressed={m === 'full'} disabled={pending} onClick={() => (setM('full'), save({ lessonMode: 'full' }))}>
            Whole lesson
          </button>
        </div>
        <p className="help">Step by step shows a little at a time, with a quick check before the next part. You can switch inside any lesson.</p>
      </div>
      <p className="help">Animations follow your device&rsquo;s &ldquo;reduce motion&rdquo; setting; transparency and contrast settings are respected too.</p>
    </div>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});
  return (
    <form action={action} className="stack">
      <div className="field">
        <label className="label" htmlFor="current">
          Current password
        </label>
        <input className="input" id="current" name="current" type="password" autoComplete="current-password" required />
      </div>
      <div className="field">
        <label className="label" htmlFor="next">
          New password
        </label>
        <input className="input" id="next" name="next" type="password" autoComplete="new-password" minLength={10} required />
      </div>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.ok && <p className="form-ok" role="status">{state.message}</p>}
      <div>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? 'Changing…' : 'Change password'}
        </button>
      </div>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(deleteAccount, {});
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <div>
        <button type="button" className="btn btn-danger" onClick={() => setOpen(true)}>
          Delete my account…
        </button>
      </div>
    );
  }
  return (
    <form action={action} className="stack">
      <p className="small">
        This permanently deletes your account, progress, answers, review schedule and saved items. It can&rsquo;t be undone. You might want to
        download your data first.
      </p>
      <div className="field">
        <label className="label" htmlFor="del-password">
          Password
        </label>
        <input className="input" id="del-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <div className="field">
        <label className="label" htmlFor="del-confirm">
          Type &ldquo;delete&rdquo; to confirm
        </label>
        <input className="input" id="del-confirm" name="confirm" autoComplete="off" required />
      </div>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="row">
        <button type="submit" className="btn btn-danger" disabled={pending}>
          {pending ? 'Deleting…' : 'Delete everything'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
