import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="auth-wrap" id="main">
      <div className="auth-card card card-pad stack" style={{ textAlign: 'center' }}>
        <h1 className="h2">We couldn&rsquo;t find that page</h1>
        <p className="muted">It may have moved, or the link might be mistyped.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/search" className="btn">
            Search
          </Link>
        </div>
      </div>
    </main>
  );
}
