/**
 * A ring in equilibrium under three forces: string tension T₁ at 30° above the horizontal to the left,
 * string tension T₂ at 60° above the horizontal to the right, and its 20 N weight. Dashed lines show the
 * horizontal and vertical components of each tension, for the resolving example in the lesson.
 */
import { MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-ring-equilibrium';

const W = 620;
const H = 360;
const CX = 310;
const CY = 200;
const LEN = 150;
const rad = (d: number) => (d * Math.PI) / 180;

export default function ForcesRingEquilibrium() {
  // T1 points up-left at 30° above the horizontal; T2 points up-right at 60° above the horizontal.
  const t1 = { x: CX - LEN * Math.cos(rad(30)), y: CY - LEN * Math.sin(rad(30)) };
  const t2 = { x: CX + LEN * Math.cos(rad(60)), y: CY - LEN * Math.sin(rad(60)) };
  const arc = 46;
  return (
    <Svg width={W} height={H}>
      <line x1={CX - 200} y1={CY} x2={CX + 200} y2={CY} className="dg-grid" />

      {/* components */}
      <line x1={CX} y1={CY} x2={t1.x} y2={CY} className="dg-accent dg-dashed" />
      <line x1={t1.x} y1={CY} x2={t1.x} y2={t1.y} className="dg-accent dg-dashed" />
      <line x1={CX} y1={CY} x2={t2.x} y2={CY} className="dg-accent-2 dg-dashed" />
      <line x1={t2.x} y1={CY} x2={t2.x} y2={t2.y} className="dg-accent-2 dg-dashed" />

      {/* forces */}
      <line x1={CX} y1={CY} x2={t1.x} y2={t1.y} className="dg-accent" strokeWidth={3} />
      <line x1={CX} y1={CY} x2={t2.x} y2={t2.y} className="dg-accent-2" strokeWidth={3} />
      <line x1={CX} y1={CY} x2={CX} y2={CY + 120} className="dg-line" strokeWidth={3} />
      <polygon points={`${CX - 7},${CY + 110} ${CX + 7},${CY + 110} ${CX},${CY + 124}`} className="dg-dot" />

      {/* angle arcs */}
      <path
        d={`M ${CX - arc} ${CY} A ${arc} ${arc} 0 0 1 ${CX - arc * Math.cos(rad(30))} ${CY - arc * Math.sin(rad(30))}`}
        className="dg-accent"
        fill="none"
        strokeWidth={2}
      />
      <path
        d={`M ${CX + arc} ${CY} A ${arc} ${arc} 0 0 0 ${CX + arc * Math.cos(rad(60))} ${CY - arc * Math.sin(rad(60))}`}
        className="dg-accent-2"
        fill="none"
        strokeWidth={2}
      />
      <circle cx={CX} cy={CY} r={9} className="dg-fill-surface dg-line" strokeWidth={2} />

      <MathLabel x={t1.x - 8} y={t1.y - 16} tex="T_1" w={50} tone="accent" />
      <MathLabel x={t2.x + 22} y={t2.y - 6} tex="T_2" w={50} tone="accent-2" />
      <MathLabel x={CX - 68} y={CY - 16} tex="30^\circ" w={50} tone="accent" size="small" />
      <MathLabel x={CX + 62} y={CY - 30} tex="60^\circ" w={50} tone="accent-2" size="small" />
      <MathLabel x={CX + 48} y={CY + 108} tex="20\ \text{N}" w={70} />
      <MathLabel x={(CX + t1.x) / 2} y={CY + 22} tex="T_1\cos 30^\circ" w={110} tone="accent" size="small" />
      <MathLabel x={t1.x - 62} y={(CY + t1.y) / 2} tex="T_1\sin 30^\circ" w={110} tone="accent" size="small" />
      <MathLabel x={(CX + t2.x) / 2 + 6} y={CY + 22} tex="T_2\cos 60^\circ" w={110} tone="accent-2" size="small" />
      <MathLabel x={t2.x + 64} y={(CY + t2.y) / 2} tex="T_2\sin 60^\circ" w={110} tone="accent-2" size="small" />
    </Svg>
  );
}
