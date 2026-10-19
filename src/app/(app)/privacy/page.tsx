import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { AlertIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  return (
    <div className="container-narrow stack stack-lg">
      <PageHead title="Privacy" lede={`What ${BRAND} stores, why, and how you stay in control. In plain English.`} />
      <p className="notice notice-warn small">
        <AlertIcon />
        <span>This is a working summary for an early version of the product. It needs legal review before a public launch.</span>
      </p>
      <section className="card card-pad prose">
        <h2 className="h3">What we store</h2>
        <ul>
          <li>Your email address and a securely hashed password (we can&rsquo;t see your password).</li>
          <li>Your first name, if you choose to give it.</li>
          <li>The date you confirmed the age statement when signing up.</li>
          <li>Your subjects and target level, lesson progress, your answers to questions, your review schedule and saved items.</li>
          <li>Your theme and lesson display preferences.</li>
        </ul>
        <h2 className="h3">What we don&rsquo;t do</h2>
        <ul>
          <li>No adverts, no tracking scripts, no selling or sharing your data.</li>
          <li>No AI processing of your data in this version. Nothing you type is sent to an AI provider.</li>
          <li>No photo uploads yet. When they arrive, we&rsquo;ll ask before processing any image, explain where it goes, and let you delete it.</li>
          <li>We won&rsquo;t use your work to train AI models without your explicit permission.</li>
        </ul>
        <h2 className="h3">Cookies</h2>
        <p>
          Two: a sign-in cookie (so you stay logged in) and a theme cookie (so pages load in light or dark mode without a flash). Neither tracks
          you across sites.
        </p>
        <h2 className="h3">Your control</h2>
        <ul>
          <li>
            Download all your data, or delete your account and everything linked to it, from <Link href="/settings">Settings</Link>.
          </li>
          <li>Deleting your account removes your progress, answers, review schedule and saved items straight away.</li>
        </ul>
      </section>
    </div>
  );
}
