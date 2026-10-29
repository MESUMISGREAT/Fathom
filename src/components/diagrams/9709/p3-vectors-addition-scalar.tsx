/**
 * Vector addition and scalar multiplication diagrams.
 * Top row: triangle law and parallelogram law.
 * Bottom row: scalar multiplication (stretch, reverse, shrink).
 */
import { Label, MathLabel, Svg, Arrow } from '../primitives';

export const diagramKey = 'p3-vectors-addition-scalar';

const W = 560;
const H = 380;

function arrow(x1: number, y1: number, x2: number, y2: number, cls = "dg-accent") {
  return (
    <Arrow x1={x1} y1={y1} x2={x2} y2={y2} className={cls} head={8} />
  );
}

export default function P3VectorsAdditionScalar() {
  return (
    <Svg width={W} height={H}>
      {/* Title */}
      <MathLabel x={W / 2} y={20} tex="Vector addition and scalar multiplication" w={300} h={24} />

      {/* Triangle law */}
      <g transform="translate(30, 40)">
        <MathLabel x={0} y={-10} tex="Triangle law:" w={120} h={20} size="small" tone="accent" />
        {arrow(0, 0, 100, 0, "dg-accent")}
        {arrow(100, 0, 160, 60, "dg-accent-2")}
        {arrow(0, 0, 160, 60, "dg-accent")}
        <MathLabel x={50} y={-16} tex="a" anchor="middle" w={30} h={20} size="small" tone="accent" />
        <MathLabel x={130} y={20} tex="b" anchor="middle" w={30} h={20} size="small" tone="accent-2" />
        <MathLabel x={80} y={40} tex="a + b" anchor="middle" w={50} h={20} size="small" tone="accent" />
        <circle cx={0} cy={0} r={3} className="dg-dot" />
        <circle cx={100} cy={0} r={3} className="dg-dot" />
        <circle cx={160} cy={60} r={3} className="dg-dot" />
      </g>

      {/* Parallelogram law */}
      <g transform="translate(300, 40)">
        <MathLabel x={0} y={-10} tex="Parallelogram law:" w={150} h={20} size="small" tone="accent" />
        {arrow(0, 0, 100, 0, "dg-accent")}
        {arrow(0, 0, 40, 60, "dg-accent-2")}
        {arrow(100, 0, 140, 60, "dg-accent-2")}
        {arrow(40, 60, 140, 60, "dg-accent")}
        {arrow(0, 0, 140, 60, "dg-accent")}
        <MathLabel x={50} y={-16} tex="a" anchor="middle" w={30} h={20} size="small" tone="accent" />
        <MathLabel x={20} y={40} tex="b" anchor="middle" w={30} h={20} size="small" tone="accent-2" />
        <MathLabel x={120} y={40} tex="b" anchor="middle" w={30} h={20} size="small" tone="accent-2" />
        <MathLabel x={70} y={40} tex="a + b" anchor="middle" w={50} h={20} size="small" tone="accent" />
        <circle cx={0} cy={0} r={3} className="dg-dot" />
        <circle cx={100} cy={0} r={3} className="dg-dot" />
        <circle cx={40} cy={60} r={3} className="dg-dot" />
        <circle cx={140} cy={60} r={3} className="dg-dot" />
      </g>

      {/* Scalar multiplication examples */}
      <g transform="translate(30, 200)">
        <MathLabel x={0} y={-10} tex="Scalar multiplication:" w={180} h={20} size="small" tone="accent" />
        {/* original a */}
        {arrow(0, 60, 100, 60, "dg-accent")}
        <MathLabel x={50} y={44} tex="a" anchor="middle" w={30} h={20} size="small" tone="accent" />
        <MathLabel x={-10} y={64} tex="a" anchor="end" w={30} h={20} size="small" />
        {/* 2a */}
        {arrow(0, 140, 200, 140, "dg-accent")}
        <MathLabel x={100} y={124} tex="2a" anchor="middle" w={30} h={20} size="small" tone="accent" />
        <MathLabel x={-10} y={144} tex="2a" anchor="end" w={30} h={20} size="small" />
        {/* -a */}
        {arrow(0, 220, -100, 220, "dg-accent-2")}
        <MathLabel x={-50} y={204} tex="-a" anchor="middle" w={30} h={20} size="small" tone="accent-2" />
        <MathLabel x={-10} y={224} tex="-a" anchor="end" w={30} h={20} size="small" />
        {/* 0.5a */}
        {arrow(0, 300, 50, 300, "dg-accent")}
        <MathLabel x={25} y={284} tex="0.5a" anchor="middle" w={40} h={20} size="small" tone="accent" />
        <MathLabel x={-10} y={304} tex="0.5a" anchor="end" w={40} h={20} size="small" />
      </g>

      {/* Legend */}
      <g transform="translate(300, 200)">
        <MathLabel x={0} y={-10} tex="k > 1: stretch" w={120} h={20} size="small" tone="accent" />
        <MathLabel x={0} y={10} tex="0 < k < 1: shrink" w={120} h={20} size="small" tone="accent" />
        <MathLabel x={0} y={30} tex="k < 0: reverse + scale" w={150} h={20} size="small" tone="accent-2" />
        <MathLabel x={0} y={50} tex="k = 0: zero vector" w={120} h={20} size="small" tone="muted" />
      </g>

      <Label x={W / 2} y={H - 12} className="dg-text-small dg-bold">
        {`Addition: head-to-tail (triangle) or diagonal (parallelogram). Scalar k: scale by |k|, flip if k < 0.`}
      </Label>
    </Svg>
  );
}