/**
 * Twelve molecules of three gases (6, 4 and 2) sharing a total pressure of 100 kPa.
 *
 * The molecule box shows the mole fractions directly: 6/12 = 0.50, 4/12 = 0.33, 2/12 = 0.17.
 * The split bar beneath has segment widths in the same proportion, and each segment is labelled
 * with its mole fraction and with the share of the total pressure it supplies (50, 33 and 17 kPa).
 * The shares therefore add to the total, which is the point of the diagram.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-equilibria-mole-fraction';

const W = 640;
const H = 434;

const BOX_X = 60;
const BOX_Y = 70;
const BOX_W = 300;
const BOX_H = 140;

const BAR_X = 60;
const BAR_Y = 292;
const BAR_W = 520;
const BAR_H = 44;

const TOTAL = 12;
const GROUPS = [
  { n: 6, name: 'A', fill: 'dg-dot-accent', frac: '0.50', p: '50 kPa' },
  { n: 4, name: 'B', fill: 'dg-dot', frac: '0.33', p: '33 kPa' },
  { n: 2, name: 'C', name2: 'C', fill: 'dg-dot-muted', frac: '0.17', p: '17 kPa' },
];

/** positions of the twelve molecules: two rows of six */
function dotPositions() {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const col = i % 6;
    const row = Math.floor(i / 6);
    pts.push({ x: BOX_X + 44 + col * 44, y: BOX_Y + 46 + row * 52 });
  }
  return pts;
}

const ORDER = ['A', 'A', 'A', 'B', 'B', 'C', 'A', 'A', 'A', 'B', 'B', 'C'];

export function ChemEquilibriaMoleFraction() {
  const dots = dotPositions();
  let segX = BAR_X;

  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Mole fraction sets the share of the pressure
      </Label>

      {/* molecule box */}
      <rect
        x={BOX_X}
        y={BOX_Y}
        width={BOX_W}
        height={BOX_H}
        rx={10}
        className="dg-fill-surface dg-thin"
      />
      {dots.map((d, i) => {
        const g = ORDER[i];
        const cls = g === 'A' ? 'dg-fill-accent' : g === 'B' ? 'dg-fill-muted' : 'dg-fill-accent-2';
        return <circle key={i} cx={d.x} cy={d.y} r={13} className={cls} />;
      })}
      <Label x={BOX_X + BOX_W + 18} y={BOX_Y + 40} anchor="start" className="dg-text-small">
        6 of A
      </Label>
      <Label x={BOX_X + BOX_W + 18} y={BOX_Y + 70} anchor="start" className="dg-text-small">
        4 of B
      </Label>
      <Label x={BOX_X + BOX_W + 18} y={BOX_Y + 100} anchor="start" className="dg-text-small">
        2 of C
      </Label>
      <Label x={BOX_X + BOX_W + 18} y={BOX_Y + 130} anchor="start" className="dg-text-small dg-text-muted">
        12 in total
      </Label>

      <Label x={BAR_X} y={BAR_Y - 18} anchor="start" className="dg-text-small dg-text-muted">
        total pressure 100 kPa, shared in the same proportions
      </Label>

      {/* split bar */}
      {GROUPS.map((g, i) => {
        const w = (g.n / TOTAL) * BAR_W;
        const x = segX;
        segX += w;
        const fill =
          i === 0 ? 'dg-fill-accent' : i === 1 ? 'dg-fill-muted' : 'dg-fill-accent-2';
        return (
          <g key={g.name}>
            <rect x={x} y={BAR_Y} width={w} height={BAR_H} className={fill} />
            <rect x={x} y={BAR_Y} width={w} height={BAR_H} className="dg-thin" fill="none" />
            <Label x={x + w / 2} y={BAR_Y + 16} className="dg-text-small dg-bold">
              {g.name}
            </Label>
            <Label x={x + w / 2} y={BAR_Y + 33} className="dg-text-small">
              {g.frac}
            </Label>
            <Label x={x + w / 2} y={BAR_Y + BAR_H + 18} className="dg-text-small dg-text-muted">
              {g.p}
            </Label>
          </g>
        );
      })}

      <Label x={BAR_X} y={BAR_Y + BAR_H + 54} anchor="start" className="dg-text-small dg-text-muted">
        mole fractions add to 1 · partial pressures add to the total
      </Label>
      <Label x={BAR_X} y={BAR_Y + BAR_H + 74} anchor="start" className="dg-text-small dg-text-muted">
        partial pressure = mole fraction × total pressure
      </Label>
    </Svg>
  );
}

export default ChemEquilibriaMoleFraction;
