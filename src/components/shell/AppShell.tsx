import Link from 'next/link';
import type { ReactNode } from 'react';
import type { SessionUser } from '@/server/auth/session';
import type { PointsSummary } from '@/server/queries/points';
import { logOut } from '@/server/actions/auth';
import { Logo } from '@/components/brand/Logo';
import { PointsProvider } from '@/components/points/PointsProvider';
import { TimeZoneSync } from '@/components/points/TimeZoneSync';
import { XpCard, XpChip } from '@/components/points/XpChips';
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
  LogoutIcon,
  MedalIcon,
  PencilIcon,
  RepeatIcon,
  SearchIcon,
  SettingsIcon,
} from '@/components/icons';
import { NavLink } from './NavLink';

export function AppShell({
  user,
  dueCount,
  summary,
  children,
}: {
  user: SessionUser | null;
  dueCount: number;
  summary: PointsSummary | null;
  children: ReactNode;
}) {
  const due = dueCount > 0 ? <span className="count-badge" aria-label={`${dueCount} due`}>{dueCount > 99 ? '99+' : dueCount}</span> : null;
  // Older sessions predate the setting; treat a missing value as on (the default).
  const showPoints = user ? user.showPoints !== false : false;
  const prefs = { showPoints, celebrations: user?.celebrations ?? true, sounds: user?.sounds ?? false };
  const initial = summary ? { totalXp: summary.totalXp, level: summary.level, todayXp: summary.today.xp, goal: summary.today.goal } : null;

  return (
    <PointsProvider signedIn={!!user} prefs={prefs} initial={initial}>
      <div className="shell">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {user && <TimeZoneSync stored={user.timeZone} />}

        <aside className="sidebar" aria-label="Main navigation">
          <div className="sidebar-brand">
            <Logo />
          </div>
          {user && showPoints && <XpCard />}
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
                {showPoints && (
                  <NavLink href="/achievements" className="nav-item">
                    <MedalIcon /> Achievements
                  </NavLink>
                )}
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
                  <button type="submit" className="nav-item nav-button">
                    <LogoutIcon /> Log out
                  </button>
                </form>
              </>
            ) : (
              <div className="sidebar-guest stack stack-sm">
                <p className="tiny muted">Save your progress, get spaced review and earn XP.</p>
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
          <Logo size={30} />
          <div className="grow" />
          {user && showPoints && <XpChip />}
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
            <span className="tab-icon">
              <HomeIcon />
            </span>
            Home
          </NavLink>
          <NavLink href="/subjects" className="tab">
            <span className="tab-icon">
              <BookIcon />
            </span>
            Subjects
          </NavLink>
          {user ? (
            <NavLink href="/review" className="tab">
              <span className="tab-icon">
                <RepeatIcon />
              </span>
              Review {due}
            </NavLink>
          ) : (
            <NavLink href="/search" className="tab">
              <span className="tab-icon">
                <SearchIcon />
              </span>
              Search
            </NavLink>
          )}
          {user ? (
            <NavLink href="/progress" className="tab">
              <span className="tab-icon">
                <ChartIcon />
              </span>
              Progress
            </NavLink>
          ) : (
            <NavLink href="/about" className="tab">
              <span className="tab-icon">
                <InfoIcon />
              </span>
              About
            </NavLink>
          )}
          <NavLink href="/more" className="tab">
            <span className="tab-icon">
              <GridIcon />
            </span>
            More
          </NavLink>
        </nav>
      </div>
    </PointsProvider>
  );
}
