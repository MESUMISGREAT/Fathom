/**
 * pH against volume of base added for the four acid-base combinations.
 *
 * All four titrations use 25.0 cm3 of acid, so the equivalence volume is the same; what changes is
 * the pH at that point and the size of the vertical jump. Strong acid + strong base jumps around
 * pH 7; a weak acid with a strong base has its equivalence point above 7 (ethanoate is basic); a
 * strong acid with a weak base has it below 7; weak + weak has almost no jump at all, which is why
 * an indicator cannot locate the end-point.
 *
 * The curves are sketches drawn from piecewise-linear pH values, not calculated data.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-bronsted-lowry-titration-curves';

const W = 700;
const H = 450;
const LEFT = 70;
const TOP = 40;
const PLOT_W = 560;
const PLOT_H = 340;

const xVol = (v: number) => LEFT + (v / 50) * PLOT_W;
const yPH = (pH: number) => TOP + PLOT_H - (pH / 14) * PLOT_H;

type Pt = { x: number; y: number };

function curve(pH: (v: number) => number): Pt[] {
  const pts: Pt[] = [];
  for (let v = 0; v <= 50; v += 0.5) {
    pts.push({ x: xVol(v), y: yPH(Math.min(14, Math.max(0, pH(v)))) });
  }
  return pts;
}

const strongStrong = curve((v) => {
  if (v < 24.5) return 1 + 0.1 * v;
  if (v < 25.5) return 3.45 + (10.5 - 3.45) * (v - 24.5);
  return 11 + 0.04 * (v - 25.5);
});

const weakStrong = curve((v) => {
  if (v < 10) return 2.9 + 0.15 * v;
  if (v < 20) return 4.4 + 0.03 * (v - 10);
  if (v < 24.5) return 4.7 + 0.3 * (v - 20);
  if (v < 25.5) return 6.05 + (10.2 - 6.05) * (v - 24.5);
  return 10.2 + 0.04 * (v - 25.5);
});

const strongWeak = curve((v) => {
  if (v < 10) return 1 + 0.2 * v;
  if (v < 20) return 3 + 0.15 * (v - 10);
  if (v < 24.5) return 4.5 + 0.3 * (v - 20);
  if (v < 25.5) return 5.85 + (7.2 - 5.85) * (v - 24.5);
  return 7.2 + 0.03 * (v - 25.5);
});

const weakWeak = curve((v) => {
  if (v < 10) return 3.5 + 0.1 * v;
  if (v < 20) return 4.5 + 0.05 * (v - 10);
  if (v < 24.5) return 5.0 + 0.15 * (v - 20);
  if (v < 25.5) return 5.675 + (6.3 - 5.675) * (v - 24.5);
  return 6.3 + 0.02 * (v - 25.5);
});

function path(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

const PH_TICKS = [0, 2, 4, 6, 8, 10, 12, 14];
const VOL_TICKS = [0, 10, 20, 30, 40, 50];

const LEGEND = [
  { label: 'strong acid + strong base', cls: 'dg-accent' },
  { label: 'weak acid + strong base', cls: 'dg-accent-2' },
  { label: 'strong acid + weak base', cls: 'dg-muted' },
  { label: 'weak acid + weak base (dashed)', cls: 'dg-muted dg-dashed' },
];

export default function BronstedLowryTitrationCurves() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        pH against volume of base added
      </Label>

      {/* axes */}
      <line x1={LEFT} y1={TOP + PLOT_H} x2={LEFT + PLOT_W} y2={TOP + PLOT_H} className="dg-line" />
      <line x1={LEFT} y1={TOP + PLOT_H} x2={LEFT} y2={TOP} className="dg-line" />
      <Label x={LEFT - 16} y={TOP - 6} anchor="end" className="dg-text-small dg-text-muted">
        pH
      </Label>
      <Label x={LEFT + PLOT_W / 2} y={TOP + PLOT_H + 42} className="dg-text-small dg-text-muted">
        volume of base added (cm³)
      </Label>

      {PH_TICKS.map((pH) => (
        <g key={`ph-${pH}`}>
          <line x1={LEFT - 5} y1={yPH(pH)} x2={LEFT} y2={yPH(pH)} className="dg-thin" />
          <Label x={LEFT - 10} y={yPH(pH)} anchor="end" className="dg-text-small dg-text-muted">
            {pH}
          </Label>
        </g>
      ))}

      {VOL_TICKS.map((v) => (
        <g key={`vol-${v}`}>
          <line x1={xVol(v)} y1={TOP + PLOT_H} x2={xVol(v)} y2={TOP + PLOT_H + 5} className="dg-thin" />
          <Label x={xVol(v)} y={TOP + PLOT_H + 20} className="dg-text-small dg-text-muted">
            {v}
          </Label>
        </g>
      ))}

      {/* pH 7 and the 25 cm3 equivalence volume */}
      <line x1={LEFT} y1={yPH(7)} x2={LEFT + PLOT_W} y2={yPH(7)} className="dg-grid dg-dashed" />
      <line x1={xVol(25)} y1={TOP} x2={xVol(25)} y2={TOP + PLOT_H} className="dg-grid dg-dashed" />
      <Label x={xVol(25) + 6} y={TOP + 12} anchor="start" className="dg-text-small dg-text-muted">
        25 cm³
      </Label>

      {/* the four curves */}
      <path d={path(strongStrong)} className="dg-accent" strokeWidth={2.5} fill="none" />
      <path d={path(weakStrong)} className="dg-accent-2" strokeWidth={2.5} fill="none" />
      <path d={path(strongWeak)} className="dg-muted" strokeWidth={2.5} fill="none" />
      <path d={path(weakWeak)} className="dg-muted dg-dashed" strokeWidth={2.5} fill="none" />

      {/* legend, in the empty upper-left corner */}
      {LEGEND.map((row, i) => {
        const y = TOP + 14 + i * 22;
        return (
          <g key={row.label}>
            <line x1={LEFT + 12} y1={y} x2={LEFT + 42} y2={y} className={row.cls} strokeWidth={2.5} />
            <Label x={LEFT + 50} y={y} anchor="start" className="dg-text-small">
              {row.label}
            </Label>
          </g>
        );
      })}

      <MathLabel x={xVol(25) + 60} y={yPH(7) - 26} tex="\text{pH 7}" w={70} h={22} tone="muted" size="small" />
      <Label x={xVol(25) - 8} y={TOP + PLOT_H - 8} anchor="end" className="dg-text-small dg-text-muted">
        equivalence
      </Label>
    </Svg>
  );
}
