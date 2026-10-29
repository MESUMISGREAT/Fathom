/**
 * The four steps that turn W = Fs into E_K = ½mv²: substitute F = ma, rearrange
 * v² = u² + 2as for as, then substitute back. A footer explains that the ½ is the
 * average-speed factor.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-gpe-ke-derivation';

const W = 620;
const H = 432;
const X = 92;
const BOX_W = 436;
const GAP = 26;

const steps = [
  {
    tex: 'W = Fs',
    note: 'a constant resultant force F acts through a distance s',
    h: 62,
  },
  {
    tex: 'F = ma \\Rightarrow W = mas',
    note: 'Newton\u2019s second law replaces the force',
    h: 62,
  },
  {
    tex: 'v^2 = u^2 + 2as \\Rightarrow as = \\dfrac{v^2 - u^2}{2}',
    note: 'the equation of motion with no time in it',
    h: 88,
  },
  {
    tex: 'W = \\tfrac{1}{2}mv^2 - \\tfrac{1}{2}mu^2',
    note: 'so the kinetic energy is ½mv², and the work done equals its change',
    h: 62,
  },
];

export function GpeKeDerivation() {
  let y = 46;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        From work done to kinetic energy
      </Label>
      {steps.map((s, i) => {
        const top = y;
        y += s.h + GAP;
        const formulaY = top + (i === 2 ? 34 : 24);
        const noteY = top + s.h - 12;
        return (
          <g key={i}>
            <rect x={X} y={top} width={BOX_W} height={s.h} className="dg-fill-muted dg-thin" />
            <circle cx={X + 26} cy={top + 30} r={13} className="dg-fill-accent-2 dg-thin" />
            <Label x={X + 26} y={top + 30} className="dg-text-small dg-bold">
              {i + 1}
            </Label>
            <MathLabel x={X + 56} y={formulaY} tex={s.tex} w={BOX_W - 70} h={i === 2 ? 42 : 30} anchor="start" />
            <Label x={X + 56} y={noteY} anchor="start" className="dg-text-small dg-text-muted">
              {s.note}
            </Label>
            {i < steps.length - 1 && (
              <line
                x1={X + BOX_W / 2}
                y1={top + s.h + 5}
                x2={X + BOX_W / 2}
                y2={top + s.h + GAP - 5}
                className="dg-muted dg-dashed"
              />
            )}
          </g>
        );
      })}
      <Label x={W / 2} y={H - 18} className="dg-text-small dg-text-muted">
        the ½ is the average speed: while accelerating steadily the speed averages (u + v) / 2
      </Label>
    </Svg>
  );
}

export default GpeKeDerivation;
