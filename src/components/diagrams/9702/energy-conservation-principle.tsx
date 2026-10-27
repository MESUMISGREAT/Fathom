/**
 * Conservation of energy. Left: a ball falling through three positions, each
 * with a bar of the same total length (100 J) split differently between the
 * stored (height) store and the kinetic and thermal stores. Right: a bouncing
 * ball whose bounces get lower, with the energy remaining in the mechanical
 * stores after each bounce (60 J, 40 J, 30 J) shown against the bounce heights.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-principle';

const W = 640;
const H = 368;
/** 160 px of bar = 100 J. */
const px = (joules: number) => (joules / 100) * 160;

export function EnergyConservationPrinciple() {
  return (
    <Svg width={W} height={H}>
      <Label x={170} y={26} className="dg-text dg-bold">
        A falling ball: the split changes
      </Label>
      <line x1={60} y1={54} x2={60} y2={250} className="dg-muted dg-dashed" />
      <circle cx={60} cy={70} r={8} className="dg-dot" />
      <circle cx={60} cy={150} r={8} className="dg-dot" />
      <circle cx={60} cy={230} r={8} className="dg-dot" />
      {/* row 1: everything stored */}
      <rect x={100} y={61} width={px(100)} height={18} className="dg-fill-accent-2 dg-line" />
      <Label x={100} y={94} anchor="start" className="dg-text-small">
        at release: 100 J stored in the height
      </Label>
      {/* row 2: 60 J kinetic + 40 J thermal */}
      <rect x={100} y={141} width={px(60)} height={18} className="dg-fill-accent dg-line" />
      <rect x={100 + px(60)} y={141} width={px(40)} height={18} className="dg-fill-muted dg-line" />
      <Label x={100} y={174} anchor="start" className="dg-text-small">
        falling: 60 J kinetic + 40 J thermal
      </Label>
      {/* row 3: 80 J kinetic + 20 J thermal */}
      <rect x={100} y={221} width={px(80)} height={18} className="dg-fill-accent dg-line" />
      <rect x={100 + px(80)} y={221} width={px(20)} height={18} className="dg-fill-muted dg-line" />
      <Label x={100} y={254} anchor="start" className="dg-text-small">
        just before landing: 80 J kinetic + 20 J
      </Label>
      <Label x={170} y={300} className="dg-text-small dg-text-muted">
        every bar is the same total: 100 J
      </Label>
      <Label x={170} y={322} className="dg-text-small dg-text-muted">
        energy is transferred, never destroyed
      </Label>
      {/* right panel */}
      <line x1={380} y1={40} x2={380} y2={326} className="dg-grid" />
      <Label x={505} y={26} className="dg-text dg-bold">
        A bouncing ball: lower each time
      </Label>
      <line x1={384} y1={290} x2={630} y2={290} className="dg-thin" />
      <path d="M390,290 C430,23 450,23 490,290" className="dg-accent" />
      <path d="M490,290 C505,103 535,103 550,290" className="dg-accent" />
      <path d="M550,290 C558,157 582,157 590,290" className="dg-accent" />
      <circle cx={440} cy={90} r={6} className="dg-dot" />
      <circle cx={520} cy={150} r={6} className="dg-dot" />
      <circle cx={570} cy={190} r={6} className="dg-dot" />
      <line x1={446} y1={90} x2={598} y2={90} className="dg-grid" />
      <line x1={526} y1={150} x2={598} y2={150} className="dg-grid" />
      <line x1={576} y1={190} x2={598} y2={190} className="dg-grid" />
      <Label x={624} y={90} anchor="end" className="dg-text-small dg-text-accent-2">
        60 J
      </Label>
      <Label x={624} y={150} anchor="end" className="dg-text-small dg-text-accent-2">
        40 J
      </Label>
      <Label x={624} y={190} anchor="end" className="dg-text-small dg-text-accent-2">
        30 J
      </Label>
      <Label x={505} y={330} className="dg-text-small dg-text-muted">
        each bounce: energy to the thermal store
      </Label>
      <Label x={505} y={350} className="dg-text-small dg-text-muted">
        of the ball, the floor and the air
      </Label>
    </Svg>
  );
}

export default EnergyConservationPrinciple;
