import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser } from '@/server/auth/session';
import { logOut } from '@/server/actions/auth';
import { BookmarkIcon, ChatIcon, ChevronRightIcon, ClockIcon, InfoIcon, LockIcon, LogoutIcon, PencilIcon, SearchIcon, SettingsIcon } from '@/components/icons';
import { PageHead } from '@/components/ui';

export const metadata: Metadata = { title: 'More' };

export default async function MorePage() {
  const user = await getSessionUser();
  const items = [
    ...(user
      ? [
          { href: '/saved', label: 'Saved', Icon: BookmarkIcon },
          { href: '/history', label: 'History', Icon: ClockIcon },
        ]
      : []),
    { href: '/search', label: 'Search', Icon: SearchIcon },
    { href: '/practice', label: 'Exam practice (coming next)', Icon: PencilIcon },
    { href: '/tutor', label: 'AI tutor (coming next)', Icon: ChatIcon },
    { href: '/about', label: 'How it works', Icon: InfoIcon },
    { href: '/privacy', label: 'Privacy', Icon: LockIcon },
    ...(user ? [{ href: '/settings', label: 'Settings', Icon: SettingsIcon }] : []),
  ];
  return (
    <div className="container-narrow">
      <PageHead title="More" />
      <ul className="list card card-pad list-rows">
        {items.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link href={href} className="list-row">
              <Icon width={20} height={20} style={{ color: 'var(--text-2)' }} />
              <span className="grow">{label}</span>
              <ChevronRightIcon width={18} height={18} style={{ color: 'var(--text-3)' }} />
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 20 }}>
        {user ? (
          <form action={logOut}>
            <button type="submit" className="btn btn-block">
              <LogoutIcon /> Log out
            </button>
          </form>
        ) : (
          <div className="stack stack-sm">
            <Link href="/signup" className="btn btn-primary btn-block">
              Create free account
            </Link>
            <Link href="/login" className="btn btn-block">
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
