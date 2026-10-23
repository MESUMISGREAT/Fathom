/**
 * Two function machines in a row, with f(x) = x + 3 and g(x) = x².
 * Top: gf(2) = g(f(2)) = g(5) = 25 (f acts first).
 * Bottom: fg(2) = f(g(2)) = f(4) = 7 (g acts first). Order matters.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'functions-composite-machines';

const W = 600;
const H = 300;
const BW = 116;
const BH = 58;

interface Machine {
  name: 'f' | 'g';
  rule: string;
}
const F: Machine = { name: 'f', rule: 'x ↦ x + 3' };
const G: Machine = { name: 'g', rule: 'x ↦ x²' };

const rows = [
  { y: 100, title: 'gf(2) = g(f(2)): f acts first', first: F, second: G, values: ['2', '5', '25'] },
  { y: 225, title: 'fg(2) = f(g(2)): g acts first', first: G, second: F, values: ['2', '4', '7'] },
];

function Box({ x, y, m }: { x: number; y: number; m: Machine }) {
  const isF = m.name === 'f';
  return (
    <g>
      <rect
        x={x}
        y={y - BH / 2}
        width={BW}
        height={BH}
        rx={12}
        className={isF ? 'dg-accent dg-fill-accent' : 'dg-accent-2 dg-fill-accent-2'}
      />
      <Label x={x + BW / 2} y={y - 9} className={isF ? 'dg-text-accent dg-italic' : 'dg-text-accent-2 dg-italic'}>
        {m.name}
      </Label>
      <Label x={x + BW / 2} y={y + 12} className="dg-text-small">
        {m.rule}
      </Label>
    </g>
  );
}

export default function FunctionsCompositeMachines() {
  const xs = { in: 42, b1: 104, mid: 300, b2: 380, out: 562 };
  return (
    <Svg width={W} height={H}>
      {rows.map((r) => (
        <g key={r.title}>
          <Label x={20} y={r.y - 52} anchor="start" className="dg-text dg-bold">
            {r.title}
          </Label>
          <Label x={xs.in} y={r.y} className="dg-text dg-bold">
            {r.values[0]}
          </Label>
          <Arrow x1={xs.in + 14} y1={r.y} x2={xs.b1 - 4} y2={r.y} head={8} className="dg-thin" />
          <Box x={xs.b1} y={r.y} m={r.first} />
          <Arrow x1={xs.b1 + BW + 4} y1={r.y} x2={xs.mid - 18} y2={r.y} head={8} className="dg-thin" />
          <circle cx={xs.mid} cy={r.y} r={17} className="dg-thin dg-fill-muted" />
          <Label x={xs.mid} y={r.y} className="dg-text dg-bold">
            {r.values[1]}
          </Label>
          <Arrow x1={xs.mid + 18} y1={r.y} x2={xs.b2 - 4} y2={r.y} head={8} className="dg-thin" />
          <Box x={xs.b2} y={r.y} m={r.second} />
          <Arrow x1={xs.b2 + BW + 4} y1={r.y} x2={xs.out - 20} y2={r.y} head={8} className="dg-thin" />
          <Label x={xs.out} y={r.y} className="dg-text dg-bold">
            {r.values[2]}
          </Label>
        </g>
      ))}
      <line x1={20} y1={160} x2={W - 20} y2={160} className="dg-grid" />
      <Label x={W / 2} y={H - 14} className="dg-text-muted">
        Same two machines, different order, different answer.
      </Label>
    </Svg>
  );
}
