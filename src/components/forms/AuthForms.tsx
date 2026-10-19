'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { logIn, signUp, type AuthState } from '@/server/actions/auth';
import { BRAND } from '@/lib/brand';

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(logIn, {});
  return (
    <form action={action} className="card card-pad stack" noValidate>
      <h1 className="h2">Welcome back</h1>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <input type="hidden" name="next" value={next ?? ''} />
      <div className="field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required defaultValue={state.fields?.email} />
      </div>
      <div className="field">
        <label className="label" htmlFor="password">
          Password
        </label>
        <input className="input" id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={pending}>
        {pending ? 'Logging in…' : 'Log in'}
      </button>
      <p className="small muted" style={{ textAlign: 'center' }}>
        New here? <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'}>Create a free account</Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, {});
  return (
    <form action={action} className="card card-pad stack" noValidate>
      <div className="stack stack-xs">
        <h1 className="h2">Create your account</h1>
        <p className="small muted">Free. We only ask for what we need to save your progress.</p>
      </div>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="field">
        <label className="label" htmlFor="displayName">
          First name <span className="faint">(optional)</span>
        </label>
        <input className="input" id="displayName" name="displayName" autoComplete="given-name" maxLength={40} defaultValue={state.fields?.displayName} />
      </div>
      <div className="field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required defaultValue={state.fields?.email} />
      </div>
      <div className="field">
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          aria-describedby="password-help"
        />
        <p className="help" id="password-help">
          At least 10 characters. A short phrase is easier to remember than a jumble.
        </p>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="ageConfirmed" required />
        <span>
          I&rsquo;m 13 or older, and if the law where I live requires it, a parent or guardian has agreed to me using {BRAND}.{' '}
          <Link href="/privacy">How we use your data</Link>
        </span>
      </label>
      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={pending}>
        {pending ? 'Creating account…' : 'Create account'}
      </button>
      <p className="small muted" style={{ textAlign: 'center' }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}
