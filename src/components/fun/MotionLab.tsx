'use client';
/**
 * Style-guide playground: fires each animation in the points vocabulary so
 * it can be reviewed (and copied). Not used by the app itself.
 */
import { useEffect, useRef, useState } from 'react';
import { BoltIcon, CheckIcon, SparkIcon, XIcon } from '@/components/icons';
import { Combo, Confetti, GoalRing, StreakChip, Toast, ToastRegion, XpChip, XpPop, type ToastKind } from './index';

const TOASTS: Array<{ kind: ToastKind; title: string; body: string }> = [
  { kind: 'badge', title: 'Badge earned: First Spark', body: 'Your first correct answer. Many more to come.' },
  { kind: 'level', title: 'Level 3 reached', body: '150 XP and climbing. Next stop: level 4.' },
  { kind: 'goal', title: 'Daily goal reached', body: '+10 XP bonus. Back at it tomorrow?' },
  { kind: 'streak', title: '7-day streak', body: 'You earned a streak freeze for a day off.' },
];

export function MotionLab() {
  const [xp, setXp] = useState(30);
  const [pops, setPops] = useState<number[]>([]);
  const [combo, setCombo] = useState(0);
  const [comboKey, setComboKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [mark, setMark] = useState<'right' | 'wrong' | null>(null);
  const [toast, setToast] = useState<{ i: number; leaving: boolean } | null>(null);
  const [confetti, setConfetti] = useState<number | null>(null);
  const [calm, setCalm] = useState(false);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  useEffect(() => {
    if (calm) document.documentElement.setAttribute('data-celebrations', 'off');
    else document.documentElement.removeAttribute('data-celebrations');
    return () => document.documentElement.removeAttribute('data-celebrations');
  }, [calm]);

  function award(n: number) {
    const id = Date.now();
    setXp((v) => v + n);
    setPops((p) => [...p, id]);
    later(() => setPops((p) => p.filter((x) => x !== id)), 1400);
  }
  function correct() {
    setMark('right');
    setShakeKey((k) => k + 1);
    setCombo((c) => c + 1);
    setComboKey((k) => k + 1);
    award(15);
  }
  function wrong() {
    setMark('wrong');
    setShakeKey((k) => k + 1);
    setCombo(0);
  }
  function showToast() {
    const i = toast ? (toast.i + 1) % TOASTS.length : 0;
    setToast({ i, leaving: false });
    later(() => setToast((t) => (t && t.i === i ? { i, leaving: true } : t)), 2800);
    later(() => setToast((t) => (t && t.i === i ? null : t)), 3050);
  }
  function fireConfetti() {
    const seed = Date.now() % 1000;
    setConfetti(seed);
    later(() => setConfetti((c) => (c === seed ? null : c)), 4200);
  }

  const t = toast ? TOASTS[toast.i]! : null;
  return (
    <div className="stack stack-lg">
      <div className="row" style={{ ['--gap' as string]: '10px' }}>
        <XpChip xp={xp} bump key={`xp-${xp}`} />
        <GoalRing xp={Math.min(xp, 50)} goal={50} bump={xp >= 50} />
        <StreakChip days={6} />
        {combo >= 2 && <Combo key={comboKey} count={combo} />}
      </div>

      <div className="question" data-outcome={mark === 'right' ? 'correct' : mark === 'wrong' ? 'incorrect' : undefined} key={shakeKey}>
        <p className="q-prompt">Tap a button below to replay the answer feedback.</p>
        <div className="q-body">
          <div className="options">
            <div className="option" data-mark={mark ?? undefined}>
              <span className="option-key" aria-hidden="true">
                A
              </span>
              <span>{mark === 'wrong' ? 'A wrong answer shakes gently' : mark === 'right' ? 'A right answer pops' : 'An answer option'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ ['--gap' as string]: '10px' }}>
        <span className="pop-anchor">
          <button type="button" className="btn btn-success" onClick={correct}>
            <CheckIcon /> Correct (+15 XP, combo)
          </button>
          {pops.map((id) => (
            <XpPop key={id} amount={15} />
          ))}
        </span>
        <button type="button" className="btn" onClick={wrong}>
          <XIcon /> Wrong (combo resets)
        </button>
        <button type="button" className="btn btn-gold" onClick={showToast}>
          <BoltIcon /> Next toast
        </button>
        <button type="button" className="btn btn-primary" onClick={fireConfetti}>
          <SparkIcon /> Confetti
        </button>
        <label className="checkbox" style={{ alignItems: 'center' }}>
          <input type="checkbox" className="switch" role="switch" checked={!calm} onChange={(e) => setCalm(!e.target.checked)} />
          <span className="small">Celebrations {calm ? 'off' : 'on'}</span>
        </label>
      </div>

      <ToastRegion>{t && toast && <Toast key={toast.i} kind={t.kind} title={t.title} body={t.body} leaving={toast.leaving} />}</ToastRegion>
      {confetti !== null && <Confetti key={confetti} seed={confetti} />}
    </div>
  );
}
