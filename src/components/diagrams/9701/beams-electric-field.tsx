/**
 * Beams of protons, neutrons and electrons, all moving at the same velocity,
 * enter the uniform electric field between two charged plates. Inside the
 * field a charged beam feels a constant sideways force, so it follows a
 * parabola; after the plates it carries on in a straight line along the exit
 * tangent. Sideways deflection is proportional to charge/mass, so:
 *   electrons (−1, mass 1/1836) bend towards the positive plate, a lot;
 *   protons (+1, mass 1) bend towards the negative plate, a little;
 *   neutrons (0) go straight on.
 * Not to scale: the real electron deflection is about 1840 times the proton's,
 * which cannot be drawn on one picture, so the diagram says so.
 */
import { Arrow, Label, Svg, plotPath } from '../primitives';

const W = 640;
const H = 340;
const X0 = 170; // plates start
const X1 = 380; // plates end
const YB = 160; // beam axis
const TOP = 70; // inner surface of the positive plate
const BOT = 250; // inner surface of the negative plate
const XEND = 460; // where the drawn paths stop

/** Path of a beam whose sideways displacement at the end of the plates is `k` (screen px, + is down). */
function beamPath(k: number): { d: string; end: [number, number] } {
  const L = X1 - X0;
  const a = k / (L * L);
  const slope = (2 * k) / L;
  const inside = plotPath((x) => YB + a * (x - X0) ** 2, X0, X1, 60);
  const yEnd = YB + k + slope * (XEND - X1);
  return { d: `${inside} L${XEND},${yEnd.toFixed(2)}`, end: [XEND, yEnd] };
}

export function BeamsInElectricField() {
  const electron = beamPath(-70);
  const proton = beamPath(28);
  const plus = [0, 1, 2, 3, 4, 5].map((i) => X0 + 22 + i * 33);
  return (
    <Svg width={W} height={H}>
      {/* source and the shared beam */}
      <rect x={20} y={YB - 22} width={72} height={44} rx={6} className="dg-thin dg-fill-muted" />
      <Label x={56} y={YB} className="dg-text-small">
        source
      </Label>
      <line x1={92} y1={YB} x2={X0} y2={YB} className="dg-line" />
      <Arrow x1={104} y1={YB - 22} x2={150} y2={YB - 22} head={8} className="dg-thin" />
      <Label x={127} y={YB - 40} className="dg-text-small">
        same velocity
      </Label>

      {/* plates */}
      <rect x={X0} y={TOP - 14} width={X1 - X0} height={14} className="dg-thin dg-fill-accent" />
      <rect x={X0} y={BOT} width={X1 - X0} height={14} className="dg-thin dg-fill-accent-2" />
      {plus.map((x) => (
        <g key={x}>
          <Label x={x} y={TOP - 7} className="dg-text-small dg-bold">
            +
          </Label>
          <Label x={x} y={BOT + 7} className="dg-text-small dg-bold">
            −
          </Label>
        </g>
      ))}
      <Label x={(X0 + X1) / 2} y={TOP - 30} className="dg-text-muted">
        positive plate
      </Label>
      <Label x={(X0 + X1) / 2} y={BOT + 32} className="dg-text-muted">
        negative plate
      </Label>

      {/* beams */}
      <line x1={X0} y1={YB} x2={XEND} y2={YB} className="dg-line" />
      <path d={electron.d} className="dg-accent" />
      <path d={proton.d} className="dg-accent-2" />
      <circle cx={electron.end[0]} cy={electron.end[1]} r={3.5} className="dg-dot-accent" />
      <circle cx={proton.end[0]} cy={proton.end[1]} r={3.5} className="dg-dot-accent-2" />
      <circle cx={XEND} cy={YB} r={3.5} className="dg-dot" />

      {/* labels at the ends of the beams */}
      <Label x={XEND + 12} y={electron.end[1] - 8} anchor="start" className="dg-text-accent">
        electrons (−1)
      </Label>
      <Label x={XEND + 12} y={electron.end[1] + 9} anchor="start" className="dg-text-small">
        big bend towards +
      </Label>
      <Label x={XEND + 12} y={YB - 8} anchor="start" className="dg-text dg-bold">
        neutrons (0)
      </Label>
      <Label x={XEND + 12} y={YB + 9} anchor="start" className="dg-text-small">
        no deflection
      </Label>
      <Label x={XEND + 12} y={proton.end[1] - 2} anchor="start" className="dg-text-accent-2">
        protons (+1)
      </Label>
      <Label x={XEND + 12} y={proton.end[1] + 15} anchor="start" className="dg-text-small">
        small bend towards −
      </Label>

      {/* scale warning */}
      <Label x={W / 2} y={H - 30} className="dg-text-muted">
        Not to scale: deflection ∝ charge ÷ mass, so the real electron beam bends
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-muted">
        about 1840 times more than the proton beam (and the opposite way).
      </Label>
    </Svg>
  );
}
