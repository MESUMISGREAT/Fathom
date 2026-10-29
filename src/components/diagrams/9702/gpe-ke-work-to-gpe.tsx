/**
 * Work becomes stored energy. Left: a box of mass m lifted steadily from the
 * ground to a shelf through Δh, with the applied force F = mg upward, the weight
 * mg downward and a bracket marking Δh. Right: the same rise up a ramp of length
 * s, showing that the vertical rise, not the distance travelled, fixes the
 * energy stored.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-gpe-ke-work-to-gpe';

const W = 620;
const H = 336;

export function GpeKeWorkToGpe() {
  return (
    <Svg width={W} height={H}>
      <Label x={160} y={24} className="dg-text dg-bold">
        Lifting straight up
      </Label>

      {/* shelf and ground */}
      <line x1={30} y1={140} x2={238} y2={140} className="dg-line" />
      <line x1={30} y1={262} x2={238} y2={262} className="dg-line" />
      <Label x={238} y={126} anchor="end" className="dg-text-small dg-text-muted">
        shelf
      </Label>
      <Label x={30} y={278} anchor="start" className="dg-text-small dg-text-muted">
        ground
      </Label>

      {/* box on the shelf and box on the ground */}
      <rect x={56} y={108} width={48} height={32} className="dg-fill-accent-2 dg-thin" />
      <rect x={56} y={230} width={48} height={32} className="dg-fill-accent-2 dg-thin" />
      <Label x={80} y={124} className="dg-text-small dg-mono">
        m
      </Label>
      <Label x={80} y={246} className="dg-text-small dg-mono">
        m
      </Label>

      {/* forces on the lifted box */}
      <Arrow x1={166} y1={226} x2={166} y2={172} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={178} y={170} tex="F = mg" w={110} h={26} anchor="start" tone="accent" size="small" />
      <Arrow x1={42} y1={234} x2={42} y2={260} head={8} className="dg-muted" headClassName="dg-dot" />
      <MathLabel x={34} y={232} tex="mg" w={44} h={24} anchor="end" tone="muted" size="small" />

      {/* Δh bracket */}
      <line x1={266} y1={140} x2={266} y2={262} className="dg-muted" />
      <line x1={260} y1={140} x2={272} y2={140} className="dg-muted" />
      <line x1={260} y1={262} x2={272} y2={262} className="dg-muted" />
      <MathLabel x={280} y={200} tex="\Delta h" w={46} h={26} anchor="start" />

      <MathLabel x={150} y={308} tex="W = Fs = mg\Delta h = \Delta E_P" w={300} h={30} />

      {/* divider */}
      <line x1={322} y1={40} x2={322} y2={276} className="dg-grid" />

      <Label x={478} y={24} className="dg-text dg-bold">
        Up a ramp instead
      </Label>
      <line x1={340} y1={262} x2={600} y2={262} className="dg-line" />
      {/* ramp: from (356, 262) to (556, 150) */}
      <line x1={356} y1={262} x2={556} y2={150} className="dg-line" />
      <line x1={556} y1={150} x2={556} y2={262} className="dg-muted dg-dashed" />
      <line x1={542} y1={150} x2={556} y2={150} className="dg-line" />
      <rect
        x={430}
        y={182}
        width={40}
        height={26}
        transform="rotate(-29 450 195)"
        className="dg-fill-accent-2 dg-thin"
      />
      <Arrow x1={476} y1={199} x2={512} y2={179} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={392} y={250} tex="s" w={26} h={24} anchor="middle" size="small" />
      <MathLabel x={572} y={204} tex="\Delta h" w={54} h={26} anchor="start" />
      <Label x={478} y={288} className="dg-text-small dg-text-muted">
        same vertical rise, same energy saved
      </Label>
      <Label x={478} y={308} className="dg-text-small dg-text-muted">
        a ramp trades force for distance
      </Label>
    </Svg>
  );
}

export default GpeKeWorkToGpe;
