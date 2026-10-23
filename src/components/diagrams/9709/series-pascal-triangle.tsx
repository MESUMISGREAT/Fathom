/**
 * Pascal's triangle, rows n = 0 to 6. Each entry is the sum of the two above
 * it; the highlighted pair 10 + 10 in row 5 makes the 20 (= ⁶C₃) in row 6.
 * Row n holds the coefficients of (a + b)ⁿ, and entry r (counting from 0) is ⁿCᵣ.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'series-pascal-triangle';

const W = 600;
const H = 372;
const CX = 330;
const DX = 62;
const DY = 40;
const TOP = 32;
const R = 16;

function comb(n: number, r: number): number {
  let c = 1;
  for (let i = 1; i <= r; i++) c = (c * (n - i + 1)) / i;
  return Math.round(c);
}

const rows = [0, 1, 2, 3, 4, 5, 6];
const pos = (n: number, r: number) => ({ x: CX + (r - n / 2) * DX, y: TOP + n * DY });

export default function SeriesPascalTriangle() {
  const isPair = (n: number, r: number) => n === 5 && (r === 2 || r === 3);
  const isSum = (n: number, r: number) => n === 6 && r === 3;
  const a = pos(5, 2);
  const b = pos(5, 3);
  const s = pos(6, 3);
  return (
    <Svg width={W} height={H}>
      {rows.map((n) => (
        <Label key={`n${n}`} x={30} y={TOP + n * DY} anchor="start" className="dg-text-muted dg-italic">
          {`n = ${n}`}
        </Label>
      ))}

      {/* the addition rule: 10 + 10 = 20 */}
      <Arrow x1={a.x + 8} y1={a.y + R - 2} x2={s.x - 9} y2={s.y - R + 1} head={7} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={b.x - 8} y1={b.y + R - 2} x2={s.x + 9} y2={s.y - R + 1} head={7} className="dg-accent-2" headClassName="dg-dot-accent-2" />

      {rows.map((n) =>
        Array.from({ length: n + 1 }, (_, r) => {
          const p = pos(n, r);
          const cls = isSum(n, r) ? 'dg-accent-2 dg-fill-accent-2' : isPair(n, r) ? 'dg-accent dg-fill-accent' : 'dg-thin dg-fill-muted';
          const txt = isSum(n, r) ? 'dg-text-accent-2' : isPair(n, r) ? 'dg-text-accent' : 'dg-text';
          return (
            <g key={`${n}-${r}`}>
              <circle cx={p.x} cy={p.y} r={R} className={cls} />
              <Label x={p.x} y={p.y + 1} className={txt}>
                {comb(n, r)}
              </Label>
            </g>
          );
        }),
      )}

      <Label x={W - 12} y={TOP + 6} anchor="end" className="dg-text-small">
        Each number is the sum
      </Label>
      <Label x={W - 12} y={TOP + 24} anchor="end" className="dg-text-small">
        of the two just above it:
      </Label>
      <Label x={W - 12} y={TOP + 44} anchor="end" className="dg-text-accent-2">
        10 + 10 = 20
      </Label>

      <line x1={20} y1={TOP + 6 * DY + 30} x2={W - 20} y2={TOP + 6 * DY + 30} className="dg-grid" />
      <Label x={W / 2} y={TOP + 6 * DY + 52} className="dg-text">
        Row 4: (a + b)⁴ = 1a⁴ + 4a³b + 6a²b² + 4ab³ + 1b⁴
      </Label>
      <Label x={W / 2} y={TOP + 6 * DY + 76} className="dg-text-muted">
        Entry r of row n (counting r from 0) is ⁿCᵣ, e.g. ⁶C₃ = 20
      </Label>
    </Svg>
  );
}
