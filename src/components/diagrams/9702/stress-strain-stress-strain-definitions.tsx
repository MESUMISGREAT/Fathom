/**
 * A wire in tension with the force and cross-section that define stress, and the lengths that
 * define strain. The circular inset shows how the area comes from the diameter.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-stress-strain-stress-strain-definitions';

const W = 660;
const H = 430;

export function StressStrainStressStrainDefinitions() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Stress uses F and A; strain uses x and L
      </Label>

      {/* support */}
      <rect x={96} y={50} width={120} height={9} className="dg-fill-muted" rx={2} />

      {/* wire */}
      <line x1={156} y1={59} x2={156} y2={286} className="dg-line" strokeWidth={3} />
      <line x1={134} y1={252} x2={178} y2={252} className="dg-muted dg-dashed" />

      {/* load */}
      <Arrow x1={156} y1={286} x2={156} y2={318} className="dg-line" headClassName="dg-dot" />
      <Label x={170} y={312} anchor="start" className="dg-text-small dg-text-accent">
        F
      </Label>

      {/* original length bracket */}
      <line x1={104} y1={59} x2={104} y2={252} className="dg-muted" />
      <line x1={98} y1={59} x2={110} y2={59} className="dg-muted" />
      <line x1={98} y1={252} x2={110} y2={252} className="dg-muted" />
      <Label x={96} y={152} anchor="end" className="dg-text-small dg-text-muted">
        original
      </Label>
      <Label x={96} y={170} anchor="end" className="dg-text-small dg-text-muted">
        length L
      </Label>

      {/* extension bracket */}
      <line x1={192} y1={252} x2={192} y2={286} className="dg-muted" />
      <line x1={186} y1={252} x2={198} y2={252} className="dg-muted" />
      <line x1={186} y1={286} x2={198} y2={286} className="dg-muted" />
      <Label x={206} y={269} anchor="start" className="dg-text-small dg-text-accent">
        x
      </Label>

      {/* cross-section inset */}
      <circle cx={330} cy={112} r={40} className="dg-fill-muted" />
      <circle cx={330} cy={112} r={40} className="dg-line" />
      <line x1={290} y1={112} x2={370} y2={112} className="dg-muted dg-dashed" />
      <line x1={330} y1={72} x2={330} y2={152} className="dg-muted dg-dashed" />
      <Label x={338} y={104} anchor="start" className="dg-text-small dg-text-muted">
        d
      </Label>
      <Label x={330} y={170} className="dg-text-small dg-text-muted">
        cross-section
      </Label>

      <MathLabel x={330} y={204} tex="A = \pi\left(\dfrac{d}{2}\right)^2 = \dfrac{\pi d^2}{4}" w={230} h={52} />

      {/* stress box */}
      <rect x={412} y={70} width={210} height={116} className="dg-fill-muted" rx={8} />
      <Label x={517} y={90} className="dg-text-small dg-text-muted">
        tensile stress
      </Label>
      <MathLabel x={517} y={130} tex="\sigma = \dfrac{F}{A}" w={190} h={54} />
      <Label x={517} y={168} className="dg-text-small dg-text-muted">
        unit: Pa = N m⁻²
      </Label>

      {/* strain box */}
      <rect x={412} y={210} width={210} height={112} className="dg-fill-muted" rx={8} />
      <Label x={517} y={230} className="dg-text-small dg-text-muted">
        tensile strain
      </Label>
      <MathLabel x={517} y={268} tex="\varepsilon = \dfrac{x}{L}" w={190} h={54} />
      <Label x={517} y={306} className="dg-text-small dg-text-muted">
        no unit
      </Label>

      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        Multiplying by a larger area lowers the stress; a longer wire lowers the strain for the same extension.
      </Label>
    </Svg>
  );
}

export default StressStrainStressStrainDefinitions;
