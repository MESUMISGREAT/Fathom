'use client';
/**
 * The browser side of points: holds the XP total and level shown in the
 * header (starting from the server's summary and updated from each
 * PointsResult the server returns), shows badge / level / goal toasts in one
 * polite live region, throws a little confetti and plays optional sounds.
 *
 * Nothing here computes XP: every number comes from the server.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { LevelInfo, PointsResult } from '@/domain/points';
import { BadgeArt } from '@/components/art/BadgeArt';
import { ArrowUpIcon, GoalIcon, XIcon } from '@/components/icons';
import { playSound, type SoundKind } from './sounds';

export interface PointsPrefs {
  /** XP chips, pops, toasts and badges are visible. */
  showPoints: boolean;
  /** Confetti and pops (always off under prefers-reduced-motion). */
  celebrations: boolean;
  sounds: boolean;
}

export interface PointsSnapshot {
  totalXp: number;
  level: LevelInfo;
  todayXp: number;
  goal: number;
}

interface Toast {
  id: number;
  kind: 'badge' | 'level' | 'goal';
  title: string;
  body: string;
  badgeId?: string;
  /** Superseded by newer rewards: shown only briefly. */
  short?: boolean;
}

interface PointsContextValue {
  signedIn: boolean;
  prefs: PointsPrefs;
  snapshot: PointsSnapshot | null;
  combo: number;
  /** Increments whenever the total changes, so the header chip can pulse. */
  pulse: number;
  /** Take in a server result: totals, combo, and toasts for new badges, levels and the daily goal. */
  apply: (points: PointsResult | null | undefined) => void;
  celebrate: () => void;
  play: (kind: SoundKind) => void;
}

const PointsContext = createContext<PointsContextValue | null>(null);

export function usePoints() {
  return useContext(PointsContext);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const TOAST_MS = 6500;
/** Shorter when more are waiting, so a burst of rewards doesn't linger. */
const TOAST_MS_QUEUED = 4500;
/** Older toasts when a newer reward arrives (finishing a lesson right after a level-up). */
const TOAST_MS_SUPERSEDED = 1500;
const TOAST_ORDER: Record<Toast['kind'], number> = { badge: 0, level: 1, goal: 2 };
let toastSeq = 0;

/** Phones show one toast at a time (they stay small and clear of the content); wider screens two. */
function useVisibleToasts() {
  const [max, setMax] = useState(2);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 959px)');
    const update = () => setMax(mq.matches ? 1 : 2);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return max;
}

