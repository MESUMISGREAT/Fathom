/**
 * How a 3D printer (fused deposition type) makes an object. Top: three steps, design the object
 * in CAD software, slice it into thin layers, print it layer by layer. Bottom: a side view.
 * Plastic filament from a spool is fed into a heated nozzle, which melts it and lays down one
 * layer while moving left-right and front-back. Five finished layers sit on the build plate
 * and the sixth is part-way done. After each layer the build plate drops by one layer height.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-3d-printer';

const W = 620;
const H = 380;
const PLATE_Y = 336;
const LAYER = 16;
const widths = [220, 200, 184, 172, 164, 160];
const CXO = 290;

function Step({ x, n, a, b }: { x: number; n: string; a: string; b: string }) {
  return (
    <g>
      <rect x={x} y={12} width={180} height={52} rx={8} className="dg-fill-accent dg-accent" />
      <Label x={x + 90} y={30} className="dg-text-small dg-bold">
        {`${n} ${a}`}
      </Label>
      <Label x={x + 90} y={48} className="dg-text-small">
        {b}
      </Label>
    </g>
  );
}

export function ComputerComponents3dPrinter() {
  const topY = PLATE_Y - LAYER * widths.length;
  const cur = widths[widths.length - 1]!;
  const curLeft = CXO - cur / 2;
  const doneTo = curLeft + cur * 0.55;
  const nozzleX = doneTo + 8;
  return (
    <Svg width={W} height={H}>
      <Step x={14} n="1" a="design in CAD" b="a 3D model on screen" />
      <Step x={220} n="2" a="slice" b="cut into thin layers" />
      <Step x={426} n="3" a="print" b="build it layer by layer" />
      <Arrow x1={196} y1={38} x2={218} y2={38} head={7} />
      <Arrow x1={402} y1={38} x2={424} y2={38} head={7} />

      {/* build plate */}
      <rect x={150} y={PLATE_Y} width={280} height={14} rx={3} className="dg-fill-muted dg-thin" />
      <Label x={290} y={PLATE_Y + 30} className="dg-text-small dg-text-muted">
        build plate
      </Label>

      {/* finished layers */}
      {widths.slice(0, -1).map((w, k) => (
        <rect key={k} x={CXO - w / 2} y={PLATE_Y - LAYER * (k + 1)} width={w} height={LAYER} className="dg-fill-accent-2 dg-thin" />
      ))}
      {/* the layer being printed */}
      <rect x={curLeft} y={topY} width={doneTo - curLeft} height={LAYER} className="dg-fill-accent dg-accent" />
      <rect x={curLeft} y={topY} width={cur} height={LAYER} className="dg-muted dg-dashed" />

      {/* nozzle */}
      <rect x={nozzleX - 22} y={topY - 64} width={44} height={36} rx={4} className="dg-fill-muted dg-line" />
      <path d={`M${nozzleX - 10},${topY - 28} L${nozzleX + 10},${topY - 28} L${nozzleX},${topY - 4} Z`} className="dg-dot" />
      <Arrow x1={nozzleX - 60} y1={topY - 84} x2={nozzleX + 60} y2={topY - 84} double head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={nozzleX} y={topY - 102} className="dg-text-small dg-text-accent">
        nozzle moves in x and y
      </Label>

      {/* filament from spool */}
      <circle cx={540} cy={150} r={30} className="dg-fill-muted dg-thin" />
      <circle cx={540} cy={150} r={7} className="dg-thin" />
      <path d={`M510,150 C450,150 400,${topY - 52} ${nozzleX + 22},${topY - 52}`} className="dg-accent-2" />
      <Label x={540} y={196} className="dg-text-small">
        plastic filament
      </Label>
      <Label x={nozzleX - 30} y={topY - 46} anchor="end" className="dg-text-small">
        heated nozzle melts it
      </Label>

      {/* layer labels */}
      <Label x={140} y={topY + 8} anchor="end" className="dg-text-small dg-text-accent">
        layer 6, in progress
      </Label>
      <Label x={140} y={PLATE_Y - 40} anchor="end" className="dg-text-small">
        layers 1 to 5,
      </Label>
      <Label x={140} y={PLATE_Y - 24} anchor="end" className="dg-text-small">
        cooled and solid
      </Label>

      {/* plate drops */}
      <Arrow x1={470} y1={PLATE_Y - 30} x2={470} y2={PLATE_Y + 6} head={8} className="dg-line" />
      <Label x={482} y={PLATE_Y - 20} anchor="start" className="dg-text-small">
        after each layer,
      </Label>
      <Label x={482} y={PLATE_Y - 4} anchor="start" className="dg-text-small">
        plate drops one layer
      </Label>
    </Svg>
  );
}

export default ComputerComponents3dPrinter;
