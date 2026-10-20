import { Logo } from '@/components/brand/Logo';
import { SubjectMotif } from '@/components/art/SubjectMotif';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-wrap" id="main">
      <aside className="auth-side" aria-hidden="true">
        <div className="auth-motifs">
          {['9709', '9618', '9702', '9701'].map((code) => (
            <span key={code} className="auth-motif" data-subject={code}>
              <SubjectMotif code={code} />
            </span>
          ))}
        </div>
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
