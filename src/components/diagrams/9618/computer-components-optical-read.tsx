/**
 * Reading an optical disc. A laser beam passes through a lens, is focused on the spinning
 * disc's track and reflects back to a photodiode. The track (side view) is a run of lands and
 * pits: lands reflect strongly and pits reflect weakly, so the reflected light level goes high
 * and low. Each change between pit and land is read as a 1 and each stretch with no change as
 * 0s, giving the bits 000100010010000100100100 for the 24 cells shown.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-optical-read';

const W = 620;
const H = 340;
const X0 = 118;
const CELL = 20;
/** Lengths of alternating runs, starting with a land. */
const runs = [3, 4, 3, 5, 3, 3, 3];
const LAND_Y = 168;
const PIT_Y = 188;
const HI = 226;
const LO = 254;

function cells(): boolean[] {
  const out: boolean[] = [];
  runs.forEach((n, i) => {
    for (let k = 0; k < n; k++) out.push(i % 2 === 0);
  });
  return out;
}

export function ComputerComponentsOpticalRead() {
  const land = cells();
  const N = land.length;
  const profile = (top: number, bottom: number) => {
    let d = `M${X0},${land[0] ? top : bottom}`;
    for (let i = 0; i < N; i++) {
      const y = land[i] ? top : bottom;
      if (i > 0 && land[i] !== land[i - 1]) d += ` L${X0 + i * CELL},${y}`;
      d += ` L${X0 + (i + 1) * CELL},${y}`;
    }
    return d;
  };
  const bits = land.map((v, i) => (i > 0 && v !== land[i - 1] ? '1' : '0'));
  const focus = { x: X0 + 9.5 * CELL, y: LAND_Y };
  return (
    <Svg width={W} height={H}>
      {/* laser, lens, photodiode */}
      <rect x={168} y={22} width={86} height={30} rx={5} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={211} y={37} className="dg-text-small dg-bold">
        laser
      </Label>
      <rect x={326} y={22} width={100} height={30} rx={5} className="dg-fill-accent dg-accent" />
      <Label x={376} y={37} className="dg-text-small dg-bold">
        photodiode
      </Label>
      <line x1={211} y1={52} x2={focus.x} y2={focus.y} className="dg-accent-2" />
      <line x1={focus.x} y1={focus.y} x2={376} y2={52} className="dg-accent-2 dg-dashed" />
      <ellipse cx={focus.x} cy={104} rx={74} ry={8} className="dg-fill-muted dg-thin" />
      <Label x={focus.x + 84} y={104} anchor="start" className="dg-text-small dg-text-muted">
        lens focuses the beam
      </Label>

      {/* disc surface */}
      <path d={`${profile(LAND_Y, PIT_Y)} L${X0 + N * CELL},206 L${X0},206 Z`} className="dg-fill-muted dg-line" />
      <Label x={X0 + 1.5 * CELL} y={LAND_Y - 12} className="dg-text-small">
        land
      </Label>
      <Label x={X0 + 5 * CELL} y={PIT_Y - 10} className="dg-text-small">
        pit
      </Label>
      <Label x={X0 - 10} y={186} anchor="end" className="dg-text-small">
        track
      </Label>

      {/* reflected light */}
      <path d={profile(HI, LO)} className="dg-accent" />
      <Label x={X0 - 10} y={232} anchor="end" className="dg-text-small">
        reflected
      </Label>
      <Label x={X0 - 10} y={248} anchor="end" className="dg-text-small">
        light
      </Label>

      {/* bits */}
      {bits.map((b, i) => (
        <Label key={i} x={X0 + (i + 0.5) * CELL} y={284} className={b === '1' ? 'dg-text dg-mono dg-text-accent' : 'dg-text dg-mono dg-text-muted'}>
          {b}
        </Label>
      ))}
      <Label x={X0 - 10} y={284} anchor="end" className="dg-text-small">
        bits
      </Label>
      <Label x={W / 2} y={318} className="dg-text-small dg-bold">
        change between pit and land = 1, no change = 0
      </Label>
    </Svg>
  );
}

export default ComputerComponentsOpticalRead;
