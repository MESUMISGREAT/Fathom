import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Spot } from '@/components/art/Spot';

export default function NotFound() {
  return (
    <main className="error-wrap" id="main">
      <div className="error-page">
        <Logo size={32} />
        <Spot name="lost" size={200} />
        <h1 className="h2">We couldn&rsquo;t find that page</h1>
        <p className="muted">We sounded the depths and came up empty. It may have moved, or the link might be mistyped.</p>
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
