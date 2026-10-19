import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/server/auth/session';
import { AppearanceForm, DeleteAccountForm, PasswordForm, ProfileForm } from '@/components/forms/SettingsForms';
import { PageHead } from '@/components/ui';
import { DownloadIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const user = await requireUser('/settings');
  return (
    <div className="container-narrow stack stack-lg">
      <PageHead title="Settings" />
      <section className="card card-pad stack" aria-labelledby="s-profile">
        <h2 id="s-profile">Profile</h2>
        <ProfileForm displayName={user.displayName} email={user.email} />
      </section>
      <section className="card card-pad stack" aria-labelledby="s-appearance">
        <h2 id="s-appearance">Appearance &amp; lessons</h2>
        <AppearanceForm theme={user.theme} lessonMode={user.lessonMode} />
      </section>
      <section className="card card-pad stack stack-sm" aria-labelledby="s-reminders">
        <h2 id="s-reminders">Reminders</h2>
        <p className="small muted">
          We don&rsquo;t send any reminders or notifications. If we add them, they&rsquo;ll be off until you turn them on, and you&rsquo;ll
          choose when and how often.
        </p>
      </section>
      <section className="card card-pad stack" aria-labelledby="s-password">
        <h2 id="s-password">Password</h2>
        <PasswordForm />
      </section>
      <section className="card card-pad stack" aria-labelledby="s-data">
        <h2 id="s-data">Your data</h2>
        <p className="small muted">
          Download everything we hold about you as a JSON file, or delete your account. <Link href="/privacy">What we store and why</Link>
        </p>
        <div>
          <a className="btn" href="/api/export" download>
            <DownloadIcon /> Download my data
          </a>
        </div>
        <hr style={{ margin: '8px 0' }} />
        <DeleteAccountForm />
      </section>
    </div>
  );
}
