/**
 * Tiny Web Audio blips, generated on the fly (no audio files). Only played
 * when the student has turned Sounds on in Settings (off by default).
 */
export type SoundKind = 'correct' | 'badge' | 'level' | 'complete';

const NOTES: Record<SoundKind, number[]> = {
  correct: [660, 880],
  badge: [523.25, 659.25, 783.99],
  level: [523.25, 783.99, 1046.5],
  complete: [523.25, 659.25, 783.99, 1046.5],
};

let ctx: AudioContext | null = null;

export function playSound(kind: SoundKind) {
  if (typeof window === 'undefined') return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    const start = ctx.currentTime + 0.01;
    NOTES[kind].forEach((freq, i) => {
      const t = start + i * 0.085;
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.07, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  } catch {
    // Audio is a nicety; never let it break an answer.
  }
}
