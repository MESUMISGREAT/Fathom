import { Logo } from '@/components/brand/Logo';
import { Spot } from '@/components/art/Spot';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-wrap" id="main">
      <aside className="auth-side" aria-hidden="true">
        {/* One composed scene (a lesson card, a check answered, the XP it earned), not another grid of subject tiles. */}
        <Spot name="welcome" size={380} className="auth-scene" />
        <p className="auth-side-line">Short lessons, quick checks, and XP for every first-time right answer.</p>
      </aside>
      <div className="auth-card stack stack-lg">
        <div className="auth-brand">
          <Logo size={36} />
        </div>
        {children}
      </div>
    </main>
  );
}
