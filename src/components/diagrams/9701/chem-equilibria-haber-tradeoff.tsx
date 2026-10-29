/**
 * The two curves that force a compromise temperature in the Haber process.
 *
 * The equilibrium yield falls as the temperature rises (the forward reaction is exothermic), while
 * the rate of approach to equilibrium rises. The plant cannot have both, so it works at the point
 * where the two curves cross in usefulness — about 450 °C, marked on the axis.
 *
 * Both curves are drawn as smooth sketches in arbitrary units: the diagram is about the shape of
 * the trade-off, not about measured yields.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-equilibria-haber-tradeoff';

const W = 640;
const H = 424;

const X0 = 90;
const X1 = 540;
const BASE = 310;
const TOP = 90;

/** the temperature axis is in °C */
const tMin = 250;
const tMax = 650;
const sx = (t: number) => X0 + ((t - tMin) / (tMax - tMin)) * (X1 - X0);
const sy = (v: number) => BASE - v * (BASE - TOP);

const yieldCurve = (t: number) => 0.92 * Math.exp(-(t - tMin) / 115);
const rateCurve = (t: number) => 0.95 / (1 + Math.exp(-(t - 470) / 40));

function path(f: (t: number) => number) {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = tMin + ((tMax - tMin) * i) / 120;
    pts.push(`${sx(t).toFixed(1)},${sy(f(t)).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

const COMPROMISE = 450;

export function ChemEquilibriaHaberTradeoff() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Why 450 °C, and not the temperature with the best yield
      </Label>

      {/* axes */}
      <line x1={X0} y1={BASE} x2={X1 + 30} y2={BASE} className="dg-line" />
      <line x1={X0} y1={BASE} x2={X0} y2={TOP - 20} className="dg-line" />
      <Label x={X0} y={BASE + 48} anchor="start" className="dg-text-small dg-text-muted">
        temperature
      </Label>

      {/* temperature ticks */}
      {[250, 350, 450, 550, 650].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={BASE} x2={sx(t)} y2={BASE + 6} className="dg-thin" />
          <Label
            x={sx(t)}
            y={BASE + 22}
            className={
              t === COMPROMISE ? 'dg-text-small dg-text-accent dg-bold' : 'dg-text-small dg-text-muted'
            }
          >
            {`${t} °C`}
          </Label>
        </g>
      ))}

      {/* curves */}
      <path d={path(yieldCurve)} className="dg-accent" strokeWidth={2.5} fill="none" />
      <path d={path(rateCurve)} className="dg-accent-2" strokeWidth={2.5} fill="none" />

      <Label x={sx(280)} y={sy(0.80)} anchor="start" className="dg-text-small dg-text-accent">
        equilibrium yield of ammonia
      </Label>
      <Label x={sx(640)} y={sy(0.62)} anchor="end" className="dg-text-small dg-text-accent-2">
        rate of reaction
      </Label>

      {/* compromise marker */}
      <line
        x1={sx(COMPROMISE)}
        y1={TOP - 10}
        x2={sx(COMPROMISE)}
        y2={BASE}
        className="dg-grid dg-dashed"
      />
      <Arrow
        x1={sx(COMPROMISE)}
        y1={TOP - 6}
        x2={sx(COMPROMISE)}
        y2={TOP + 6}
        className="dg-accent"
        headClassName="dg-dot-accent"
      />
      <Label x={sx(COMPROMISE) + 10} y={TOP - 22} anchor="start" className="dg-text-small dg-text-accent">
        compromise
      </Label>

      <Label x={X0} y={TOP - 30} anchor="start" className="dg-text-small dg-text-muted">
        high
      </Label>
      <Label x={X0 - 12} y={BASE - 12} anchor="end" className="dg-text-small dg-text-muted">
        low
      </Label>

      <Label x={W / 2} y={H - 18} className="dg-text-small dg-text-muted">
        Cool enough for a usable yield, hot enough (with iron) for a usable rate.
      </Label>
    </Svg>
  );
}

export default ChemEquilibriaHaberTradeoff;
