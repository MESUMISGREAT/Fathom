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

function NavIcon({ hue, children }: { hue: string; children: ReactNode }) {
  return (
    <span className="nav-icon" style={{ ['--hue' as string]: hue }}>
      {children}
    </span>
  );
}

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
            <NavIcon hue="var(--primary)"><HomeIcon /></NavIcon> Home
          </NavLink>
          <NavLink href="/subjects" className="nav-item">
            <NavIcon hue="var(--sub-9618)"><BookIcon /></NavIcon> Subjects
          </NavLink>
          {user && (
            <NavLink href="/review" className="nav-item">
              <NavIcon hue="var(--flame-text)"><RepeatIcon /></NavIcon> Review {due}
            </NavLink>
          )}
          <NavLink href="/search" className="nav-item">
            <NavIcon hue="var(--sub-9709)"><SearchIcon /></NavIcon> Search
          </NavLink>
          {user && (
            <>
              <NavLink href="/progress" className="nav-item">
                <NavIcon hue="var(--good)"><ChartIcon /></NavIcon> Progress
              </NavLink>
              <NavLink href="/saved" className="nav-item">
                <NavIcon hue="var(--xp-text)"><BookmarkIcon /></NavIcon> Saved
              </NavLink>
              <NavLink href="/history" className="nav-item">
                <NavIcon hue="var(--sub-9618)"><ClockIcon /></NavIcon> History
              </NavLink>
            </>
          )}
        </nav>
        <nav className="nav-group" aria-label="Coming next">
          <div className="nav-label">Coming next</div>
          <NavLink href="/practice" className="nav-item">
            <NavIcon hue="var(--text-3)"><PencilIcon /></NavIcon> Exam practice <span className="badge soon">Soon</span>
          </NavLink>
          <NavLink href="/tutor" className="nav-item">
            <NavIcon hue="var(--text-3)"><ChatIcon /></NavIcon> AI tutor <span className="badge soon">Soon</span>
          </NavLink>
        </nav>
        <div className="nav-spacer" />
        <nav className="nav-group" aria-label="Account">
          <NavLink href="/about" className="nav-item">
            <NavIcon hue="var(--accent)"><InfoIcon /></NavIcon> How it works
          </NavLink>
          {user && (user.role === 'editor' || user.role === 'admin') && (
            <NavLink href="/reports" className="nav-item">
              <NavIcon hue="var(--bad)"><FlagIcon /></NavIcon> Content reports
            </NavLink>
          )}
          {user ? (
            <>
              <NavLink href="/settings" className="nav-item">
                <NavIcon hue="var(--text-3)"><SettingsIcon /></NavIcon> Settings
              </NavLink>
              <form action={logOut}>
                <button type="submit" className="nav-item" style={{ width: '100%', background: 'none', cursor: 'pointer' }}>
                  <NavIcon hue="var(--text-3)"><LogoutIcon /></NavIcon> Log out
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
          <span className="tab-icon"><HomeIcon /></span> Home
        </NavLink>
        <NavLink href="/subjects" className="tab">
          <span className="tab-icon"><BookIcon /></span> Subjects
        </NavLink>
        {user ? (
          <NavLink href="/review" className="tab">
            <span className="tab-icon"><RepeatIcon /></span> Review {due}
          </NavLink>
        ) : (
          <NavLink href="/search" className="tab">
            <span className="tab-icon"><SearchIcon /></span> Search
          </NavLink>
        )}
        {user ? (
          <NavLink href="/progress" className="tab">
            <span className="tab-icon"><ChartIcon /></span> Progress
          </NavLink>
        ) : (
          <NavLink href="/about" className="tab">
            <span className="tab-icon"><InfoIcon /></span> About
          </NavLink>
        )}
        <NavLink href="/more" className="tab">
          <span className="tab-icon"><GridIcon /></span> More
        </NavLink>
      </nav>
    </div>
  );
}
