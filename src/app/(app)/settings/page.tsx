import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/server/auth/session';
import { AppearanceForm, DeleteAccountForm, PasswordForm, PointsForm, ProfileForm } from '@/components/forms/SettingsForms';
import { PageHead } from '@/components/ui';
import { DownloadIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const user = await requireUser('/settings');
  return (
    <div className="container-narrow">
      <PageHead title="Settings" />
      {/* Plain sections on the page, divided by rules: only the destructive action is boxed. */}
      <div className="settings">
        <section className="settings-section" aria-labelledby="s-profile">
          <div className="settings-intro">
            <h2 id="s-profile">Profile</h2>
          </div>
          <ProfileForm displayName={user.displayName} email={user.email} />
        </section>
        <section className="settings-section" aria-labelledby="s-appearance">
          <div className="settings-intro">
            <h2 id="s-appearance">Appearance &amp; lessons</h2>
          </div>
          <AppearanceForm theme={user.theme} lessonMode={user.lessonMode} />
        </section>
        <section className="settings-section" aria-labelledby="s-points">
          <div className="settings-intro">
            <h2 id="s-points">Points and celebrations</h2>
          </div>
          <PointsForm showPoints={user.showPoints !== false} dailyGoal={user.dailyGoal} celebrations={user.celebrations} sounds={user.sounds} />
        </section>
        <section className="settings-section" aria-labelledby="s-reminders">
          <div className="settings-intro">
            <h2 id="s-reminders">Reminders</h2>
          </div>
          <p className="small muted">
            We don&rsquo;t send any reminders or notifications. If we add them, they&rsquo;ll be off until you turn them on, and you&rsquo;ll
            choose when and how often.
          </p>
        </section>
        <section className="settings-section" aria-labelledby="s-password">
          <div className="settings-intro">
            <h2 id="s-password">Password</h2>
          </div>
          <PasswordForm />
        </section>
        <section className="settings-section" aria-labelledby="s-data">
          <div className="settings-intro">
            <h2 id="s-data">Your data</h2>
          </div>
          <div className="stack">
            <p className="small muted">
              Download everything we hold about you as a JSON file, or delete your account. <Link href="/privacy">What we store and why</Link>
            </p>
            <div>
              <a className="btn" href="/api/export" download>
                <DownloadIcon /> Download my data
              </a>
            </div>
            <div className="danger-zone stack stack-sm">
              <h3 className="small" style={{ fontWeight: 800 }}>
                Delete account
              </h3>
              <DeleteAccountForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
