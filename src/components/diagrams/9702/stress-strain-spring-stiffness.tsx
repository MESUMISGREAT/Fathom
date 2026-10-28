/**
 * The same 4 N load on a stiff spring (k = 200 N/m) and a soft one (k = 50 N/m): 20 mm versus
 * 80 mm of extension. Both springs have the same unloaded length, and the extension is drawn to
 * scale at 1 mm = 1 px. The graph on the right shows the same two springs as lines of different
 * gradient through the origin.
 */
import { Label, MathLabel, Svg, axes } from '../primitives';

export const diagramKey = 'phys-stress-strain-spring-stiffness';

const W = 680;
const H = 420;

const G = axes({ width: 300, height: 250, pad: 44, x: [0, 100], y: [0, 8] });

const UNLOADED = 40; // px, bottom of the spring with no load
const TOP = 56;

const spring = (x: number, bottom: number) => {
  const coils = 7;
  const step = (bottom - TOP) / coils;
  let d = `M${x},${TOP}`;
  for (let i = 0; i < coils; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    d += ` L${x + dir * 17},${TOP + step * (i + 0.5)} L${x},${TOP + step * (i + 1)}`;
  }
  return d;
};

export function StressStrainSpringStiffness() {
  const stiffBottom = TOP + UNLOADED + 20; // +20 mm
  const softBottom = TOP + UNLOADED + 80; // +80 mm
  return (
    <Svg width={W} height={H}>
      <Label x={190} y={24} className="dg-text dg-bold">
        Same load, different stiffness
      </Label>

      {/* support */}
      <rect x={80} y={46} width={220} height={8} className="dg-fill-muted" rx={2} />

      {/* stiff spring */}
      <path d={spring(130, stiffBottom)} className="dg-line" />
      <line x1={104} y1={stiffBottom} x2={156} y2={stiffBottom} className="dg-line" />
      <rect x={112} y={stiffBottom + 34} width={36} height={9} className="dg-muted" />
      <rect x={110} y={stiffBottom + 6} width={40} height={28} className="dg-fill-accent" rx={3} />
      <Label x={130} y={stiffBottom + 19} className="dg-text-small dg-on-accent">
        4 N
      </Label>
      <line x1={152} y1={stiffBottom + 19} x2={178} y2={stiffBottom + 19} className="dg-thin" />
      {/* unloaded end position */}
      <line x1={94} y1={TOP + UNLOADED} x2={110} y2={TOP + UNLOADED} className="dg-muted dg-dashed" />
      <line x1={170} y1={TOP + UNLOADED} x2={186} y2={TOP + UNLOADED} className="dg-muted dg-dashed" />
      <line x1={178} y1={TOP + UNLOADED} x2={178} y2={stiffBottom + 19} className="dg-muted" />
      <Label x={188} y={(TOP + UNLOADED + stiffBottom + 19) / 2} anchor="start" className="dg-text-small dg-text-accent">
        20 mm
      </Label>
      <MathLabel x={130} y={stiffBottom + 70} tex="k = 200\ \text{N m}^{-1}" w={170} h={24} size="small" />
      <Label x={130} y={stiffBottom + 92} className="dg-text-small dg-text-muted">
        stiff
      </Label>

      {/* soft spring */}
      <path d={spring(270, softBottom)} className="dg-line" />
      <line x1={244} y1={softBottom} x2={296} y2={softBottom} className="dg-line" />
      <rect x={252} y={softBottom + 34} width={36} height={9} className="dg-muted" />
      <rect x={250} y={softBottom + 6} width={40} height={28} className="dg-fill-accent" rx={3} />
      <Label x={270} y={softBottom + 19} className="dg-text-small dg-on-accent">
        4 N
      </Label>
      <line x1={232} y1={TOP + UNLOADED} x2={250} y2={TOP + UNLOADED} className="dg-muted dg-dashed" />
      <line x1={310} y1={TOP + UNLOADED} x2={326} y2={TOP + UNLOADED} className="dg-muted dg-dashed" />
      <line x1={318} y1={TOP + UNLOADED} x2={318} y2={softBottom + 20} className="dg-muted" />
      <Label x={328} y={(TOP + UNLOADED + softBottom) / 2} anchor="start" className="dg-text-small dg-text-accent">
        80 mm
      </Label>
      <MathLabel x={270} y={softBottom + 70} tex="k = 50\ \text{N m}^{-1}" w={170} h={24} size="small" />
      <Label x={270} y={softBottom + 92} className="dg-text-small dg-text-muted">
        soft
      </Label>

      {/* graph */}
      <g transform="translate(380, 46)">
        <Label x={146} y={0} className="dg-text dg-bold">
          Load against extension
        </Label>
        <line x1={G.sx(0)} y1={G.sy(0)} x2={G.sx(100)} y2={G.sy(0)} className="dg-line" />
        <line x1={G.sx(0)} y1={G.sy(0)} x2={G.sx(0)} y2={G.sy(8)} className="dg-line" />

        <Label x={G.sx(98)} y={G.sy(0) + 24} anchor="end" className="dg-text-small dg-text-muted">
          x / mm
        </Label>
        <Label x={G.sx(0) - 12} y={G.sy(7.7)} anchor="end" className="dg-text-small dg-text-muted">
          F / N
        </Label>

        {/* stiff: 4 N at 20 mm */}
        <line x1={G.sx(0)} y1={G.sy(0)} x2={G.sx(40)} y2={G.sy(8)} className="dg-accent" strokeWidth={2.5} />
        {/* soft: 4 N at 80 mm */}
        <line x1={G.sx(0)} y1={G.sy(0)} x2={G.sx(100)} y2={G.sy(5)} className="dg-accent-2" strokeWidth={2.5} />

        <circle cx={G.sx(20)} cy={G.sy(4)} r={4} className="dg-dot-accent" />
        <circle cx={G.sx(80)} cy={G.sy(4)} r={4} className="dg-dot-accent-2" />

        <Label x={G.sx(44)} y={G.sy(6.8)} anchor="start" className="dg-text-small dg-text-accent">
          stiff
        </Label>
        <Label x={G.sx(74)} y={G.sy(1.35)} anchor="end" className="dg-text-small dg-text-accent-2">
          soft
        </Label>
        <Label x={G.sx(50)} y={G.sy(0) + 42} className="dg-text-small dg-text-muted">
          steeper line, bigger k
        </Label>
      </g>
    </Svg>
  );
}

export default StressStrainSpringStiffness;
