/**
 * The graphs of y = sin x, y = cos x and y = tan x for −180° ≤ x ≤ 360°, stacked
 * on the same horizontal scale. Dashed verticals every 90°. sin and cos have
 * period 360° and range −1 to 1; tan has period 180°, vertical asymptotes at
 * x = −90°, 90°, 270°, and takes every real value. The bottom row repeats the
 * x-scale in radians.
 */
import { Arrow, FracLabel, Svg } from '../primitives';
import { cosd, sind, tand } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-basic-graphs';

const W = 640;
const H = 482;
const X0 = 112;
const K = 490 / 540; // px per degree
const sx = (d: number) => X0 + (d + 180) * K;
const TICKS = [-180, -90, 0, 90, 180, 270, 360];
const RADS = ['−π', '−π/2', '0', 'π/2', 'π', '3π/2', '2π'];

type Spec = {
  title: string;
  period: string;
  f: (d: number) => number;
  u: number;
  ymax: number;
  cls: string;
  asym?: number[];
};

const specs: Spec[] = [
  { title: 'y = sin x', period: 'period 360°', f: sind, u: 40, ymax: 1.35, cls: 'dg-accent' },
  { title: 'y = cos x', period: 'period 360°', f: cosd, u: 40, ymax: 1.35, cls: 'dg-accent-2' },
  { title: 'y = tan x', period: 'period 180°', f: tand, u: 18, ymax: 3, cls: 'dg-accent', asym: [-90, 90, 270] },
];

function curve(f: (d: number) => number, sy: (v: number) => number, ymax: number): string {
  let d = '';
  let pen = false;
  for (let i = 0; i <= 1080; i++) {
    const x = -180 + i * 0.5;
    const v = f(x);
    if (!Number.isFinite(v) || Math.abs(v) > ymax) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(v).toFixed(2)} `;
    pen = true;
  }
  return d.trim();
}

function Panel({ s, cy, last }: { s: Spec; cy: number; last: boolean }) {
  const sy = (v: number) => cy - v * s.u;
  const top = sy(s.ymax) - 4;
  const bot = sy(-s.ymax) + 4;
  return (
    <g>
      {TICKS.filter((t) => t !== 0).map((t) => (
        <line key={t} x1={sx(t)} y1={top} x2={sx(t)} y2={bot} className="dg-grid dg-dashed" />
      ))}
      {[1, -1].map((v) => (
        <line key={v} x1={sx(-180)} y1={sy(v)} x2={sx(360)} y2={sy(v)} className="dg-grid" />
      ))}
      {s.asym?.map((a) => (
        <line key={`a${a}`} x1={sx(a)} y1={top} x2={sx(a)} y2={bot} className="dg-muted dg-dashed" />
      ))}
      <Arrow x1={sx(-180) - 4} y1={cy} x2={sx(360) + 16} y2={cy} className="dg-thin" head={7} />
      <Arrow x1={sx(0)} y1={bot + 2} x2={sx(0)} y2={top - 8} className="dg-thin" head={7} />
      <FracLabel x={sx(360) + 20} y={cy + 12} className="dg-text-small dg-italic">
        x
      </FracLabel>
      <FracLabel x={sx(0) + 10} y={top - 6} className="dg-text-small dg-italic">
        y
      </FracLabel>
      <path d={curve(s.f, sy, s.ymax)} className={s.cls} />
      <FracLabel x={X0 - 8} y={sy(1)} anchor="end" className="dg-text-small">
        1
      </FracLabel>
      <FracLabel x={X0 - 8} y={sy(-1)} anchor="end" className="dg-text-small">
        −1
      </FracLabel>
      <FracLabel x={8} y={cy - 8} anchor="start" className={s.cls === 'dg-accent' ? 'dg-text-accent' : 'dg-text-accent-2'}>
        {s.title}
      </FracLabel>
      <FracLabel x={8} y={cy + 12} anchor="start" className="dg-text-small">
        {s.period}
      </FracLabel>
      {TICKS.map((t) => (
        <FracLabel key={`l${t}`} x={sx(t) - (t === 0 ? 12 : 0)} y={bot + 12} className="dg-text-small">
          {t < 0 ? `−${-t}°` : `${t}°`}
        </FracLabel>
      ))}
      {last &&
        TICKS.map((t, i) => (
          <FracLabel key={`r${t}`} x={sx(t) - (t === 0 ? 12 : 0)} y={bot + 32} className="dg-text-muted">
            {RADS[i]}
          </FracLabel>
        ))}
    </g>
  );
}

export default function P1TrigonometryBasicGraphs() {
  return (
    <Svg width={W} height={H}>
      <Panel s={specs[0]!} cy={70} last={false} />
      <Panel s={specs[1]!} cy={222} last={false} />
      <Panel s={specs[2]!} cy={374} last />
    </Svg>
  );
}
