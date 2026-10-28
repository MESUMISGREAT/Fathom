/**
 * Searle's apparatus: a reference wire and a test wire hang side by side from a rigid support. The
 * test wire carries a vernier arm that slides against a fixed scale, so its extension is read
 * directly; slotted masses hang from it. Small insets show the micrometer (for the diameter) and
 * the metre rule (for the original length).
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-stress-strain-young-modulus-apparatus';

const W = 720;
const H = 470;

const SUPPORT = 54;
const TEST_X = 220;
const REF_X = 120;

export function StressStrainYoungModulusApparatus() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Searle&apos;s apparatus: two wires, one loaded
      </Label>

      {/* rigid support */}
      <rect x={60} y={SUPPORT - 10} width={260} height={10} className="dg-fill-muted" rx={2} />
      {[70, 94, 118, 142, 166, 190, 214, 238, 262, 286, 306].map((x) => (
        <line key={x} x1={x} y1={SUPPORT} x2={x - 13} y2={SUPPORT + 13} className="dg-thin" />
      ))}
      <Label x={64} y={SUPPORT - 22} anchor="start" className="dg-text-small dg-text-muted">
        rigid support
      </Label>

      {/* reference wire */}
      <line x1={REF_X} y1={SUPPORT} x2={REF_X} y2={326} className="dg-line" strokeWidth={2.5} />
      <rect x={104} y={326} width={32} height={22} className="dg-fill-muted" rx={2} />
      <Label x={REF_X} y={337} className="dg-text-small dg-text-muted">
        W
      </Label>
      <Label x={REF_X} y={420} className="dg-text-small dg-text-muted">
        reference wire
      </Label>
      <Label x={REF_X} y={436} className="dg-text-small dg-text-muted">
        (no added load)
      </Label>

      {/* test wire */}
      <line x1={TEST_X} y1={SUPPORT} x2={TEST_X} y2={306} className="dg-line" strokeWidth={2.5} />

      {/* original position of the vernier, dashed */}
      <line x1={196} y1={288} x2={228} y2={288} className="dg-muted dg-dashed" />

      {/* vernier arm, clamped to the test wire */}
      <rect x={226} y={300} width={74} height={12} className="dg-fill-accent" rx={2} />
      <Label x={263} y={306} className="dg-text-small dg-on-accent">
        vernier
      </Label>

      {/* fixed scale */}
      <line x1={300} y1={246} x2={300} y2={372} className="dg-line" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={300} y1={252 + i * 19} x2={310} y2={252 + i * 19} className="dg-thin" />
      ))}
      <Label x={316} y={252} anchor="start" className="dg-text-small dg-text-muted">
        fixed
      </Label>
      <Label x={316} y={268} anchor="start" className="dg-text-small dg-text-muted">
        scale
      </Label>

      {/* extension bracket */}
      <line x1={206} y1={288} x2={206} y2={300} className="dg-muted" />
      <line x1={200} y1={288} x2={212} y2={288} className="dg-muted" />
      <line x1={200} y1={300} x2={212} y2={300} className="dg-muted" />
      <Label x={194} y={300} anchor="end" className="dg-text-small dg-text-accent">
        x
      </Label>

      {/* hanger and masses */}
      <line x1={TEST_X} y1={312} x2={TEST_X} y2={322} className="dg-line" />
      <rect x={196} y={322} width={48} height={8} className="dg-muted" rx={1} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={202 + i * 2}
          y={330 + i * 13}
          width={36 - i * 4}
          height={10}
          className="dg-fill-accent"
          rx={1}
        />
      ))}
      <Label x={TEST_X} y={386} className="dg-text-small dg-text-accent">
        added masses
      </Label>
      <Label x={TEST_X} y={404} className="dg-text-small dg-text-muted">
        test wire
      </Label>

      {/* length bracket, from the support down to the unloaded vernier position */}
      <line x1={278} y1={SUPPORT} x2={278} y2={300} className="dg-muted" />
      <line x1={272} y1={SUPPORT} x2={284} y2={SUPPORT} className="dg-muted" />
      <line x1={272} y1={300} x2={284} y2={300} className="dg-muted" />
      <Label x={286} y={168} anchor="start" className="dg-text-small dg-text-muted">
        L
      </Label>

      {/* micrometer inset */}
      <g transform="translate(430, 96)">
        <circle cx={40} cy={40} r={34} className="dg-fill-muted" />
        <circle cx={40} cy={40} r={34} className="dg-line" />
        <line x1={6} y1={40} x2={74} y2={40} className="dg-muted dg-dashed" />
        <line x1={40} y1={6} x2={40} y2={74} className="dg-muted dg-dashed" />
        <Label x={48} y={30} anchor="start" className="dg-text-small dg-text-muted">
          d
        </Label>
        <Label x={40} y={100} className="dg-text-small dg-text-muted">
          micrometer
        </Label>
        <Label x={40} y={118} className="dg-text-small dg-text-muted">
          measures d
        </Label>
      </g>

      {/* metre rule inset */}
      <g transform="translate(440, 232)">
        <rect x={0} y={0} width={18} height={120} className="dg-fill-muted" rx={2} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={0} y1={12 + i * 20} x2={12} y2={12 + i * 20} className="dg-thin" />
        ))}
        <Label x={30} y={52} anchor="start" className="dg-text-small dg-text-muted">
          metre rule
        </Label>
        <Label x={30} y={70} anchor="start" className="dg-text-small dg-text-muted">
          measures L
        </Label>
      </g>

      <MathLabel
        x={W / 2}
        y={H - 20}
        tex="E = \dfrac{kL}{A},\quad k = \text{gradient of } F \text{ against } x"
        w={380}
        h={34}
      />
    </Svg>
  );
}

export default StressStrainYoungModulusApparatus;
