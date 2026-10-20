/**
 * The Fathom mark and wordmark. The mark is a sounding line: a weight
 * dropping below the surface, i.e. getting to the bottom of an idea. Fixed
 * brand colours (cobalt, cream, coral) in both themes, so it is recognisable.
 */
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg className={`logo-mark${className ? ` ${className}` : ''}`} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="12" fill="#2d4bd1" />
      <path d="M7.5 15.5c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 6.6 0 3.3-2.4 5.2-1.2" fill="none" stroke="#fbf5ea" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 19.5v5.5" stroke="#fbf5ea" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 24.5c2.9 0 4.6 2 4.6 4.3a4.6 4.6 0 0 1-9.2 0c0-2.3 1.7-4.3 4.6-4.3z" fill="#ff6b4a" />
    </svg>
  );
}

/** Mark + wordmark, linking home. */
export function Logo({ size = 32, label = `${BRAND} home` }: { size?: number; label?: string }) {
  return (
    <Link href="/" className="brand" aria-label={label}>
      <LogoMark size={size} />
      <span className="wordmark" aria-hidden="true">
        {BRAND.toLowerCase()}
      </span>
    </Link>
  );
}
