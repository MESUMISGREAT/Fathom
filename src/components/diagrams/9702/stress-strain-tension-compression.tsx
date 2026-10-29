/**
 * Tension and compression side by side. Left: a wire pulled longer by a hanging load, with the
 * extension marked between the original and stretched bottom ends. Right: a pillar squashed
 * shorter by a block on top, with the compression marked the same way.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-stress-strain-tension-compression';

const W = 660;
const H = 380;

export function StressStrainTensionCompression() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        A tensile force lengthens; a compressive force shortens
      </Label>

      {/* ---------------- left panel: tension ---------------- */}
      <Label x={165} y={54} className="dg-text-small dg-text-muted">
        tension
      </Label>

      {/* support */}
      <rect x={95} y={64} width={140} height={10} className="dg-fill-muted" rx={2} />
      {[100, 118, 136, 154, 172, 190, 208, 226].map((x) => (
        <line key={x} x1={x} y1={74} x2={x - 12} y2={86} className="dg-thin" />
      ))}
      <Label x={106} y={104} anchor="end" className="dg-text-small dg-text-muted">
        support
      </Label>

      {/* stretched wire */}
      <line x1={165} y1={74} x2={165} y2={276} className="dg-line" strokeWidth={3} />

      {/* original end position, dashed */}
      <line x1={128} y1={246} x2={202} y2={246} className="dg-muted dg-dashed" />

      {/* weight */}
      <rect x={143} y={276} width={44} height={30} className="dg-fill-accent" rx={3} />
      <Label x={165} y={294} className="dg-text-small dg-on-accent">
        load
      </Label>

      {/* tensile arrows inside the wire, pointing outwards */}
      <Arrow x1={165} y1={130} x2={165} y2={108} className="dg-line" headClassName="dg-dot-accent" />
      <Arrow x1={165} y1={214} x2={165} y2={236} className="dg-line" headClassName="dg-dot-accent" />
      <Label x={198} y={119} anchor="start" className="dg-text-small dg-text-accent">
        tensile
      </Label>

      {/* extension bracket */}
      <line x1={208} y1={246} x2={208} y2={276} className="dg-muted" />
      <line x1={202} y1={246} x2={214} y2={246} className="dg-muted" />
      <line x1={202} y1={276} x2={214} y2={276} className="dg-muted" />
      <Label x={222} y={262} anchor="start" className="dg-text-small dg-text-accent">
        x
      </Label>
      <Label x={222} y={282} anchor="start" className="dg-text-small dg-text-muted">
        extension
      </Label>

      {/* original length bracket */}
      <line x1={112} y1={74} x2={112} y2={246} className="dg-muted" />
      <line x1={106} y1={74} x2={118} y2={74} className="dg-muted" />
      <line x1={106} y1={246} x2={118} y2={246} className="dg-muted" />
      <Label x={96} y={160} anchor="end" className="dg-text-small dg-text-muted">
        original L
      </Label>

      <Label x={165} y={330} className="dg-text-small dg-text-muted">
        wire, pulled by load F
      </Label>

      {/* ---------------- right panel: compression ---------------- */}
      <line x1={340} y1={60} x2={340} y2={320} className="dg-muted dg-dashed" />

      <Label x={505} y={54} className="dg-text-small dg-text-muted">
        compression
      </Label>

      {/* block on top */}
      <rect x={455} y={96} width={100} height={26} className="dg-fill-accent" rx={2} />
      <Label x={505} y={110} className="dg-text-small dg-on-accent">
        load
      </Label>

      {/* pillar, squashed: original top dashed at y = 122, new top at y = 134 */}
      <rect x={470} y={142} width={70} height={168} className="dg-fill-muted" rx={2} />
      <line x1={452} y1={122} x2={558} y2={122} className="dg-muted dg-dashed" />
      <line x1={470} y1={142} x2={540} y2={142} className="dg-line" />

      {/* ground */}
      <line x1={400} y1={310} x2={610} y2={310} className="dg-line" />
      {[408, 428, 448, 468, 488, 508, 528, 548, 568, 588].map((x) => (
        <line key={x} x1={x} y1={310} x2={x - 12} y2={322} className="dg-thin" />
      ))}

      {/* compressive arrows pointing inwards */}
      <Arrow x1={505} y1={86} x2={505} y2={104} className="dg-line" headClassName="dg-dot-accent" />
      <Arrow x1={505} y1={300} x2={505} y2={282} className="dg-line" headClassName="dg-dot-accent" />
      <Label x={462} y={206} anchor="end" className="dg-text-small dg-text-accent">
        compressive
      </Label>

      {/* compression bracket */}
      <line x1={566} y1={122} x2={566} y2={142} className="dg-muted" />
      <line x1={560} y1={122} x2={572} y2={122} className="dg-muted" />
      <line x1={560} y1={142} x2={572} y2={142} className="dg-muted" />
      <Label x={582} y={132} anchor="start" className="dg-text-small dg-text-accent">
        x
      </Label>

      <Label x={505} y={346} className="dg-text-small dg-text-muted">
        pillar, pushed by load F
      </Label>

      <MathLabel x={W / 2} y={H - 12} tex="\text{both: change in length } x" w={280} h={26} size="small" />
    </Svg>
  );
}

export default StressStrainTensionCompression;
