/**
 * What a couple does (outcome 4.1.3). The same rod, lying on a smooth table, seen from above, with
 * its centre of gravity G at the middle. Every force has the same size F.
 * (a) One force at one end: resultant force F, and a moment about G, so the rod accelerates AND turns.
 * (b) Two equal, opposite forces along the same line (the rod's axis): resultant force zero and no
 *     moment about any point, so there is no translational or angular acceleration (though the rod may deform).
 * (c) A couple: equal, opposite, parallel forces with separated lines of action at the two ends.
 *     Resultant force zero, but both forces turn the rod the same way: it rotates about G and G
 *     does not accelerate.
 */
import { Label, Svg } from '../primitives';
import { Force, TurnArrow } from './turning-effects-kit';

export const diagramKey = 'phys-turning-effects-couple-effects';

const W = 640;
const H = 280;
const Y = 140;
const HALF = 60;

function Rod({ cx }: { cx: number }) {
  return (
    <g>
      <rect x={cx - HALF} y={Y - 7} width={2 * HALF} height={14} rx={5} className="dg-fill-muted dg-line" />
      <circle cx={cx} cy={Y} r={3.5} className="dg-dot" />
      <Label x={cx} y={Y + 22} className="dg-text-small">
        G
      </Label>
    </g>
  );
}

function Notes({ cx, lines, title }: { cx: number; lines: [string, string]; title: string }) {
  return (
    <g>
      <Label x={cx} y={24} className="dg-text dg-bold">
        {title}
      </Label>
      <Label x={cx} y={240} className="dg-text-small">
        {lines[0]}
      </Label>
      <Label x={cx} y={260} className="dg-text-accent-2">
        {lines[1]}
      </Label>
    </g>
  );
}

export function TurningEffectsCoupleEffects() {
  const a = 107;
  const b = 320;
  const c = 533;
  return (
    <Svg width={W} height={H}>
      <line x1={213} y1={44} x2={213} y2={270} className="dg-grid" />
      <line x1={427} y1={44} x2={427} y2={270} className="dg-grid" />

      {/* (a) one force, off centre */}
      <Notes cx={a} title="One force, off centre" lines={['resultant force F, plus a moment', 'moves and turns']} />
      <Rod cx={a} />
      <Force p={{ x: a + HALF - 4, y: Y - 7 }} u={{ x: 0, y: -1 }} l={62} label="F" dx={12} dy={8} anchor="start" />
      <TurnArrow c={{ x: a, y: Y }} r={36} a1={40} a2={140} />

      {/* (b) equal and opposite, same line */}
      <Notes cx={b} title="Equal, opposite, same line" lines={['resultant force 0, no moment', 'no overall motion']} />
      <Rod cx={b} />
      <Force p={{ x: b - HALF, y: Y }} u={{ x: -1, y: 0 }} l={40} label="F" dy={-16} />
      <Force p={{ x: b + HALF, y: Y }} u={{ x: 1, y: 0 }} l={40} label="F" dy={-16} />

      {/* (c) a couple */}
      <Notes cx={c} title="A couple" lines={['resultant force 0, but a moment', 'turns only']} />
      <Rod cx={c} />
      <Force p={{ x: c + HALF - 4, y: Y - 7 }} u={{ x: 0, y: -1 }} l={62} label="F" dx={12} dy={8} anchor="start" />
      <Force p={{ x: c - HALF + 4, y: Y + 7 }} u={{ x: 0, y: 1 }} l={62} label="F" dx={-12} dy={-8} anchor="end" />
      <TurnArrow c={{ x: c, y: Y }} r={36} a1={40} a2={140} />
    </Svg>
  );
}

export default TurningEffectsCoupleEffects;
