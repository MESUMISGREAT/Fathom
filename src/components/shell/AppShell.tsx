import Link from 'next/link';
import type { ReactNode } from 'react';
import { BRAND } from '@/lib/brand';
import type { SessionUser } from '@/server/auth/session';
import { logOut } from '@/server/actions/auth';
import {
  BookIcon,
  BookmarkIcon,
  ChartIcon,
  ChatIcon,
  ClockIcon,
  FlagIcon,
  GridIcon,
  HomeIcon,
  InfoIcon,
  LogoMark,
  LogoutIcon,
  PencilIcon,
  RepeatIcon,
  SearchIcon,
  SettingsIcon,
} from '@/components/icons';
import { NavLink } from './NavLink';

function Brand() {
  return (
    <Link href="/" className="brand" aria-label={`${BRAND} home`}>
      <span className="brand-mark">
        <LogoMark />
      </span>
      {BRAND}
    </Link>
  );
}

export function AppShell({ user, dueCount, children }: { user: SessionUser | null; dueCount: number; children: ReactNode }) {
  const due = dueCount > 0 ? <span className="count-badge" aria-label={`${dueCount} due`}>{dueCount > 99 ? '99+' : dueCount}</span> : null;
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <aside className="sidebar" aria-label="Main navigation">
        <Brand />
        <nav className="nav-group" aria-label="Study">
          <NavLink href="/" className="nav-item">
            <HomeIcon /> Home
          </NavLink>
          <NavLink href="/subjects" className="nav-item">
            <BookIcon /> Subjects
          </NavLink>
          {user && (
            <NavLink href="/review" className="nav-item">
              <RepeatIcon /> Review {due}
            </NavLink>
          )}
          <NavLink href="/search" className="nav-item">
            <SearchIcon /> Search
          </NavLink>
          {user && (
            <>
              <NavLink href="/progress" className="nav-item">
                <ChartIcon /> Progress
              </NavLink>
              <NavLink href="/saved" className="nav-item">
                <BookmarkIcon /> Saved
              </NavLink>
              <NavLink href="/history" className="nav-item">
                <ClockIcon /> History
              </NavLink>
            </>
          )}
        </nav>
        <nav className="nav-group" aria-label="Coming next">
          <div className="nav-label">Coming next</div>
          <NavLink href="/practice" className="nav-item">
            <PencilIcon /> Exam practice <span className="badge soon">Soon</span>
          </NavLink>
          <NavLink href="/tutor" className="nav-item">
            <ChatIcon /> AI tutor <span className="badge soon">Soon</span>
          </NavLink>
        </nav>
        <div className="nav-spacer" />
        <nav className="nav-group" aria-label="Account">
          <NavLink href="/about" className="nav-item">
            <InfoIcon /> How it works
          </NavLink>
          {user && (user.role === 'editor' || user.role === 'admin') && (
            <NavLink href="/reports" className="nav-item">
              <FlagIcon /> Content reports
            </NavLink>
          )}
          {user ? (
            <>
              <NavLink href="/settings" className="nav-item">
                <SettingsIcon /> Settings
              </NavLink>
              <form action={logOut}>
                <button type="submit" className="nav-item" style={{ width: '100%', border: 0, background: 'none', cursor: 'pointer' }}>
                  <LogoutIcon /> Log out
                </button>
              </form>
            </>
          ) : (
            <div className="stack stack-sm" style={{ padding: '8px 4px' }}>
              <Link href="/signup" className="btn btn-primary btn-block">
                Create free account
              </Link>
              <Link href="/login" className="btn btn-block">
                Log in
              </Link>
            </div>
          )}
        </nav>
      </aside>

      <header className="topbar">
        <Brand />
        <div className="grow" />
        <Link href="/search" className="icon-btn" aria-label="Search">
          <SearchIcon />
        </Link>
        {user ? (
          <Link href="/settings" className="icon-btn" aria-label="Settings">
            <SettingsIcon />
          </Link>
        ) : (
          <Link href="/login" className="btn btn-sm">
            Log in
          </Link>
        )}
      </header>

      <main id="main" className="main" tabIndex={-1}>
        {children}
      </main>

      <nav className="tabbar" aria-label="Main navigation">
        <NavLink href="/" className="tab">
          <HomeIcon /> Home
        </NavLink>
        <NavLink href="/subjects" className="tab">
          <BookIcon /> Subjects
        </NavLink>
        {user ? (
          <NavLink href="/review" className="tab">
            <RepeatIcon /> Review {due}
          </NavLink>
        ) : (
          <NavLink href="/search" className="tab">
            <SearchIcon /> Search
          </NavLink>
        )}
        {user ? (
          <NavLink href="/progress" className="tab">
            <ChartIcon /> Progress
          </NavLink>
        ) : (
          <NavLink href="/about" className="tab">
            <InfoIcon /> About
          </NavLink>
        )}
        <NavLink href="/more" className="tab">
          <GridIcon /> More
        </NavLink>
      </nav>
    </div>
  );
}
