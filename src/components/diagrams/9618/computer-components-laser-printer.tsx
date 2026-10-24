/**
 * A laser printer as a cycle around the printing drum, which turns clockwise.
 * 1 a charge roller gives the drum a positive charge; 2 a laser beam (steered by a rotating
 * mirror) removes the charge where the page's text and images go; 3 positively charged toner
 * sticks only to those discharged areas; 4 the paper, with a negative charge, passes under
 * the drum and pulls the toner off; 5 the fuser's heated rollers melt the toner onto the
 * paper; 6 a discharge lamp removes the remaining charge so the drum is ready for the next page.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-laser-printer';

const W = 640;
const H = 330;
const CX = 320;
const CY = 150;
const R = 78;
const PAPER_Y = CY + R + 3;

const rad = (d: number) => (d * Math.PI) / 180;
const at = (deg: number, r: number) => ({ x: CX + r * Math.cos(rad(deg)), y: CY + r * Math.sin(rad(deg)) });

function Lines({ x, y, anchor = 'start', lines }: { x: number; y: number; anchor?: 'start' | 'middle' | 'end'; lines: string[] }) {
  return (
    <g>
      {lines.map((l, i) => (
        <Label key={i} x={x} y={y + i * 16} anchor={anchor} className={i === 0 ? 'dg-text-small dg-bold' : 'dg-text-small'}>
          {l}
        </Label>
      ))}
    </g>
  );
}

export function ComputerComponentsLaserPrinter() {
  const roller = at(215, R + 14);
  const laserHit = at(285, R);
  const lamp = at(150, R + 16);
  const turnFrom = at(-50, 62);
  const turnTo = at(40, 62);
  const turnTip = at(47, 62);
  return (
    <Svg width={W} height={H}>
      {/* drum */}
      <circle cx={CX} cy={CY} r={R} className="dg-fill-accent dg-accent" />
      <path d={`M${turnFrom.x.toFixed(1)},${turnFrom.y.toFixed(1)} A62,62 0 0 1 ${turnTo.x.toFixed(1)},${turnTo.y.toFixed(1)}`} className="dg-muted" />
      <Arrow x1={turnTo.x} y1={turnTo.y} x2={turnTip.x} y2={turnTip.y} head={8} className="dg-muted" headClassName="dg-dot" />
      <Label x={CX} y={CY - 6} className="dg-text dg-bold">
        drum
      </Label>
      <Label x={CX} y={CY + 12} className="dg-text-small dg-text-muted">
        turns clockwise
      </Label>
      {[225, 240, 255, 270].map((d) => {
        const p = at(d, R - 12);
        return (
          <Label key={d} x={p.x} y={p.y} className="dg-text-small dg-bold">
            +
          </Label>
        );
      })}

      {/* 1 charge roller */}
      <circle cx={roller.x} cy={roller.y} r={13} className="dg-fill-muted dg-thin" />
      <Lines x={222} y={52} anchor="end" lines={['1 charge roller', 'gives the drum', 'a + charge']} />

      {/* 2 laser */}
      <rect x={430} y={14} width={86} height={30} rx={5} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={473} y={29} className="dg-text-small dg-bold">
        laser + mirror
      </Label>
      <line x1={440} y1={44} x2={laserHit.x} y2={laserHit.y} className="dg-accent-2 dg-dashed" />
      <circle cx={laserHit.x} cy={laserHit.y} r={3.5} className="dg-dot-accent-2" />
      <Lines x={430} y={64} lines={['2 laser beam removes', 'the charge where the', 'text and images go']} />

      {/* 3 toner */}
      <rect x={404} y={124} width={58} height={50} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={433} y={142} className="dg-text-small dg-bold">
        toner
      </Label>
      <Label x={433} y={158} className="dg-text-small">
        (+)
      </Label>
      <Lines x={472} y={136} lines={['3 toner sticks only', 'to the discharged', 'areas']} />

      {/* 4 paper path, moving left */}
      <Arrow x1={624} y1={PAPER_Y} x2={18} y2={PAPER_Y} head={9} className="dg-line" />
      <Label x={624} y={PAPER_Y - 14} anchor="end" className="dg-text-small dg-text-muted">
        paper in
      </Label>
      <Label x={18} y={PAPER_Y - 14} anchor="start" className="dg-text-small dg-text-muted">
        page out
      </Label>
      <Lines x={CX} y={PAPER_Y + 26} anchor="middle" lines={['4 paper (− charge)', 'pulls the toner off', 'the drum']} />

      {/* 5 fuser */}
      <circle cx={150} cy={PAPER_Y - 15} r={13} className="dg-fill-accent-2 dg-accent-2" />
      <circle cx={150} cy={PAPER_Y + 15} r={13} className="dg-fill-accent-2 dg-accent-2" />
      <Lines x={150} y={PAPER_Y + 44} anchor="middle" lines={['5 fuser: heat and', 'pressure melt the', 'toner onto the paper']} />

      {/* 6 discharge lamp */}
      <rect x={lamp.x - 12} y={lamp.y - 7} width={24} height={14} rx={3} className="dg-fill-muted dg-thin" />
      <Lines x={222} y={150} anchor="end" lines={['6 discharge lamp', 'clears the drum', 'for the next page']} />
    </Svg>
  );
}

export default ComputerComponentsLaserPrinter;
