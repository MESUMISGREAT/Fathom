'use client';
import { useActionState, useId, useState, useTransition } from 'react';
import { changePassword, deleteAccount, updatePreferences, updateProfile, type FormState } from '@/server/actions/settings';
import { DAILY_GOALS } from '@/domain/points';
import { playSound } from '@/components/points/sounds';

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
        <button type="submit" className="btn" disabled={pending} aria-busy={pending || undefined}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export function AppearanceForm({ theme, lessonMode }: { theme: 'system' | 'light' | 'dark'; lessonMode: 'steps' | 'full' }) {
  const [t, setT] = useState(theme);
  const [m, setM] = useState(lessonMode);
  // While a save is in flight the controls are aria-disabled, not disabled: a disabled button loses keyboard focus.
  // `pending` tracks the save itself, not the transition (which also waits for the page refresh after it).
  const [pending, setPending] = useState(false);
  const [, start] = useTransition();
  const save = (patch: { theme?: typeof t; lessonMode?: typeof m }) => {
    setPending(true);
    start(async () => {
      await updatePreferences(patch).catch(() => null);
      setPending(false);
      if (patch.theme) {
        // Apply immediately without waiting for navigation.
        if (patch.theme === 'system') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', patch.theme);
      }
    });
  };
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
              aria-disabled={pending || undefined}
              onClick={() => {
                if (pending) return;
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
          <button type="button" aria-pressed={m === 'steps'} aria-disabled={pending || undefined} onClick={() => pending || (setM('steps'), save({ lessonMode: 'steps' }))}>
            One step at a time
          </button>
          <button type="button" aria-pressed={m === 'full'} aria-disabled={pending || undefined} onClick={() => pending || (setM('full'), save({ lessonMode: 'full' }))}>
            Whole lesson
          </button>
        </div>
        <p className="help">Step by step shows a little at a time, with a quick check before the next part. You can switch inside any lesson.</p>
      </div>
      <p className="help">Animations follow your device&rsquo;s &ldquo;reduce motion&rdquo; setting, and contrast settings are respected too.</p>
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
        <button type="submit" className="btn" disabled={pending} aria-busy={pending || undefined}>
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
        <button type="submit" className="btn btn-danger" disabled={pending} aria-busy={pending || undefined}>
          {pending ? 'Deleting…' : 'Delete everything'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * A labelled on/off switch that saves as soon as it is flipped. While a save
 * is pending it is aria-disabled (and ignores presses) rather than disabled,
 * so the switch keeps keyboard focus.
 */
function SwitchRow({
  label,
  help,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  const id = useId();
  // The whole row is a <label>, so tapping the words flips the switch too (a bigger target than the switch alone).
  return (
    <label className="switch-row" data-disabled={disabled || undefined}>
      <span className="switch-label" id={`${id}-label`}>
        {label}
      </span>
      <span className="help" id={`${id}-help`}>
        {help}
      </span>
      <button
        type="button"
        role="switch"
        className="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-help`}
        aria-disabled={disabled || undefined}
        onClick={() => {
          if (!disabled) onChange(!checked);
        }}
      />
    </label>
  );
}

export function PointsForm({
  showPoints,
  dailyGoal,
  celebrations,
  sounds,
}: {
  showPoints: boolean;
  dailyGoal: number;
  celebrations: boolean;
  sounds: boolean;
}) {
  const [prefs, setPrefs] = useState({ showPoints, dailyGoal, celebrations, sounds });
  const [saved, setSaved] = useState<string | null>(null);
  // The save itself, not the transition (which also waits for the page refresh after it): controls take input
  // again as soon as the "saved" message shows.
  const [pending, setPending] = useState(false);
  const [, start] = useTransition();
  const save = (patch: Partial<typeof prefs>, message: string) => {
    const before = prefs;
    setPrefs((p) => ({ ...p, ...patch }));
    setSaved(null);
    setPending(true);
    start(async () => {
      const ok = await updatePreferences(patch).then(
        (r) => r.ok,
        () => false,
      );
      setPending(false);
      // Never show a setting that wasn't saved: put the control back.
      if (!ok) setPrefs(before);
      setSaved(ok ? message : 'That didn’t save. Please try again.');
    });
  };
  return (
    <div className="stack stack-sm">
      <div>
        <SwitchRow
          label="Show points and badges"
          help="XP, levels, combos and badges. Turning this off hides them everywhere; XP is still recorded, so turning it back on shows your real history."
          checked={prefs.showPoints}
          disabled={pending}
          onChange={(v) => save({ showPoints: v }, v ? 'Points and badges are back.' : 'Points and badges are hidden.')}
        />
        <SwitchRow
          label="Celebrations"
          help="A little confetti when you finish a lesson. Always off if your device asks for reduced motion."
          checked={prefs.celebrations}
          disabled={pending}
          onChange={(v) => save({ celebrations: v }, v ? 'Celebrations on.' : 'Celebrations off.')}
        />
        <SwitchRow
          label="Sounds"
          help="Short blips for right answers and badges."
          checked={prefs.sounds}
          disabled={pending}
          onChange={(v) => {
            if (v) playSound('correct');
            save({ sounds: v }, v ? 'Sounds on.' : 'Sounds off.');
          }}
        />
      </div>
      <div className="field" style={{ paddingTop: 8 }}>
        <span className="label" id="goal-label">
          Daily goal
        </span>
        <div className="segmented segmented-cards" role="group" aria-labelledby="goal-label">
          {DAILY_GOALS.map((g) => (
            <button
              key={g.xp}
              type="button"
              aria-pressed={prefs.dailyGoal === g.xp}
              aria-disabled={pending || undefined}
              onClick={() => pending || save({ dailyGoal: g.xp }, g.xp ? `Daily goal set to ${g.xp} XP.` : 'Daily goal turned off.')}
            >
              <span className="seg-name">{g.name}</span>
              <span className="seg-sub">{g.xp ? `${g.xp} XP` : 'No goal'}</span>
            </button>
          ))}
        </div>
        <p className="help">XP to aim for each day. Reaching it adds a small bonus. No goal means no ring and no bonus, and nothing is ever lost.</p>
      </div>
      <p className="small" role="status" aria-live="polite" style={{ minHeight: '1.5em', color: 'var(--text-2)' }}>
        {saved}
      </p>
    </div>
  );
}
