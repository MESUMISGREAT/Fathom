/**
 * Where the second solution comes from, for 0° ≤ x ≤ 360°. Each panel shows a
 * curve and the line y = 0.4, with the two intersections marked.
 * sin x = 0.4: α = 23.6° and 180° − α = 156.4° (symmetry about x = 90°).
 * cos x = 0.4: α = 66.4° and 360° − α = 293.6° (symmetry about x = 180°).
 * tan x = 0.4: α = 21.8° and 180° + α = 201.8° (tan repeats every 180°).
 */
import { Label, Svg, graph } from '../primitives';
import { GraphFrame, cosd, frame, sind, tand } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-solve-graphs';

const W = 640;
const H = 456;
const K = 0.4;
const XR: [number, number] = [-12, 372];
const deg = (r: number) => (r * 180) / Math.PI;

type Spec = {
  f: (x: number) => number;
  y: [number, number];
  title: string;
  rule: string;
  sols: [number, number];
  names: [string, string];
  /** For each solution: label side (−1 left, +1 right). */
  side: [number, number];
  cls: string;
  asym?: number[];
};

const a1 = deg(Math.asin(K));
const a2 = deg(Math.acos(K));
const a3 = deg(Math.atan(K));

const specs: Spec[] = [
  { f: sind, y: [-1.3, 1.3], title: 'sin x = 0.4', rule: 'symmetry about 90°', sols: [a1, 180 - a1], names: ['α', '180° − α'], side: [-1, 1], cls: 'dg-accent' },
  { f: cosd, y: [-1.3, 1.3], title: 'cos x = 0.4', rule: 'symmetry about 180°', sols: [a2, 360 - a2], names: ['α', '360° − α'], side: [1, -1], cls: 'dg-accent' },
  { f: tand, y: [-3, 3], title: 'tan x = 0.4', rule: 'repeats every 180°', sols: [a3, 180 + a3], names: ['α', '180° + α'], side: [-1, -1], cls: 'dg-accent', asym: [90, 270] },
];

function Panel({ s, top }: { s: Spec; top: number }) {
  const p = frame(112, top, 360, 104, XR, s.y);
  return (
    <g>
      <GraphFrame
        p={p}
        xTicks={[90, 180, 270, 360].map((v) => ({ v, label: `${v}°` }))}
        yTicks={[
          { v: 1, label: '1' },
          { v: -1, label: '−1' },
        ]}
      />
      {s.asym?.map((a) => (
        <line key={a} x1={p.sx(a)} y1={p.sy(s.y[1])} x2={p.sx(a)} y2={p.sy(s.y[0])} className="dg-muted dg-dashed" />
      ))}
      <path d={graph(s.f, [0, 360], p, s.y, 720)} className={s.cls} />
      <line x1={p.sx(0)} y1={p.sy(K)} x2={p.sx(360)} y2={p.sy(K)} className="dg-accent-2" style={{ strokeWidth: 1.75 }} />
      {s.sols.map((x, i) => (
        <g key={i}>
          <line x1={p.sx(x)} y1={p.sy(K)} x2={p.sx(x)} y2={p.sy(0)} className="dg-muted" />
          <circle cx={p.sx(x)} cy={p.sy(K)} r={4.5} className="dg-dot" />
          <Label
            x={p.sx(x) + 8 * s.side[i]!}
            y={p.sy(K) - 13}
            anchor={s.side[i]! < 0 ? 'end' : 'start'}
            className="dg-text-small dg-bold"
          >
            {s.names[i]}
          </Label>
        </g>
      ))}
      <Label x={8} y={top + 40} anchor="start" className="dg-text-accent">
        {s.title}
      </Label>
      <Label x={8} y={top + 60} anchor="start" className="dg-text-small">
        line y = 0.4
      </Label>
      <Label x={560} y={top + 32} className="dg-text-small">
        {`α = ${s.sols[0].toFixed(1)}°`}
      </Label>
      <Label x={560} y={top + 52} className="dg-text-small">
        {`${s.names[1]} = ${s.sols[1].toFixed(1)}°`}
      </Label>
      <Label x={560} y={top + 76} className="dg-text-muted">
        {s.rule}
      </Label>
    </g>
  );
}

export default function P1TrigonometrySolveGraphs() {
  return (
    <Svg width={W} height={H}>
      <Panel s={specs[0]!} top={22} />
      <Panel s={specs[1]!} top={172} />
      <Panel s={specs[2]!} top={322} />
    </Svg>
  );
}