export function PointsProvider({
  signedIn,
  prefs,
  initial,
  children,
}: {
  signedIn: boolean;
  prefs: PointsPrefs;
  initial: PointsSnapshot | null;
  children: ReactNode;
}) {
  const [snapshot, setSnapshot] = useState<PointsSnapshot | null>(initial);
  const [combo, setCombo] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confetti, setConfetti] = useState(0);
  const maxVisible = useVisibleToasts();
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // A fresh server render (e.g. after finishing a lesson) is the source of truth.
  const initialKey = initial ? `${initial.totalXp}|${initial.goal}|${initial.todayXp}` : 'none';
  useEffect(() => {
    setSnapshot(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  const play = useCallback((kind: SoundKind) => {
    if (prefsRef.current.sounds) playSound(kind);
  }, []);

  const celebrate = useCallback(() => {
    if (!prefsRef.current.celebrations || prefersReducedMotion()) return;
    setConfetti((n) => n + 1);
  }, []);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const apply = useCallback(
    (points: PointsResult | null | undefined) => {
      if (!points) return;
      setSnapshot({ totalXp: points.totalXp, level: points.level, todayXp: points.today.xp, goal: points.today.goal });
      setCombo(points.combo);
      if (points.gained > 0) setPulse((n) => n + 1);
      if (!prefsRef.current.showPoints) return;

      const fresh: Toast[] = [];
      for (const b of points.newBadges) fresh.push({ id: ++toastSeq, kind: 'badge', title: b.name, body: b.description, badgeId: b.id });
      if (points.leveledUp) {
        const { level, title, xpForNextLevel, xpIntoLevel } = points.level;
        fresh.push({ id: ++toastSeq, kind: 'level', title: `Level ${level} · ${title}`, body: `${xpForNextLevel - xpIntoLevel} XP to level ${level + 1}.` });
      }
      if (points.today.justMetGoal && points.today.goal > 0) fresh.push({ id: ++toastSeq, kind: 'goal', title: 'Daily goal reached', body: `${points.today.xp} XP today. That's the goal.` });
      if (fresh.length) {
        fresh.sort((a, b) => TOAST_ORDER[a.kind] - TOAST_ORDER[b.kind]);
        // Newest first (badges first among them); older ones are cut short rather than dropped.
        setToasts((list) => [...fresh, ...list.map((t) => ({ ...t, short: true }))].slice(0, 12));
        play(points.newBadges.length ? 'badge' : 'level');
      } else if (points.gained > 0) {
        play('correct');
      }
    },
    [play],
  );

  const value = useMemo<PointsContextValue>(
    () => ({ signedIn, prefs, snapshot, combo, pulse, apply, celebrate, play }),
    [signedIn, prefs, snapshot, combo, pulse, apply, celebrate, play],
  );

  return (
    <PointsContext.Provider value={value}>
      {children}
      {/* A fixed home in the chrome (the sidebar column on wide screens, over the top bar on phones), never over the lesson. */}
      <div className="toaster" aria-live="polite" aria-label="Rewards" role="region">
        {toasts.slice(0, maxVisible).map((t) => (
          <ToastCard
            key={t.id}
            toast={t}
            onDismiss={dismiss}
            ms={t.short ? TOAST_MS_SUPERSEDED : toasts.length > maxVisible ? TOAST_MS_QUEUED : TOAST_MS}
          />
        ))}
      </div>
      {confetti > 0 && <Confetti key={confetti} />}
    </PointsContext.Provider>
  );
}

function ToastCard({ toast, onDismiss, ms }: { toast: Toast; onDismiss: (id: number) => void; ms: number }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => onDismiss(toast.id), ms);
    return () => clearTimeout(t);
  }, [paused, toast.id, onDismiss, ms]);
  return (
    <div
      className="toast"
      data-kind={toast.kind}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="toast-art">
        {toast.kind === 'badge' && toast.badgeId ? (
          <BadgeArt id={toast.badgeId} size={48} />
        ) : toast.kind === 'level' ? (
          <span className="toast-glyph" data-kind="level">
            <ArrowUpIcon />
          </span>
        ) : (
          <span className="toast-glyph" data-kind="goal">
            <GoalIcon />
          </span>
        )}
      </span>
      <span className="toast-text">
        <span className="toast-kicker">{toast.kind === 'badge' ? 'Badge unlocked' : toast.kind === 'level' ? 'Level up' : 'Nice'}</span>
        <span className="toast-title">{toast.title}</span>
        <span className="toast-body">{toast.body}</span>
      </span>
      <button type="button" className="icon-btn toast-close" aria-label={`Dismiss: ${toast.title}`} onClick={() => onDismiss(toast.id)}>
        <XIcon />
      </button>
    </div>
  );
}

const CONFETTI_COLOURS = ['var(--coral)', 'var(--yellow)', 'var(--mint)', 'var(--lavender)', 'var(--sky)', 'var(--pink)'];

/** Light confetti from the top of the screen; gone after under two seconds. */
function Confetti() {
  const [on, setOn] = useState(true);
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        x: Math.round(Math.random() * 100),
        drift: Math.round((Math.random() - 0.5) * 160),
        spin: Math.round((Math.random() - 0.5) * 720),
        delay: Math.round(Math.random() * 260),
        dur: 1100 + Math.round(Math.random() * 600),
        c: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
        round: i % 3 === 0,
      })),
    [],
  );
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 2000);
    return () => clearTimeout(t);
  }, []);
  if (!on) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          data-round={p.round || undefined}
          style={{
            left: `${p.x}%`,
            background: p.c,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.dur}ms`,
            ['--drift' as string]: `${p.drift}px`,
            ['--spin' as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
