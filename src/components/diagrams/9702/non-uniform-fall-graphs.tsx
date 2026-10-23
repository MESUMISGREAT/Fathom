/**
 * Velocity–time and acceleration–time graphs for an object falling from rest
 * with air resistance that increases with speed. Illustrative skydiver with
 * drag proportional to v² and terminal velocity 50 m s⁻¹, so
 *   v = v_T tanh(g t / v_T)   and   a = g / cosh²(g t / v_T),  g = 9.81 m s⁻².
 * Left: v rises from 0 with initial gradient g (the dashed tangent v = g t is
 *   what would happen with no air resistance), the gradient decreases and v
 *   levels off at the terminal velocity (dashed horizontal line).
 * Right: a starts at g = 9.81 m s⁻² and falls towards zero.
 */
import { Label, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-non-uniform-fall-graphs';

const W = 640;
const H = 290;
const GW = 316;
const GH = 270;
const PAD = 46;
const G = 9.81;
const VT = 50;
const T: [number, number] = [0, 20];
const VY: [number, number] = [0, 70];
const AY: [number, number] = [0, 12];
const vmap = axes({ width: GW, height: GH, pad: PAD, x: T, y: VY });
const amap = axes({ width: GW, height: GH, pad: PAD, x: T, y: AY });
const v = (t: number) => VT * Math.tanh((G * t) / VT);
const a = (t: number) => G / Math.cosh((G * t) / VT) ** 2;

function Frame({
  map,
  yTicks,
  yLabel,
  title,
}: {
  map: { sx: (x: number) => number; sy: (y: number) => number };
  yTicks: number[];
  yLabel: string;
  title: string;
}) {
  const { sx, sy } = map;
  const top = yTicks[yTicks.length - 1]!;
  return (
    <g>
      <Label x={GW / 2 + 10} y={12} className="dg-text dg-bold">
        {title}
      </Label>
      {yTicks.slice(1).map((t) => (
        <line key={t} x1={sx(0)} y1={sy(t)} x2={sx(20)} y2={sy(t)} className="dg-grid" />
      ))}
      <line x1={sx(0)} y1={sy(0)} x2={sx(20)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(top)} className="dg-line" />
      {[0, 5, 10, 15, 20].map((t) => (
        <Label key={t} x={sx(t)} y={sy(0) + 14} className="dg-text-small">
          {t}
        </Label>
      ))}
      {yTicks.map((t) => (
        <Label key={t} x={sx(0) - 7} y={sy(t)} anchor="end" className="dg-text-small">
          {t}
        </Label>
      ))}
      <Label x={sx(10)} y={sy(0) + 32} className="dg-text-small dg-italic">
        t / s
      </Label>
      <text
        x={10}
        y={sy(top / 2)}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 10 ${sy(top / 2)})`}
        className="dg-text-small dg-italic"
      >
        {yLabel}
      </text>
    </g>
  );
}

export function NonUniformFallGraphs() {
  const { sx, sy } = vmap;
  return (
    <Svg width={W} height={H}>
      <g transform="translate(4, 12)">
        <Frame map={vmap} yTicks={[0, 10, 20, 30, 40, 50, 60, 70]} yLabel="v / m s⁻¹" title="Velocity against time" />
        <path d={graph((t) => G * t, T, vmap, VY)} className="dg-muted dg-dashed" />
        <path d={`M${sx(0)},${sy(VT)} L${sx(20)},${sy(VT)}`} className="dg-accent-2 dg-dashed" />
        <path d={graph(v, T, vmap, VY)} className="dg-accent" />
        <Label x={sx(7.6)} y={sy(66)} anchor="start" className="dg-text-small dg-text-muted">
          no air: gradient g
        </Label>
        <Label x={sx(19.6)} y={sy(VT) - 11} anchor="end" className="dg-text-small dg-text-accent-2">
          terminal velocity
        </Label>
        <Label x={sx(19.6)} y={sy(28)} anchor="end" className="dg-text-small">
          gradient (= a) falls
        </Label>
        <Label x={sx(19.6)} y={sy(28) + 15} anchor="end" className="dg-text-small">
          from g to zero
        </Label>
      </g>
      <g transform={`translate(${W - GW - 4}, 12)`}>
        <Frame map={amap} yTicks={[0, 4, 8, 12]} yLabel="a / m s⁻²" title="Acceleration against time" />
        <path d={`M${amap.sx(0)},${amap.sy(G)} L${amap.sx(2.2)},${amap.sy(G)}`} className="dg-muted dg-dashed" />
        <path d={graph(a, T, amap, AY)} className="dg-accent" />
        <Label x={amap.sx(1.6)} y={amap.sy(G) - 12} anchor="start" className="dg-text-small">
          starts at g = 9.81 m s⁻²
        </Label>
        <Label x={amap.sx(19.6)} y={amap.sy(2.6)} anchor="end" className="dg-text-small">
          a → 0 as D → W
        </Label>
      </g>
    </Svg>
  );
}

export default NonUniformFallGraphs;
