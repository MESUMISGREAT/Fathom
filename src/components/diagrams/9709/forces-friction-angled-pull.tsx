/**
 * Force diagram for a 5 kg box on a rough horizontal floor, pulled by a force P at 20° above the
 * horizontal: normal reaction R up, weight 50 N down, friction F to the left (opposing the pull).
 */
import { MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-friction-angled-pull';

const W = 600;
const H = 330;
const FLOOR = 230;
const BX = 230; // box left
const BW = 140;
const BH = 80;
const CX = BX + BW / 2;
const CY = FLOOR - BH / 2;
const rad = (d: number) => (d * Math.PI) / 180;

function Head({ x, y, dx, dy, className }: { x: number; y: number; dx: number; dy: number; className: string }) {
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 11;
  const p = `${x},${y} ${x - s * ux - (s / 2) * uy},${y - s * uy + (s / 2) * ux} ${x - s * ux + (s / 2) * uy},${y - s * uy - (s / 2) * ux}`;
  return <polygon points={p} className={className} />;
}

export default function ForcesFrictionAngledPull() {
  const px = BX + BW + 140 * Math.cos(rad(20));
  const py = CY - 140 * Math.sin(rad(20));
  return (
    <Svg width={W} height={H}>
      <line x1={60} y1={FLOOR} x2={540} y2={FLOOR} className="dg-line" strokeWidth={2} />
      {[80, 120, 160, 200, 400, 440, 480, 520].map((x) => (
        <line key={x} x1={x} y1={FLOOR} x2={x - 12} y2={FLOOR + 12} className="dg-line dg-thin" />
      ))}
      <rect x={BX} y={FLOOR - BH} width={BW} height={BH} rx={6} className="dg-fill-surface dg-line" strokeWidth={2} />
      <MathLabel x={CX} y={CY} tex="5\ \text{kg}" w={80} size="small" />

      {/* P at 20° */}
      <line x1={BX + BW} y1={CY} x2={px} y2={py} className="dg-accent" strokeWidth={3} />
      <Head x={px} y={py} dx={px - (BX + BW)} dy={py - CY} className="dg-dot-accent" />
      <line x1={BX + BW} y1={CY} x2={BX + BW + 90} y2={CY} className="dg-line dg-dashed" />
      <path
        d={`M ${BX + BW + 60} ${CY} A 60 60 0 0 0 ${BX + BW + 60 * Math.cos(rad(20))} ${CY - 60 * Math.sin(rad(20))}`}
        className="dg-accent"
        fill="none"
        strokeWidth={2}
      />
      <MathLabel x={px + 18} y={py - 6} tex="P" w={30} tone="accent" />
      <MathLabel x={BX + BW + 84} y={CY - 14} tex="20^\circ" w={50} tone="accent" size="small" />

      {/* R up, weight down */}
      <line x1={CX} y1={FLOOR - BH} x2={CX} y2={FLOOR - BH - 70} className="dg-accent-2" strokeWidth={3} />
      <Head x={CX} y={FLOOR - BH - 70} dx={0} dy={-1} className="dg-dot-accent-2" />
      <MathLabel x={CX + 22} y={FLOOR - BH - 66} tex="R" w={30} tone="accent-2" />
      <line x1={CX} y1={FLOOR} x2={CX} y2={FLOOR + 70} className="dg-line" strokeWidth={3} />
      <Head x={CX} y={FLOOR + 70} dx={0} dy={1} className="dg-dot" />
      <MathLabel x={CX + 46} y={FLOOR + 60} tex="50\ \text{N}" w={70} />

      {/* friction left along the floor */}
      <line x1={BX} y1={FLOOR - 6} x2={BX - 90} y2={FLOOR - 6} className="dg-accent-2" strokeWidth={3} />
      <Head x={BX - 90} y={FLOOR - 6} dx={-1} dy={0} className="dg-dot-accent-2" />
      <MathLabel x={BX - 60} y={FLOOR - 28} tex="F" w={30} tone="accent-2" />
    </Svg>
  );
}
