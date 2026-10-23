/**
 * Same mass, different weight. A 20 kg mass hangs from a spring balance on the
 * Earth (g = 9.81 N kg⁻¹) and on the Moon (g = 1.62 N kg⁻¹, illustrative).
 * Drawn to scale: weight arrows at 0.75 px per newton (196 N and 32.4 N), and
 * spring extensions proportional to the weight. Background gravitational
 * field lines are vertical, parallel and equally spaced (a uniform field);
 * their spacing is about six times wider on the Moon, where the field is
 * about six times weaker.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-weight-field';

const W = 620;
const H = 344;
const G_EARTH = 9.81;
const G_MOON = 1.62;
const MASS = 20;
const PX_PER_N = 0.75;

function Spring({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const n = 8;
  const lead = 8;
  const len = y2 - y1 - 2 * lead;
  let d = `M${x},${y1} L${x},${y1 + lead}`;
  for (let i = 0; i < n; i++) {
    const ya = y1 + lead + ((i + 0.5) / n) * len;
    d += ` L${x + (i % 2 === 0 ? 9 : -9)},${ya.toFixed(2)}`;
  }
  d += ` L${x},${y2 - lead} L${x},${y2}`;
  return <path d={d} className="dg-thin" />;
}

function Panel({ x0, g, title, spacing, note }: { x0: number; g: number; title: string; spacing: number; note: string }) {
  const cx = x0 + 150;
  const top = 64;
  const weight = MASS * g;
  const springEnd = top + 24 + weight * 0.15;
  const r = 11;
  const by = springEnd + r; // centre of the hanging mass
  const lines: number[] = [];
  for (let x = x0 + 20; x <= x0 + 280; x += spacing) lines.push(x);
  return (
    <g>
      <Label x={cx} y={20} className="dg-text dg-bold">
        {title}
      </Label>
      <Label x={cx} y={40} className="dg-text-small">
        {`g = ${g.toFixed(2)} N kg⁻¹`}
      </Label>
      {/* uniform field: parallel, equally spaced lines pointing down */}
      {lines.map((x) => (
        <Arrow key={x} x1={x} y1={top + 2} x2={x} y2={292} head={7} className="dg-grid" headClassName="dg-dot-accent-2" />
      ))}
      <Label x={x0 + 150} y={306} className="dg-text-small dg-text-muted">
        {note}
      </Label>
      {/* support and spring balance */}
      <line x1={cx - 30} y1={top} x2={cx + 30} y2={top} className="dg-line" />
      <Spring x={cx} y1={top} y2={springEnd} />
      <circle cx={cx} cy={by} r={r} className="dg-fill-accent dg-accent" />
      <Label x={cx - r - 8} y={by} anchor="end" className="dg-text-small dg-bold">
        m = 20 kg
      </Label>
      <Arrow x1={cx} y1={by} x2={cx} y2={by + weight * PX_PER_N} head={9} />
      <circle cx={cx} cy={by} r={2.5} className="dg-dot" />
      <Label x={cx + 14} y={by + 26} anchor="start" className="dg-text dg-bold">
        W
      </Label>
      <Label x={cx + 34} y={by + 26} anchor="start" className="dg-text-small">
        {`= 20 × ${g.toFixed(2)}`}
      </Label>
      <Label x={cx + 34} y={by + 42} anchor="start" className="dg-text-small">
        {`= ${weight < 100 ? weight.toFixed(1) : weight.toFixed(0)} N`}
      </Label>
    </g>
  );
}

export function MomentumNewtonWeightField() {
  return (
    <Svg width={W} height={H}>
      <Panel x0={0} g={G_EARTH} title="On the Earth" spacing={30} note="field lines: parallel, evenly spaced" />
      <line x1={310} y1={12} x2={310} y2={296} className="dg-grid" />
      <Panel x0={320} g={G_MOON} title="On the Moon" spacing={30 * (G_EARTH / G_MOON)} note="lines ~6× further apart: weaker field" />
      <Label x={W / 2} y={332} className="dg-text-small dg-bold">
        same mass (same inertia) everywhere; weight W = mg depends on the field
      </Label>
    </Svg>
  );
}

export default MomentumNewtonWeightField;
