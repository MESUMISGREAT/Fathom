/**
 * Gas volumes, to scale (3 px per cm³), in a hydrocarbon combustion
 * experiment with all volumes at room conditions. Before: 10 cm³ of C₃H₈ +
 * 70 cm³ of O₂ = 80 cm³. After exploding and cooling: 30 cm³ of CO₂ + 20 cm³
 * of unreacted O₂ = 50 cm³ (the water has condensed to a liquid of
 * negligible volume), a contraction of 30 cm³. After passing through
 * NaOH(aq): 20 cm³ of O₂, so 30 cm³ of CO₂ was absorbed. Deduction:
 * x = 30 ÷ 10 = 3; O₂ used = 70 − 20 = 50 cm³, so 3 + y/4 = 5 and y = 8: C₃H₈.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-combustion-volumes';

const W = 640;
const H = 400;
const BASE = 300;
const PX = 3; // pixels per cm³
const BW = 84;
const AXIS_X = 64;

interface Seg {
  name: string;
  v: number;
  cls: string;
}
const BARS: Array<{ x: number; segs: Seg[]; title: string; sub: string }> = [
  {
    x: 108,
    title: 'before',
    sub: 'hydrocarbon + excess O₂',
    segs: [
      { name: 'C₃H₈', v: 10, cls: 'dg-fill-muted' },
      { name: 'O₂', v: 70, cls: 'dg-fill-accent' },
    ],
  },
  {
    x: 304,
    title: 'after explosion',
    sub: 'cooled to room temperature',
    segs: [
      { name: 'CO₂', v: 30, cls: 'dg-fill-accent-2' },
      { name: 'O₂', v: 20, cls: 'dg-fill-accent' },
    ],
  },
  {
    x: 500,
    title: 'after NaOH(aq)',
    sub: 'CO₂ absorbed',
    segs: [{ name: 'O₂', v: 20, cls: 'dg-fill-accent' }],
  },
];

const y = (v: number) => BASE - v * PX;

export function ReactingMassesCombustionVolumes() {
  return (
    <Svg width={W} height={H}>
      {/* axis */}
      {[0, 10, 20, 30, 40, 50, 60, 70, 80].map((t) => (
        <g key={t}>
          {t > 0 && <line x1={AXIS_X} y1={y(t)} x2={W - 20} y2={y(t)} className="dg-grid" />}
          <Label x={AXIS_X - 8} y={y(t)} anchor="end" className="dg-text-small">
            {String(t)}
          </Label>
        </g>
      ))}
      <line x1={AXIS_X} y1={BASE} x2={W - 20} y2={BASE} className="dg-line" />
      <line x1={AXIS_X} y1={BASE} x2={AXIS_X} y2={y(84)} className="dg-line" />
      <text x={18} y={y(40)} transform={`rotate(-90 18 ${y(40)})`} textAnchor="middle" dominantBaseline="middle" className="dg-text">
        gas volume / cm³
      </text>

      {BARS.map((b) => {
        let acc = 0;
        const total = b.segs.reduce((s, g) => s + g.v, 0);
        return (
          <g key={b.title}>
            {b.segs.map((s) => {
              const top = y(acc + s.v);
              const bottom = y(acc);
              acc += s.v;
              return (
                <g key={s.name}>
                  <rect x={b.x} y={top} width={BW} height={bottom - top} className={`${s.cls} dg-line`} />
                  <Label x={b.x + BW / 2} y={(top + bottom) / 2} className="dg-text-small dg-bold">
                    {`${s.name} ${s.v}`}
                  </Label>
                </g>
              );
            })}
            <Label x={b.x + BW / 2} y={y(total) - 14} className="dg-text dg-bold">
              {`${total} cm³`}
            </Label>
            <Label x={b.x + BW / 2} y={BASE + 18} className="dg-text dg-bold">
              {b.title}
            </Label>
            <Label x={b.x + BW / 2} y={BASE + 36} className="dg-text-small">
              {b.sub}
            </Label>
          </g>
        );
      })}

      {/* step arrows */}
      <Arrow x1={200} y1={y(64)} x2={292} y2={y(64)} />
      <Label x={246} y={y(64) - 30} className="dg-text-small">
        spark, then cool
      </Label>
      <Label x={246} y={y(64) - 14} className="dg-text-accent-2">
        −30 cm³
      </Label>
      <Label x={246} y={y(64) + 16} className="dg-text-small">
        H₂O condenses
      </Label>
      <Label x={246} y={y(64) + 31} className="dg-text-small">
        (≈ 0 cm³ liquid)
      </Label>

      <Arrow x1={396} y1={y(64)} x2={488} y2={y(64)} />
      <Label x={442} y={y(64) - 30} className="dg-text-small">
        through NaOH(aq)
      </Label>
      <Label x={442} y={y(64) - 14} className="dg-text-accent-2">
        −30 cm³ = CO₂
      </Label>

      {/* deduction */}
      <Label x={W / 2} y={H - 34} className="dg-text-accent">
        x = 30 ÷ 10 = 3;  O₂ used = 70 − 20 = 50 cm³, so 3 + y/4 = 5 and y = 8
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text dg-bold">
        the hydrocarbon is C₃H₈ (propane)
      </Label>
    </Svg>
  );
}

export default ReactingMassesCombustionVolumes;
