import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'p2-integration-trapezium-rule';

const width = 500;
const height = 300;
const p = axes({ width, height, pad: 48, x: [0, 4], y: [0, 17] });
const values = [0, 4 / 3, 8 / 3, 4];

export default function TrapeziumRuleDiagram() {
  return (
    <Svg width={width} height={height}>
      {[0, 1, 2].map((i) => {
        const x1 = values[i]!;
        const x2 = values[i + 1]!;
        const y1 = x1 * x1;
        const y2 = x2 * x2;
        const points = `${p.sx(x1)},${p.sy(0)} ${p.sx(x1)},${p.sy(y1)} ${p.sx(x2)},${p.sy(y2)} ${p.sx(x2)},${p.sy(0)}`;
        return <polygon key={i} points={points} className="dg-fill-accent-2 dg-thin" />;
      })}
      {[0, 1, 2, 3].map((i) => {
        const x = values[i]!;
        return <line key={i} x1={p.sx(x)} y1={p.sy(0)} x2={p.sx(x)} y2={p.sy(x * x)} className="dg-thin" />;
      })}
      <path d={graph((x) => x * x, [0, 4], p, [0, 17])} className="dg-accent" />
      <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(4) + 10} y2={p.sy(0)} className="dg-line" />
      <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(0)} y2={p.sy(16) - 8} className="dg-line" />
      <Label x={p.sx(4) + 15} y={p.sy(0)} className="dg-text dg-italic">x</Label>
      <Label x={p.sx(0)} y={p.sy(16) - 15} className="dg-text dg-italic">y</Label>
      <MathLabel x={p.sx(2.9)} y={p.sy(13.5)} tex="y=x^2" w={80} h={26} />
      <Label x={p.sx(2)} y={height - 16} className="dg-text-small">Chords sit above the curve</Label>
    </Svg>
  );
}
