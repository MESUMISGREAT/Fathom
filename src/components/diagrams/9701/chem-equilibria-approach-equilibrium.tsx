/**
 * How a system settles at equilibrium, in two panels sharing a time axis.
 *
 * Left: the forward rate starts at its maximum and falls as reactants are used up, while the
 * reverse rate starts at zero and rises as products appear. The two curves converge on the same
 * value and then run flat — that common value is the equilibrium rate.
 *
 * Right: the reactant concentration falls and the product concentration rises; both level off at
 * constant, unequal values, which is why "equal rates" must not be read as "equal amounts".
 *
 * The curves are exponential approaches drawn from explicit functions, so the convergence is
 * genuine rather than hand-drawn.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-equilibria-approach-equilibrium';

const W = 660;
const H = 420;

const PANEL_W = 250;
const PANEL_H = 210;
const BASE = 300;

const LEFT_X = 70;
const RIGHT_X = 385;

/** value 0..1 plotted inside a panel, measured up from the shared baseline */
const py = (v: number) => BASE - v * PANEL_H;

/** t runs 0..1 across a panel */
const px = (x0: number, t: number) => x0 + t * PANEL_W;

function path(x0: number, f: (t: number) => number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    pts.push(`${px(x0, t).toFixed(1)},${py(f(t)).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

const forwardRate = (t: number) => 0.45 + 0.55 * Math.exp(-4 * t);
const reverseRate = (t: number) => 0.45 * (1 - Math.exp(-4 * t));

const reactant = (t: number) => 0.15 + 0.70 * Math.exp(-5 * t);
const product = (t: number) => 0.55 * (1 - Math.exp(-5 * t));

function Frame({ x0 }: { x0: number }) {
  return (
    <g>
      <line x1={x0} y1={BASE} x2={x0 + PANEL_W} y2={BASE} className="dg-line" />
      <line x1={x0} y1={BASE} x2={x0} y2={BASE - PANEL_H} className="dg-line" />
      <Label x={x0 + PANEL_W / 2} y={BASE + 22} className="dg-text-small dg-text-muted">
        time
      </Label>
    </g>
  );
}

export function ChemEquilibriaApproachEquilibrium() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Both rates meet; the amounts level off
      </Label>

      {/* ---------------- left panel: rates ---------------- */}
      <Label x={LEFT_X + PANEL_W / 2} y={58} className="dg-text">
        Rate of reaction
      </Label>
      <Frame x0={LEFT_X} />
      <Label x={LEFT_X - 10} y={BASE - PANEL_H + 8} anchor="end" className="dg-text-small dg-text-muted">
        fast
      </Label>
      <Label x={LEFT_X - 10} y={BASE - 4} anchor="end" className="dg-text-small dg-text-muted">
        0
      </Label>

      {/* equilibrium rate guide */}
      <line
        x1={LEFT_X}
        y1={py(0.45)}
        x2={LEFT_X + PANEL_W}
        y2={py(0.45)}
        className="dg-grid dg-dashed"
      />

      <path d={path(LEFT_X, forwardRate)} className="dg-accent" strokeWidth={2.5} fill="none" />
      <path d={path(LEFT_X, reverseRate)} className="dg-accent-2" strokeWidth={2.5} fill="none" />

      <Label x={px(LEFT_X, 0.05)} y={py(0.95)} anchor="start" className="dg-text-small dg-text-accent">
        forward
      </Label>
      <Label x={px(LEFT_X, 0.42)} y={py(0.22)} anchor="start" className="dg-text-small dg-text-accent-2">
        reverse
      </Label>
      <Label x={LEFT_X + PANEL_W} y={py(0.45) - 20} anchor="end" className="dg-text-small dg-text-muted">
        equal rates
      </Label>

      {/* ---------------- right panel: concentrations ---------------- */}
      <Label x={RIGHT_X + PANEL_W / 2} y={58} className="dg-text">
        Concentration
      </Label>
      <Frame x0={RIGHT_X} />
      <Label x={RIGHT_X - 10} y={BASE - PANEL_H + 8} anchor="end" className="dg-text-small dg-text-muted">
        high
      </Label>
      <Label x={RIGHT_X - 10} y={BASE - 4} anchor="end" className="dg-text-small dg-text-muted">
        0
      </Label>

      <path d={path(RIGHT_X, reactant)} className="dg-accent" strokeWidth={2.5} fill="none" />
      <path d={path(RIGHT_X, product)} className="dg-accent-2" strokeWidth={2.5} fill="none" />

      <Label x={px(RIGHT_X, 0.04)} y={py(0.88)} anchor="start" className="dg-text-small dg-text-accent">
        reactant
      </Label>
      <Label x={px(RIGHT_X, 0.52)} y={py(0.32)} anchor="start" className="dg-text-small dg-text-accent-2">
        product
      </Label>
      <Label
        x={RIGHT_X + PANEL_W}
        y={py(0.56) - 14}
        anchor="end"
        className="dg-text-small dg-text-muted"
      >
        constant, unequal
      </Label>

      <Label x={W / 2} y={H - 36} className="dg-text-small dg-text-muted">
        at equilibrium: forward rate = reverse rate ≠ 0
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-small dg-text-muted">
        Both reactions continue — the amounts only stop changing.
      </Label>
    </Svg>
  );
}

export default ChemEquilibriaApproachEquilibrium;
