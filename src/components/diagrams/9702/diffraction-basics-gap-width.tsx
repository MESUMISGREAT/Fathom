/**
 * Diffraction through three gaps, each narrower relative to the wavelength.
 * A wide gap lets the wavefronts through almost straight; a gap about one
 * wavelength wide spreads them into semicircles; a narrower gap spreads them
 * into the region behind the barrier too, though the amplitude falls.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-diffraction-basics-gap-width';

const W = 660;
const H = 350;
const CY = 150;
const TOP = 60;
const BOTTOM = 270;
const LAMBDA_PX = 13;

/** A circular wavefront from the gap, between two angles measured from +x. */
function arc(cx: number, r: number, fromDeg: number, toDeg: number): string {
  const a = { x: cx + r * Math.cos((fromDeg * Math.PI) / 180), y: CY + r * Math.sin((fromDeg * Math.PI) / 180) };
  const b = { x: cx + r * Math.cos((toDeg * Math.PI) / 180), y: CY + r * Math.sin((toDeg * Math.PI) / 180) };
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  return `M${a.x.toFixed(1)},${a.y.toFixed(1)} A${r},${r} 0 ${large} 1 ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
}

function Panel({ cx, halfGap, spread, label, note }: { cx: number; halfGap: number; spread: 'straight' | 'wide' | 'everywhere'; label: string; note: string }) {
  const bx = cx + 24;
  return (
    <g>
      {/* barrier */}
      <line x1={bx} y1={TOP} x2={bx} y2={CY - halfGap} className="dg-line" strokeWidth={3} />
      <line x1={bx} y1={CY + halfGap} x2={bx} y2={BOTTOM} className="dg-line" strokeWidth={3} />

      {/* incoming plane wavefronts */}
      {[1, 2, 3, 4].map((k) => (
        <line
          key={k}
          x1={bx - k * LAMBDA_PX}
          y1={TOP}
          x2={bx - k * LAMBDA_PX}
          y2={BOTTOM}
          className="dg-muted"
          strokeWidth={1.5}
        />
      ))}

      {/* transmitted wavefronts */}
      {spread === 'straight' &&
        [16, 30, 44, 58].map((dx) => (
          <line key={dx} x1={bx + dx} y1={CY - halfGap} x2={bx + dx} y2={CY + halfGap} className="dg-accent" strokeWidth={1.8} />
        ))}
      {spread === 'wide' &&
        [22, 38, 54, 70].map((r) => <path key={r} d={arc(bx, r, -90, 90)} className="dg-accent" strokeWidth={1.8} />)}
      {spread === 'everywhere' &&
        [26, 42, 58, 74, 90].map((r) => (
          <path key={r} d={arc(bx, r, -100, 100)} className="dg-accent dg-dashed" strokeWidth={1.6} />
        ))}

      <Label x={cx} y={300} className="dg-text dg-bold">
        {label}
      </Label>
      <Label x={cx} y={324} className="dg-text-small dg-text-muted">
        {note}
      </Label>
    </g>
  );
}

export function DiffractionBasicsGapWidth() {
  return (
    <Svg width={W} height={H}>
      <Label x={330} y={28} className="dg-text dg-bold">
        Same wavelength, three gap widths
      </Label>
      <Label x={330} y={48} className="dg-text-small dg-text-muted">
        dashed = weaker amplitude
      </Label>
      <Panel cx={105} halfGap={45} spread="straight" label="gap ≫ λ" note="almost no spreading" />
      <Panel cx={330} halfGap={8} spread="wide" label="gap ≈ λ" note="spreads widely" />
      <Panel cx={555} halfGap={4} spread="everywhere" label="gap < λ" note="spreads in all directions" />
    </Svg>
  );
}

export default DiffractionBasicsGapWidth;
