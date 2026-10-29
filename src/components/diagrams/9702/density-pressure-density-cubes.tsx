import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-density-pressure-density-cubes';

export default function DensityCubes() {
  const cubes = [
    { x: 38, label: 'Low density', dots: [[28, 30], [58, 58], [43, 82]] },
    { x: 190, label: 'Higher density', dots: [[24, 24], [50, 24], [76, 24], [24, 50], [50, 50], [76, 50], [24, 76], [50, 76], [76, 76]] },
  ];
  return (
    <Svg width={430} height={230}>
      {cubes.map((cube) => (
        <g key={cube.label} transform={`translate(${cube.x}, 75)`}>
          <rect x={0} y={0} width={100} height={100} rx={4} className="dg-thin dg-fill-muted" />
          {cube.dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} className="dg-dot-accent" />)}
          <Label x={50} y={120} className="dg-text dg-bold">{cube.label}</Label>
          <Label x={50} y={141} className="dg-text-small dg-text-muted">same volume</Label>
        </g>
      ))}
      <MathLabel x={215} y={35} tex="\rho = \dfrac{m}{V}" w={150} h={50} size="large" />
      <Label x={385} y={124} className="dg-text-small dg-text-muted">more mass</Label>
      <Label x={385} y={142} className="dg-text-small dg-text-muted">in the same</Label>
      <Label x={385} y={160} className="dg-text-small dg-text-muted">volume</Label>
    </Svg>
  );
}