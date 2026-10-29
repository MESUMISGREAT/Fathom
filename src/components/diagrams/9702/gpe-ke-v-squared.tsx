/**
 * Kinetic energy against speed for 1.0 kg and 2.0 kg masses: parabolas, not
 * straight lines. Doubling the speed from 10 to 20 m/s multiplies the energy of
 * the 2.0 kg mass by four (100 J to 400 J).
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-gpe-ke-v-squared';

const W = 600;
const H = 344;
const X0 = 84;
const Y0 = 288;
/** 21.5 px per m/s. */
const px = (v: number) => X0 + v * 21.5;
/** 0.5 px per joule. */
const py = (j: number) => Y0 - j * 0.5;

function curve(mass: number) {
  const pts: string[] = [];
  for (let v = 0; v <= 20; v += 1) {
    pts.push(`${px(v).toFixed(1)},${py(0.5 * mass * v * v).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

export function GpeKeVSquared() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        Kinetic energy against speed: a curve, not a line
      </Label>

      <line x1={X0} y1={Y0} x2={516} y2={Y0} className="dg-line" />
      <line x1={X0} y1={Y0} x2={X0} y2={52} className="dg-line" />
      <MathLabel x={512} y={Y0 - 14} tex="v\ /\ \text{m s}^{-1}" w={130} h={24} anchor="end" tone="muted" size="small" />
      <MathLabel x={58} y={44} tex="E_K\ /\ \text{J}" w={96} h={26} tone="muted" size="small" />

      {[5, 10, 15, 20].map((v) => (
        <g key={v}>
          <line x1={px(v)} y1={Y0} x2={px(v)} y2={Y0 + 5} className="dg-muted" />
          <Label x={px(v)} y={Y0 + 17} className="dg-text-small dg-text-muted">
            {v}
          </Label>
        </g>
      ))}
      {[100, 200, 300, 400].map((j) => (
        <g key={j}>
          <line x1={X0 - 5} y1={py(j)} x2={X0} y2={py(j)} className="dg-muted" />
          <Label x={X0 - 9} y={py(j)} anchor="end" className="dg-text-small dg-text-muted">
            {j}
          </Label>
        </g>
      ))}

      {/* the two curves */}
      <path d={curve(2.0)} className="dg-accent" />
      <path d={curve(1.0)} className="dg-accent-2" />
      <MathLabel x={392} y={96} tex="m = 2.0\ \text{kg}" w={110} h={24} tone="accent" size="small" />
      <MathLabel x={440} y={196} tex="m = 1.0\ \text{kg}" w={110} h={24} tone="accent-2" size="small" />

      {/* the four-fold step */}
      <circle cx={px(10)} cy={py(100)} r={4} className="dg-dot-accent" />
      <circle cx={px(20)} cy={py(400)} r={4} className="dg-dot-accent" />
      <line x1={px(10)} y1={py(100)} x2={px(10)} y2={py(400)} className="dg-muted dg-dashed" />
      <Arrow x1={px(10) + 10} y1={py(400) + 4} x2={px(10) + 10} y2={py(100) - 6} head={7} className="dg-muted" />
      <MathLabel x={px(10) + 70} y={py(250)} tex="\times 4 \text{ energy}" w={110} h={24} tone="muted" size="small" />

      <Label x={W / 2} y={H - 10} className="dg-text-small dg-text-muted">
        double the speed, four times the energy — that is why stopping distances explode
      </Label>
    </Svg>
  );
}

export default GpeKeVSquared;
