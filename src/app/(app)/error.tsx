'use client';
import Link from 'next/link';

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-narrow">
      <div className="card card-pad stack" role="alert">
        <h1 className="h2">Something went wrong on our side</h1>
        <p className="muted">Your progress is safe. Try again, and if it keeps happening, come back in a little while.</p>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
