/**
 * The 16 patterns of a 4-bit two's complement number arranged on a circle.
 * Counting up (adding 1) moves clockwise. 0000-0111 are 0 to +7, 1000-1111 are
 * −8 to −1. Crossing from 0111 to 1000 is overflow (+7 + 1 cannot be +8);
 * crossing from 1111 to 0000 produces a carry out that is discarded, and the
 * answer (−1 + 1 = 0) is correct.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-twos-complement-wheel';

const W = 600;
const H = 430;
const CX = 300;
const CY = 222;
const R = 120;
const STEP = 22.5;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (deg: number, r: number) => ({ x: CX + r * Math.cos(rad(deg)), y: CY + r * Math.sin(rad(deg)) });
/** Angle of pattern k: 0000 at the top, increasing clockwise. */
const angle = (k: number) => -90 + k * STEP;

function arc(fromDeg: number, toDeg: number, r: number): string {
  const a = pt(fromDeg, r);
  const b = pt(toDeg, r);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} A${r},${r} 0 ${large} 1 ${b.x.toFixed(2)},${b.y.toFixed(2)}`;
}

function value(k: number): string {
  const v = k < 8 ? k : k - 16;
  if (v > 0) return `+${v}`;
  if (v < 0) return `−${-v}`;
  return '0';
}

export function TwosComplementWheel() {
  const overflowAt = angle(7.5); // between 0111 and 1000
  const wrapAt = angle(15.5); // between 1111 and 0000
  const o1 = pt(overflowAt, 70);
  const o2 = pt(overflowAt, 182);
  const w1 = pt(wrapAt, 70);
  const w2 = pt(wrapAt, 182);
  return (
    <Svg width={W} height={H}>
      {/* the two halves of the range */}
      <path d={arc(angle(-0.5) + 2, angle(7.5) - 2, R)} className="dg-accent" />
      <path d={arc(angle(7.5) + 2, angle(15.5) - 2, R)} className="dg-accent-2" />

      {Array.from({ length: 16 }, (_, k) => {
        const p = pt(angle(k), R);
        const out = pt(angle(k), R + 30);
        const inn = pt(angle(k), R - 26);
        return (
          <g key={k}>
            <circle cx={p.x} cy={p.y} r={3.5} className="dg-dot" />
            <Label x={out.x} y={out.y} className="dg-text-small dg-mono">
              {k.toString(2).padStart(4, '0')}
            </Label>
            <Label x={inn.x} y={inn.y} className={k < 8 ? 'dg-text-accent' : 'dg-text-accent-2'}>
              {value(k)}
            </Label>
          </g>
        );
      })}

      {/* boundaries */}
      <line x1={o1.x} y1={o1.y} x2={o2.x} y2={o2.y} className="dg-accent-2 dg-dashed" />
      <line x1={w1.x} y1={w1.y} x2={w2.x} y2={w2.y} className="dg-muted dg-dashed" />
      <Label x={o2.x + 6} y={o2.y + 14} anchor="start" className="dg-text-accent-2">
        overflow: +7 + 1 lands on −8
      </Label>
      <Label x={w2.x - 6} y={w2.y - 12} anchor="end" className="dg-text-muted">
        carry out discarded: −1 + 1 = 0 ✓
      </Label>

      <Label x={CX} y={CY - 20} className="dg-text dg-bold">
        4-bit two’s complement
      </Label>
      <Label x={CX} y={CY + 2} className="dg-text-muted">
        range −8 to +7
      </Label>
      <Label x={CX} y={CY + 22} className="dg-text-muted">
        add 1 = one step clockwise
      </Label>
    </Svg>
  );
}

export default TwosComplementWheel;
