/**
 * Three adjacent slits of a grating, separated by d. Parallel rays leave at
 * angle theta, and the ray from each slit travels an extra d sin(theta)
 * compared with its neighbour. Maxima occur when d sin(theta) = n lambda.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-diffraction-grating-paths';

const W = 660;
const H = 400;
const GX = 280;
const THETA = 20;
const SIN = Math.sin((THETA * Math.PI) / 180);
const COS = Math.cos((THETA * Math.PI) / 180);

const YS = [110, 210, 310];
const D = 100;

export function DiffractionGratingPaths() {
  const end = (y: number) => ({ x: GX + 230 * COS, y: y - 230 * SIN });

  // foot of the perpendicular from the top slit onto the middle slit's ray
  const foot = { x: GX + D * SIN * COS, y: 210 - D * SIN * SIN };

  return (
    <Svg width={W} height={H}>
      <Label x={330} y={26} className="dg-text dg-bold">
        Adjacent slits: the extra path is d sin θ
      </Label>

      {/* grating */}
      <line x1={GX} y1={40} x2={GX} y2={95} className="dg-line" strokeWidth={4} />
      {[110, 210, 310].map((y) => (
        <line key={y} x1={GX} y1={y - 15} x2={GX} y2={y + 15} className="dg-line" strokeWidth={4} />
      ))}
      <line x1={GX} y1={325} x2={GX} y2={360} className="dg-line" strokeWidth={4} />
      <Label x={GX - 14} y={370} anchor="end" className="dg-text-small dg-text-muted">
        grating
      </Label>

      {/* incoming parallel rays */}
      {YS.map((y) => (
        <g key={`in-${y}`}>
          <line x1={90} y1={y} x2={GX - 6} y2={y} className="dg-muted" strokeWidth={1.6} />
          <path d={`M${GX - 6},${y} l-10,-4 l0,8 Z`} className="dg-dot" />
        </g>
      ))}
      <Label x={96} y={96} anchor="start" className="dg-text-small dg-text-muted">
        parallel rays in
      </Label>

      {/* outgoing rays */}
      {YS.map((y) => {
        const e = end(y);
        return <line key={`out-${y}`} x1={GX} y1={y} x2={e.x} y2={e.y} className="dg-accent" strokeWidth={1.8} />;
      })}
      {YS.map((y) => {
        const e = end(y);
        return <path key={`head-${y}`} d={`M${e.x},${e.y} l-11,-1 l4,8 Z`} className="dg-dot-accent" />;
      })}

      {/* angle */}
      <line x1={GX} y1={210} x2={GX + 120} y2={210} className="dg-dashed dg-muted" />
      <path d={`M${GX + 60},${210} A60,60 0 0 0 ${(GX + 60 * COS).toFixed(1)},${(210 - 60 * SIN).toFixed(1)}`} className="dg-muted" fill="none" />
      <Label x={GX + 58} y={226} anchor="start" className="dg-text-small dg-text-muted">
        θ
      </Label>

      {/* d and the extra path */}
      <line x1={GX - 26} y1={110} x2={GX - 26} y2={210} className="dg-line" />
      <line x1={GX - 31} y1={110} x2={GX - 21} y2={110} className="dg-line" />
      <line x1={GX - 31} y1={210} x2={GX - 21} y2={210} className="dg-line" />
      <Label x={GX - 36} y={160} anchor="end" className="dg-text-small dg-text-muted">
        d
      </Label>

      <line x1={GX} y1={110} x2={foot.x} y2={foot.y} className="dg-accent-2 dg-dashed" />
      <Label x={GX + 46} y={104} anchor="start" className="dg-text-small dg-text-accent-2">
        d sin θ
      </Label>

      <Label x={520} y={70} className="dg-text-small dg-text-muted">
        parallel rays out
      </Label>

      <MathLabel x={330} y={348} tex="d\sin\theta=n\lambda" w={200} h={40} tone="accent" />
    </Svg>
  );
}

export default DiffractionGratingPaths;
