/**
 * Circular wavefronts from a source that is moving to the right. Each circle is centred where
 * the source was when it emitted that wavefront, so the circles bunch up ahead of the source
 * and spread out behind it. The source speed is exaggerated to make the effect visible.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-doppler-effect-wavefronts';

const W = 640;
const H = 440;
const CX0 = 400;
const CY = 240;
const STEP_X = 20; // source displacement between emissions
const STEP_R = 46; // wavefront spacing per emission

const fronts = [1, 2, 3, 4].map((k) => ({ cx: CX0 - STEP_X * k, r: STEP_R * k }));

export function DopplerEffectWavefronts() {
  return (
    <Svg width={W} height={H}>
      {fronts.map((f) => (
        <circle key={f.r} cx={f.cx} cy={CY} r={f.r} className="dg-muted" />
      ))}

      {/* source and its velocity */}
      <circle cx={CX0} cy={CY} r={7} className="dg-dot-accent" />
      <Arrow x1={330} y1={30} x2={402} y2={30} head={9} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={452} y={30} tex="v_s" w={60} h={30} size="small" tone="accent" />
      <Label x={330} y={12} anchor="start" className="dg-text-small dg-text-muted">
        source moving this way
      </Label>

      <Label x={600} y={60} anchor="end" className="dg-text-small dg-text-accent">
        observer ahead: higher frequency
      </Label>
      <Label x={620} y={424} anchor="end" className="dg-text-small dg-text-accent-2">
        observer behind: lower frequency
      </Label>
    </Svg>
  );
}

export default DopplerEffectWavefronts;
