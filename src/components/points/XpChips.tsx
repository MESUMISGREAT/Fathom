'use client';
/**
 * Live XP surfaces in the shell: the compact chip in the phone top bar and
 * the level card in the sidebar. Both read the PointsProvider, so the total
 * updates the moment the server returns a result. Hidden when the student
 * has turned points off.
 */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BoltIcon, StarFilledIcon } from '@/components/icons';
import { prefersReducedMotion, usePoints } from './PointsProvider';

/** Counts up to `value` over ~400 ms (instantly with reduced motion). */
function useTween(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value || prefersReducedMotion()) {
      from.current = value;
      setShown(value);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 400);
      const v = Math.round(start + (value - start) * (1 - (1 - k) ** 3));
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return shown;
}

function usePulse(pulse: number) {
  const [on, setOn] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setOn(true);
    const t = setTimeout(() => setOn(false), 700);
    return () => clearTimeout(t);
  }, [pulse]);
  return on;
}

export function XpChip() {
  const p = usePoints();
  const total = useTween(p?.snapshot?.totalXp ?? 0);
  const pulsing = usePulse(p?.pulse ?? 0);
  if (!p || !p.signedIn || !p.prefs.showPoints || !p.snapshot) return null;
  const { level } = p.snapshot;
  return (
    <Link href="/achievements" className="xp-chip" data-pulse={pulsing || undefined}>
      <span className="xp-chip-star" aria-hidden="true">
        <StarFilledIcon />
      </span>
      <span className="xp-chip-total tabular">{total}</span>
      <span className="visually-hidden"> XP,</span>
      <span className="xp-chip-level">Lv {level.level}</span>
      <span className="visually-hidden">. Achievements</span>
      {p.combo >= 2 && (
        <span className="xp-chip-combo" aria-hidden="true">
          <BoltIcon />×{p.combo}
        </span>
      )}
    </Link>
  );
}

export function XpCard() {
  const p = usePoints();
  const total = useTween(p?.snapshot?.totalXp ?? 0);
  const pulsing = usePulse(p?.pulse ?? 0);
  if (!p || !p.signedIn || !p.prefs.showPoints || !p.snapshot) return null;
  const { level, todayXp, goal } = p.snapshot;
  const pct = Math.round(level.progress * 100);
  return (
    <Link href="/achievements" className="xp-card" data-pulse={pulsing || undefined}>
      <span className="xp-card-top">
        <span className="level-coin" aria-hidden="true">
          {level.level}
        </span>
        <span className="xp-card-text">
          <span className="xp-card-title">
            Level {level.level} · {level.title}
          </span>
          <span className="xp-card-total tabular">
            <StarFilledIcon aria-hidden="true" /> {total} XP
            {p.combo >= 2 && (
              <span className="xp-chip-combo">
                <BoltIcon aria-hidden="true" />
                <span className="visually-hidden">combo </span>×{p.combo}
              </span>
            )}
          </span>
        </span>
      </span>
      <span
        className="meter meter-thin meter-xp"
        role="progressbar"
        aria-label={`Level ${level.level + 1} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        style={{ ['--value' as string]: pct }}
      >
        <span />
      </span>
      <span className="xp-card-foot tiny">
        <span>
          {level.xpForNextLevel - level.xpIntoLevel} XP to level {level.level + 1}
        </span>
        {goal > 0 && (
          <span className="tabular">
            Today {Math.min(todayXp, 9999)}/{goal}
          </span>
        )}
      </span>
    </Link>
  );
}
