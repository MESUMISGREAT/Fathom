/**
 * The CAST diagram. Angles are measured anticlockwise from the positive x-axis.
 * In the 1st quadrant all three ratios are positive, in the 2nd only sin, in the
 * 3rd only tan, in the 4th only cos. A basic acute angle α (drawn as 30°) gives
 * the related angles 180° − α, 180° + α and 360° − α, each making angle α with
 * the x-axis.
 */
import { Arrow, Label, Svg } from '../primitives';
import { arcPath, polar, rad } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-cast';

const W = 600;
const H = 390;
const C = { x: 300, y: 192 };
const L = 128;
const A = 30;

const rays: { deg: number; label: string; anchor: 'start' | 'end'; a0: number; a1: number }[] = [
  { deg: A, label: 'α', anchor: 'start', a0: 0, a1: A },
  { deg: 180 - A, label: '180° − α', anchor: 'end', a0: 180 - A, a1: 180 },
  { deg: 180 + A, label: '180° + α', anchor: 'end', a0: 180, a1: 180 + A },
  { deg: 360 - A, label: '360° − α', anchor: 'start', a0: 360 - A, a1: 360 },
];

const quads: { x: number; y: number; letter: string; sub: string }[] = [
  { x: 480, y: 62, letter: 'A', sub: 'all positive' },
  { x: 120, y: 62, letter: 'S', sub: 'sin positive' },
  { x: 120, y: 318, letter: 'T', sub: 'tan positive' },
  { x: 480, y: 318, letter: 'C', sub: 'cos positive' },
];

export default function P1TrigonometryCast() {
  return (
    <Svg width={W} height={H}>
      <Arrow x1={C.x - 190} y1={C.y} x2={C.x + 200} y2={C.y} className="dg-thin" head={8} />
      <Arrow x1={C.x} y1={C.y + 170} x2={C.x} y2={C.y - 178} className="dg-thin" head={8} />
      <Label x={C.x + 206} y={C.y + 15} className="dg-text dg-italic">
        x
      </Label>
      <Label x={C.x - 12} y={C.y - 176} className="dg-text dg-italic">
        y
      </Label>
      {quads.map((q) => (
        <g key={q.letter}>
          <Label x={q.x} y={q.y} className="dg-text-accent" >
            <tspan style={{ fontSize: 28 }}>{q.letter}</tspan>
          </Label>
          <Label x={q.x} y={q.y + 26} className="dg-text-small">
            {q.sub}
          </Label>
        </g>
      ))}
      {rays.map((r) => {
        const end = polar(C, L, rad(r.deg));
        const lbl = polar(C, L + 14, rad(r.deg));
        const aLbl = polar(C, 52, rad((r.a0 + r.a1) / 2));
        return (
          <g key={r.deg}>
            <line x1={C.x} y1={C.y} x2={end.x} y2={end.y} className={r.deg === A ? 'dg-accent' : 'dg-accent-2'} />
            <circle cx={end.x} cy={end.y} r={3.5} className="dg-dot" />
            <path d={arcPath(C, 36, rad(r.a0), rad(r.a1))} className="dg-thin" />
            <Label x={aLbl.x} y={aLbl.y} className="dg-text-small dg-italic">
              α
            </Label>
            <Label x={lbl.x} y={lbl.y} anchor={r.anchor} className={r.deg === A ? 'dg-text-accent' : 'dg-text-accent-2'}>
              {r.label}
            </Label>
          </g>
        );
      })}
      <Label x={C.x} y={H - 12} className="dg-text-small">
        in radians: α, π − α, π + α, 2π − α
      </Label>
    </Svg>
  );
}
