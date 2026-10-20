import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { LogoMark } from '@/components/icons';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-wrap" id="main">
      <div className="auth-card stack stack-lg">
        <Link href="/" className="brand" style={{ alignSelf: 'center' }}>
          <span className="brand-mark">
            <LogoMark />
          </span>
          {BRAND}
        </Link>
        {children}
      </div>
    </main>
  );
}
