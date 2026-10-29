/**
 * Resonance in a tube closed at one end by a water surface. The air column is
 * a node at the water and an antinode at the open top, so the first resonance
 * has L = λ/4 and the second L = 3λ/4.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-stationary-waves-air-column';

const W = 640;
const H = 420;
const TOP = 80;
const BOTTOM = 320;

function Tube({ x, water }: { x: number; water: number }) {
  const width = 70;
  return (
    <g>
      <rect x={x} y={water} width={width} height={BOTTOM - water} className="dg-fill-muted" />
      <rect x={x} y={TOP} width={width} height={BOTTOM - TOP} className="dg-thin" fill="none" />
      <line x1={x} y1={BOTTOM} x2={x + width} y2={BOTTOM} className="dg-line" strokeWidth={3} />
      <circle cx={x + width / 2} cy={water} r={3.5} className="dg-dot" />
      <circle cx={x + width / 2} cy={TOP} r={3.5} className="dg-dot-accent" />
      <Label x={x - 8} y={water} anchor="end" className="dg-text-small dg-text-muted">
        N
      </Label>
      <Label x={x - 8} y={TOP} anchor="end" className="dg-text-small dg-text-accent">
        A
      </Label>
    </g>
  );
}

export function StationaryWavesAirColumn() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={28} className="dg-text dg-bold">
        Resonance tube: an air column closed by the water surface
      </Label>

      <Arrow x1={135} y1={44} x2={135} y2={TOP - 8} />
      <Label x={150} y={50} anchor="start" className="dg-text-small dg-text-muted">
        sound
      </Label>

      <Tube x={120} water={140} />
      <MathLabel x={272} y={128} tex="L_1=\dfrac{\lambda}{4}" w={170} h={46} />
      <Label x={272} y={166} className="dg-text-small dg-text-muted">
        1st resonance
      </Label>

      <Tube x={400} water={260} />
      <MathLabel x={550} y={128} tex="L_2=\dfrac{3\lambda}{4}" w={160} h={46} />
      <Label x={550} y={166} className="dg-text-small dg-text-muted">
        2nd resonance
      </Label>

      <Label x={320} y={352} className="dg-text-small dg-text-muted">
        N = node, A = antinode. Lower the water to lengthen the air column.
      </Label>
      <Label x={320} y={380} className="dg-text-small dg-text-muted">
        At resonance the note is loudest, and L₂ − L₁ is half a wavelength.
      </Label>
    </Svg>
  );
}

export default StationaryWavesAirColumn;
